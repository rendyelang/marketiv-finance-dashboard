import { useState, useEffect, useRef } from "react";
import {
  X,
  ArrowUpCircle,
  ArrowDownCircle,
  Upload,
  Plus,
  ChevronDown,
  Search,
  Check,
  Link2,
} from "lucide-react";
import { type TransactionType, type TransactionStatus, type Transaction, CATEGORY_MAP } from "./transactionData";
import { fetchRABData, type RABCategoryView } from "../../../services/budget.service";
import { addTransaction, updateTransaction, uploadAttachment } from "../../../services/transaction.service";

interface AddTransactionModalProps {
  onClose: () => void;
  onSave?: (data: any) => void;
  editData?: Transaction | null;
}

const CATEGORIES = Object.keys(CATEGORY_MAP);
const STATUSES: TransactionStatus[] = ["Draft", "Completed"];

const fieldStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "0 14px",
  borderRadius: "13px",
  background: "white",
  border: "1px solid rgba(17,24,39,0.10)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 12px rgba(15,23,42,0.035)",
  color: "#182033",
  fontSize: "0.85rem",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  outline: "none",
  boxSizing: "border-box" as const,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 800,
  color: "#34435d",
  marginBottom: "6px",
  letterSpacing: "-0.01em",
};

function fmt(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export function AddTransactionModal({ onClose, onSave, editData }: AddTransactionModalProps) {
  const isEditing = !!editData;
  const [txType, setTxType] = useState<TransactionType>(editData?.type || "Expense");
  // Default to today if new, or existing date
  const [date, setDate] = useState(editData?.date || new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState(editData?.description || "");
  const [category, setCategory] = useState(editData?.category || CATEGORIES[0]);
  const [amount, setAmount] = useState(editData?.amount ? editData.amount.toLocaleString("id-ID") : "");
  const [pic, setPic] = useState(editData?.pic || "");
  const [status, setStatus] = useState<TransactionStatus>(editData?.status || "Draft");
  const [notes, setNotes] = useState(editData?.notes || "");
  const [files, setFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RAB linkage state
  const [relatedItemId, setRelatedItemId] = useState<string | null>(editData?.relatedItemId || null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const [rabCategories, setRabCategories] = useState<RABCategoryView[]>([]);
  const isInitialMount = useRef(true);

  // Load RAB data for budget item selection
  useEffect(() => {
    (async () => {
      const result = await fetchRABData();
      if (!result.error && result.categories.length > 0) {
        setRabCategories(result.categories);
        if (!isEditing) setCategory(result.categories[0].name);
      }
    })();
  }, [isEditing]);

  // Reset RAB item when category or type changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setRelatedItemId(null);
    setDropdownOpen(false);
    setItemSearch("");
  }, [category, txType]);

  const selectedRabCategory = rabCategories.find((c) => c.name === category);
  const availableItems = (selectedRabCategory?.items ?? []).map((item) => ({
    id: item.id,
    mainActivity: item.mainActivity,
    activity: item.activity,
    totalAmount: item.totalAmount,
    usedAmount: item.usedAmount,
    status: item.status,
    qty: item.qty,
    unit: item.unit,
    itemType: item.itemType,
    color: selectedRabCategory?.color ?? "#f97316",
  }));
  const filteredItems = availableItems.filter(
    (item) =>
      !itemSearch ||
      item.activity.toLowerCase().includes(itemSearch.toLowerCase()) ||
      item.mainActivity.toLowerCase().includes(itemSearch.toLowerCase())
  );
  const selectedItem = availableItems.find((i) => i.id === relatedItemId) ?? null;
  const catColor = selectedRabCategory?.color ?? "#f97316";

  const handleSave = async () => {
    if (txType === "Expense" && !relatedItemId) {
      alert("Expense transactions require a related budget item.");
      return;
    }

    const payload = {
      type: txType,
      date,
      amount: parseFloat(amount.replace(/\./g, "").replace(/,/g, ".")) || 0,
      description,
      budget_item_id: txType === "Expense" ? (relatedItemId || null) : null,
      person_in_charge: pic,
      status,
      notes,
    };

    setIsSaving(true);
    try {
      let result;
      if (isEditing && editData) {
        result = await updateTransaction(editData.id, payload);
      } else {
        result = await addTransaction(payload);
      }

      if (result.error || !result.data) {
        throw new Error(result.error || "Failed to save transaction to database");
      }

      const tx = result.data;
      if (tx && files.length > 0) {
        let uploadErrors = [];
        for (const file of files) {
          const res = await uploadAttachment(tx.id, file);
          if (res.error) uploadErrors.push(`${file.name}: ${res.error}`);
        }
        if (uploadErrors.length > 0) {
          alert("Transaction saved, but some attachments failed to upload:\n" + uploadErrors.join("\n"));
        }
      }

      onSave?.(tx);
      onClose();
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred: " + (err instanceof Error ? err.message : err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          background: "rgba(12,23,43,0.40)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
          width: "min(620px, calc(100vw - 40px))",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "32px",
          background: "#fbf7ef",
          boxShadow: "0 32px 90px rgba(12,23,43,0.28)",
          border: "1px solid rgba(255,255,255,0.80)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 20px",
            borderBottom: "1px solid rgba(17,24,39,0.07)",
            background:
              "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.07), transparent 14rem), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.72))",
            borderRadius: "32px 32px 0 0",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#182033",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              {isEditing ? "Edit Transaction" : "Add Transaction"}
            </div>
            <div style={{ color: "#556174", fontSize: "0.80rem", marginTop: "5px", fontWeight: 500 }}>
              {isEditing ? "Update details for this financial record" : "Record a new financial transaction to the system"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "11px",
              background: "white",
              border: "1px solid rgba(17,24,39,0.09)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#182033",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Transaction Type Toggle */}
          <div>
            <label style={labelStyle}>Transaction Type</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {(["Expense", "Income"] as TransactionType[]).map((t) => {
                const isSelected = txType === t;
                const isIncome = t === "Income";
                return (
                  <button
                    key={t}
                    onClick={() => setTxType(t)}
                    style={{
                      height: "52px",
                      borderRadius: "16px",
                      background: isSelected
                        ? isIncome
                          ? "linear-gradient(135deg, #f0fdf4, #dcfce7)"
                          : "linear-gradient(135deg, #fff5f5, #fee2e2)"
                        : "white",
                      border: isSelected
                        ? isIncome
                          ? "1.5px solid rgba(22,163,74,0.30)"
                          : "1.5px solid rgba(220,38,38,0.25)"
                        : "1px solid rgba(17,24,39,0.09)",
                      color: isSelected ? (isIncome ? "#16a34a" : "#dc2626") : "#556174",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "0.18s cubic-bezier(.2,.8,.2,1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: isSelected ? "0 6px 18px rgba(15,23,42,0.08)" : "none",
                    }}
                  >
                    {isIncome ? (
                      <ArrowUpCircle size={17} strokeWidth={2.5} />
                    ) : (
                      <ArrowDownCircle size={17} strokeWidth={2.5} />
                    )}
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date + Amount */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Amount (Rp)</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 500.000"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setAmount(val ? Number(val).toLocaleString("id-ID") : "");
                }}
                style={fieldStyle}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <input
              type="text"
              placeholder="e.g. Cloud hosting payment — June 2026"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={fieldStyle}
            />
          </div>

          {/* Category + PIC */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Budget Category</label>
              <div style={{ position: "relative" }}>
                <select
                  value={txType === "Income" ? "—" : category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    ...fieldStyle,
                    paddingRight: "36px",
                    appearance: "none" as const,
                    opacity: txType === "Income" ? 0.6 : 1,
                    cursor: txType === "Income" ? "not-allowed" : "pointer",
                    background: txType === "Income" ? "#e2e8f0" : "rgba(248,250,252,0.8)",
                  }}
                  disabled={txType === "Income"}
                >
                  {txType === "Income" ? (
                    <option value="—">— (Not Applicable for Income)</option>
                  ) : (
                    rabCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown
                  size={14}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#737f91",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Person In Charge</label>
              <input
                type="text"
                placeholder="e.g. Ahmad Rizky"
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                style={fieldStyle}
              />
            </div>
          </div>

          {/* ── Related Budget Item (Expense only) ── */}
          {txType === "Expense" && (
            <div>
              {/* Label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  Related Budget Item{" "}
                  <span
                    style={{
                      color: "#dc2626",
                      fontWeight: 900,
                      fontSize: "0.80rem",
                    }}
                  >
                    *
                  </span>
                </label>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    background: "rgba(37,99,235,0.07)",
                    color: "#2563eb",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  <Link2 size={10} strokeWidth={2.5} />
                  Detailed RAB
                </div>
              </div>

              {/* Trigger button */}
              <button
                type="button"
                onClick={() =>
                  availableItems.length > 0 && setDropdownOpen(!dropdownOpen)
                }
                style={{
                  width: "100%",
                  minHeight: "52px",
                  padding: "11px 14px",
                  borderRadius: "13px",
                  background: selectedItem
                    ? `${catColor}06`
                    : dropdownOpen
                    ? "white"
                    : "rgba(255,255,255,0.80)",
                  border: dropdownOpen
                    ? `1.5px solid ${catColor}50`
                    : selectedItem
                    ? `1px solid ${catColor}30`
                    : "1px solid rgba(17,24,39,0.10)",
                  boxShadow: dropdownOpen
                    ? `0 0 0 3px ${catColor}12, 0 4px 12px rgba(15,23,42,0.07)`
                    : "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 12px rgba(15,23,42,0.035)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  cursor: availableItems.length > 0 ? "pointer" : "not-allowed",
                  textAlign: "left",
                  transition: "0.18s cubic-bezier(.2,.8,.2,1)",
                  opacity: availableItems.length === 0 ? 0.5 : 1,
                }}
              >
                {selectedItem ? (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "3px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "3px",
                          background: catColor,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#182033",
                          fontSize: "0.86rem",
                          letterSpacing: "-0.018em",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedItem.activity}
                      </span>
                      <span
                        style={{
                          padding: "2px 7px",
                          borderRadius: "6px",
                          background: "#f3f5f8",
                          color: "#556174",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {selectedItem.itemType}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "14px",
                        fontSize: "0.73rem",
                        color: "#737f91",
                        fontWeight: 600,
                      }}
                    >
                      <span>
                        Budget:{" "}
                        <strong style={{ color: "#182033" }}>
                          {fmt(selectedItem.totalAmount)}
                        </strong>
                      </span>
                      <span>
                        Used:{" "}
                        <strong
                          style={{
                            color:
                              selectedItem.usedAmount > 0 ? catColor : "#c9d0da",
                          }}
                        >
                          {fmt(selectedItem.usedAmount)}
                        </strong>
                      </span>
                      <span>
                        Remaining:{" "}
                        <strong
                          style={{
                            color:
                              selectedItem.totalAmount - selectedItem.usedAmount > 0
                                ? "#16a34a"
                                : "#dc2626",
                          }}
                        >
                          {fmt(selectedItem.totalAmount - selectedItem.usedAmount)}
                        </strong>
                      </span>
                    </div>
                  </div>
                ) : (
                  <span
                    style={{
                      color: "#737f91",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  >
                    {availableItems.length === 0
                      ? "Select a Budget Category first"
                      : `Choose from ${availableItems.length} items in ${selectedRabCategory?.name ?? "this category"}…`}
                  </span>
                )}

                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}
                >
                  {selectedItem && (
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "999px",
                        background: "rgba(22,163,74,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#16a34a",
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                  <ChevronDown
                    size={15}
                    style={{
                      color: "#737f91",
                      transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.18s",
                    }}
                  />
                </div>
              </button>

              {/* Inline expanded list */}
              {dropdownOpen && availableItems.length > 0 && (
                <div
                  style={{
                    marginTop: "6px",
                    borderRadius: "16px",
                    background: "white",
                    border: "1px solid rgba(17,24,39,0.10)",
                    boxShadow: "0 12px 32px rgba(15,23,42,0.12)",
                    overflow: "hidden",
                  }}
                >
                  {/* Search bar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "11px 14px",
                      borderBottom: "1px solid rgba(17,24,39,0.07)",
                      background: "#fafbfc",
                    }}
                  >
                    <Search size={14} style={{ color: "#737f91", flexShrink: 0 }} />
                    <input
                      value={itemSearch}
                      onChange={(e) => setItemSearch(e.target.value)}
                      placeholder={`Search ${availableItems.length} budget items…`}
                      autoFocus
                      style={{
                        background: "none",
                        border: "none",
                        outline: "none",
                        color: "#182033",
                        fontSize: "0.84rem",
                        width: "100%",
                        padding: 0,
                        height: "auto",
                        minHeight: "auto",
                        boxShadow: "none",
                        borderRadius: 0,
                      }}
                    />
                    {itemSearch && (
                      <button
                        onClick={() => setItemSearch("")}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#737f91",
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Items */}
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {filteredItems.length === 0 ? (
                      <div
                        style={{
                          padding: "22px 16px",
                          textAlign: "center",
                          color: "#737f91",
                          fontSize: "0.82rem",
                        }}
                      >
                        No items match "{itemSearch}"
                      </div>
                    ) : (
                      filteredItems.map((item, idx) => {
                        const isSelected = relatedItemId === item.id;
                        const pct =
                          item.totalAmount > 0
                            ? Math.round((item.usedAmount / item.totalAmount) * 100)
                            : 0;
                        const remaining = item.totalAmount - item.usedAmount;
                        const isLast = idx === filteredItems.length - 1;

                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setRelatedItemId(item.id);
                              setDropdownOpen(false);
                              setItemSearch("");
                            }}
                            style={{
                              width: "100%",
                              padding: "14px 16px",
                              background: isSelected
                                ? `${catColor}08`
                                : "transparent",
                              border: "none",
                              borderBottom: isLast
                                ? "none"
                                : "1px solid rgba(17,24,39,0.05)",
                              cursor: "pointer",
                              textAlign: "left",
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                              transition: "background 0.14s",
                            }}
                          >
                            {/* Item header row */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: "10px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  minWidth: 0,
                                  flex: 1,
                                }}
                              >
                                <div
                                  style={{
                                    width: "9px",
                                    height: "9px",
                                    borderRadius: "3px",
                                    background: catColor,
                                    flexShrink: 0,
                                    boxShadow: isSelected
                                      ? `0 0 0 3px ${catColor}22`
                                      : "none",
                                  }}
                                />
                                <span
                                  style={{
                                    fontWeight: 700,
                                    color: "#182033",
                                    fontSize: "0.87rem",
                                    letterSpacing: "-0.02em",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {item.activity}
                                </span>
                                <span
                                  style={{
                                    padding: "2px 7px",
                                    borderRadius: "6px",
                                    background: "#f3f5f8",
                                    color: "#556174",
                                    fontSize: "0.67rem",
                                    fontWeight: 700,
                                    flexShrink: 0,
                                  }}
                                >
                                  {item.itemType}
                                </span>
                              </div>
                              {isSelected && (
                                <div
                                  style={{
                                    width: "22px",
                                    height: "22px",
                                    borderRadius: "999px",
                                    background: "rgba(22,163,74,0.12)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#16a34a",
                                    flexShrink: 0,
                                  }}
                                >
                                  <Check size={11} strokeWidth={3} />
                                </div>
                              )}
                            </div>

                            {/* Sub-label */}
                            <div
                              style={{
                                fontSize: "0.71rem",
                                color: "#737f91",
                                fontWeight: 600,
                                marginTop: "-4px",
                                paddingLeft: "17px",
                              }}
                            >
                              {item.mainActivity} · {item.qty} {item.unit}
                            </div>

                            {/* Budget info tiles */}
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "8px",
                              }}
                            >
                              {[
                                {
                                  label: "Budget",
                                  value: fmt(item.totalAmount),
                                  color: "#182033",
                                  bg: isSelected ? `${catColor}08` : "#f8fafc",
                                },
                                {
                                  label: "Used",
                                  value: fmt(item.usedAmount),
                                  color:
                                    item.usedAmount > 0 ? catColor : "#c9d0da",
                                  bg: isSelected
                                    ? `${catColor}06`
                                    : "#f8fafc",
                                },
                                {
                                  label: "Remaining",
                                  value: fmt(remaining),
                                  color:
                                    remaining > 0 ? "#16a34a" : "#dc2626",
                                  bg: isSelected
                                    ? "rgba(22,163,74,0.05)"
                                    : "#f8fafc",
                                },
                              ].map((tile) => (
                                <div
                                  key={tile.label}
                                  style={{
                                    padding: "8px 10px",
                                    borderRadius: "10px",
                                    background: tile.bg,
                                    border: "1px solid rgba(17,24,39,0.06)",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "0.62rem",
                                      color: "#737f91",
                                      fontWeight: 800,
                                      letterSpacing: "0.06em",
                                      textTransform: "uppercase",
                                      marginBottom: "3px",
                                    }}
                                  >
                                    {tile.label}
                                  </div>
                                  <div
                                    style={{
                                      fontFamily: "'Sora', sans-serif",
                                      fontSize: "0.82rem",
                                      fontWeight: 800,
                                      color: tile.color,
                                      letterSpacing: "-0.025em",
                                      lineHeight: 1,
                                    }}
                                  >
                                    {tile.value}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Utilization bar */}
                            <div>
                              <div
                                style={{
                                  height: "5px",
                                  borderRadius: "999px",
                                  background: "#eef2f7",
                                  overflow: "hidden",
                                  marginBottom: "4px",
                                }}
                              >
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${pct}%`,
                                    borderRadius: "999px",
                                    background: `linear-gradient(90deg, ${catColor}, ${catColor}cc)`,
                                  }}
                                />
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.66rem",
                                    color: "#737f91",
                                    fontWeight: 600,
                                  }}
                                >
                                  {item.status}
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.66rem",
                                    fontWeight: 800,
                                    color: catColor,
                                  }}
                                >
                                  {pct}% utilized
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Confirmed linkage card */}
              {selectedItem && !dropdownOpen && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "12px 14px",
                    borderRadius: "13px",
                    background: `${catColor}07`,
                    border: `1px solid ${catColor}28`,
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "11px",
                      background: `${catColor}14`,
                      border: `1px solid ${catColor}22`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: catColor,
                      flexShrink: 0,
                    }}
                  >
                    <Link2 size={15} strokeWidth={2.2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.71rem",
                        color: "#556174",
                        fontWeight: 700,
                        marginBottom: "2px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Check size={10} strokeWidth={3} style={{ color: "#16a34a" }} />
                      RAB item linked — P2MW reporting ready
                    </div>
                    <div
                      style={{
                        fontSize: "0.84rem",
                        fontWeight: 700,
                        color: "#182033",
                        letterSpacing: "-0.02em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {selectedItem.activity}
                    </div>
                    <div
                      style={{ display: "flex", gap: "10px", marginTop: "3px" }}
                    >
                      <span style={{ fontSize: "0.72rem", color: "#737f91", fontWeight: 600 }}>
                        Budget:{" "}
                        <strong style={{ color: "#182033" }}>
                          {fmt(selectedItem.totalAmount)}
                        </strong>
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "#737f91", fontWeight: 600 }}>
                        Remaining:{" "}
                        <strong
                          style={{
                            color:
                              selectedItem.totalAmount - selectedItem.usedAmount > 0
                                ? "#16a34a"
                                : "#dc2626",
                          }}
                        >
                          {fmt(selectedItem.totalAmount - selectedItem.usedAmount)}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Required hint */}
              {!selectedItem && (
                <div
                  style={{
                    marginTop: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.73rem",
                    color: "#737f91",
                    fontWeight: 600,
                  }}
                >
                  <Link2 size={11} style={{ color: "#c9d0da", flexShrink: 0 }} />
                  Required for expense transactions — links to Detailed RAB for P2MW accountability.
                </div>
              )}
            </div>
          )}

          {/* Status */}
          <div>
            <label style={labelStyle}>Status</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {STATUSES.map((s) => {
                const isSelected = status === s;
                const colors: Record<string, { color: string; bg: string; border: string }> = {
                  Draft: {
                    color: "#d97706",
                    bg: "rgba(217,119,6,0.09)",
                    border: "rgba(217,119,6,0.26)",
                  },
                  Completed: {
                    color: "#16a34a",
                    bg: "rgba(22,163,74,0.09)",
                    border: "rgba(22,163,74,0.26)",
                  },
                };
                const c = colors[s];
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    style={{
                      height: "38px",
                      padding: "0 16px",
                      borderRadius: "11px",
                      background: isSelected ? c.bg : "white",
                      border: isSelected
                        ? `1.5px solid ${c.border}`
                        : "1px solid rgba(17,24,39,0.09)",
                      color: isSelected ? c.color : "#556174",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "0.18s",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "999px",
                        background: isSelected ? c.color : "#c9d0da",
                      }}
                    />
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes (Optional)</label>
            <textarea
              placeholder="Add notes, references, or additional context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                ...fieldStyle,
                height: "88px",
                padding: "12px 14px",
                resize: "vertical" as const,
                lineHeight: 1.55,
              }}
            />
          </div>

          {/* Attachment upload */}
          <div>
            <label style={labelStyle}>Supporting Documents</label>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: "none" }}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: "20px",
                borderRadius: "16px",
                background: "rgba(255,247,237,0.60)",
                border: "1.5px dashed rgba(249,115,22,0.28)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "0.18s",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "14px",
                  background: "white",
                  border: "1px solid rgba(249,115,22,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ea580c",
                  boxShadow: "0 6px 16px rgba(15,23,42,0.06)",
                }}
              >
                <Upload size={18} />
              </div>
              <div
                style={{ fontSize: "0.84rem", fontWeight: 700, color: "#182033", letterSpacing: "-0.015em" }}
              >
                Upload documents
              </div>
              <div
                style={{ fontSize: "0.76rem", color: "#737f91", textAlign: "center", lineHeight: 1.5 }}
              >
                PDF, JPG, PNG, WEBP · Max 10 MB each
              </div>
            </div>
            
            {files.length > 0 && (
              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {files.map((f, i) => (
                  <div key={i} style={{ fontSize: "0.78rem", color: "#34435d", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", padding: "8px 12px", borderRadius: "8px", border: "1px solid #eef2f7" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
                      <span style={{ color: "#737f91", flexShrink: 0 }}>{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <button
                      onClick={() => setFiles((prev) => prev.filter((_, index) => index !== i))}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "4px",
                        flexShrink: 0
                      }}
                      title="Remove file"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 28px 24px",
            borderTop: "1px solid rgba(17,24,39,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            background: "rgba(255,255,255,0.60)",
            borderRadius: "0 0 32px 32px",
          }}
        >
          <button
            onClick={onClose}
            disabled={isSaving}
            style={{
              height: "44px",
              padding: "0 22px",
              borderRadius: "13px",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(250,250,250,0.86))",
              border: "1px solid rgba(17,24,39,0.10)",
              boxShadow:
                "0 8px 20px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.92)",
              color: "#182033",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "-0.01em",
              opacity: isSaving ? 0.6 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              height: "44px",
              padding: "0 22px",
              borderRadius: "13px",
              background: "linear-gradient(180deg, #fb7a18 0%, #ea580c 100%)",
              color: "white",
              border: "1px solid rgba(194,65,12,0.22)",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 700,
              boxShadow:
                "0 12px 28px rgba(234,88,12,0.24), inset 0 1px 0 rgba(255,255,255,0.20)",
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              opacity: isSaving ? 0.6 : 1,
            }}
          >
            <Plus size={15} />
            {isSaving ? "Saving..." : isEditing ? "Update Transaction" : "Save Transaction"}
          </button>
        </div>
      </div>
    </>
  );
}
