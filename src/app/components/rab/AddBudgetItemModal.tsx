import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import {
  fetchBudgetCategories,
  fetchBudgetActivities,
  addBudgetItem,
  updateBudgetItem,
  type BudgetCategory,
  type BudgetActivity,
} from "../../../services/budget.service";
import { formatRp, type RABItem } from "./rabData";

interface AddBudgetItemModalProps {
  onClose: () => void;
  onSuccess: () => void;
  preselectedCategoryId?: string;
  editItem?: RABItem & { categoryId: string };
}

const UNIT_OPTIONS = ["Month", "Package", "License", "Unit", "User", "Year", "Lot", "Person", "Event", "Article", "Video", "Campaign", "Document"];

export function AddBudgetItemModal({ onClose, onSuccess, preselectedCategoryId, editItem }: AddBudgetItemModalProps) {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [activities, setActivities] = useState<BudgetActivity[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingActs, setLoadingActs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [categoryId, setCategoryId] = useState(editItem?.categoryId ?? preselectedCategoryId ?? "");
  const [activityId, setActivityId] = useState(editItem?.activity_id ?? "");
  const [name, setName] = useState(editItem?.activity ?? "");
  const [quantity, setQuantity] = useState<number>(editItem?.qty ?? 1);
  const [unit, setUnit] = useState(editItem?.unit ?? "Unit");
  const [unitPrice, setUnitPrice] = useState<number>(editItem?.unitPrice ?? 0);
  const [targetAchievement, setTargetAchievement] = useState(editItem?.targetOutput ?? "");
  const [personInCharge, setPersonInCharge] = useState(editItem?.pic ?? "");
  const [referenceUrl, setReferenceUrl] = useState(editItem?.referenceUrl ?? "");

  const plannedAmount = quantity * unitPrice;

  // Load categories
  useEffect(() => {
    (async () => {
      setLoadingCats(true);
      const cats = await fetchBudgetCategories();
      setCategories(cats);
      setLoadingCats(false);
    })();
  }, []);

  // Load activities when category changes
  useEffect(() => {
    if (!categoryId) {
      setActivities([]);
      setActivityId(editItem?.activity_id ?? "");
      return;
    }
    (async () => {
      setLoadingActs(true);
      const acts = await fetchBudgetActivities(categoryId);
      setActivities(acts);
      if (!editItem || editItem.categoryId !== categoryId) {
        setActivityId("");
      } else {
        setActivityId(editItem.activity_id);
      }
      setLoadingActs(false);
    })();
  }, [categoryId, editItem]);

  const canSubmit =
    categoryId && activityId && name.trim() && quantity > 0 && unitPrice > 0 && targetAchievement.trim() && personInCharge.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    let result;
    
    if (editItem) {
      result = await updateBudgetItem(editItem.id, {
        activity_id: activityId,
        name: name.trim(),
        quantity,
        unit,
        unit_price: unitPrice,
        reference_url: referenceUrl.trim() || null,
        target_achievement: targetAchievement.trim(),
        person_in_charge: personInCharge.trim(),
      });
    } else {
      result = await addBudgetItem({
        activity_id: activityId,
        name: name.trim(),
        quantity,
        unit,
        unit_price: unitPrice,
        reference_url: referenceUrl.trim() || undefined,
        target_achievement: targetAchievement.trim(),
        person_in_charge: personInCharge.trim(),
      });
    }

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      onSuccess();
    }
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: 700,
    color: "#556174",
    marginBottom: "6px",
    letterSpacing: "0.02em",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "42px",
    padding: "0 14px",
    borderRadius: "12px",
    border: "1px solid rgba(17,24,39,0.12)",
    background: "#f8fafc",
    fontSize: "0.85rem",
    color: "#182033",
    fontWeight: 600,
    outline: "none",
    transition: "0.18s",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none" as const,
    cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737f91' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: "36px",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(12,23,43,0.55)",
        backdropFilter: "blur(8px)",
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "620px",
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: "28px",
          background: "linear-gradient(180deg, #ffffff, #fffdf9)",
          border: "1px solid rgba(17,24,39,0.10)",
          boxShadow: "0 32px 80px rgba(12,23,43,0.30)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 20px",
            borderBottom: "1px solid rgba(17,24,39,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 className="text-xl font-bold text-[#182033] font-sora">
              {editItem ? "Edit Budget Item" : "Add Budget Item"}
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {editItem ? "Update details for the selected budget plan" : "Create a new detailed budget plan"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "12px",
              background: "#f3f5f8",
              border: "1px solid rgba(17,24,39,0.08)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#556174",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px 28px 28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Category */}
            <div>
              <label style={labelStyle}>Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={selectStyle}
                disabled={loadingCats}
              >
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Activity */}
            <div>
              <label style={labelStyle}>Activity *</label>
              <select
                value={activityId}
                onChange={(e) => setActivityId(e.target.value)}
                style={selectStyle}
                disabled={!categoryId || loadingActs}
              >
                <option value="">{!categoryId ? "Select category first..." : loadingActs ? "Loading..." : "Select activity..."}</option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {/* Item Name */}
            <div>
              <label style={labelStyle}>Item Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cloud Hosting (12 months)"
                style={inputStyle}
              />
            </div>

            {/* Quantity + Unit + Unit Price row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Quantity *</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Unit *</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} style={selectStyle}>
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Unit Price (Rp) *</label>
                <input
                  type="number"
                  min={0}
                  value={unitPrice || ""}
                  onChange={(e) => setUnitPrice(Number(e.target.value) || 0)}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Planned Amount (computed) */}
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                background: "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.08), transparent 10rem), #fff7ed",
                border: "1px solid rgba(249,115,22,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#556174" }}>Planned Amount</span>
              <span
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#ea580c",
                  letterSpacing: "-0.04em",
                }}
              >
                {formatRp(plannedAmount)}
              </span>
            </div>

            {/* Target Achievement */}
            <div>
              <label style={labelStyle}>Target Output / Achievement *</label>
              <input
                value={targetAchievement}
                onChange={(e) => setTargetAchievement(e.target.value)}
                placeholder="e.g. Official company domain active"
                style={inputStyle}
              />
            </div>

            {/* Person In Charge */}
            <div>
              <label style={labelStyle}>Person In Charge (PIC) *</label>
              <input
                value={personInCharge}
                onChange={(e) => setPersonInCharge(e.target.value)}
                placeholder="e.g. Ahmad Rizky"
                style={inputStyle}
              />
            </div>

            {/* Reference URL */}
            <div>
              <label style={labelStyle}>Reference URL (optional)</label>
              <input
                value={referenceUrl}
                onChange={(e) => setReferenceUrl(e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                borderRadius: "12px",
                background: "rgba(220,38,38,0.06)",
                border: "1px solid rgba(220,38,38,0.18)",
                color: "#dc2626",
                fontSize: "0.82rem",
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                height: "42px",
                padding: "0 20px",
                borderRadius: "13px",
                background: "#f3f5f8",
                border: "1px solid rgba(17,24,39,0.08)",
                color: "#556174",
                fontSize: "0.83rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              style={{
                height: "42px",
                padding: "0 24px",
                borderRadius: "13px",
                background: canSubmit && !submitting
                  ? "linear-gradient(180deg, #fb7a18 0%, #ea580c 100%)"
                  : "#c9d0da",
                color: "white",
                border: canSubmit && !submitting
                  ? "1px solid rgba(194,65,12,0.22)"
                  : "1px solid transparent",
                cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
                fontSize: "0.83rem",
                fontWeight: 700,
                boxShadow: canSubmit && !submitting
                  ? "0 12px 28px rgba(234,88,12,0.22), inset 0 1px 0 rgba(255,255,255,0.20)"
                  : "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {editItem ? "Saving..." : "Creating..."}
                </>
              ) : (
                editItem ? "Save Changes" : "Create Budget Item"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
