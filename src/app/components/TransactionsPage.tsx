import { useState, useMemo } from "react";
import { TopNav } from "./TopNav";
import { TransactionDrawer } from "./transactions/TransactionDrawer";
import { AddTransactionModal } from "./transactions/AddTransactionModal";
import {
  transactions,
  getTotalIncome,
  getTotalExpenses,
  getNetBalance,
  getArchivedCount,
  getStatusStyle,
  CATEGORY_MAP,
  formatRp,
  formatDate,
  type Transaction,
  type TransactionType,
  type TransactionStatus,
} from "./transactions/transactionData";
import {
  Search,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Paperclip,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Wallet,
  Archive,
  Eye,
  Edit3,
} from "lucide-react";

const totalIncome = getTotalIncome();
const totalExpenses = getTotalExpenses();
const netBalance = getNetBalance();
const archivedCount = getArchivedCount();

const summaryCards = [
  {
    title: "Total Income",
    value: formatRp(totalIncome),
    icon: TrendingUp,
    iconColor: "#16a34a",
    iconBg: "#f0fdf4",
    badge: "Completed",
    badgeColor: "#16a34a",
    badgeBg: "rgba(22,163,74,0.09)",
    note: "P2MW funding received",
    prefix: "+",
    prefixColor: "#16a34a",
  },
  {
    title: "Total Expenses",
    value: formatRp(totalExpenses),
    icon: TrendingDown,
    iconColor: "#dc2626",
    iconBg: "#fff5f5",
    badge: `${transactions.filter((t) => t.type === "Expense" && t.status === "Completed").length} txns`,
    badgeColor: "#dc2626",
    badgeBg: "rgba(220,38,38,0.09)",
    note: "Completed transactions",
    prefix: "-",
    prefixColor: "#dc2626",
  },
  {
    title: "Net Balance",
    value: formatRp(Math.abs(netBalance)),
    icon: Wallet,
    iconColor: "#2563eb",
    iconBg: "#eff6ff",
    badge: "Available",
    badgeColor: "#2563eb",
    badgeBg: "rgba(37,99,235,0.09)",
    note: "Income minus expenses",
    prefix: netBalance >= 0 ? "+" : "-",
    prefixColor: netBalance >= 0 ? "#16a34a" : "#dc2626",
  },
  {
    title: "Archived Transactions",
    value: String(archivedCount),
    icon: Archive,
    iconColor: "#556174",
    iconBg: "#f3f5f8",
    badge: "Archived",
    badgeColor: "#556174",
    badgeBg: "rgba(85,97,116,0.09)",
    note: "Cancelled or superseded",
    prefix: "",
    prefixColor: "#556174",
  },
];

function TypeDot({ type }: { type: TransactionType }) {
  const isIncome = type === "Income";
  return (
    <div
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "12px",
        background: isIncome ? "rgba(22,163,74,0.09)" : "rgba(220,38,38,0.08)",
        border: isIncome ? "1px solid rgba(22,163,74,0.18)" : "1px solid rgba(220,38,38,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isIncome ? "#16a34a" : "#dc2626",
        flexShrink: 0,
      }}
    >
      {isIncome ? (
        <ArrowUpCircle size={16} strokeWidth={2.5} />
      ) : (
        <ArrowDownCircle size={16} strokeWidth={2.5} />
      )}
    </div>
  );
}

function TransactionRow({
  txn,
  onSelect,
}: {
  txn: Transaction;
  onSelect: (t: Transaction) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const statusStyle = getStatusStyle(txn.status);
  const catStyle = CATEGORY_MAP[txn.category];
  const isIncome = txn.type === "Income";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "36px 110px 1fr auto 120px 160px 80px",
        gap: "14px",
        alignItems: "center",
        padding: "14px 20px",
        borderRadius: "18px",
        background: hovered ? "rgba(249,115,22,0.025)" : "white",
        border: hovered
          ? "1px solid rgba(249,115,22,0.16)"
          : "1px solid rgba(17,24,39,0.07)",
        boxShadow: hovered ? "0 8px 24px rgba(15,23,42,0.08)" : "0 2px 8px rgba(15,23,42,0.03)",
        transition: "0.18s cubic-bezier(.2,.8,.2,1)",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => onSelect(txn)}
    >
      {/* Type dot */}
      <TypeDot type={txn.type} />

      {/* Date + ID */}
      <div>
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "#182033",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          {formatDate(txn.date)}
        </div>
        <div
          style={{
            fontSize: "0.68rem",
            color: "#737f91",
            fontWeight: 700,
            marginTop: "3px",
            letterSpacing: "0.03em",
          }}
        >
          {txn.id}
        </div>
      </div>

      {/* Description + category */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.88rem",
            fontWeight: 700,
            color: "#182033",
            letterSpacing: "-0.02em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: 1.3,
          }}
        >
          {txn.description}
        </div>
        <div
          style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "5px" }}
        >
          {catStyle && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "2px 8px",
                borderRadius: "6px",
                background: catStyle.bg,
                color: catStyle.color,
                fontSize: "0.68rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "2px",
                  background: catStyle.color,
                }}
              />
              {txn.category}
            </span>
          )}
          {txn.attachments.length > 0 && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                fontSize: "0.68rem",
                color: "#737f91",
                fontWeight: 600,
              }}
            >
              <Paperclip size={10} />
              {txn.attachments.length}
            </span>
          )}
        </div>
      </div>

      {/* PIC */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "9px",
            background: "radial-gradient(circle at 38% 28%, rgba(255,255,255,0.85) 0 12%, transparent 13%), linear-gradient(135deg, #fed7aa, #fb923c)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.60rem",
            fontWeight: 800,
            color: "#ea580c",
            flexShrink: 0,
          }}
        >
          {txn.pic.split(",")[0].trim().substring(0, 2).toUpperCase()}
        </div>
        <span
          style={{
            fontSize: "0.80rem",
            color: "#556174",
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {txn.pic}
        </span>
      </div>

      {/* Status */}
      <div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 11px",
            borderRadius: "999px",
            background: statusStyle.bg,
            color: statusStyle.color,
            border: `1px solid ${statusStyle.border}`,
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
              background: statusStyle.color,
            }}
          />
          {txn.status}
        </span>
      </div>

      {/* Amount */}
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
            fontSize: "0.95rem",
            fontWeight: 800,
            color: isIncome ? "#16a34a" : "#182033",
            letterSpacing: "-0.035em",
            lineHeight: 1,
          }}
        >
          {isIncome ? "+" : "-"}
          {formatRp(txn.amount)}
        </div>
        <div
          style={{
            fontSize: "0.69rem",
            color: "#737f91",
            fontWeight: 600,
            marginTop: "3px",
          }}
        >
          {txn.type}
        </div>
      </div>

      {/* Actions (hover) */}
      <div
        style={{
          display: "flex",
          gap: "5px",
          justifyContent: "flex-end",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.15s",
        }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(txn); }}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "9px",
            background: "white",
            border: "1px solid rgba(17,24,39,0.09)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#556174",
            boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
          }}
        >
          <Eye size={13} />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "9px",
            background: "white",
            border: "1px solid rgba(17,24,39,0.09)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#556174",
            boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
          }}
        >
          <Edit3 size={13} />
        </button>
      </div>
    </div>
  );
}
interface TransactionsPageProps {
  onMenuClick?: () => void;
}

export function TransactionsPage({ onMenuClick }: TransactionsPageProps) {
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<TransactionType | "All">("All");
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | "All">("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", ...Object.keys(CATEGORY_MAP)];

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        !search ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.pic.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "All" || t.type === filterType;
      const matchStatus = filterStatus === "All" || t.status === filterStatus;
      const matchCat = filterCategory === "All" || t.category === filterCategory;
      return matchSearch && matchType && matchStatus && matchCat;
    });
  }, [search, filterType, filterStatus, filterCategory]);

  const filteredIncome = filtered.filter((t) => t.type === "Income" && t.status === "Completed").reduce((s, t) => s + t.amount, 0);
  const filteredExpenses = filtered.filter((t) => t.type === "Expense" && t.status === "Completed").reduce((s, t) => s + t.amount, 0);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        maxHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <TopNav title="Transactions" subtitle="Financial Records & Transaction Management" onMenuClick={onMenuClick} />

      <main
        style={{
          flex: 1,
          padding: "28px 32px 48px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Summary KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[18px]">
          {summaryCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                style={{
                  padding: "22px",
                  borderRadius: "28px",
                  background:
                    "radial-gradient(circle at 100% 0%, rgba(249,115,22,.06), transparent 12rem), linear-gradient(180deg, #ffffff, #fffdf9)",
                  border: "1px solid rgba(17,24,39,0.08)",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "15px",
                      background: card.iconBg,
                      border: `1px solid ${card.iconColor}22`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: card.iconColor,
                    }}
                  >
                    <Icon size={19} strokeWidth={2} />
                  </div>
                  <div
                    style={{
                      padding: "3px 9px",
                      borderRadius: "999px",
                      background: card.badgeBg,
                      color: card.badgeColor,
                      fontSize: "0.70rem",
                      fontWeight: 700,
                    }}
                  >
                    {card.badge}
                  </div>
                </div>
                <div style={{ color: "#737f91", fontSize: "0.79rem", fontWeight: 600 }}>
                  {card.title}
                </div>
                <div
                  style={{
                    fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                    fontSize: i === 3 ? "2rem" : "1.42rem",
                    fontWeight: 800,
                    letterSpacing: "-0.055em",
                    lineHeight: 1,
                    marginTop: "5px",
                    color: card.prefixColor,
                  }}
                >
                  {card.prefix}{card.value}
                </div>
                <div style={{ marginTop: "7px", color: "#737f91", fontSize: "0.77rem" }}>
                  {card.note}
                </div>
              </div>
            );
          })}
        </div>

        {/* Transaction List Card */}
        <div
          style={{
            borderRadius: "32px",
            background: "white",
            border: "1px solid rgba(17,24,39,0.08)",
            boxShadow: "0 18px 46px rgba(15,23,42,0.10)",
            overflow: "hidden",
          }}
        >
          {/* Card header */}
          <div
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 md:p-[22px_28px]"
            style={{
              borderBottom: "1px solid rgba(17,24,39,0.07)",
              background:
                "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.06), transparent 16rem), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.72))",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#ea580c",
                  fontSize: "0.73rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "2px",
                    borderRadius: "999px",
                    background: "#f97316",
                  }}
                />
                Transaction Records
              </div>
              <div
                style={{
                  fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                  fontSize: "1.28rem",
                  fontWeight: 700,
                  color: "#182033",
                  letterSpacing: "-0.045em",
                  marginTop: "5px",
                  lineHeight: 1,
                }}
              >
                All Transactions
              </div>
              <div style={{ color: "#556174", fontSize: "0.80rem", marginTop: "5px" }}>
                {filtered.length} of {transactions.length} records
                {filtered.length < transactions.length && " (filtered)"}
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                height: "42px",
                padding: "0 20px",
                borderRadius: "13px",
                background: "linear-gradient(180deg, #fb7a18 0%, #ea580c 100%)",
                color: "white",
                border: "1px solid rgba(194,65,12,0.22)",
                cursor: "pointer",
                fontSize: "0.83rem",
                fontWeight: 700,
                boxShadow:
                  "0 12px 28px rgba(234,88,12,0.22), inset 0 1px 0 rgba(255,255,255,0.20)",
                letterSpacing: "-0.01em",
                flexShrink: 0,
              }}
            >
              <Plus size={15} />
              Add Transaction
            </button>
          </div>

          {/* Toolbar / Filters */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid rgba(17,24,39,0.06)",
              background: "#fafbfc",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                flex: 1,
                minWidth: "200px",
                maxWidth: "300px",
                height: "38px",
                padding: "0 13px",
                borderRadius: "11px",
                background: "white",
                border: "1px solid rgba(17,24,39,0.09)",
                boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
              }}
            >
              <Search size={14} style={{ color: "#737f91", flexShrink: 0 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "#182033",
                  fontSize: "0.82rem",
                  width: "100%",
                  padding: 0,
                  height: "auto",
                  minHeight: "auto",
                  boxShadow: "none",
                  borderRadius: 0,
                }}
              />
            </div>

            {/* Type filter */}
            <div style={{ display: "flex", gap: "5px" }}>
              {(["All", "Income", "Expense"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  style={{
                    height: "36px",
                    padding: "0 13px",
                    borderRadius: "10px",
                    border:
                      filterType === t
                        ? "1px solid rgba(249,115,22,0.22)"
                        : "1px solid rgba(17,24,39,0.08)",
                    background: filterType === t ? "rgba(255,247,237,0.8)" : "white",
                    color: filterType === t ? "#ea580c" : "#556174",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "0.16s",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {t === "Income" && <ArrowUpCircle size={11} />}
                  {t === "Expense" && <ArrowDownCircle size={11} />}
                  {t}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div style={{ display: "flex", gap: "5px" }}>
              {(["All", "Completed", "Draft", "Archived"] as const).map((s) => {
                const isActive = filterStatus === s;
                const styleMap: Record<string, { color: string; bg: string; border: string }> = {
                  Completed: { color: "#16a34a", bg: "rgba(22,163,74,0.08)", border: "rgba(22,163,74,0.22)" },
                  Draft: { color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.22)" },
                  Archived: { color: "#737f91", bg: "rgba(115,127,145,0.08)", border: "rgba(115,127,145,0.22)" },
                  All: { color: "#ea580c", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.22)" },
                };
                const sc = styleMap[s];
                return (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    style={{
                      height: "36px",
                      padding: "0 13px",
                      borderRadius: "10px",
                      border: isActive ? `1px solid ${sc.border}` : "1px solid rgba(17,24,39,0.08)",
                      background: isActive ? sc.bg : "white",
                      color: isActive ? sc.color : "#556174",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "0.16s",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* Category filter */}
            <div style={{ position: "relative", marginLeft: "auto" }}>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  height: "36px",
                  padding: "0 30px 0 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(17,24,39,0.09)",
                  background: "white",
                  color: filterCategory !== "All" ? "#182033" : "#556174",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  appearance: "none",
                  outline: "none",
                  boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
                  minHeight: "auto",
                }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All Categories" : c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#737f91",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          <div className="overflow-x-auto w-full pb-2">
            <div className="min-w-[1000px]">
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "36px 110px 1fr auto 120px 160px 80px",
              gap: "14px",
              padding: "10px 20px",
              background: "#f8fafc",
              borderBottom: "1px solid rgba(17,24,39,0.06)",
            }}
          >
            {["", "Date", "Description", "PIC", "Status", "Amount", ""].map((h, i) => (
              <div
                key={i}
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: "#737f91",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  textAlign: h === "Amount" ? "right" : "left",
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Transaction rows */}
          <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: "5px" }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "18px",
                    background: "#fff7ed",
                    border: "1px solid rgba(249,115,22,0.16)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ea580c",
                  }}
                >
                  <Search size={22} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      color: "#182033",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    No transactions found
                  </div>
                  <div style={{ color: "#737f91", fontSize: "0.82rem", marginTop: "4px" }}>
                    Try adjusting your search or filter criteria.
                  </div>
                </div>
              </div>
            ) : (
              filtered.map((txn) => (
                <TransactionRow key={txn.id} txn={txn} onSelect={setSelectedTxn} />
              ))
            )}
          </div>

          {/* Footer summary */}
          {filtered.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                padding: "14px 20px",
                borderTop: "1px solid rgba(17,24,39,0.06)",
                background: "#fafbfc",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "#737f91",
                  fontWeight: 600,
                }}
              >
                Showing {filtered.length} transactions
              </div>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.72rem", color: "#737f91", fontWeight: 600 }}>
                    Income:
                  </span>
                  <span
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: "0.84rem",
                      fontWeight: 800,
                      color: "#16a34a",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    +{formatRp(filteredIncome)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.72rem", color: "#737f91", fontWeight: 600 }}>
                    Expenses:
                  </span>
                  <span
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: "0.84rem",
                      fontWeight: 800,
                      color: "#dc2626",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    -{formatRp(filteredExpenses)}
                  </span>
                </div>
                <div
                  style={{
                    height: "20px",
                    width: "1px",
                    background: "rgba(17,24,39,0.08)",
                  }}
                />
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.72rem", color: "#737f91", fontWeight: 600 }}>
                    Net:
                  </span>
                  <span
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: "0.84rem",
                      fontWeight: 800,
                      color: filteredIncome - filteredExpenses >= 0 ? "#16a34a" : "#dc2626",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {filteredIncome - filteredExpenses >= 0 ? "+" : "-"}
                    {formatRp(Math.abs(filteredIncome - filteredExpenses))}
                  </span>
                </div>
              </div>
            </div>
          )}
            </div>
          </div>
        </div>
      </main>

      {/* Drawer */}
      <TransactionDrawer
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
      />

      {/* Add Modal */}
      {showAddModal && (
        <AddTransactionModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
