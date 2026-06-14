import { useState } from "react";
import {
  rabCategories,
  getCategoryRealization,
  getTotalRealization,
  TOTAL_FUNDING,
  getStatusStyle,
  formatRp,
  type RABItem,
  type ApprovalStatus,
} from "./rabData";
import { Search, Plus, Filter, ChevronDown, ChevronUp, Edit3, Trash2 } from "lucide-react";

const COL_GRID =
  "36px minmax(180px,2.2fr) 92px 64px 124px 124px minmax(110px,1.1fr) 106px 110px 124px minmax(100px,1fr)";

const COL_HEADERS = [
  "#",
  "Activity",
  "Type",
  "Qty",
  "Unit Price",
  "Total",
  "Target Output",
  "PIC",
  "Status",
  "Used",
  "Justification",
];

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    Service: { color: "#2563eb", bg: "#eff6ff" },
    Subscription: { color: "#7c3aed", bg: "#f5f3ff" },
    Report: { color: "#16a34a", bg: "#f0fdf4" },
    Equipment: { color: "#d97706", bg: "#fffbeb" },
    Design: { color: "#f97316", bg: "#fff7ed" },
    Ads: { color: "#dc2626", bg: "#fff5f5" },
    Training: { color: "#16a34a", bg: "#f0fdf4" },
    Workshop: { color: "#2563eb", bg: "#eff6ff" },
    Supply: { color: "#d97706", bg: "#fffbeb" },
    Print: { color: "#556174", bg: "#f3f5f8" },
    Admin: { color: "#182033", bg: "#f3f5f8" },
  };
  const s = map[type] ?? { color: "#556174", bg: "#f3f5f8" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: "8px",
        background: s.bg,
        color: s.color,
        fontSize: "0.71rem",
        fontWeight: 700,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: ApprovalStatus }) {
  const s = getStatusStyle(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "5px 10px",
        borderRadius: "999px",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontSize: "0.71rem",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "999px",
          background: s.color,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}

function TableHeader() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: COL_GRID,
        gap: "12px",
        padding: "11px 20px",
        borderRadius: "14px",
        background: "#f8fafc",
        border: "1px solid rgba(17,24,39,0.07)",
        marginBottom: "6px",
      }}
    >
      {COL_HEADERS.map((h) => (
        <div
          key={h}
          style={{
            fontSize: "0.68rem",
            color: "#737f91",
            fontWeight: 800,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {h}
        </div>
      ))}
    </div>
  );
}

function ItemRow({
  item,
  index,
  catColor,
}: {
  item: RABItem;
  index: number;
  catColor: string;
}) {
  const [hovered, setHovered] = useState(false);
  const remaining = item.totalAmount - item.usedAmount;
  const usedPct = item.totalAmount > 0
    ? Math.round((item.usedAmount / item.totalAmount) * 100)
    : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: COL_GRID,
        gap: "12px",
        padding: "13px 20px",
        borderRadius: "14px",
        background: hovered ? "rgba(249,115,22,0.025)" : "white",
        border: hovered ? "1px solid rgba(249,115,22,0.14)" : "1px solid rgba(17,24,39,0.06)",
        boxShadow: hovered ? "0 6px 20px rgba(15,23,42,0.07)" : "0 2px 8px rgba(15,23,42,0.03)",
        transition: "0.18s cubic-bezier(.2,.8,.2,1)",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* # */}
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "8px",
          background: hovered ? `${catColor}14` : "#f3f5f8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.70rem",
          fontWeight: 800,
          color: hovered ? catColor : "#737f91",
          transition: "0.18s",
        }}
      >
        {index + 1}
      </div>

      {/* Activity */}
      <div>
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#182033",
            letterSpacing: "-0.018em",
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.activity}
        </div>
        <div style={{ fontSize: "0.71rem", color: "#737f91", marginTop: "2px", fontWeight: 600 }}>
          {item.mainActivity}
        </div>
      </div>

      {/* Type */}
      <div style={{ overflow: "hidden" }}>
        <TypeBadge type={item.itemType} />
      </div>

      {/* Qty */}
      <div
        style={{
          fontSize: "0.84rem",
          fontWeight: 700,
          color: "#182033",
          letterSpacing: "-0.01em",
        }}
      >
        {item.qty}
        <span
          style={{ color: "#737f91", fontSize: "0.70rem", fontWeight: 600, display: "block" }}
        >
          {item.unit}
        </span>
      </div>

      {/* Unit Price */}
      <div
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "0.82rem",
          fontWeight: 700,
          color: "#182033",
          letterSpacing: "-0.025em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {formatRp(item.unitPrice)}
      </div>

      {/* Total */}
      <div
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "0.88rem",
          fontWeight: 800,
          color: "#182033",
          letterSpacing: "-0.03em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {formatRp(item.totalAmount)}
      </div>

      {/* Target Output */}
      <div
        style={{
          fontSize: "0.80rem",
          color: "#556174",
          fontWeight: 600,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          lineHeight: 1.3,
        }}
      >
        {item.targetOutput}
      </div>

      {/* PIC */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "8px",
            background: `linear-gradient(135deg, ${catColor}30, ${catColor}60)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.62rem",
            fontWeight: 800,
            color: catColor,
            flexShrink: 0,
            letterSpacing: "0",
          }}
        >
          {item.pic
            .split(",")[0]
            .trim()
            .substring(0, 2)
            .toUpperCase()}
        </div>
        <span
          style={{
            fontSize: "0.78rem",
            color: "#556174",
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.pic}
        </span>
      </div>

      {/* Status */}
      <div>
        <StatusBadge status={item.status} />
      </div>

      {/* Used Amount */}
      <div>
        <div
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "0.84rem",
            fontWeight: 800,
            color: item.usedAmount > 0 ? "#182033" : "#c9d0da",
            letterSpacing: "-0.025em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {formatRp(item.usedAmount)}
        </div>
        {item.totalAmount > 0 && (
          <div style={{ marginTop: "4px" }}>
            <div
              style={{
                height: "4px",
                borderRadius: "999px",
                background: "#eef2f7",
                overflow: "hidden",
                width: "80px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${usedPct}%`,
                  borderRadius: "999px",
                  background: catColor,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Justification */}
      <div
        style={{
          fontSize: "0.78rem",
          color: "#737f91",
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={item.justification}
      >
        {item.justification}
      </div>

      {/* Hover actions */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            gap: "6px",
            background: "white",
            padding: "4px 6px",
            borderRadius: "10px",
            border: "1px solid rgba(17,24,39,0.08)",
            boxShadow: "0 4px 12px rgba(15,23,42,0.10)",
            zIndex: 2,
          }}
        >
          <button
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "#f3f5f8",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#556174",
            }}
          >
            <Edit3 size={13} />
          </button>
          <button
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "rgba(220,38,38,0.07)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#dc2626",
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

function SubtotalRow({
  budget,
  used,
  color,
}: {
  budget: number;
  used: number;
  color: string;
}) {
  const remaining = budget - used;
  const pct = Math.round((used / budget) * 100);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: COL_GRID,
        gap: "12px",
        padding: "14px 20px",
        borderRadius: "14px",
        background: `linear-gradient(135deg, ${color}08, ${color}04)`,
        border: `1px solid ${color}20`,
        alignItems: "center",
        marginTop: "4px",
      }}
    >
      <div />
      <div
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "0.83rem",
          fontWeight: 800,
          color: "#182033",
          letterSpacing: "-0.025em",
        }}
      >
        Subtotal
      </div>
      <div />
      <div />
      <div />
      <div
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "0.90rem",
          fontWeight: 800,
          color: "#182033",
          letterSpacing: "-0.03em",
        }}
      >
        {formatRp(budget)}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          gridColumn: "7 / 10",
        }}
      >
        <div style={{ flex: 1, height: "6px", borderRadius: "999px", background: "#eef2f7", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              borderRadius: "999px",
              background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "0.80rem",
            fontWeight: 800,
            color: color,
            flexShrink: 0,
          }}
        >
          {pct}%
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "0.88rem",
          fontWeight: 800,
          color: "#182033",
          letterSpacing: "-0.03em",
        }}
      >
        {formatRp(used)}
      </div>
      <div
        style={{
          fontSize: "0.80rem",
          fontWeight: 700,
          color: "#16a34a",
          letterSpacing: "-0.02em",
          fontFamily: "'Sora', sans-serif",
        }}
      >
        {formatRp(remaining)} left
      </div>
    </div>
  );
}

export function DetailedRABTab() {
  const [search, setSearch] = useState("");
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<ApprovalStatus | "All">("All");

  const totalRealization = getTotalRealization();
  const totalPct = Math.round((totalRealization / TOTAL_FUNDING) * 100);

  const toggleCollapse = (id: string) => {
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredCategories = rabCategories.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => {
      const matchSearch =
        !search ||
        item.activity.toLowerCase().includes(search.toLowerCase()) ||
        item.mainActivity.toLowerCase().includes(search.toLowerCase()) ||
        item.pic.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" || item.status === filterStatus;
      return matchSearch && matchStatus;
    }),
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Toolbar */}
      <div
        className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 p-3.5 px-4 rounded-[20px] bg-white border border-slate-900/5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1">
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flex: 1,
              maxWidth: "340px",
              height: "40px",
              padding: "0 14px",
              borderRadius: "12px",
              background: "#f8fafc",
              border: "1px solid rgba(17,24,39,0.08)",
            }}
          >
            <Search size={15} style={{ color: "#737f91", flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search activities, PIC..."
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
          </div>

          {/* Status filter */}
          <div className="flex flex-wrap gap-1.5">
            {(["All", "Planned", "In Progress", "Completed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  height: "36px",
                  padding: "0 14px",
                  borderRadius: "10px",
                  border:
                    filterStatus === s
                      ? "1px solid rgba(249,115,22,0.22)"
                      : "1px solid rgba(17,24,39,0.08)",
                  background:
                    filterStatus === s
                      ? "rgba(255,247,237,0.8)"
                      : "transparent",
                  color: filterStatus === s ? "#ea580c" : "#556174",
                  fontSize: "0.79rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "0.18s",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              height: "36px",
              padding: "0 12px",
              borderRadius: "10px",
              border: "1px solid rgba(17,24,39,0.08)",
              color: "#556174",
              fontSize: "0.79rem",
              fontWeight: 700,
              cursor: "pointer",
              background: "transparent",
            }}
          >
            <Filter size={13} />
            Filter
          </div>
        </div>

        {/* Right: Add button */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            height: "40px",
            padding: "0 18px",
            borderRadius: "12px",
            background: "linear-gradient(180deg, #fb7a18 0%, #ea580c 100%)",
            color: "white",
            border: "1px solid rgba(194,65,12,0.22)",
            cursor: "pointer",
            fontSize: "0.83rem",
            fontWeight: 700,
            boxShadow: "0 12px 28px rgba(234,88,12,0.22), inset 0 1px 0 rgba(255,255,255,0.20)",
            letterSpacing: "-0.01em",
            transition: "0.18s",
            flexShrink: 0,
          }}
        >
          <Plus size={15} />
          Add Budget Item
        </button>
      </div>

      {/* Category groups */}
      {filteredCategories.map((cat) => {
        const realization = getCategoryRealization(cat);
        const pct = cat.budget > 0
          ? Math.round((realization / cat.budget) * 100)
          : 0;
        const isCollapsed = collapsedCats.has(cat.id);

        return (
          <div
            key={cat.id}
            style={{
              borderRadius: "28px",
              background: "white",
              border: "1px solid rgba(17,24,39,0.08)",
              boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Category header */}
            <div
              onClick={() => toggleCollapse(cat.id)}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 px-6 cursor-pointer select-none"
              style={{
                background: `linear-gradient(135deg, ${cat.lightColor}, white)`,
                borderBottom: isCollapsed ? "none" : "1px solid rgba(17,24,39,0.07)",
              }}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Color badge */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "16px",
                  background: cat.lightColor,
                  border: `1px solid ${cat.borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "6px",
                    background: cat.color,
                  }}
                />
              </div>

              {/* Category info */}
              <div className="flex-1 min-w-0">
                <div
                  style={{
                    fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                    fontSize: "1.02rem",
                    fontWeight: 700,
                    color: "#182033",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {cat.name}
                </div>
                <div
                  style={{
                    color: "#737f91",
                    fontSize: "0.78rem",
                    marginTop: "5px",
                    fontWeight: 600,
                  }}
                >
                  {cat.items.length} line items ·{" "}
                  {cat.items.filter((i) => i.status === "Completed").length} completed ·{" "}
                  {cat.items.filter((i) => i.status === "Planned").length} planned
                </div>
              </div>
              </div>

              {/* Budget/Realization */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#182033",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {formatRp(cat.budget)}
                </div>
                <div style={{ color: "#737f91", fontSize: "0.76rem", marginTop: "3px", fontWeight: 600 }}>
                  {formatRp(realization)} realized
                </div>
              </div>

              {/* Progress */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  width: "100px",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: "0.90rem",
                      fontWeight: 800,
                      color: cat.color,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {pct}%
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    borderRadius: "999px",
                    background: "#eef2f7",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      borderRadius: "999px",
                      background: `linear-gradient(90deg, ${cat.color}, ${cat.color}bb)`,
                    }}
                  />
                </div>
              </div>

              {/* Collapse toggle */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(17,24,39,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#556174",
                  flexShrink: 0,
                }}
              >
                {isCollapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </div>
            </div>

            {/* Items */}
            {!isCollapsed && (
              <div className="p-4 md:p-5 lg:pb-5">
                <div className="overflow-x-auto w-full pb-2">
                  <div className="min-w-[1000px]">
                    <TableHeader />
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {cat.items.map((item, idx) => (
                        <ItemRow
                          key={item.id}
                          item={item}
                          index={idx}
                          catColor={cat.color}
                        />
                      ))}
                    </div>
                    <SubtotalRow budget={cat.budget} used={realization} color={cat.color} />
                  </div>
                </div>

                {/* Add item row */}
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    marginTop: "8px",
                    height: "40px",
                    padding: "0 16px",
                    borderRadius: "12px",
                    background: "transparent",
                    border: `1.5px dashed ${cat.color}40`,
                    color: cat.color,
                    fontSize: "0.80rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "0.18s",
                  }}
                >
                  <Plus size={13} />
                  Add item to {cat.name}
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Grand Total */}
      <div
        className="p-6 md:p-7 rounded-[28px] border border-white/5 shadow-[0_18px_46px_rgba(12,23,43,0.22)] flex flex-col md:flex-row md:items-center gap-7"
        style={{
          background:
            "radial-gradient(circle at 0% 50%, rgba(249,115,22,0.10), transparent 14rem), linear-gradient(135deg, #0c172b 0%, #12213a 100%)",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.71rem",
              fontWeight: 800,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Grand Total
          </div>
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "1.8rem",
              fontWeight: 800,
              letterSpacing: "-0.06em",
              color: "white",
              lineHeight: 1,
            }}
          >
            {formatRp(TOTAL_FUNDING)}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.76rem",
              marginTop: "5px",
              fontWeight: 600,
            }}
          >
            Total planned budget — {rabCategories.length} categories ·{" "}
            {rabCategories.reduce((s, c) => s + c.items.length, 0)} line items
          </div>
        </div>

        <div
          style={{
            height: "60px",
            width: "1px",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.71rem",
              fontWeight: 800,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Realization
          </div>
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "1.8rem",
              fontWeight: 800,
              letterSpacing: "-0.06em",
              color: "#fb923c",
              lineHeight: 1,
            }}
          >
            {formatRp(totalRealization)}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.76rem",
              marginTop: "5px",
              fontWeight: 600,
            }}
          >
            {totalPct}% of total budget utilized
          </div>
        </div>

        <div
          style={{
            height: "60px",
            width: "1px",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.71rem",
              fontWeight: 800,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Remaining
          </div>
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "1.8rem",
              fontWeight: 800,
              letterSpacing: "-0.06em",
              color: "#4ade80",
              lineHeight: 1,
            }}
          >
            {formatRp(TOTAL_FUNDING - totalRealization)}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.76rem",
              marginTop: "5px",
              fontWeight: 600,
            }}
          >
            {100 - totalPct}% still available
          </div>
        </div>

        {/* Utilization bar */}
        <div
          style={{
            flexShrink: 0,
            width: "160px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.72rem",
              fontWeight: 700,
            }}
          >
            <span>Utilization</span>
            <span style={{ color: "#fb923c" }}>{totalPct}%</span>
          </div>
          <div
            style={{
              height: "10px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.10)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${totalPct}%`,
                borderRadius: "999px",
                background: "linear-gradient(90deg, #f97316, #fbbf24)",
                boxShadow: "0 2px 10px rgba(249,115,22,0.30)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
