import { Globe, CheckCircle, FlaskConical } from "lucide-react";

const activities = [
  {
    date: "12 June 2026",
    title: "Domain purchase completed",
    by: "Rendy",
    icon: Globe,
    iconColor: "#ea580c",
    iconBg: "#fff7ed",
    iconBorder: "rgba(249,115,22,0.18)",
    tag: "Completed",
    tagColor: "#16a34a",
    tagBg: "rgba(22,163,74,0.09)",
  },
  {
    date: "11 June 2026",
    title: "Hosting payment approved",
    by: "Admin",
    icon: CheckCircle,
    iconColor: "#16a34a",
    iconBg: "#f0fdf4",
    iconBorder: "rgba(22,163,74,0.18)",
    tag: "Approved",
    tagColor: "#2563eb",
    tagBg: "rgba(37,99,235,0.09)",
  },
  {
    date: "10 June 2026",
    title: "Product research equipment purchased",
    by: "Team",
    icon: FlaskConical,
    iconColor: "#2563eb",
    iconBg: "#eff6ff",
    iconBorder: "rgba(37,99,235,0.18)",
    tag: "Processing",
    tagColor: "#d97706",
    tagBg: "rgba(217,119,6,0.09)",
  },
];

export function RecentActivity() {
  return (
    <div
      style={{
        padding: "28px",
        borderRadius: "32px",
        background:
          "radial-gradient(circle at 100% 0%, rgba(30,58,95,0.06), transparent 16rem), linear-gradient(180deg, #ffffff, #fffdf9)",
        border: "1px solid rgba(17,24,39,0.08)",
        boxShadow: "0 18px 46px rgba(15,23,42,0.10)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
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
          Activity Log
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
          Recent Activity
        </div>
        <div style={{ color: "#556174", fontSize: "0.84rem", marginTop: "7px" }}>
          Latest financial transactions
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative", flex: 1 }}>
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: "20px",
            top: "22px",
            bottom: "22px",
            width: "2px",
            borderRadius: "999px",
            background:
              "linear-gradient(180deg, #f97316, rgba(249,115,22,0.04))",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {activities.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "42px minmax(0,1fr)",
                  gap: "14px",
                  alignItems: "flex-start",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: activity.iconBg,
                    border: `1px solid ${activity.iconBorder}`,
                    boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
                    position: "relative",
                    zIndex: 1,
                    color: activity.iconColor,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={17} strokeWidth={2.2} />
                </div>

                {/* Content */}
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: "20px",
                    background: "white",
                    border: "1px solid rgba(17,24,39,0.07)",
                    boxShadow: "0 6px 18px rgba(15,23,42,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "8px",
                      marginBottom: "6px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: "#737f91",
                        fontWeight: 600,
                      }}
                    >
                      {activity.date}
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "3px 9px",
                        borderRadius: "999px",
                        background: activity.tagBg,
                        color: activity.tagColor,
                        fontSize: "0.70rem",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "999px",
                          background: activity.tagColor,
                        }}
                      />
                      {activity.tag}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      color: "#182033",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.3,
                    }}
                  >
                    {activity.title}
                  </div>
                  <div
                    style={{
                      color: "#737f91",
                      fontSize: "0.78rem",
                      marginTop: "4px",
                      fontWeight: 600,
                    }}
                  >
                    By {activity.by}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View All */}
      <button
        style={{
          marginTop: "20px",
          width: "100%",
          height: "42px",
          borderRadius: "14px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(250,250,250,0.86))",
          border: "1px solid rgba(17,24,39,0.10)",
          boxShadow:
            "0 10px 24px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.92)",
          color: "#182033",
          fontSize: "0.84rem",
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: "-0.01em",
        }}
      >
        View All Activity
      </button>
    </div>
  );
}
