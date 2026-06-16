import { useState } from "react";
import { TrendingUp, CreditCard, Wallet, PieChart } from "lucide-react";

function formatRp(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

interface KPICardsProps {
  totalFunding: number;
  usedFunds: number;
  remainingFunds: number;
  budgetUtilization: number;
  isLoading?: boolean;
}

export function KPICards({ totalFunding, usedFunds, remainingFunds, budgetUtilization, isLoading }: KPICardsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const availablePct = totalFunding > 0 ? Math.round((remainingFunds / totalFunding) * 100) : 0;
  const usedPct = totalFunding > 0 ? Math.round((usedFunds / totalFunding) * 100) : 0;

  const getUtilizationBadge = () => {
    if (budgetUtilization >= 90) return { badge: "Critical", badgeColor: "#dc2626", badgeBg: "rgba(220,38,38,0.09)" };
    if (budgetUtilization >= 75) return { badge: "Warning", badgeColor: "#d97706", badgeBg: "rgba(217,119,6,0.09)" };
    return { badge: "Healthy", badgeColor: "#16a34a", badgeBg: "rgba(22,163,74,0.09)" };
  };

  const utilBadge = getUtilizationBadge();

  const cards = [
    {
      title: "Total Funding",
      value: formatRp(totalFunding),
      icon: TrendingUp,
      iconColor: "#ea580c",
      iconBg: "#fff7ed",
      iconBorder: "rgba(249,115,22,0.18)",
      note: "P2MW 2026 Program",
      badgeColor: "#ea580c",
      badgeBg: "rgba(249,115,22,0.09)",
      badge: "Active",
    },
    {
      title: "Used Funds",
      value: formatRp(usedFunds),
      icon: CreditCard,
      iconColor: "#2563eb",
      iconBg: "#eff6ff",
      iconBorder: "rgba(37,99,235,0.18)",
      note: `${usedPct}% of total funding`,
      badgeColor: "#2563eb",
      badgeBg: "rgba(37,99,235,0.09)",
      badge: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
    },
    {
      title: "Remaining Funds",
      value: formatRp(remainingFunds),
      icon: Wallet,
      iconColor: "#16a34a",
      iconBg: "#f0fdf4",
      iconBorder: "rgba(22,163,74,0.18)",
      note: `${availablePct}% still available`,
      badgeColor: remainingFunds >= 0 ? "#16a34a" : "#dc2626",
      badgeBg: remainingFunds >= 0 ? "rgba(22,163,74,0.09)" : "rgba(220,38,38,0.09)",
      badge: remainingFunds >= 0 ? "On Track" : "Over Budget",
    },
    {
      title: "Budget Utilization",
      value: `${budgetUtilization}%`,
      icon: PieChart,
      iconColor: "#7c3aed",
      iconBg: "#f5f3ff",
      iconBorder: "rgba(124,58,237,0.18)",
      note: budgetUtilization < 75 ? "Healthy spending pace" : budgetUtilization < 90 ? "Approaching limit" : "Over budget limit",
      badgeColor: utilBadge.badgeColor,
      badgeBg: utilBadge.badgeBg,
      badge: utilBadge.badge,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const isHovered = hovered === i;
        return (
          <div
            key={card.title}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "relative",
              padding: "24px",
              borderRadius: "28px",
              background:
                "radial-gradient(circle at 100% 0%, rgba(249,115,22,.07), transparent 12rem), linear-gradient(180deg, #ffffff, #fffdf9)",
              border: isHovered
                ? "1px solid rgba(249,115,22,0.26)"
                : "1px solid rgba(17,24,39,0.08)",
              boxShadow: isHovered
                ? "0 18px 46px rgba(15,23,42,0.12)"
                : "0 8px 24px rgba(15,23,42,0.06)",
              overflow: "hidden",
              transition: "0.24s cubic-bezier(.2,.8,.2,1)",
              cursor: "pointer",
              transform: isHovered ? "translateY(-4px)" : "translateY(0)",
            }}
          >
            {/* Top row: icon + badge */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "17px",
                  background: card.iconBg,
                  border: `1px solid ${card.iconBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.iconColor,
                  boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
                }}
              >
                <Icon size={20} strokeWidth={2} />
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: card.badgeBg,
                  color: card.badgeColor,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "999px",
                    background: card.badgeColor,
                  }}
                />
                {card.badge}
              </div>
            </div>

            {/* Label */}
            <div
              style={{
                color: "#556174",
                fontSize: "0.81rem",
                fontWeight: 600,
                letterSpacing: "0",
              }}
            >
              {card.title}
            </div>

            {/* Value */}
            <div
              style={{
                fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                fontSize: "1.68rem",
                fontWeight: 800,
                letterSpacing: "-0.06em",
                lineHeight: 1,
                marginTop: "6px",
                color: "#182033",
              }}
            >
              {isLoading ? (
                <div style={{ width: "120px", height: "28px", borderRadius: "8px", background: "#eef2f7", animation: "pulse 1.5s infinite" }} />
              ) : (
                card.value
              )}
            </div>

            {/* Note */}
            <div
              style={{
                marginTop: "9px",
                color: "#737f91",
                fontSize: "0.80rem",
                fontWeight: 500,
              }}
            >
              {card.note}
            </div>

            {/* Decorative corner glow */}
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "80px",
                height: "80px",
                borderRadius: "999px",
                background: `radial-gradient(circle, ${card.iconColor}18, transparent 70%)`,
                pointerEvents: "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
