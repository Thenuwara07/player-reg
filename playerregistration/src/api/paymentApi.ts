const API_BASE_URL = import.meta.env.VITE_API_URL;

const authHeaders = (): Record<string, string> => {
  const token = sessionStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const readError = async (response: Response, fallback: string) => {
  const data = await response.json().catch(() => ({}));
  return new Error(data.message || data.error || fallback);
};

/**
 * Starts the PayHere checkout: the backend creates the order (fixed
 * Rs. 1,000.00) and signs it; we then post that form to PayHere, which
 * navigates the browser to the PayHere payment page.
 */
export const startPayHereCheckout = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/user/payhere/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  if (!response.ok) throw await readError(response, "Could not start the payment");
  const { action, fields } = (await response.json()) as {
    action: string;
    fields: Record<string, string>;
  };

  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
};

export type PaymentStatus = {
  orderId: string;
  status: "initiated" | "approved" | "failed" | "cancelled" | "chargedback" | "abandoned";
  amount: string;
  currency: string;
  regExpDate: string | null;
};

export const getPayHereStatus = async (orderId: string): Promise<PaymentStatus> => {
  const response = await fetch(
    `${API_BASE_URL}/user/payhere/status/${encodeURIComponent(orderId)}`,
    { headers: authHeaders() }
  );
  if (!response.ok) throw await readError(response, "Could not read the payment status");
  return (await response.json()).data;
};
