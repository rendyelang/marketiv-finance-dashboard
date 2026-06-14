import { TopNav } from "./TopNav";
import { KPICards } from "./KPICards";
import { BudgetDistribution } from "./BudgetDistribution";
import { RecentActivity } from "./RecentActivity";
import { BudgetAlerts } from "./BudgetAlerts";
import { BudgetProgress } from "./BudgetProgress";

export function DashboardPage() {
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
      <TopNav
        title="Financial Dashboard"
        subtitle="Marketiv P2MW Funding Overview"
      />

      <main
        style={{
          flex: 1,
          padding: "28px 32px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Section label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#182033",
                letterSpacing: "-0.035em",
              }}
            >
              Overview
            </div>
            <div style={{ color: "#556174", fontSize: "0.80rem", marginTop: "3px" }}>
              Fiscal Year 2025 · June 2026
            </div>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 14px",
              borderRadius: "999px",
              background: "rgba(255,247,237,0.80)",
              border: "1px solid rgba(249,115,22,0.20)",
              color: "#ea580c",
              fontSize: "0.78rem",
              fontWeight: 700,
              boxShadow: "0 8px 20px rgba(249,115,22,0.08)",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "999px",
                background: "#f97316",
                boxShadow: "0 0 0 4px rgba(249,115,22,0.15)",
              }}
            />
            Live Dashboard
          </div>
        </div>

        <KPICards />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 1fr",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          <BudgetDistribution />
          <RecentActivity />
        </div>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#d97706",
                boxShadow: "0 0 0 4px rgba(217,119,6,0.15)",
              }}
            />
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#d97706",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Budget Alerts
            </span>
          </div>
          <BudgetAlerts />
        </div>

        <BudgetProgress />
      </main>
    </div>
  );
}
