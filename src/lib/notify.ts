export type OrderDetails = {
  id: string;
  paypalOrderId: string;
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  status: string;
  payerName: string;
  payerEmail: string;
  shippingName: string;
  shippingAddress: string;
  createdAt: string;
};

const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "";

export async function recordOrder(params: {
  paypalOrderId: string;
  productId: string;
  productName: string;
}): Promise<OrderDetails | null> {
  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      console.error("[recordOrder] HTTP", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return data.order as OrderDetails;
  } catch (err) {
    console.error("[recordOrder] network error:", err);
    return null;
  }
}

const LAST_ORDER_KEY = "mm971_last_order";

export function storeLastOrder(order: OrderDetails): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

export function getLastOrder(id: string): OrderDetails | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as OrderDetails;
    return parsed.id === id ? parsed : undefined;
  } catch {
    return undefined;
  }
}
