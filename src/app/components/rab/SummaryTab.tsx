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
  rabCategories,
  TOTAL_FUNDING,
  getCategoryRealization,
  getCategoryRemaining,
  getCategoryPct,
  getTotalRealization,
  getUtilizationStatus,
  formatRp,
} from "./rabData";
import {
  TrendingUp,
  Wallet,
  CheckCircle2,
} from "lucide-react";

function RpIcon({ color, bg, border }: { color: string; bg: string; border: string }) {
  return (
    <div
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "16px",
        background: bg,
        border: `1px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
          fontSize: "0.80rem",
          fontWeight: 800,
          color: color,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        Rp
      </span>
    </div>
  );
}

const totalRealization = getTotalRealization();
const totalRemaining = TOTAL_FUNDING - totalRealization;
const overallPct = Math.round((totalRealization / TOTAL_FUNDING) * 100);

const approvedItems = rabCategories.flatMap((c) => c.items).filter((i) => i.status === "Completed").length;
const totalItems = rabCategories.flatMap((c) => c.items).length;

const kpiCards = [
  {
    title: "Total Planned Budget",
    value: formatRp(TOTAL_FUNDING),
    icon: null as null,
    iconColor: "#ea580c",
    iconBg: "#fff7ed",
    iconBorder: "rgba(249,115,22,0.18)",
    badge: "P2MW 2025",
    badgeColor: "#ea580c",
    badgeBg: "rgba(249,115,22,0.09)",
    note: "Full program allocation",
  },
  {
    title: "Total Realization",
    value: formatRp(totalRealization),
    icon: TrendingUp as any,
    iconColor: "#2563eb",
    iconBg: "#eff6ff",
    iconBorder: "rgba(37,99,235,0.18)",
    badge: `${overallPct}% used`,
    badgeColor: "#2563eb",
    badgeBg: "rgba(37,99,235,0.09)",
    note: "Actual spending to date",
  },
  {
    title: "Remaining Budget",
    value: formatRp(totalRemaining),
    icon: Wallet as any,
    iconColor: "#16a34a",
    iconBg: "#f0fdf4",
    iconBorder: "rgba(22,163,74,0.18)",
    badge: `${100 - overallPct}% available`,
    badgeColor: "#16a34a",
    badgeBg: "rgba(22,163,74,0.09)",
    note: "Unspent allocation",
  },
  {
    title: "Items Approved",
    value: `${approvedItems} / ${totalItems}`,
    icon: CheckCircle2 as any,
    iconColor: "#7c3aed",
    iconBg: "#f5f3ff",
    iconBorder: "rgba(124,58,237,0.18)",
    badge: "Line Items",
    badgeColor: "#7c3aed",
    badgeBg: "rgba(124,58,237,0.09)",
    note: `${totalItems - approvedItems} pending review`,
  },
];

const chartData = rabCategories.map((cat) => ({
  name: cat.name.split(" ").slice(0, 2).join(" "),
  budget: cat.budget,
  realization: getCategoryRealization(cat),
  color: cat.color,
}));

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          padding: "14px 18px",
          borderRadius: "18px",
          background: "white",
          border: "1px solid rgba(17,24,39,0.10)",
          boxShadow: "0 18px 46px rgba(15,23,42,0.12)",
          minWidth: "180px",
        }}
      >
        <div
          style={{
            fontSize: "0.78rem",
            color: "#556174",
            fontWeight: 700,
            marginBottom: "10px",
          }}
        >
          {label}
        </div>
        {payload.map((p: any, pi: number) => (
          <div
            key={`${p.name ?? "item"}-${pi}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "5px",
              fontSize: "0.84rem",
            }}
          >
            <span
              style={{
                color: "#556174",
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
                letterSpacing: "-0.02em",
              }}
            >
              {formatRp(p.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function SummaryTab() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[18px]">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          const isHov = hoveredCard === i;
          return (
            <div
              key={card.title}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                padding: "22px",
                borderRadius: "28px",
                background:
                  "radial-gradient(circle at 100% 0%, rgba(249,115,22,.06), transparent 12rem), linear-gradient(180deg, #ffffff, #fffdf9)",
                border: isHov
                  ? "1px solid rgba(249,115,22,0.24)"
                  : "1px solid rgba(17,24,39,0.08)",
                boxShadow: isHov
                  ? "0 18px 46px rgba(15,23,42,0.11)"
                  : "0 8px 24px rgba(15,23,42,0.06)",
                transform: isHov ? "translateY(-4px)" : "translateY(0)",
                transition: "0.24s cubic-bezier(.2,.8,.2,1)",
                cursor: "default",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                {i === 0 ? (
                  <RpIcon
                    color={card.iconColor}
                    bg={card.iconBg}
                    border={(card as any).iconBorder ?? `${card.iconColor}26`}
                  />
                ) : (
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "16px",
                      background: card.iconBg,
                      border: `1px solid ${(card as any).iconBorder ?? `${card.iconColor}26`}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: card.iconColor,
                      boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
                    }}
                  >
                    {Icon && <Icon size={19} strokeWidth={2} />}
                  </div>
                )}
                <div
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: card.badgeBg,
                    color: card.badgeColor,
                    fontSize: "0.71rem",
                    fontWeight: 700,
                  }}
                >
                  {card.badge}
                </div>
              </div>
              <div style={{ color: "#737f91", fontSize: "0.80rem", fontWeight: 600 }}>
                {card.title}
              </div>
              <div
                style={{
                  fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                  fontSize: i < 3 ? "1.45rem" : "1.8rem",
                  fontWeight: 800,
                  letterSpacing: i < 3 ? "-0.055em" : "-0.04em",
                  lineHeight: 1,
                  marginTop: "5px",
                  color: "#182033",
                }}
              >
                {card.value}
              </div>
              <div
                style={{
                  marginTop: "8px",
                  color: "#737f91",
                  fontSize: "0.78rem",
                }}
              >
                {card.note}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "-16px",
                  right: "-16px",
                  width: "72px",
                  height: "72px",
                  borderRadius: "999px",
                  background: `radial-gradient(circle, ${card.iconColor}14, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Category cards grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#182033",
                letterSpacing: "-0.035em",
              }}
            >
              Budget by Category
            </div>
            <div style={{ color: "#556174", fontSize: "0.79rem", marginTop: "3px" }}>
              Planned allocation vs. actual realization
            </div>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#556174",
              fontSize: "0.78rem",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "3px",
                background: "#eef2f7",
                display: "inline-block",
                border: "1px solid rgba(17,24,39,0.10)",
              }}
            />
            Budget
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "3px",
                background: "#f97316",
                display: "inline-block",
                marginLeft: "8px",
              }}
            />
            Realized
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {rabCategories.map((cat) => {
            const realization = getCategoryRealization(cat);
            const remaining = getCategoryRemaining(cat);
            const pct = getCategoryPct(cat);
            const statusInfo = getUtilizationStatus(pct);
            const approvedCount = cat.items.filter((i) => i.status === "Completed").length;

            return (
              <div
                key={cat.id}
                style={{
                  padding: "20px",
                  borderRadius: "26px",
                  background: "white",
                  border: "1px solid rgba(17,24,39,0.08)",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
                  transition: "0.22s cubic-bezier(.2,.8,.2,1)",
                  cursor: "default",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Category header */}
                <div>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "14px",
                      background: cat.lightColor,
                      border: cat.borderColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "5px",
                        background: cat.color,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "0.83rem",
                      fontWeight: 700,
                      color: "#182033",
                      letterSpacing: "-0.018em",
                      lineHeight: 1.3,
                    }}
                  >
                    {cat.name}
                  </div>
                </div>

                {/* Budget amount */}
                <div>
                  <div style={{ color: "#737f91", fontSize: "0.70rem", fontWeight: 700 }}>
                    BUDGET
                  </div>
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: "1.18rem",
                      fontWeight: 800,
                      color: "#182033",
                      letterSpacing: "-0.05em",
                      lineHeight: 1,
                      marginTop: "3px",
                    }}
                  >
                    {formatRp(cat.budget)}
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "7px",
                    }}
                  >
                    <span style={{ fontSize: "0.72rem", color: "#737f91", fontWeight: 600 }}>
                      {formatRp(realization)} used
                    </span>
                    <span
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: "0.80rem",
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
                      height: "8px",
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
                        boxShadow: `0 2px 8px ${cat.color}30`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "0.70rem",
                      color: "#737f91",
                      fontWeight: 600,
                    }}
                  >
                    Remaining:{" "}
                    <span style={{ color: "#16a34a", fontWeight: 700 }}>
                      {formatRp(remaining)}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "12px",
                    borderTop: "1px solid rgba(17,24,39,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "4px 9px",
                      borderRadius: "999px",
                      background: statusInfo.bg,
                      color: statusInfo.color,
                      fontSize: "0.70rem",
                      fontWeight: 700,
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
                  <div
                    style={{
                      fontSize: "0.70rem",
                      color: "#737f91",
                      fontWeight: 600,
                    }}
                  >
                    {approvedCount}/{cat.items.length} approved
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget vs Realization Chart */}
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
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "28px",
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
              Visual Comparison
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
              Budget vs Realization
            </div>
            <div style={{ color: "#556174", fontSize: "0.82rem", marginTop: "6px" }}>
              Planned allocation compared to actual spending by category
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
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
                  background: "rgba(249,115,22,0.15)",
                  border: "1px solid rgba(249,115,22,0.22)",
                }}
              />
              Budget (planned)
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
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
                  background: "#f97316",
                }}
              />
              Realization
            </div>
          </div>
        </div>

        <div style={{ height: "280px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barCategoryGap="28%"
              barGap={4}
              margin={{ top: 0, right: 0, left: 20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="0"
                vertical={false}
                stroke="rgba(17,24,39,0.06)"
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
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(17,24,39,0.03)" }} />
              <Bar
                dataKey="budget"
                name="Budget"
                isAnimationActive={false}
                radius={[6, 6, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`budget-${index}`} fill={`${entry.color}33`} />
                ))}
              </Bar>
              <Bar
                dataKey="realization"
                name="Realization"
                isAnimationActive={false}
                radius={[6, 6, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`realization-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grand Total strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "1px",
          padding: "22px 28px",
          borderRadius: "24px",
          background:
            "radial-gradient(circle at 0% 50%, rgba(249,115,22,0.08), transparent 14rem), linear-gradient(135deg, #0c172b 0%, #12213a 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 18px 46px rgba(12,23,43,0.22)",
        }}
      >
        {[
          {
            label: "Total Budget",
            value: formatRp(TOTAL_FUNDING),
            sub: "5 categories",
            color: "rgba(255,255,255,0.9)",
          },
          {
            label: "Total Realization",
            value: formatRp(totalRealization),
            sub: `${overallPct}% utilized`,
            color: "#fb923c",
          },
          {
            label: "Total Remaining",
            value: formatRp(totalRemaining),
            sub: `${100 - overallPct}% unspent`,
            color: "#4ade80",
          },
          {
            label: "Items Status",
            value: `${approvedItems}/${totalItems}`,
            sub: "line items approved",
            color: "#a78bfa",
          },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: i > 0 ? "0 24px" : "0 24px 0 0",
              borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}
          >
            <div
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "1.4rem",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                color: item.color,
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.76rem",
                marginTop: "5px",
                fontWeight: 600,
              }}
            >
              {item.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
