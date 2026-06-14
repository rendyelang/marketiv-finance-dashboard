import { LayoutDashboard, ArrowLeftRight, FileSpreadsheet, BarChart3, Shield, Users } from "lucide-react";

export type PageId = "dashboard" | "transactions" | "rab" | "reports" | "audit" | "users";

interface NavItem {
  name: string;
  pageId: PageId;
  icon: React.ElementType;
}

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const navItems: NavItem[] = [
  { name: "Dashboard", pageId: "dashboard", icon: LayoutDashboard },
  { name: "Transactions", pageId: "transactions", icon: ArrowLeftRight },
  { name: "RAB", pageId: "rab", icon: FileSpreadsheet },
  { name: "Reports", pageId: "reports", icon: BarChart3 },
  { name: "Audit Trail", pageId: "audit", icon: Shield },
];

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#0c172b",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "8px 12px",
          marginBottom: "36px",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 20px 60px rgba(249,115,22,.22)",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "9px",
              right: "9px",
              bottom: "12px",
              borderRadius: "999px",
              border: "2px solid rgba(255,255,255,.88)",
              transform: "rotate(-22deg)",
            }}
          />
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              color: "white",
              fontSize: "1.12rem",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            Marketiv
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.42)",
              fontSize: "0.72rem",
              fontWeight: 600,
              marginTop: "5px",
            }}
          >
            Financial System
          </div>
        </div>
      </div>

      {/* Main Nav label */}
      <div
        style={{
          color: "rgba(255,255,255,0.28)",
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "0 16px",
          marginBottom: "8px",
        }}
      >
        Main Menu
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.pageId === activePage;
          return (
            <button
              key={item.pageId}
              onClick={() => onNavigate(item.pageId)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                minHeight: "48px",
                padding: "0 16px",
                borderRadius: "16px",
                background: isActive
                  ? "linear-gradient(135deg, #f97316, #f59e0b)"
                  : "transparent",
                color: isActive ? "white" : "rgba(255,255,255,0.50)",
                border: "none",
                cursor: "pointer",
                transition: "0.22s cubic-bezier(.2,.8,.2,1)",
                fontSize: "0.88rem",
                fontWeight: isActive ? 700 : 600,
                textAlign: "left",
                boxShadow: isActive
                  ? "0 14px 30px rgba(249,115,22,0.28)"
                  : "none",
                letterSpacing: "-0.01em",
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.name}</span>
              {isActive && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: "6px",
                    height: "6px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.7)",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.07)",
          margin: "20px 0",
        }}
      />

      {/* Administration label */}
      <div
        style={{
          color: "rgba(255,255,255,0.28)",
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "0 16px",
          marginBottom: "8px",
        }}
      >
        Administration
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <button
          onClick={() => onNavigate("users")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minHeight: "48px",
            padding: "0 16px",
            borderRadius: "16px",
            background: activePage === "users"
              ? "linear-gradient(135deg, #f97316, #f59e0b)"
              : "transparent",
            color: activePage === "users" ? "white" : "rgba(255,255,255,0.50)",
            border: "none",
            cursor: "pointer",
            fontSize: "0.88rem",
            fontWeight: activePage === "users" ? 700 : 600,
            textAlign: "left",
            transition: "0.22s cubic-bezier(.2,.8,.2,1)",
            boxShadow: activePage === "users" ? "0 14px 30px rgba(249,115,22,0.28)" : "none",
          }}
        >
          <Users size={18} strokeWidth={2} />
          <span>User Management</span>
        </button>
      </nav>

      {/* Bottom: User Profile */}
      <div style={{ marginTop: "auto" }}>
        <div
          style={{
            padding: "14px 16px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.055)",
            border: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "14px",
              background:
                "radial-gradient(circle at 38% 28%, rgba(255,255,255,0.9) 0 12%, transparent 13%), linear-gradient(135deg, #fed7aa, #fb923c)",
              flexShrink: 0,
              boxShadow: "0 10px 20px rgba(249,115,22,0.18)",
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: "white",
                fontSize: "0.84rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              Admin User
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.38)",
                fontSize: "0.72rem",
                fontWeight: 600,
                marginTop: "2px",
              }}
            >
              Treasurer · P2MW
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              width: "8px",
              height: "8px",
              borderRadius: "999px",
              background: "#16a34a",
              boxShadow: "0 0 0 3px rgba(22,163,74,0.2)",
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
