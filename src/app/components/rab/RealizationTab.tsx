import { useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getCategoryRealization,
  getCategoryRemaining,
  getCategoryPct,
  getUtilizationStatus,
  formatRp,
  type RABCategory,
} from "./rabData";
import { TrendingUp, AlertTriangle, CheckCircle2, Download, ArrowUpRight } from "lucide-react";
import { RealizationDrawer } from "./RealizationDrawer";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload;
    const pct = d?.pct ?? 0;
    const statusInfo = getUtilizationStatus(pct);
    return (
      <div
        style={{
          padding: "16px 18px",
          borderRadius: "18px",
          background: "white",
          border: "1px solid rgba(17,24,39,0.10)",
          boxShadow: "0 18px 46px rgba(15,23,42,0.12)",
          minWidth: "220px",
        }}
      >
        <div
          style={{
            fontSize: "0.78rem",
            color: "#556174",
            fontWeight: 700,
            marginBottom: "12px",
            paddingBottom: "10px",
            borderBottom: "1px solid rgba(17,24,39,0.06)",
          }}
        >
          {d?.fullName}
        </div>
        {payload.map((p: any, pi: number) => (
          <div
            key={`${p.name ?? "item"}-${pi}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "6px",
            }}
          >
            <span
              style={{
                color: "#556174",
                fontSize: "0.80rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "3px",
                  background: p.fill,
                  display: "inline-block",
                }}
              />
              {p.name}
            </span>
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                color: "#182033",
                fontSize: "0.84rem",
                letterSpacing: "-0.02em",
              }}
            >
              {formatRp(p.value)}
            </span>
          </div>
        ))}
        <div
          style={{
            marginTop: "10px",
            paddingTop: "10px",
            borderTop: "1px solid rgba(17,24,39,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "0.76rem", color: "#737f91", fontWeight: 600 }}>
            Utilization
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 9px",
              borderRadius: "999px",
              background: statusInfo.bg,
              color: statusInfo.color,
              fontSize: "0.72rem",
              fontWeight: 700,
            }}
          >
            {pct}% — {statusInfo.label}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

interface RealizationTabProps {
  rabCategories: RABCategory[];
  totalBudget: number;
  totalRealization: number;
  isLoading: boolean;
}

export function RealizationTab({ rabCategories, totalBudget, totalRealization, isLoading }: RealizationTabProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string; budget: number; realization: number; itemIds: string[] } | null>(null);

  const totalRemaining = totalBudget - totalRealization;
  const overallPct = totalBudget > 0 ? Math.round((totalRealization / totalBudget) * 100) : 0;

  const chartData = rabCategories.map((cat) => {
    const realized = getCategoryRealization(cat);
    const remaining = getCategoryRemaining(cat);
    const pct = getCategoryPct(cat);
    return {
      name: cat.name.split(" ").slice(0, 2).join(" "),
      fullName: cat.name,
      budget: cat.budget,
      realization: realized,
      remaining,
      pct,
      color: cat.color,
    };
  });

  const criticalCount = rabCategories.filter((c) => getCategoryPct(c) >= 90).length;
  const warningCount = rabCategories.filter(
    (c) => getCategoryPct(c) >= 75 && getCategoryPct(c) < 90
  ).length;
  const onTrackCount = rabCategories.filter((c) => getCategoryPct(c) < 75).length;

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ height: "100px", borderRadius: "24px", background: "#f8fafc", border: "1px solid rgba(17,24,39,0.08)" }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top summary strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total Budget",
            value: formatRp(totalBudget),
            icon: TrendingUp,
            color: "#ea580c",
            bg: "#fff7ed",
            note: "Full allocation",
            pct: null,
          },
          {
            label: "Total Realized",
            value: formatRp(totalRealization),
            icon: ArrowUpRight,
            color: "#2563eb",
            bg: "#eff6ff",
            note: `${overallPct}% of budget`,
            pct: overallPct,
          },
          {
            label: "Total Remaining",
            value: formatRp(totalRemaining),
            icon: CheckCircle2,
            color: "#16a34a",
            bg: "#f0fdf4",
            note: "Unspent funds",
            pct: 100 - overallPct,
          },
          {
            label: "Budget Status",
            value: `${criticalCount} Critical`,
            icon: AlertTriangle,
            color: "#dc2626",
            bg: "#fff5f5",
            note: `${warningCount} warning · ${onTrackCount} on track`,
            pct: null,
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              style={{
                padding: "20px",
                borderRadius: "26px",
                background:
                  "radial-gradient(circle at 100% 0%, rgba(249,115,22,.06), transparent 12rem), linear-gradient(180deg, #ffffff, #fffdf9)",
                border: "1px solid rgba(17,24,39,0.08)",
                boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "14px",
                    background: card.bg,
                    border: `1px solid ${card.color}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: card.color,
                  }}
                >
                  <Icon size={18} strokeWidth={2} />
                </div>
                {card.pct !== null && (
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: "1.35rem",
                      fontWeight: 800,
                      color: card.color,
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {card.pct}%
                  </div>
                )}
              </div>
              <div>
                <div style={{ color: "#737f91", fontSize: "0.78rem", fontWeight: 600 }}>
                  {card.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: "#182033",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginTop: "4px",
                  }}
                >
                  {card.value}
                </div>
                <div
                  style={{
                    color: "#737f91",
                    fontSize: "0.76rem",
                    marginTop: "5px",
                    fontWeight: 600,
                  }}
                >
                  {card.note}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Realization Chart */}
      <div
        style={{
          padding: "28px",
          borderRadius: "32px",
          background:
            "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.06), transparent 18rem), linear-gradient(180deg, #ffffff, #fffdf9)",
          border: "1px solid rgba(17,24,39,0.08)",
          boxShadow: "0 18px 46px rgba(15,23,42,0.10)",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-7">
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#ea580c",
                fontSize: "0.74rem",
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
              Realization Analysis
            </div>
            <div
              style={{
                fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "#182033",
                letterSpacing: "-0.05em",
                marginTop: "6px",
                lineHeight: 1,
              }}
            >
              Budget Realization by Category
            </div>
            <div style={{ color: "#556174", fontSize: "0.82rem", marginTop: "6px" }}>
              Actual spending against planned allocation — stacked view
            </div>
          </div>
          <div className="flex flex-wrap lg:flex-nowrap gap-3 items-center">
            {[
              { color: "rgba(249,115,22,0.15)", label: "Remaining Budget", border: "rgba(249,115,22,0.22)" },
              { color: "#f97316", label: "Realized", border: "transparent" },
            ].map((l) => (
              <div
                key={l.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "0.78rem",
                  color: "#556174",
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "4px",
                    background: l.color,
                    border: `1px solid ${l.border}`,
                  }}
                />
                {l.label}
              </div>
            ))}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                height: "36px",
                padding: "0 14px",
                borderRadius: "10px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(250,250,250,0.86))",
                border: "1px solid rgba(17,24,39,0.10)",
                boxShadow:
                  "0 8px 18px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.92)",
                color: "#182033",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Download size={13} />
              Export
            </button>
          </div>
        </div>

        <div style={{ height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barCategoryGap="30%"
              margin={{ top: 0, right: 0, left: 20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="0"
                vertical={false}
                stroke="rgba(17,24,39,0.05)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fontWeight: 700,
                  fill: "#737f91",
                  fontFamily: "Plus Jakarta Sans",
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fontWeight: 600,
                  fill: "#737f91",
                  fontFamily: "Plus Jakarta Sans",
                }}
                tickFormatter={(v) => v === 0 ? "Rp0" : `Rp${(v / 1_000_000).toFixed(0)} Juta`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(17,24,39,0.03)" }} />
              <Bar
                dataKey="realization"
                name="Realized"
                stackId="a"
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`realization-${index}`} fill={entry.color} />
                ))}
              </Bar>
              <Bar
                dataKey="remaining"
                name="Remaining"
                stackId="a"
                isAnimationActive={false}
                radius={[6, 6, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`remaining-${index}`} fill={`${entry.color}40`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed comparison table */}
      <div
        style={{
          borderRadius: "32px",
          background: "white",
          border: "1px solid rgba(17,24,39,0.08)",
          boxShadow: "0 18px 46px rgba(15,23,42,0.10)",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            padding: "22px 28px",
            borderBottom: "1px solid rgba(17,24,39,0.07)",
            background:
              "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.07), transparent 16rem), linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.72))",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#ea580c",
                fontSize: "0.74rem",
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
              Realization Detail
            </div>
            <div
              style={{
                fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#182033",
                letterSpacing: "-0.05em",
                marginTop: "6px",
                lineHeight: 1,
              }}
            >
              Category Realization Report
            </div>
            <div style={{ color: "#556174", fontSize: "0.82rem", marginTop: "6px" }}>
              Budget planning vs actual realization — per category
            </div>
          </div>
        </div>

        <div className="overflow-x-auto w-full pb-2">
          <div className="min-w-[900px]">
        {/* Column headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.2fr 1.4fr 1.4fr 1.4fr 2fr 120px",
            gap: "16px",
            padding: "14px 28px",
            background: "#f8fafc",
            borderBottom: "1px solid rgba(17,24,39,0.06)",
          }}
        >
          {["Category", "Budget", "Realization", "Remaining", "Progress", "Status"].map((h) => (
            <div
              key={h}
              style={{
                fontSize: "0.70rem",
                color: "#737f91",
                fontWeight: 800,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Category rows */}
        <div style={{ padding: "12px 16px" }}>
          {rabCategories.map((cat) => {
            const realization = getCategoryRealization(cat);
            const remaining = getCategoryRemaining(cat);
            const pct = getCategoryPct(cat);
            const statusInfo = getUtilizationStatus(pct);
            const isHov = hoveredRow === cat.id;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredRow(cat.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.2fr 1.4fr 1.4fr 1.4fr 2fr 120px",
                  gap: "16px",
                  padding: "18px 12px",
                  borderRadius: "18px",
                  background: isHov ? "rgba(249,115,22,0.025)" : "transparent",
                  border: isHov
                    ? "1px solid rgba(249,115,22,0.14)"
                    : "1px solid transparent",
                  transition: "0.18s cubic-bezier(.2,.8,.2,1)",
                  alignItems: "center",
                  marginBottom: "4px",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedCategory({
                  id: cat.id,
                  name: cat.name,
                  budget: cat.budget,
                  realization: realization,
                  itemIds: cat.items.map(item => item.id)
                })}
              >
                {/* Category */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "13px",
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
                        width: "13px",
                        height: "13px",
                        borderRadius: "5px",
                        background: cat.color,
                      }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        color: "#182033",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                      }}
                    >
                      {cat.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "#737f91",
                        marginTop: "3px",
                        fontWeight: 600,
                      }}
                    >
                      {cat.items.length} items ·{" "}
                      {cat.items.filter((i) => i.status === "Completed").length} approved
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: "0.94rem",
                      fontWeight: 800,
                      color: "#182033",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {formatRp(cat.budget)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.70rem",
                      color: "#737f91",
                      marginTop: "3px",
                      fontWeight: 600,
                    }}
                  >
                    {totalBudget > 0 ? ((cat.budget / totalBudget) * 100).toFixed(1) : 0}% of total
                  </div>
                </div>

                {/* Realization */}
                <div>
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: "0.94rem",
                      fontWeight: 800,
                      color: cat.color,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {formatRp(realization)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.70rem",
                      color: "#737f91",
                      marginTop: "3px",
                      fontWeight: 600,
                    }}
                  >
                    {pct}% utilized
                  </div>
                </div>

                {/* Remaining */}
                <div>
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: "0.94rem",
                      fontWeight: 800,
                      color: remaining > 0 ? "#16a34a" : "#dc2626",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {formatRp(remaining)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.70rem",
                      color: "#737f91",
                      marginTop: "3px",
                      fontWeight: 600,
                    }}
                  >
                    {100 - pct}% left
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "7px",
                    }}
                  >
                    <span style={{ fontSize: "0.72rem", color: "#737f91", fontWeight: 600 }}>
                      {formatRp(realization)} / {formatRp(cat.budget)}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                        color: cat.color,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "10px",
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
                        background: `linear-gradient(90deg, ${cat.color}, ${cat.color}cc)`,
                        boxShadow: `0 2px 8px ${cat.color}30`,
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      background: statusInfo.bg,
                      color: statusInfo.color,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "999px",
                        background: statusInfo.color,
                      }}
                    />
                    {statusInfo.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grand total footer */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.2fr 1.4fr 1.4fr 1.4fr 2fr 120px",
            gap: "16px",
            padding: "20px 28px",
            background:
              "radial-gradient(circle at 0% 50%, rgba(249,115,22,0.07), transparent 12rem), linear-gradient(135deg, #0c172b, #12213a)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.70rem",
                fontWeight: 800,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Grand Total
            </div>
            <div
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "0.94rem",
                fontWeight: 800,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "-0.02em",
              }}
            >
              All 5 Categories
            </div>
          </div>
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "-0.04em",
            }}
          >
            {formatRp(totalBudget)}
          </div>
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "#fb923c",
              letterSpacing: "-0.04em",
            }}
          >
            {formatRp(totalRealization)}
          </div>
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "#4ade80",
              letterSpacing: "-0.04em",
            }}
          >
            {formatRp(totalRemaining)}
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "7px",
              }}
            >
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
                Overall utilization
              </span>
              <span
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "0.84rem",
                  fontWeight: 800,
                  color: "#fb923c",
                  letterSpacing: "-0.02em",
                }}
              >
                {overallPct}%
              </span>
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
                  width: `${overallPct}%`,
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #f97316, #fbbf24)",
                  boxShadow: "0 2px 10px rgba(249,115,22,0.28)",
                  transition: "width 0.8s ease",
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 12px",
              borderRadius: "999px",
              background: "rgba(251,146,60,0.15)",
              color: "#fb923c",
              fontSize: "0.72rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
              border: "1px solid rgba(251,146,60,0.22)",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "999px",
                background: "#fb923c",
              }}
            />
            {overallPct}% used
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* Alert summary */}
      {(criticalCount > 0 || warningCount > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rabCategories
            .filter((c) => getCategoryPct(c) >= 75)
            .map((cat) => {
              const pct = getCategoryPct(cat);
              const isCritical = pct >= 90;
              return (
                <div
                  key={cat.id}
                  style={{
                    padding: "20px",
                    borderRadius: "24px",
                    background: isCritical
                      ? "linear-gradient(180deg, #fff5f5, #ffffff)"
                      : "linear-gradient(180deg, #fffbeb, #ffffff)",
                    border: isCritical
                      ? "1px solid rgba(220,38,38,0.22)"
                      : "1px solid rgba(217,119,6,0.22)",
                    boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
                    display: "grid",
                    gridTemplateColumns: "46px minmax(0,1fr)",
                    gap: "14px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "16px",
                      background: isCritical
                        ? "rgba(220,38,38,0.09)"
                        : "rgba(217,119,6,0.09)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isCritical ? "#dc2626" : "#d97706",
                    }}
                  >
                    <AlertTriangle size={20} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "5px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 800,
                          color: "#182033",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {isCritical ? "Critical" : "Warning"}: {cat.name}
                      </span>
                    </div>
                    <div style={{ color: "#556174", fontSize: "0.82rem", marginBottom: "12px" }}>
                      Budget realization has reached{" "}
                      <span style={{ fontWeight: 800, color: isCritical ? "#dc2626" : "#d97706" }}>
                        {pct}%
                      </span>{" "}
                      of allocated budget.{" "}
                      {isCritical
                        ? "Immediate budget review required."
                        : "Consider reviewing spending pace."}
                    </div>
                    <div
                      style={{
                        height: "8px",
                        borderRadius: "999px",
                        background: "#eef2f7",
                        overflow: "hidden",
                        marginBottom: "6px",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          borderRadius: "999px",
                          background: isCritical
                            ? "linear-gradient(90deg, #dc2626, #f87171)"
                            : "linear-gradient(90deg, #d97706, #fbbf24)",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.74rem",
                        color: "#737f91",
                        fontWeight: 600,
                      }}
                    >
                      <span>
                        Used: {formatRp(getCategoryRealization(cat))} /{" "}
                        {formatRp(cat.budget)}
                      </span>
                      <span
                        style={{ color: isCritical ? "#dc2626" : "#d97706", fontWeight: 700 }}
                      >
                        {pct}% utilized
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Realization Drill-down Drawer */}
      <RealizationDrawer 
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        category={selectedCategory}
      />
    </div>
  );
}
