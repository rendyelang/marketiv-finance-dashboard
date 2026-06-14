import { useState } from "react";
import { TopNav } from "./TopNav";
import { SummaryTab } from "./rab/SummaryTab";
import { DetailedRABTab } from "./rab/DetailedRABTab";
import { RealizationTab } from "./rab/RealizationTab";
import { getTotalRealization, TOTAL_FUNDING, formatRp } from "./rab/rabData";
import { Download, FileText, BarChart2 } from "lucide-react";

type TabId = "summary" | "detailed" | "realization";

const tabs: { id: TabId; label: string; desc: string }[] = [
  { id: "summary", label: "Summary", desc: "High-level budget overview" },
  { id: "detailed", label: "Detailed RAB", desc: "Full line-item budget plan" },
  { id: "realization", label: "Realization", desc: "Planned vs actual spending" },
];

const totalRealization = getTotalRealization();
const overallPct = Math.round((totalRealization / TOTAL_FUNDING) * 100);

export function RABPage() {
  const [activeTab, setActiveTab] = useState<TabId>("summary");

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
        title="Rencana Anggaran Biaya"
        subtitle="P2MW 2025 Budget Planning & Realization"
      />

      <main
        style={{
          flex: 1,
          padding: "28px 32px 48px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Page hero header */}
        <div
          style={{
            padding: "28px 32px",
            borderRadius: "32px",
            background:
              "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.10), transparent 20rem), linear-gradient(135deg, #0c172b 0%, #12213a 60%, #1e3a5f 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 18px 46px rgba(12,23,43,0.22)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                fontSize: "1.8rem",
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.06em",
                lineHeight: 1,
                marginBottom: "10px",
              }}
            >
              Rencana Anggaran Biaya
            </div>
            <div style={{ color: "rgba(255,255,255,0.50)", fontSize: "0.88rem", fontWeight: 500, maxWidth: "520px", lineHeight: 1.55 }}>
              Complete budget planning and realization tracking for Marketiv P2MW 2025 program.
              Manage allocations, track spending, and ensure financial transparency.
            </div>

            {/* Quick stats */}
            <div style={{ display: "flex", gap: "24px", marginTop: "20px" }}>
              {[
                { label: "Total Budget", value: formatRp(TOTAL_FUNDING), color: "rgba(255,255,255,0.9)" },
                { label: "Realized", value: formatRp(totalRealization), color: "#fb923c" },
                { label: "Utilization", value: `${overallPct}%`, color: "#4ade80" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: "0.70rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      color: stat.color,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Action buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              flexShrink: 0,
              alignItems: "flex-end",
            }}
          >
            <button
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
                  "0 14px 30px rgba(234,88,12,0.28), inset 0 1px 0 rgba(255,255,255,0.22)",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              <Download size={14} />
              Export PDF
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                height: "42px",
                padding: "0 20px",
                borderRadius: "13px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.05))",
                color: "rgba(255,255,255,0.80)",
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer",
                fontSize: "0.83rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              <FileText size={14} />
              Export Excel
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            padding: "6px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(17,24,39,0.08)",
            boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
            backdropFilter: "blur(18px)",
            alignSelf: "flex-start",
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "1px",
                  padding: "10px 20px",
                  borderRadius: "15px",
                  background: isActive
                    ? "linear-gradient(180deg, #fb7a18 0%, #ea580c 100%)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(194,65,12,0.22)"
                    : "1px solid transparent",
                  color: isActive ? "white" : "#556174",
                  cursor: "pointer",
                  transition: "0.22s cubic-bezier(.2,.8,.2,1)",
                  boxShadow: isActive
                    ? "0 10px 24px rgba(234,88,12,0.22), inset 0 1px 0 rgba(255,255,255,0.18)"
                    : "none",
                  minWidth: "140px",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    letterSpacing: "-0.015em",
                    lineHeight: 1,
                    color: isActive ? "white" : "#182033",
                  }}
                >
                  {tab.label}
                </span>
                <span
                  style={{
                    fontSize: "0.71rem",
                    fontWeight: 500,
                    color: isActive ? "rgba(255,255,255,0.68)" : "#737f91",
                    marginTop: "3px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === "summary" && <SummaryTab />}
        {activeTab === "detailed" && <DetailedRABTab />}
        {activeTab === "realization" && <RealizationTab />}
      </main>
    </div>
  );
}
