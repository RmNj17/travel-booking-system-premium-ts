import { BookingStatus } from "../types";

export const fallbackImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop";

export function money(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function statusColor(status: BookingStatus): string {
  const map: Record<BookingStatus, string> = {
    PENDING_PAYMENT: "gold",
    CONFIRMED: "green",
    PAYMENT_FAILED: "red",
    CANCELLED: "volcano",
    COMPLETED: "blue",
    REFUND_REQUESTED: "purple",
    REFUNDED: "cyan",
  };
  return map[status] || "default";
}

export function prettyStatus(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "PENDING CONFIRMATION",
    PENDING_PAYMENT: "PENDING CONFIRMATION",
    CONFIRMED: "CONFIRMED",
    PAYMENT_FAILED: "PAYMENT FAILED",
    CANCELLED: "CANCELLED",
    COMPLETED: "COMPLETED",
    REFUND_REQUESTED: "REFUND REQUESTED",
    REFUNDED: "REFUNDED",
  };

  return labels[status] || status.toUpperCase().replace(/_/g, " ");
}
