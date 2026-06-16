import { useState, useEffect } from "react";
import {
  X,
  Mail,
  Briefcase,
  Calendar,
  Clock,
  ShieldCheck,
  Check,
  Minus,
  Edit3,
  Send,
  Ban,
  Loader2,
} from "lucide-react";
import {
  PERMISSIONS,
  getRoleStyle,
  getUserStatusStyle,
  getInitials,
  formatUserDate,
  ROLE_PERMISSIONS,
} from "./userData";
import { UserProfile, disableUser } from "../../../services/user.service";
import { supabase } from "../../../lib/supabase";
import { toast } from "sonner";

interface UserDrawerProps {
  user: UserProfile | null;
  onClose: () => void;
}

type DrawerTab = "profile" | "permissions" | "activity";

export function UserDrawer({ user, onClose }: UserDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>("profile");
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user && activeTab === "activity") {
      loadActivities();
    }
  }, [user, activeTab]);

  const loadActivities = async () => {
    if (!user) return;
    setLoadingActivities(true);
    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("entity_id", user.id)
      .order("created_at", { ascending: false });
    
    if (data) setActivities(data);
    setLoadingActivities(false);
  };

  const handleDeactivate = async () => {
    if (!user) return;
    if (confirm(`Are you sure you want to deactivate ${user.full_name}?`)) {
      setActionLoading(true);
      // use a mock admin name for now or get from auth context
      await disableUser(user.id, "Admin");
      setActionLoading(false);
      onClose();
    }
  };

  if (!user) return null;

  const roleStyle = getRoleStyle(user.role);
  const statusStyle = getUserStatusStyle(user.status);
  const grantedKeys = ROLE_PERMISSIONS[user.role];
  const grantedCount = grantedKeys.length;

  const drawerTabs: { id: DrawerTab; label: string; count?: number }[] = [
    { id: "profile", label: "Profile" },
    { id: "permissions", label: "Permissions", count: grantedCount },
    { id: "activity", label: "Activity", count: activities.length || 0 },
  ];

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          background: "rgba(12,23,43,0.38)",
          backdropFilter: "blur(4px)",
        }}
      />

      <div className="fixed top-0 right-0 bottom-0 w-[520px] max-w-[100vw] z-[100] bg-[#fbf7ef] shadow-[-8px_0_48px_rgba(12,23,43,0.18)] flex flex-col overflow-y-auto">
        <div
          style={{
            padding: "20px 24px 0",
            background: "rgba(251,247,239,0.95)",
            backdropFilter: "blur(22px)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: "8px",
                  background: "#f3f5f8",
                  color: "#556174",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                }}
              >
                {user.id.slice(0, 8)}...
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: statusStyle.bg,
                  color: statusStyle.color,
                  border: `1px solid ${statusStyle.border}`,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "999px",
                    background: statusStyle.color,
                  }}
                />
                {user.status}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => toast.info('Feature under construction 🚧')}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "11px",
                  background: "white",
                  border: "1px solid rgba(17,24,39,0.09)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#556174",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
                }}
                title="Edit user"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={onClose}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "11px",
                  background: "white",
                  border: "1px solid rgba(17,24,39,0.09)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#182033",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
                }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <div
            style={{
              padding: "20px 22px",
              borderRadius: "24px",
              background:
                "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.08), transparent 14rem), linear-gradient(180deg, #ffffff, #fffdf9)",
              border: "1px solid rgba(17,24,39,0.08)",
              boxShadow: "0 8px 24px rgba(15,23,42,0.07)",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "20px",
                background:
                  "radial-gradient(circle at 38% 28%, rgba(255,255,255,0.9) 0 12%, transparent 13%), linear-gradient(135deg, #fed7aa, #fb923c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Sora', sans-serif",
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "#9a3412",
                flexShrink: 0,
                boxShadow: "0 10px 22px rgba(249,115,22,0.20)",
              }}
            >
              {getInitials(user.full_name || "??")}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#182033",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                }}
              >
                {user.full_name}
              </div>
              <div
                style={{
                  fontSize: "0.80rem",
                  color: "#556174",
                  fontWeight: 600,
                  marginTop: "4px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </div>
              <div style={{ marginTop: "8px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "4px 11px",
                    borderRadius: "999px",
                    background: roleStyle.bg,
                    color: roleStyle.color,
                    border: `1px solid ${roleStyle.border}`,
                    fontSize: "0.73rem",
                    fontWeight: 700,
                  }}
                >
                  <ShieldCheck size={11} strokeWidth={2.5} />
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "2px",
              padding: "4px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(17,24,39,0.08)",
            }}
          >
            {drawerTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    height: "36px",
                    borderRadius: "11px",
                    background: isActive
                      ? "linear-gradient(180deg, #fb7a18, #ea580c)"
                      : "transparent",
                    border: isActive ? "1px solid rgba(194,65,12,0.22)" : "1px solid transparent",
                    color: isActive ? "white" : "#556174",
                    fontSize: "0.81rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "0.18s cubic-bezier(.2,.8,.2,1)",
                    boxShadow: isActive ? "0 8px 18px rgba(234,88,12,0.20)" : "none",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "18px",
                        height: "18px",
                        padding: "0 5px",
                        borderRadius: "6px",
                        background: isActive ? "rgba(255,255,255,0.22)" : "#eef2f7",
                        color: isActive ? "white" : "#737f91",
                        fontSize: "0.66rem",
                        fontWeight: 800,
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ height: "1px", background: "rgba(17,24,39,0.07)", marginTop: "16px" }} />
        </div>

        <div style={{ padding: "20px 24px 32px", flex: 1 }}>
          {activeTab === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Transactions", value: "?", accent: "#ea580c" },
                  { label: "Permissions", value: `${grantedCount} / ${PERMISSIONS.length}`, accent: "#2563eb" },
                ].map((tile) => (
                  <div
                    key={tile.label}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "16px",
                      background: "white",
                      border: "1px solid rgba(17,24,39,0.07)",
                      boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.70rem",
                        color: "#737f91",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {tile.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: "1.32rem",
                        fontWeight: 800,
                        color: tile.accent,
                        letterSpacing: "-0.04em",
                        lineHeight: 1,
                        marginTop: "6px",
                      }}
                    >
                      {tile.value}
                    </div>
                  </div>
                ))}
              </div>

              {[
                { icon: Mail, label: "Email Address", value: user.email },
                { icon: Briefcase, label: "Position", value: user.position || "N/A" },
                { icon: Calendar, label: "Joined", value: formatUserDate(user.created_at) },
                { icon: Clock, label: "Last Active", value: formatUserDate(user.last_active_at) },
              ].map((field) => (
                <div
                  key={field.label}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "14px 16px",
                    borderRadius: "16px",
                    background: "white",
                    border: "1px solid rgba(17,24,39,0.07)",
                    boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "10px",
                      background: "#f8fafc",
                      border: "1px solid rgba(17,24,39,0.07)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#556174",
                      flexShrink: 0,
                    }}
                  >
                    <field.icon size={14} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.70rem",
                        color: "#737f91",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      {field.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.86rem",
                        fontWeight: 700,
                        color: "#182033",
                        letterSpacing: "-0.018em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {field.value}
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button
                  onClick={() => toast.info('Feature under construction 🚧')}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    height: "44px",
                    borderRadius: "13px",
                    background: "rgba(255,247,237,0.70)",
                    border: "1.5px dashed rgba(249,115,22,0.30)",
                    color: "#ea580c",
                    fontSize: "0.83rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <Send size={14} />
                  Send Reset Link
                </button>
                <button
                  onClick={handleDeactivate}
                  disabled={actionLoading || user.status === "INACTIVE"}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    height: "44px",
                    borderRadius: "13px",
                    background: "rgba(220,38,38,0.06)",
                    border: "1px solid rgba(220,38,38,0.16)",
                    color: "#dc2626",
                    fontSize: "0.83rem",
                    fontWeight: 700,
                    cursor: (actionLoading || user.status === "INACTIVE") ? "not-allowed" : "pointer",
                    opacity: (actionLoading || user.status === "INACTIVE") ? 0.5 : 1,
                  }}
                >
                  {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                  {user.status === "INACTIVE" ? "Deactivated" : "Deactivate"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "permissions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "13px",
                  background: roleStyle.bg,
                  border: `1px solid ${roleStyle.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "2px",
                }}
              >
                <ShieldCheck size={16} strokeWidth={2.2} style={{ color: roleStyle.color, flexShrink: 0 }} />
                <div style={{ fontSize: "0.78rem", color: "#34435d", fontWeight: 600, lineHeight: 1.45 }}>
                  Access is derived from the <strong style={{ color: roleStyle.color }}>{user.role}</strong> role.
                  {user.role === "ADMIN"
                    ? " Full access across the workspace."
                    : " Scoped to day-to-day financial operations."}
                </div>
              </div>

              {PERMISSIONS.map((perm) => {
                const granted = grantedKeys.includes(perm.key);
                return (
                  <div
                    key={perm.key}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "13px 15px",
                      borderRadius: "15px",
                      background: granted ? "white" : "#f8fafc",
                      border: granted ? "1px solid rgba(17,24,39,0.07)" : "1px solid rgba(17,24,39,0.05)",
                      boxShadow: granted ? "0 4px 12px rgba(15,23,42,0.04)" : "none",
                      opacity: granted ? 1 : 0.72,
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "9px",
                        background: granted ? "rgba(22,163,74,0.10)" : "#eef2f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: granted ? "#16a34a" : "#a4adbb",
                        flexShrink: 0,
                      }}
                    >
                      {granted ? <Check size={14} strokeWidth={3} /> : <Minus size={14} strokeWidth={3} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: granted ? "#182033" : "#737f91",
                          letterSpacing: "-0.018em",
                        }}
                      >
                        {perm.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#737f91",
                          fontWeight: 500,
                          marginTop: "2px",
                          lineHeight: 1.4,
                        }}
                      >
                        {perm.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "activity" && (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "18px",
                  bottom: "18px",
                  width: "2px",
                  borderRadius: "999px",
                  background: "linear-gradient(180deg, #f97316, rgba(249,115,22,0.04))",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {loadingActivities ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-orange-500" />
                  </div>
                ) : activities.length === 0 ? (
                  <div className="pl-10 py-4 text-sm font-semibold text-slate-500">
                    No activity found.
                  </div>
                ) : (
                  activities.map((item, i) => (
                    <div
                      key={item.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "32px minmax(0,1fr)",
                        gap: "12px",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "11px",
                          background: i === 0 ? "#fff7ed" : "#f8fafc",
                          border: i === 0 ? "1px solid rgba(249,115,22,0.20)" : "1px solid rgba(17,24,39,0.07)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          zIndex: 1,
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "999px",
                            background: i === 0 ? "#f97316" : "#c9d0da",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          padding: "11px 14px",
                          borderRadius: "14px",
                          background: "white",
                          border: "1px solid rgba(17,24,39,0.07)",
                          boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            color: "#182033",
                            letterSpacing: "-0.015em",
                            lineHeight: 1.3,
                          }}
                        >
                          {item.action}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }}>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "0.72rem",
                              color: "#737f91",
                              fontWeight: 600,
                            }}
                          >
                            <Clock size={10} />
                            {formatUserDate(item.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
