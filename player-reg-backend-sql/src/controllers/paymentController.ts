import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { logActivity, logRequestActivity } from "../lib/activityLog";
import {
  CURRENCY,
  REGISTRATION_FEE,
  checkoutHash,
  formatAmount,
  isValidNotification,
  payhereConfig,
  statusFromCode,
} from "../lib/payhere";

/**
 * POST /api/user/payhere/checkout (player)
 * Creates the order and returns the signed PayHere form. The amount is
 * fixed on the server (Rs. 1,000.00) — nothing from the request body is used.
 */
export const startPayHereCheckout = async (req: Request, res: Response): Promise<void> => {
  try {
    const config = payhereConfig();
    if (!config.configured) {
      res.status(503).json({ success: false, message: "Online payment is not available right now. Please try again later." });
      return;
    }

    const userId = Number(req.user?.id);
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { player: true } });
    if (!user?.player) {
      res.status(404).json({ success: false, message: "Player profile not found" });
      return;
    }
    if (user.status !== "confirmed") {
      res.status(400).json({ success: false, message: "Your account must be verified by an admin before you can pay." });
      return;
    }
    if (user.player.regExpDate && user.player.regExpDate > new Date()) {
      res.status(400).json({ success: false, message: "Your registration is already active." });
      return;
    }
    const pendingSlip = await prisma.payment.findFirst({ where: { userId, status: "pending" } });
    if (pendingSlip) {
      res.status(400).json({ success: false, message: "You already have a payment waiting for approval." });
      return;
    }

    // Earlier checkouts the player never finished are closed off
    await prisma.payment.updateMany({
      where: { userId, method: "payhere", status: "initiated" },
      data: { status: "abandoned" },
    });

    const amount = formatAmount(REGISTRATION_FEE);
    const orderId = `SLBF${userId}T${Date.now()}`;
    await prisma.payment.create({
      data: {
        userId,
        method: "payhere",
        status: "initiated",
        amount,
        currency: CURRENCY,
        orderId,
        referenceNo: orderId,
      },
    });

    const isRenewal = Boolean(user.player.regExpDate);
    const fields: Record<string, string> = {
      merchant_id: config.merchantId,
      return_url: `${config.returnUrl}?order_id=${encodeURIComponent(orderId)}`,
      cancel_url: `${config.cancelUrl}?order_id=${encodeURIComponent(orderId)}`,
      notify_url: config.notifyUrl,
      order_id: orderId,
      items: isRenewal ? "SLBF player registration renewal (1 year)" : "SLBF player registration (1 year)",
      currency: CURRENCY,
      amount,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.contact,
      address: user.district,
      city: user.district,
      country: "Sri Lanka",
      custom_1: String(userId),
      hash: checkoutHash(config.merchantId, orderId, amount, CURRENCY, config.merchantSecret),
    };

    logRequestActivity(req, `Started online payment of Rs. ${amount} (order ${orderId})`);
    res.status(200).json({ success: true, action: config.checkoutUrl, fields });
  } catch (error) {
    console.error("PayHere checkout error:", error);
    res.status(500).json({ success: false, message: "Could not start the payment. Please try again." });
  }
};

/**
 * POST /api/payhere/notify (called by PayHere, form-encoded)
 * The only place a PayHere payment is approved: the signature, amount and
 * currency are verified before anything changes.
 */
export const payHereNotify = async (req: Request, res: Response): Promise<void> => {
  const n = (req.body ?? {}) as Record<string, string | undefined>;
  try {
    const config = payhereConfig();
    if (!isValidNotification(n, config.merchantId, config.merchantSecret)) {
      console.warn("PayHere notify: invalid signature for order", n.order_id);
      res.status(400).send("Invalid signature");
      return;
    }

    const payment = n.order_id ? await prisma.payment.findUnique({ where: { orderId: n.order_id } }) : null;
    if (!payment || payment.method !== "payhere") {
      console.warn("PayHere notify: unknown order", n.order_id);
      res.status(404).send("Unknown order");
      return;
    }

    // The amount and currency must match what we created
    const expected = formatAmount(Number(payment.amount));
    if (n.payhere_amount !== expected || n.payhere_currency !== payment.currency) {
      console.warn(`PayHere notify: amount mismatch for ${payment.orderId}: ${n.payhere_amount} ${n.payhere_currency}`);
      await prisma.payment.update({ where: { id: payment.id }, data: { status: "failed", gatewayPaymentId: n.payment_id ?? null } });
      res.status(400).send("Amount mismatch");
      return;
    }

    // Already final: PayHere may notify more than once
    if (payment.status === "approved") {
      res.status(200).send("OK");
      return;
    }

    const status = statusFromCode(n.status_code);
    if (status === "approved") {
      const regDate = new Date();
      const regExpDate = new Date(regDate);
      regExpDate.setFullYear(regExpDate.getFullYear() + 1);
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: "approved", gatewayPaymentId: n.payment_id ?? null, referenceNo: n.payment_id || payment.orderId! },
        }),
        prisma.player.update({ where: { userId: payment.userId }, data: { regDate, regExpDate } }),
      ]);
      const user = await prisma.user.findUnique({ where: { id: payment.userId }, select: { role: true } });
      logActivity(payment.userId, user?.role ?? "player", `Paid registration fee online: Rs. ${expected} (PayHere ${n.payment_id ?? ""}, order ${payment.orderId}) — registered until ${regExpDate.toISOString().slice(0, 10)}`);
    } else {
      await prisma.payment.update({ where: { id: payment.id }, data: { status, gatewayPaymentId: n.payment_id ?? null } });
      if (status !== "initiated") {
        logActivity(payment.userId, "player", `Online payment ${status} (order ${payment.orderId})`);
      }
    }
    res.status(200).send("OK");
  } catch (error) {
    console.error("PayHere notify error:", error);
    res.status(500).send("Error");
  }
};

/** GET /api/user/payhere/status/:orderId (player, own orders only) */
export const getPayHereStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment = await prisma.payment.findUnique({ where: { orderId: req.params.orderId } });
    if (!payment || payment.userId !== Number(req.user?.id)) {
      res.status(404).json({ success: false, message: "Payment not found" });
      return;
    }
    const player = await prisma.player.findUnique({ where: { userId: payment.userId }, select: { regExpDate: true } });
    res.status(200).json({
      success: true,
      data: {
        orderId: payment.orderId,
        status: payment.status,
        amount: formatAmount(Number(payment.amount)),
        currency: payment.currency,
        regExpDate: payment.status === "approved" ? player?.regExpDate : null,
      },
    });
  } catch (error) {
    console.error("PayHere status error:", error);
    res.status(500).json({ success: false, message: "Could not read the payment status" });
  }
};
