import { Bell, ChevronDown, Download } from "lucide-react";

interface TopNavProps {
  title?: string;
  subtitle?: string;
}

export function TopNav({
  title = "Financial Dashboard",
  subtitle = "Marketiv P2MW Funding Overview",
}: TopNavProps) {
  return (
    <div
      style={{
        height: "76px",
        background: "rgba(251,247,239, 0.90)",
        backdropFilter: "blur(22px)",
        borderBottom: "1px solid rgba(17,24,39,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Left: Title */}
      <div>
        <div
          style={{
            fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
            fontSize: "1.28rem",
            fontWeight: 700,
            color: "#182033",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#556174",
            fontSize: "0.81rem",
            fontWeight: 600,
            marginTop: "5px",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Export button */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            height: "42px",
            padding: "0 18px",
            borderRadius: "13px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(250,250,250,0.86))",
            border: "1px solid rgba(17,24,39,0.10)",
            boxShadow:
              "0 10px 24px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.92)",
            color: "#182033",
            fontSize: "0.83rem",
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "-0.01em",
          }}
        >
          <Download size={15} />
          Export
        </button>

        {/* Notification */}
        <button
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "13px",
            background: "white",
            border: "1px solid rgba(17,24,39,0.09)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
            color: "#556174",
            position: "relative",
          }}
        >
          <Bell size={17} />
          <div
            style={{
              position: "absolute",
              top: "9px",
              right: "9px",
              width: "8px",
              height: "8px",
              borderRadius: "999px",
              background: "#f97316",
              border: "2px solid white",
            }}
          />
        </button>

        {/* User Profile */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            height: "42px",
            padding: "0 14px 0 8px",
            borderRadius: "13px",
            background: "white",
            border: "1px solid rgba(17,24,39,0.09)",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "10px",
              background:
                "radial-gradient(circle at 38% 28%, rgba(255,255,255,0.9) 0 12%, transparent 13%), linear-gradient(135deg, #fed7aa, #fb923c)",
            }}
          />
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: "0.81rem",
                fontWeight: 700,
                color: "#182033",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Admin
            </div>
            <div
              style={{
                fontSize: "0.70rem",
                color: "#556174",
                fontWeight: 600,
                marginTop: "3px",
              }}
            >
              Treasurer
            </div>
          </div>
          <ChevronDown size={13} style={{ color: "#556174" }} />
        </button>
      </div>
    </div>
  );
}
