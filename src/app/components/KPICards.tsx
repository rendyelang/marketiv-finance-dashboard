import { useState } from "react";
import { TrendingUp, CreditCard, Wallet, PieChart } from "lucide-react";

const cards = [
  {
    title: "Total Funding",
    value: "Rp 20.000.000",
    icon: TrendingUp,
    iconColor: "#ea580c",
    iconBg: "#fff7ed",
    iconBorder: "rgba(249,115,22,0.18)",
    note: "P2MW 2025 Program",
    badgeColor: "#ea580c",
    badgeBg: "rgba(249,115,22,0.09)",
    badge: "Active",
  },
  {
    title: "Used Funds",
    value: "Rp 5.200.000",
    icon: CreditCard,
    iconColor: "#2563eb",
    iconBg: "#eff6ff",
    iconBorder: "rgba(37,99,235,0.18)",
    note: "26% of total budget",
    badgeColor: "#2563eb",
    badgeBg: "rgba(37,99,235,0.09)",
    badge: "June 2026",
  },
  {
    title: "Remaining Funds",
    value: "Rp 14.800.000",
    icon: Wallet,
    iconColor: "#16a34a",
    iconBg: "#f0fdf4",
    iconBorder: "rgba(22,163,74,0.18)",
    note: "74% still available",
    badgeColor: "#16a34a",
    badgeBg: "rgba(22,163,74,0.09)",
    badge: "On Track",
  },
  {
    title: "Budget Utilization",
    value: "26%",
    icon: PieChart,
    iconColor: "#7c3aed",
    iconBg: "#f5f3ff",
    iconBorder: "rgba(124,58,237,0.18)",
    note: "Healthy spending pace",
    badgeColor: "#7c3aed",
    badgeBg: "rgba(124,58,237,0.09)",
    badge: "Q2 2026",
  },
];

export function KPICards() {
  const [hovered, setHovered] = useState<number | null>(null);

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
              {card.value}
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
