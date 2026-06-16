// ─── Types (kept for backward-compat with existing UI components) ────────────

export type ApprovalStatus = "Planned" | "In Progress" | "Completed";

export interface RABItem {
  id: string;
  mainActivity: string;
  activity: string;
  qty: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  targetOutput: string;
  pic: string;
  status: ApprovalStatus;
  usedAmount: number;
  referenceUrl?: string | null;
  activity_id?: string;
}

export interface RABCategory {
  id: string;
  name: string;
  budget: number;
  color: string;
  lightColor: string;
  borderColor: string;
  items: RABItem[];
}

// ─── Style / Format Helpers (stateless, no hardcoded data) ───────────────────

export function getStatusStyle(status: ApprovalStatus) {
  switch (status) {
    case "Completed":
      return { color: "#16a34a", bg: "rgba(22,163,74,0.09)", border: "rgba(22,163,74,0.22)" };
    case "In Progress":
      return { color: "#d97706", bg: "rgba(217,119,6,0.09)", border: "rgba(217,119,6,0.22)" };
    case "Planned":
      return { color: "#2563eb", bg: "rgba(37,99,235,0.09)", border: "rgba(37,99,235,0.22)" };
  }
}

export function getUtilizationStatus(pct: number) {
  if (pct >= 90) return { label: "Critical", color: "#dc2626", bg: "rgba(220,38,38,0.08)" };
  if (pct >= 75) return { label: "Warning", color: "#d97706", bg: "rgba(217,119,6,0.08)" };
  return { label: "On Track", color: "#16a34a", bg: "rgba(22,163,74,0.08)" };
}

export function formatRp(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

// ─── Calculation Helpers (work on dynamic data) ──────────────────────────────

export function getCategoryRealization(cat: RABCategory): number {
  return cat.items.reduce((sum, item) => sum + item.usedAmount, 0);
}

export function getCategoryRemaining(cat: RABCategory): number {
  return cat.budget - getCategoryRealization(cat);
}

export function getCategoryPct(cat: RABCategory): number {
  if (cat.budget === 0) return 0;
  return Math.round((getCategoryRealization(cat) / cat.budget) * 100);
}

export function getTotalRealization(categories: RABCategory[]): number {
  return categories.reduce((sum, cat) => sum + getCategoryRealization(cat), 0);
}
