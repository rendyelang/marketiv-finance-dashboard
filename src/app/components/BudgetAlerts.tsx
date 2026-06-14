import { AlertTriangle, TrendingUp } from "lucide-react";

const alerts = [
  {
    title: "Budget Warning",
    category: "Company Legalization",
    message: "Company Legalization budget has reached 80% utilization.",
    percentage: 80,
    remaining: "Rp 500.000",
    color: "#d97706",
    bg: "linear-gradient(180deg, #fffbeb, #ffffff)",
    border: "rgba(217,119,6,0.22)",
    iconBg: "rgba(217,119,6,0.10)",
    barColor: "linear-gradient(90deg, #d97706, #fbbf24)",
    level: "Warning",
    levelBg: "rgba(217,119,6,0.09)",
  },
  {
    title: "Critical Alert",
    category: "Production",
    message: "Production budget has reached 90% utilization. Immediate review required.",
    percentage: 90,
    remaining: "Rp 150.000",
    color: "#dc2626",
    bg: "linear-gradient(180deg, #fff5f5, #ffffff)",
    border: "rgba(220,38,38,0.22)",
    iconBg: "rgba(220,38,38,0.09)",
    barColor: "linear-gradient(90deg, #dc2626, #f87171)",
    level: "Critical",
    levelBg: "rgba(220,38,38,0.09)",
  },
];

export function BudgetAlerts() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "20px" }}>
      {alerts.map((alert, i) => (
        <div
          key={i}
          style={{
            padding: "22px",
            borderRadius: "28px",
            background: alert.bg,
            border: `1px solid ${alert.border}`,
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
                background: alert.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: alert.color,
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
                  {alert.title}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 9px",
                    borderRadius: "999px",
                    background: alert.levelBg,
                    color: alert.color,
                    fontSize: "0.70rem",
                    fontWeight: 700,
                  }}
                >
                  <div
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "999px",
                      background: alert.color,
                    }}
                  />
                  {alert.level}
                </div>
              </div>
              <div
                style={{
                  fontSize: "0.70rem",
                  fontWeight: 700,
                  color: alert.color,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                {alert.category}
              </div>
              <div style={{ color: "#556174", fontSize: "0.84rem", lineHeight: 1.5 }}>
                {alert.message}
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
                <TrendingUp size={13} style={{ color: alert.color }} />
                <span style={{ fontSize: "0.78rem", color: "#556174", fontWeight: 600 }}>
                  Budget Utilization
                </span>
              </div>
              <span
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "0.92rem",
                  fontWeight: 800,
                  color: alert.color,
                  letterSpacing: "-0.03em",
                }}
              >
                {alert.percentage}%
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
                  width: `${alert.percentage}%`,
                  borderRadius: "999px",
                  background: alert.barColor,
                  boxShadow: `0 2px 8px ${alert.color}30`,
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
              <span style={{ color: "#182033", fontWeight: 700 }}>{alert.remaining}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
