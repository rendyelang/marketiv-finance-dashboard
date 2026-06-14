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

interface RABPageProps {
  onMenuClick?: () => void;
}

export function RABPage({ onMenuClick }: RABPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>("summary");

  return (
    <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
      <TopNav
        title="Rencana Anggaran Biaya"
        subtitle="P2MW 2025 Budget Planning & Realization"
        onMenuClick={onMenuClick}
      />

      <main className="flex-1 p-4 md:p-6 lg:px-8 lg:py-7 flex flex-col gap-6">
        {/* Page hero header */}
        <div
          className="p-6 lg:p-8 rounded-[32px] border border-white/5 shadow-[0_18px_46px_rgba(12,23,43,0.22)] flex flex-col lg:flex-row lg:items-start justify-between gap-6"
          style={{
            background:
              "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.10), transparent 20rem), linear-gradient(135deg, #0c172b 0%, #12213a 60%, #1e3a5f 100%)",
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
            <div className="flex flex-wrap gap-4 lg:gap-6 mt-5">
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
          <div className="flex flex-row lg:flex-col gap-2.5 shrink-0 w-full lg:w-auto lg:items-end">
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
        <div className="overflow-x-auto w-full lg:w-auto self-start pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
          <div
            className="inline-flex gap-1.5 p-1.5 rounded-[20px] bg-white/72 border border-slate-900/5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-[18px]"
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
        </div>

        {/* Tab content */}
        {activeTab === "summary" && <SummaryTab />}
        {activeTab === "detailed" && <DetailedRABTab />}
        {activeTab === "realization" && <RealizationTab />}
      </main>
    </div>
  );
}
