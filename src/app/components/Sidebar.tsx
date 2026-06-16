import { LayoutDashboard, ArrowLeftRight, FileSpreadsheet, BarChart3, Shield, Users, X, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export type PageId = "dashboard" | "transactions" | "rab" | "reports" | "audit" | "users";

interface NavItem {
  name: string;
  pageId: PageId;
  icon: React.ElementType;
}

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems: NavItem[] = [
  { name: "Dashboard", pageId: "dashboard", icon: LayoutDashboard },
  { name: "Transactions", pageId: "transactions", icon: ArrowLeftRight },
  { name: "RAB", pageId: "rab", icon: FileSpreadsheet },
  { name: "Reports", pageId: "reports", icon: BarChart3 },
  { name: "Audit Trail", pageId: "audit", icon: Shield },
];

export function Sidebar({ activePage, onNavigate, isOpen, onClose }: SidebarProps) {
  const { profile, logout } = useAuth();

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0c172b] flex flex-col p-6 shrink-0 h-screen overflow-y-auto transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:sticky lg:top-0
      `}
    >
      {/* Mobile Close Button */}
      {onClose && (
        <button onClick={onClose} className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
          <X size={20} />
        </button>
      )}
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
        <img src="/logo_marketiv.png" alt="Marketiv Logo" className="w-16 h-auto object-contain shrink-0" />
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
                background: isActive ? "linear-gradient(135deg, #f97316, #f59e0b)" : "transparent",
                color: isActive ? "white" : "rgba(255,255,255,0.50)",
                border: "none",
                cursor: "pointer",
                transition: "0.22s cubic-bezier(.2,.8,.2,1)",
                fontSize: "0.88rem",
                fontWeight: isActive ? 700 : 600,
                textAlign: "left",
                boxShadow: isActive ? "0 14px 30px rgba(249,115,22,0.28)" : "none",
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
      {profile?.role === "ADMIN" && (
        <>
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
                background: activePage === "users" ? "linear-gradient(135deg, #f97316, #f59e0b)" : "transparent",
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
        </>
      )}

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
              background: "radial-gradient(circle at 38% 28%, rgba(255,255,255,0.9) 0 12%, transparent 13%), linear-gradient(135deg, #fed7aa, #fb923c)",
              flexShrink: 0,
              boxShadow: "0 10px 20px rgba(249,115,22,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ea580c",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                color: "white",
                fontSize: "0.84rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {profile?.full_name || "Loading..."}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.38)",
                fontSize: "0.72rem",
                fontWeight: 600,
                marginTop: "2px",
                textTransform: "capitalize",
              }}
            >
              {profile?.position || "..."}
            </div>
          </div>
          <button onClick={() => logout()} className="text-slate-400 hover:text-white transition-colors cursor-pointer" title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
