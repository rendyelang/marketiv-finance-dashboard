import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router";
import type { DashboardCategorySummary } from "../../services/budget.service";

function formatRp(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

function formatShortRp(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

interface BudgetDistributionProps {
  categories: DashboardCategorySummary[];
  totalBudget: number;
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div
        style={{
          padding: "12px 16px",
          borderRadius: "16px",
          background: "white",
          border: "1px solid rgba(17,24,39,0.10)",
          boxShadow: "0 18px 46px rgba(15,23,42,0.12)",
        }}
      >
        <div style={{ fontSize: "0.80rem", color: "#556174", fontWeight: 600, marginBottom: "4px" }}>
          {d.name}
        </div>
        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#182033", letterSpacing: "-0.04em" }}>
          {d.pct.toFixed(1)}%
        </div>
        <div style={{ fontSize: "0.78rem", color: "#737f91", marginTop: "2px" }}>{formatRp(d.budget)}</div>
      </div>
    );
  }
  return null;
};

export function BudgetDistribution({ categories, totalBudget, isLoading }: BudgetDistributionProps) {
  const navigate = useNavigate();

  const chartData = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    value: cat.budget,
    pct: totalBudget > 0 ? (cat.budget / totalBudget) * 100 : 0,
    budget: cat.budget,
    color: cat.color,
  }));

  const CenterLabel = () => (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
      <tspan
        x="50%"
        dy="-10"
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "20px",
          fontWeight: 800,
          fill: "#182033",
          letterSpacing: "-2px",
        }}
      >
        {formatShortRp(totalBudget)}
      </tspan>
      <tspan
        x="50%"
        dy="22"
        style={{
          fontSize: "11px",
          fontWeight: 600,
          fill: "#556174",
        }}
      >
        Total Budget
      </tspan>
    </text>
  );

  return (
    <div
      style={{
        padding: "28px",
        borderRadius: "32px",
        background:
          "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.07), transparent 18rem), linear-gradient(180deg, #ffffff, #fffdf9)",
        border: "1px solid rgba(17,24,39,0.08)",
        boxShadow: "0 18px 46px rgba(15,23,42,0.10)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
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
          Budget Overview
        </div>
        <div
          style={{
            fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
            fontSize: "1.45rem",
            fontWeight: 700,
            color: "#182033",
            letterSpacing: "-0.05em",
            marginTop: "7px",
            lineHeight: 1,
          }}
        >
          Budget Distribution
        </div>
        <div style={{ color: "#556174", fontSize: "0.84rem", marginTop: "7px" }}>
          Allocation by category — P2MW 2026
        </div>
      </div>

      {/* Chart + Legend */}
      <div className="flex flex-col xl:flex-row items-center gap-7">
        {/* Donut */}
        <div className="w-[220px] h-[220px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={66}
                outerRadius={98}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`pie-cell-${entry.name}-${index}`} 
                    fill={entry.color} 
                    style={{ cursor: "pointer", outline: "none" }}
                    onClick={() => navigate("/rab", { state: { targetCategoryId: entry.id } })}
                  />
                ))}
                <CenterLabel />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 flex flex-col gap-2.5 w-full">
          {chartData.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "16px",
                background: "rgba(248,250,252,0.8)",
                border: "1px solid rgba(17,24,39,0.06)",
                transition: "0.2s",
                cursor: "pointer",
              }}
              onClick={() => navigate("/rab", { state: { targetCategoryId: item.id } })}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.borderColor = "rgba(17,24,39,0.12)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(248,250,252,0.8)";
                e.currentTarget.style.borderColor = "rgba(17,24,39,0.06)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "4px",
                  background: item.color,
                  flexShrink: 0,
                  boxShadow: `0 2px 8px ${item.color}40`,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "#34435d",
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </div>
                <div style={{ fontSize: "0.74rem", color: "#737f91", marginTop: "2px" }}>
                  {formatRp(item.budget)}
                </div>
              </div>
              <div
                style={{
                  flexShrink: 0,
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "0.92rem",
                  fontWeight: 800,
                  color: item.color,
                  letterSpacing: "-0.02em",
                }}
              >
                {item.pct.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
