// PayHere payment gateway (https://support.payhere.lk/api-&-mobile-sdk/payhere-checkout)
//
// Flow: the backend creates the order and signs it (amount fixed here, never
// taken from the browser) → the browser posts the signed form to PayHere →
// PayHere calls our notify URL server-to-server → we verify the signature and
// only then approve the payment.
import crypto from "crypto";

/** Registration fee in LKR — fixed; the client can never change it. */
export const REGISTRATION_FEE = 1000;
export const CURRENCY = "LKR";

const md5Upper = (value: string) =>
  crypto.createHash("md5").update(value).digest("hex").toUpperCase();

/** PayHere wants amounts with exactly 2 decimals, no thousands separator. */
export const formatAmount = (amount: number) => amount.toFixed(2);

export const payhereConfig = () => {
  const merchantId = process.env.PAYHERE_MERCHANT_ID ?? "";
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET ?? "";
  const sandbox = (process.env.PAYHERE_SANDBOX ?? "true").toLowerCase() !== "false";
  const backendUrl = (process.env.BACKEND_PUBLIC_URL ?? "").replace(/\/+$/, "");
  const frontendUrl = (process.env.FRONTEND_URL ?? "").replace(/\/+$/, "");
  return {
    merchantId,
    merchantSecret,
    sandbox,
    configured: Boolean(merchantId && merchantSecret && backendUrl && frontendUrl),
    checkoutUrl: sandbox
      ? "https://sandbox.payhere.lk/pay/checkout"
      : "https://www.payhere.lk/pay/checkout",
    notifyUrl: `${backendUrl}/api/payhere/notify`,
    returnUrl: `${frontendUrl}/payment/return`,
    cancelUrl: `${frontendUrl}/payment/cancel`,
  };
};

/** Hash sent with the checkout form. */
export const checkoutHash = (
  merchantId: string,
  orderId: string,
  amount: string,
  currency: string,
  merchantSecret: string
) => md5Upper(merchantId + orderId + amount + currency + md5Upper(merchantSecret));

/** Checks the md5sig PayHere sends to the notify URL. */
export const isValidNotification = (
  n: Record<string, string | undefined>,
  merchantId: string,
  merchantSecret: string
) => {
  if (!n.md5sig || n.merchant_id !== merchantId) return false;
  const expected = md5Upper(
    (n.merchant_id ?? "") +
      (n.order_id ?? "") +
      (n.payhere_amount ?? "") +
      (n.payhere_currency ?? "") +
      (n.status_code ?? "") +
      md5Upper(merchantSecret)
  );
  const a = Buffer.from(expected);
  const b = Buffer.from(String(n.md5sig).toUpperCase());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

/** PayHere status_code → our payment status. */
export const statusFromCode = (code: string | undefined) => {
  switch (code) {
    case "2":
      return "approved";
    case "0":
      return "initiated"; // still pending on PayHere's side
    case "-1":
      return "cancelled";
    case "-2":
      return "failed";
    case "-3":
      return "chargedback";
    default:
      return "failed";
  }
};
