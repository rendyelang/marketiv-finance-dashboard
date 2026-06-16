import { supabase } from "../lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BudgetCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface BudgetActivity {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface BudgetItem {
  id: string;
  activity_id: string;
  name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  reference_url: string | null;
  target_achievement: string;
  person_in_charge: string;
  created_at: string;
  updated_at: string;
}

/** Aggregated usage per budget item from transactions */
export interface BudgetItemUsage {
  budget_item_id: string;
  used_amount: number;
}

/** The full nested structure used by the UI */
export interface RABCategoryView {
  id: string;
  name: string;
  description: string | null;
  /** Sum of all item planned_amounts in this category */
  budget: number;
  /** Theme color assigned to each category (client-side) */
  color: string;
  lightColor: string;
  borderColor: string;
  activities: RABActivityView[];
  items: RABItemView[];
}

export interface RABActivityView {
  id: string;
  name: string;
}

export interface RABItemView {
  id: string;
  /** The budget_activities.name this item belongs to */
  mainActivity: string;
  /** The budget_items.name */
  activity: string;
  qty: number;
  unit: string;
  unitPrice: number;
  /** Computed: qty * unitPrice */
  totalAmount: number;
  targetOutput: string;
  pic: string;
  referenceUrl: string | null;
  /** Computed from transactions */
  usedAmount: number;
  /** Computed from usedAmount vs totalAmount */
  status: "Planned" | "In Progress" | "Completed";
  /** Raw IDs for mutations */
  activity_id: string;
}

// ─── Category Colors ─────────────────────────────────────────────────────────
// Stable color map keyed by known category names; falls back for unknowns.

const CATEGORY_COLORS: Record<string, { color: string; lightColor: string; borderColor: string }> = {
  "Pengembangan Produk/Riset": {
    color: "#f97316",
    lightColor: "#fff7ed",
    borderColor: "rgba(249,115,22,0.18)",
  },
  "Product Development & Research": {
    color: "#f97316",
    lightColor: "#fff7ed",
    borderColor: "rgba(249,115,22,0.18)",
  },
  Production: {
    color: "#2563eb",
    lightColor: "#eff6ff",
    borderColor: "rgba(37,99,235,0.18)",
  },
  Produksi: {
    color: "#2563eb",
    lightColor: "#eff6ff",
    borderColor: "rgba(37,99,235,0.18)",
  },
  "Company Legalization": {
    color: "#7c3aed",
    lightColor: "#f5f3ff",
    borderColor: "rgba(124,58,237,0.18)",
  },
  "Legalitas, Perizinan, Sertifikasi": {
    color: "#7c3aed",
    lightColor: "#f5f3ff",
    borderColor: "rgba(124,58,237,0.18)",
  },
  "HR Certification": {
    color: "#16a34a",
    lightColor: "#f0fdf4",
    borderColor: "rgba(22,163,74,0.18)",
  },
  "Peningkatan Kompetensi SDM Bersertifikasi": {
    color: "#16a34a",
    lightColor: "#f0fdf4",
    borderColor: "rgba(22,163,74,0.18)",
  },
  "Office Supplies & Support": {
    color: "#1e3a5f",
    lightColor: "#f3f7fb",
    borderColor: "rgba(30,58,95,0.18)",
  },
  "ATK dan Penunjang": {
    color: "#1e3a5f",
    lightColor: "#f3f7fb",
    borderColor: "rgba(30,58,95,0.18)",
  },
};

const FALLBACK_COLORS = [
  { color: "#0ea5e9", lightColor: "#f0f9ff", borderColor: "rgba(14,165,233,0.18)" },
  { color: "#ec4899", lightColor: "#fdf2f8", borderColor: "rgba(236,72,153,0.18)" },
  { color: "#14b8a6", lightColor: "#f0fdfa", borderColor: "rgba(20,184,166,0.18)" },
];

function getCategoryColor(name: string, index: number) {
  return CATEGORY_COLORS[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

// ─── Computed helpers ────────────────────────────────────────────────────────

function computeStatus(usedAmount: number, totalAmount: number): "Planned" | "In Progress" | "Completed" {
  if (usedAmount <= 0) return "Planned";
  if (usedAmount >= totalAmount) return "Completed";
  return "In Progress";
}

// ─── Service Functions ───────────────────────────────────────────────────────

/**
 * Fetch all budget categories, activities, budget items, and transaction usage
 * in parallel, then assemble the nested RABCategoryView[] structure.
 */
export async function fetchRABData(): Promise<{
  categories: RABCategoryView[];
  totalBudget: number;
  totalRealization: number;
  error: string | null;
}> {
  const [catRes, actRes, itemRes, usageRes] = await Promise.all([
    supabase.from("budget_categories").select("*").order("created_at"),
    supabase.from("budget_activities").select("*").order("created_at"),
    supabase.from("budget_items").select("*").order("created_at"),
    // Aggregate expense transactions per budget_item_id
    supabase
      .from("transactions")
      .select("budget_item_id, amount")
      .in("type", ["Expense", "expense"]),
  ]);

  // Check for errors
  const firstError =
    catRes.error?.message ??
    actRes.error?.message ??
    itemRes.error?.message ??
    usageRes.error?.message ??
    null;

  if (firstError) {
    return { categories: [], totalBudget: 0, totalRealization: 0, error: firstError };
  }

  const categories = (catRes.data ?? []) as BudgetCategory[];
  const activities = (actRes.data ?? []) as BudgetActivity[];
  const items = (itemRes.data ?? []) as BudgetItem[];
  const transactions = (usageRes.data ?? []) as { budget_item_id: string | null; amount: number }[];

  // Build usage map: budget_item_id -> total used
  const usageMap = new Map<string, number>();
  for (const tx of transactions) {
    if (tx.budget_item_id) {
      usageMap.set(tx.budget_item_id, (usageMap.get(tx.budget_item_id) ?? 0) + tx.amount);
    }
  }

  // Build activity lookup: activity_id -> activity
  const activityMap = new Map<string, BudgetActivity>();
  for (const act of activities) {
    activityMap.set(act.id, act);
  }

  // Build items grouped by category
  // First: group activities by category_id
  const actsByCat = new Map<string, BudgetActivity[]>();
  for (const act of activities) {
    const list = actsByCat.get(act.category_id) ?? [];
    list.push(act);
    actsByCat.set(act.category_id, list);
  }

  // Group items by activity_id
  const itemsByAct = new Map<string, BudgetItem[]>();
  for (const item of items) {
    const list = itemsByAct.get(item.activity_id) ?? [];
    list.push(item);
    itemsByAct.set(item.activity_id, list);
  }

  let totalBudget = 0;
  let totalRealization = 0;

  const result: RABCategoryView[] = categories.map((cat, catIndex) => {
    const catActivities = actsByCat.get(cat.id) ?? [];
    const catItems: RABItemView[] = [];

    for (const act of catActivities) {
      const actItems = itemsByAct.get(act.id) ?? [];
      for (const item of actItems) {
        const totalAmount = item.quantity * item.unit_price;
        const usedAmount = usageMap.get(item.id) ?? 0;

        catItems.push({
          id: item.id,
          mainActivity: act.name,
          activity: item.name,
          qty: item.quantity,
          unit: item.unit,
          unitPrice: item.unit_price,
          totalAmount,
          targetOutput: item.target_achievement ?? "",
          pic: item.person_in_charge ?? "",
          referenceUrl: item.reference_url,
          usedAmount,
          status: computeStatus(usedAmount, totalAmount),
          activity_id: item.activity_id,
        });
      }
    }

    const catBudget = catItems.reduce((sum, i) => sum + i.totalAmount, 0);
    const catRealization = catItems.reduce((sum, i) => sum + i.usedAmount, 0);
    totalBudget += catBudget;
    totalRealization += catRealization;

    const colors = getCategoryColor(cat.name, catIndex);

    return {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      budget: catBudget,
      ...colors,
      activities: catActivities.map((a) => ({ id: a.id, name: a.name })),
      items: catItems,
    };
  });

  return { categories: result, totalBudget, totalRealization, error: null };
}

/**
 * Fetch all budget categories (for dropdowns).
 */
export async function fetchBudgetCategories(): Promise<BudgetCategory[]> {
  const { data, error } = await supabase
    .from("budget_categories")
    .select("*")
    .order("created_at");

  if (error) {
    console.error("Error fetching budget categories:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Fetch budget activities filtered by category (for dropdowns).
 */
export async function fetchBudgetActivities(categoryId: string): Promise<BudgetActivity[]> {
  const { data, error } = await supabase
    .from("budget_activities")
    .select("*")
    .eq("category_id", categoryId)
    .order("created_at");

  if (error) {
    console.error("Error fetching budget activities:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Insert a new budget item.
 */
export async function addBudgetItem(item: {
  activity_id: string;
  name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  reference_url?: string;
  target_achievement: string;
  person_in_charge: string;
}): Promise<{ data: BudgetItem | null; error: string | null }> {
  const { data, error } = await supabase
    .from("budget_items")
    .insert({
      activity_id: item.activity_id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unit_price,
      reference_url: item.reference_url ?? null,
      target_achievement: item.target_achievement,
      person_in_charge: item.person_in_charge,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }
  return { data: data as BudgetItem, error: null };
}

/**
 * Update an existing budget item.
 */
export async function updateBudgetItem(
  id: string,
  updates: Partial<{
    name: string;
    quantity: number;
    unit: string;
    unit_price: number;
    reference_url: string | null;
    target_achievement: string;
    person_in_charge: string;
    activity_id: string;
  }>
): Promise<{ data: BudgetItem | null; error: string | null }> {
  const { data, error } = await supabase
    .from("budget_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }
  return { data: data as BudgetItem, error: null };
}

/**
 * Delete a budget item.
 * Will fail if any transaction references it (FK constraint).
 */
export async function deleteBudgetItem(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  // First check if transactions reference this item
  const { data: txs, error: txErr } = await supabase
    .from("transactions")
    .select("id")
    .eq("budget_item_id", id)
    .limit(1);

  if (txErr) {
    return { success: false, error: txErr.message };
  }

  if (txs && txs.length > 0) {
    return {
      success: false,
      error: "Cannot delete this budget item because it has linked transactions. Archive it instead.",
    };
  }

  const { error } = await supabase.from("budget_items").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, error: null };
}
