import { AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";
import type { DashboardCategorySummary } from "../../services/budget.service";

function formatRp(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

interface BudgetAlertsProps {
  categories: DashboardCategorySummary[];
  isLoading?: boolean;
}

export function BudgetAlerts({ categories, isLoading }: BudgetAlertsProps) {
  // Filter categories where utilization >= 75%
  const alertCategories = categories
    .map((cat) => {
      const pct = cat.budget > 0 ? Math.round((cat.realization / cat.budget) * 100) : 0;
      const remaining = cat.budget - cat.realization;
      const isCritical = pct >= 90;
      return { ...cat, pct, remaining, isCritical };
    })
    .filter((cat) => cat.pct >= 75)
    .sort((a, b) => b.pct - a.pct); // Most critical first

  if (alertCategories.length === 0) {
    return (
      <div
        style={{
          padding: "32px",
          borderRadius: "28px",
          background: "linear-gradient(180deg, #f0fdf4, #ffffff)",
          border: "1px solid rgba(22,163,74,0.18)",
          boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "18px",
            background: "rgba(22,163,74,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#16a34a",
            flexShrink: 0,
          }}
        >
          <CheckCircle2 size={22} strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ fontSize: "0.91rem", fontWeight: 800, color: "#182033", letterSpacing: "-0.02em" }}>
            All Clear
          </div>
          <div style={{ color: "#556174", fontSize: "0.84rem", marginTop: "2px" }}>
            No budget categories have reached the 75% utilization threshold. Keep up the healthy spending pace!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {alertCategories.map((alert, i) => {
        const color = alert.isCritical ? "#dc2626" : "#d97706";
        const bg = alert.isCritical
          ? "linear-gradient(180deg, #fff5f5, #ffffff)"
          : "linear-gradient(180deg, #fffbeb, #ffffff)";
        const border = alert.isCritical ? "rgba(220,38,38,0.22)" : "rgba(217,119,6,0.22)";
        const iconBg = alert.isCritical ? "rgba(220,38,38,0.09)" : "rgba(217,119,6,0.10)";
        const barColor = alert.isCritical
          ? "linear-gradient(90deg, #dc2626, #f87171)"
          : "linear-gradient(90deg, #d97706, #fbbf24)";
        const level = alert.isCritical ? "Critical" : "Warning";
        const levelBg = alert.isCritical ? "rgba(220,38,38,0.09)" : "rgba(217,119,6,0.09)";
        const title = alert.isCritical ? "Critical Alert" : "Budget Warning";
        const message = alert.isCritical
          ? `${alert.name} budget has reached ${alert.pct}% utilization. Immediate review required.`
          : `${alert.name} budget has reached ${alert.pct}% utilization.`;

        return (
          <div
            key={i}
            style={{
              padding: "22px",
              borderRadius: "28px",
              background: bg,
              border: `1px solid ${border}`,
              boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
              transition: "0.24s cubic-bezier(.2,.8,.2,1)",
            }}
          >
            {/* Top row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "18px",
                  background: iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: color,
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={22} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.91rem",
                      fontWeight: 800,
                      color: "#182033",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "3px 9px",
                      borderRadius: "999px",
                      background: levelBg,
                      color: color,
                      fontSize: "0.70rem",
                      fontWeight: 700,
                    }}
                  >
                    <div
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "999px",
                        background: color,
                      }}
                    />
                    {level}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.70rem",
                    fontWeight: 700,
                    color: color,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  {alert.name}
                </div>
                <div style={{ color: "#556174", fontSize: "0.84rem", lineHeight: 1.5 }}>
                  {message}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <TrendingUp size={13} style={{ color }} />
                  <span style={{ fontSize: "0.78rem", color: "#556174", fontWeight: 600 }}>
                    Budget Utilization
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: "0.92rem",
                    fontWeight: 800,
                    color: color,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {alert.pct}%
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
                    width: `${Math.min(alert.pct, 100)}%`,
                    borderRadius: "999px",
                    background: barColor,
                    boxShadow: `0 2px 8px ${color}30`,
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "0.76rem",
                  color: "#737f91",
                  fontWeight: 600,
                }}
              >
                Remaining:{" "}
                <span style={{ color: "#182033", fontWeight: 700 }}>{formatRp(alert.remaining)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
