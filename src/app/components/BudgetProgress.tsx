import { useState } from "react";
import { Download, TrendingUp } from "lucide-react";

const categories = [
  {
    name: "Product Development",
    budget: 8000000,
    realization: 1000000,
    color: "#f97316",
  },
  {
    name: "Production",
    budget: 5000000,
    realization: 4500000,
    color: "#2563eb",
  },
  {
    name: "Legalization",
    budget: 2500000,
    realization: 2000000,
    color: "#7c3aed",
  },
  {
    name: "HR Certification",
    budget: 2500000,
    realization: 1200000,
    color: "#16a34a",
  },
  {
    name: "ATK & Support",
    budget: 2000000,
    realization: 500000,
    color: "#d97706",
  },
];

function formatRp(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

function getStatusColor(pct: number) {
  if (pct >= 90) return { color: "#dc2626", bg: "rgba(220,38,38,0.08)", label: "Critical" };
  if (pct >= 75) return { color: "#d97706", bg: "rgba(217,119,6,0.08)", label: "Warning" };
  return { color: "#16a34a", bg: "rgba(22,163,74,0.08)", label: "On Track" };
}

export function BudgetProgress() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      style={{
        padding: "28px",
        borderRadius: "32px",
        background:
          "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.07), transparent 20rem), linear-gradient(180deg, #ffffff, #fffdf9)",
        border: "1px solid rgba(17,24,39,0.08)",
        boxShadow: "0 18px 46px rgba(15,23,42,0.10)",
      }}
    >
      {/* Header */}
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
            Financial Summary
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
            Budget Progress Summary
          </div>
          <div style={{ color: "#556174", fontSize: "0.84rem", marginTop: "7px" }}>
            Realization vs allocation — all categories
          </div>
        </div>
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
              "0 14px 30px rgba(234,88,12,0.24), inset 0 1px 0 rgba(255,255,255,0.22)",
            letterSpacing: "-0.01em",
            flexShrink: 0,
          }}
        >
          <Download size={14} />
          Export Report
        </button>
      </div>

      {/* Column headers */}
      <div className="overflow-x-auto w-full pb-4">
        <div className="min-w-[800px]">
          <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1.6fr 100px",
          gap: "16px",
          padding: "0 20px 12px",
          borderBottom: "1px solid rgba(17,24,39,0.07)",
          marginBottom: "8px",
        }}
      >
        {["Category", "Budget", "Realization", "Remaining", "Progress", "Status"].map((h) => (
          <div
            key={h}
            style={{
              fontSize: "0.72rem",
              color: "#737f91",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {categories.map((cat, i) => {
          const pct = Math.round((cat.realization / cat.budget) * 100);
          const status = getStatusColor(pct);
          const isHovered = hovered === i;

          return (
            <div
              key={cat.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1.6fr 100px",
                gap: "16px",
                alignItems: "center",
                padding: "16px 20px",
                borderRadius: "20px",
                background: isHovered ? "rgba(249,115,22,0.03)" : "white",
                border: isHovered
                  ? "1px solid rgba(249,115,22,0.16)"
                  : "1px solid rgba(17,24,39,0.07)",
                boxShadow: isHovered
                  ? "0 8px 24px rgba(15,23,42,0.08)"
                  : "0 4px 12px rgba(15,23,42,0.04)",
                transition: "0.22s cubic-bezier(.2,.8,.2,1)",
                cursor: "default",
              }}
            >
              {/* Category name */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "4px",
                    background: cat.color,
                    flexShrink: 0,
                    boxShadow: `0 2px 6px ${cat.color}40`,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.87rem",
                    fontWeight: 700,
                    color: "#182033",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {cat.name}
                </span>
              </div>

              {/* Budget */}
              <div
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  color: "#182033",
                  letterSpacing: "-0.025em",
                }}
              >
                {formatRp(cat.budget)}
              </div>

              {/* Realization */}
              <div
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  color: "#182033",
                  letterSpacing: "-0.025em",
                }}
              >
                {formatRp(cat.realization)}
              </div>

              {/* Remaining */}
              <div
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  color: "#16a34a",
                  letterSpacing: "-0.025em",
                }}
              >
                {formatRp(cat.budget - cat.realization)}
              </div>

              {/* Progress bar */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <TrendingUp size={11} style={{ color: cat.color }} />
                    <span style={{ fontSize: "0.72rem", color: "#737f91", fontWeight: 600 }}>
                      Utilization
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      color: status.color,
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
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              </div>

              {/* Status badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "5px 11px",
                  borderRadius: "999px",
                  background: status.bg,
                  color: status.color,
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
                    background: status.color,
                  }}
                />
                {status.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer totals */}
      <div
        style={{
          marginTop: "16px",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1.6fr 100px",
          gap: "16px",
          alignItems: "center",
          padding: "16px 20px",
          borderRadius: "20px",
          background:
            "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.08), transparent 10rem), linear-gradient(180deg, #fff7ed, #fff3e7)",
          border: "1px solid rgba(249,115,22,0.16)",
        }}
      >
        <div
          style={{
            fontSize: "0.84rem",
            fontWeight: 800,
            color: "#182033",
            letterSpacing: "-0.02em",
          }}
        >
          Total
        </div>
        <div
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "0.88rem",
            fontWeight: 800,
            color: "#182033",
            letterSpacing: "-0.03em",
          }}
        >
          Rp 20.000.000
        </div>
        <div
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "0.88rem",
            fontWeight: 800,
            color: "#182033",
            letterSpacing: "-0.03em",
          }}
        >
          Rp 9.200.000
        </div>
        <div
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "0.88rem",
            fontWeight: 800,
            color: "#16a34a",
            letterSpacing: "-0.03em",
          }}
        >
          Rp 10.800.000
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              flex: 1,
              height: "8px",
              borderRadius: "999px",
              background: "#eef2f7",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "46%",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #f97316, #fbbf24)",
                boxShadow: "0 2px 8px rgba(249,115,22,0.24)",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "#ea580c",
              letterSpacing: "-0.02em",
              flexShrink: 0,
            }}
          >
            46%
          </span>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 11px",
            borderRadius: "999px",
            background: "rgba(249,115,22,0.10)",
            color: "#ea580c",
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
              background: "#ea580c",
            }}
          />
          Overall
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
