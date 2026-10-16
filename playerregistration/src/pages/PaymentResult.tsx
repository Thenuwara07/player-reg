import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPayHereStatus, PaymentStatus } from "@/api/paymentApi";

// PayHere confirms the payment to our server separately from sending the
// player back here, so poll for a short while before giving up.
const POLL_EVERY_MS = 2000;
const POLL_FOR_MS = 90000;

type View = "checking" | "approved" | "failed" | "cancelled" | "pending";

const PaymentResult: React.FC<{ cancelled?: boolean }> = ({ cancelled = false }) => {
  const [params] = useSearchParams();
  const orderId = params.get("order_id") ?? "";
  const [view, setView] = useState<View>(cancelled ? "cancelled" : "checking");
  const [payment, setPayment] = useState<PaymentStatus | null>(null);

  useEffect(() => {
    if (cancelled || !orderId) {
      if (!orderId && !cancelled) setView("pending");
      return;
    }
    let stopped = false;
    const startedAt = Date.now();
    const check = async () => {
      try {
        const p = await getPayHereStatus(orderId);
        if (stopped) return;
        setPayment(p);
        if (p.status === "approved") return setView("approved");
        if (["failed", "chargedback"].includes(p.status)) return setView("failed");
        if (p.status === "cancelled") return setView("cancelled");
      } catch {
        // keep polling; show "pending" if it never resolves
      }
      if (Date.now() - startedAt > POLL_FOR_MS) return setView("pending");
      setTimeout(() => !stopped && check(), POLL_EVERY_MS);
    };
    check();
    return () => {
      stopped = true;
    };
  }, [orderId, cancelled]);

  const content: Record<View, { icon: React.ReactNode; title: string; text: string }> = {
    checking: {
      icon: <Loader2 className="w-14 h-14 animate-spin text-gray-500" />,
      title: "Confirming your payment…",
      text: "Please wait a moment while we receive the confirmation from PayHere.",
    },
    approved: {
      icon: <CheckCircle2 className="w-14 h-14 text-green-600" />,
      title: "Payment successful",
      text: `Rs. ${Number(payment?.amount ?? 1000).toLocaleString("en-LK", { minimumFractionDigits: 2 })} received. Your registration is active${
        payment?.regExpDate ? ` until ${new Date(payment.regExpDate).toLocaleDateString()}` : ""
      }.`,
    },
    failed: {
      icon: <XCircle className="w-14 h-14 text-red-600" />,
      title: "Payment failed",
      text: "Your payment was not completed. No registration was made. You can try again from your profile.",
    },
    cancelled: {
      icon: <XCircle className="w-14 h-14 text-gray-500" />,
      title: "Payment cancelled",
      text: "You cancelled the payment. You can pay any time from your profile.",
    },
    pending: {
      icon: <Clock className="w-14 h-14 text-yellow-600" />,
      title: "Payment is being confirmed",
      text: "We haven't received the confirmation yet. It usually arrives within a few minutes — check your profile again shortly. Please don't pay twice.",
    },
  };
  const c = content[view];

  return (
    <div className="min-h-screen sports-gradient flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardContent className="pt-8 pb-8 flex flex-col items-center text-center gap-4">
          {c.icon}
          <h1 className="text-2xl font-bold">{c.title}</h1>
          <p className="text-muted-foreground">{c.text}</p>
          {orderId && <p className="text-xs text-muted-foreground">Order: {orderId}</p>}
          <Button asChild className="mt-2">
            <Link to="/dashboard">Go to my profile</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentResult;
