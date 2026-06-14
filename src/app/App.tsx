import { useState } from "react";
import { Sidebar, type PageId } from "./components/Sidebar";
import { DashboardPage } from "./components/DashboardPage";
import { RABPage } from "./components/RABPage";
import { TransactionsPage } from "./components/TransactionsPage";
import { UsersPage } from "./components/UsersPage";

export default function App() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#fbf7ef",
        fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
        color: "#182033",
        position: "relative",
      }}
    >
      {/* Ambient background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 72% 8%, rgba(249,115,22,0.07), transparent 32rem), radial-gradient(circle at 10% 82%, rgba(30,58,95,0.06), transparent 28rem)",
        }}
      />

      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Page content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          minWidth: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        {activePage === "dashboard" && <DashboardPage />}
        {activePage === "transactions" && <TransactionsPage />}
        {activePage === "rab" && <RABPage />}
        {activePage === "users" && <UsersPage />}

        {/* Placeholder for pages not yet built */}
        {activePage !== "dashboard" &&
          activePage !== "transactions" &&
          activePage !== "rab" &&
          activePage !== "users" && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                color: "#556174",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "24px",
                  background: "#fff7ed",
                  border: "1px solid rgba(249,115,22,0.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ea580c",
                  fontSize: "1.5rem",
                }}
              >
                🚧
              </div>
              <div
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#182033",
                  letterSpacing: "-0.03em",
                }}
              >
                Coming Soon
              </div>
              <div style={{ fontSize: "0.84rem" }}>
                This page is under construction.
              </div>
              <button
                onClick={() => setActivePage("dashboard")}
                style={{
                  height: "40px",
                  padding: "0 20px",
                  borderRadius: "12px",
                  background: "linear-gradient(180deg, #fb7a18, #ea580c)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  boxShadow: "0 10px 24px rgba(234,88,12,0.22)",
                  marginTop: "8px",
                }}
              >
                Back to Dashboard
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
