import { useState, useMemo, useEffect } from "react";
import { TopNav } from "./TopNav";
import { UserDrawer } from "./users/UserDrawer";
import { AddUserModal } from "./users/AddUserModal";
import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  getRoleStyle,
  getUserStatusStyle,
  getInitials,
  formatUserDate,
  getActiveCount,
  getAdminCount,
  getMemberCount,
  getInvitedCount,
  type UserRole,
  type UserStatus,
} from "./users/userData";
import {
  Search,
  UserPlus,
  Users as UsersIcon,
  ShieldCheck,
  UserCheck,
  Mail,
  ChevronDown,
  Eye,
  Edit3,
  Check,
  Minus,
  Clock,
  ShieldHalf,
  Loader2,
} from "lucide-react";
import { fetchUsers, type UserProfile } from "../../services/user.service";
import { supabase } from "../../lib/supabase";

function Avatar({ name }: { name: string }) {
  return (
    <div
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "13px",
        background:
          "radial-gradient(circle at 38% 28%, rgba(255,255,255,0.85) 0 12%, transparent 13%), linear-gradient(135deg, #fed7aa, #fb923c)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.70rem",
        fontWeight: 800,
        color: "#9a3412",
        flexShrink: 0,
      }}
    >
      {getInitials(name)}
    </div>
  );
}

function UserRow({ user, onSelect }: { user: UserProfile; onSelect: (u: UserProfile) => void }) {
  const [hovered, setHovered] = useState(false);
  const roleStyle = getRoleStyle(user.role);
  const statusStyle = getUserStatusStyle(user.status);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(user)}
      style={{
        display: "grid",
        gridTemplateColumns: "38px 1fr 150px 120px 110px 120px 80px",
        gap: "14px",
        alignItems: "center",
        padding: "14px 20px",
        borderRadius: "18px",
        background: hovered ? "rgba(249,115,22,0.025)" : "white",
        border: hovered ? "1px solid rgba(249,115,22,0.16)" : "1px solid rgba(17,24,39,0.07)",
        boxShadow: hovered ? "0 8px 24px rgba(15,23,42,0.08)" : "0 2px 8px rgba(15,23,42,0.03)",
        transition: "0.18s cubic-bezier(.2,.8,.2,1)",
        cursor: "pointer",
      }}
    >
      <Avatar name={user.full_name || ""} />

      {/* Name + email */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.88rem",
            fontWeight: 700,
            color: "#182033",
            letterSpacing: "-0.02em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: 1.3,
          }}
        >
          {user.full_name}
        </div>
        <div
          style={{
            fontSize: "0.74rem",
            color: "#737f91",
            fontWeight: 600,
            marginTop: "3px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user.email}
        </div>
      </div>

      {/* Position */}
      <div
        style={{
          fontSize: "0.82rem",
          fontWeight: 600,
          color: "#556174",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {user.position || "—"}
      </div>

      {/* Role */}
      <div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 11px",
            borderRadius: "999px",
            background: roleStyle.bg,
            color: roleStyle.color,
            border: `1px solid ${roleStyle.border}`,
            fontSize: "0.71rem",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          <ShieldCheck size={11} strokeWidth={2.5} />
          {user.role}
        </span>
      </div>

      {/* Status */}
      <div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 11px",
            borderRadius: "999px",
            background: statusStyle.bg,
            color: statusStyle.color,
            border: `1px solid ${statusStyle.border}`,
            fontSize: "0.71rem",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "999px",
              background: statusStyle.color,
            }}
          />
          {user.status}
        </span>
      </div>

      {/* Last active */}
      <div
        style={{
          fontSize: "0.78rem",
          color: "#556174",
          fontWeight: 600,
        }}
      >
        {formatUserDate(user.last_active_at)}
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: "5px",
          justifyContent: "flex-end",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.15s",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(user);
          }}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "9px",
            background: "white",
            border: "1px solid rgba(17,24,39,0.09)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#556174",
            boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
          }}
        >
          <Eye size={13} />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "9px",
            background: "white",
            border: "1px solid rgba(17,24,39,0.09)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#556174",
            boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
          }}
        >
          <Edit3 size={13} />
        </button>
      </div>
    </div>
  );
}

function PermissionsOverview() {
  const roles: UserRole[] = ["ADMIN", "MEMBER"];
  return (
    <div
      style={{
        borderRadius: "32px",
        background: "white",
        border: "1px solid rgba(17,24,39,0.08)",
        boxShadow: "0 18px 46px rgba(15,23,42,0.10)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "22px 28px",
          borderBottom: "1px solid rgba(17,24,39,0.07)",
          background:
            "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.06), transparent 16rem), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.72))",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#ea580c",
            fontSize: "0.73rem",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: "18px", height: "2px", borderRadius: "999px", background: "#f97316" }} />
          Access Control
        </div>
        <div
          style={{
            fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
            fontSize: "1.28rem",
            fontWeight: 700,
            color: "#182033",
            letterSpacing: "-0.045em",
            marginTop: "5px",
            lineHeight: 1,
          }}
        >
          Permissions Overview
        </div>
        <div style={{ color: "#556174", fontSize: "0.80rem", marginTop: "5px" }}>
          What each role can do across the Marketiv workspace
        </div>
      </div>

      <div
        className="grid grid-cols-[1fr_75px_75px] sm:grid-cols-[1fr_120px_120px] gap-2 sm:gap-[14px] px-4 sm:px-[28px] py-[12px] bg-[#f8fafc] border-b border-gray-900/5 items-center"
      >
        <div
          style={{
            fontSize: "0.68rem",
            fontWeight: 800,
            color: "#737f91",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
          }}
        >
          Permission
        </div>
        {roles.map((r) => {
          const rs = getRoleStyle(r);
          return (
            <div key={r} style={{ display: "flex", justifyContent: "center" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 11px",
                  borderRadius: "999px",
                  background: rs.bg,
                  color: rs.color,
                  border: `1px solid ${rs.border}`,
                  fontSize: "0.71rem",
                  fontWeight: 700,
                }}
              >
                <ShieldCheck size={11} strokeWidth={2.5} />
                {r === "ADMIN" ? "Admin" : "Member"}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "8px 16px 16px" }}>
        {PERMISSIONS.map((perm) => (
          <div
            key={perm.key}
            className="grid grid-cols-[1fr_75px_75px] sm:grid-cols-[1fr_120px_120px] gap-2 sm:gap-[14px] items-center px-2 sm:px-[12px] py-[13px] rounded-[14px]"
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.86rem",
                  fontWeight: 700,
                  color: "#182033",
                  letterSpacing: "-0.018em",
                }}
              >
                {perm.label}
              </div>
              <div
                style={{
                  fontSize: "0.74rem",
                  color: "#737f91",
                  fontWeight: 500,
                  marginTop: "2px",
                  lineHeight: 1.4,
                }}
              >
                {perm.description}
              </div>
            </div>
            {roles.map((r) => {
              const granted = ROLE_PERMISSIONS[r].includes(perm.key);
              return (
                <div key={r} style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "10px",
                      background: granted ? "rgba(22,163,74,0.10)" : "#f3f5f8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: granted ? "#16a34a" : "#a4adbb",
                    }}
                  >
                    {granted ? <Check size={15} strokeWidth={3} /> : <Minus size={15} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentUserActivity() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function loadActivities() {
      const { data } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(7);
      
      if (data) setActivities(data);
    }
    loadActivities();
  }, []);

  return (
    <div
      style={{
        borderRadius: "32px",
        background: "white",
        border: "1px solid rgba(17,24,39,0.08)",
        boxShadow: "0 18px 46px rgba(15,23,42,0.10)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "22px 28px",
          borderBottom: "1px solid rgba(17,24,39,0.07)",
          background:
            "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.06), transparent 16rem), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.72))",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#ea580c",
            fontSize: "0.73rem",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: "18px", height: "2px", borderRadius: "999px", background: "#f97316" }} />
          Audit
        </div>
        <div
          style={{
            fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
            fontSize: "1.28rem",
            fontWeight: 700,
            color: "#182033",
            letterSpacing: "-0.045em",
            marginTop: "5px",
            lineHeight: 1,
          }}
        >
          Recent Activity
        </div>
        <div style={{ color: "#556174", fontSize: "0.80rem", marginTop: "5px" }}>
          Latest member actions in the workspace
        </div>
      </div>

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {activities.map((act) => {
          return (
            <div
              key={act.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: "16px",
                border: "1px solid rgba(17,24,39,0.06)",
                background: "#fcfdfe",
              }}
            >
              <Avatar name={act.user_name || "Unknown"} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "0.84rem",
                      fontWeight: 700,
                      color: "#182033",
                      letterSpacing: "-0.018em",
                    }}
                  >
                    {act.user_name}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.79rem",
                    color: "#556174",
                    fontWeight: 500,
                    marginTop: "3px",
                    lineHeight: 1.35,
                  }}
                >
                  {act.action} - {act.entity_type}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "0.72rem",
                  color: "#737f91",
                  fontWeight: 600,
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                <Clock size={11} />
                {formatUserDate(act.created_at)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface UsersPageProps {
  onMenuClick?: () => void;
}

export function UsersPage({ onMenuClick }: UsersPageProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "All">("All");
  const [filterStatus, setFilterStatus] = useState<UserStatus | "All">("All");

  const loadUsers = async () => {
    setLoading(true);
    const { data } = await fetchUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
        (u.position && u.position.toLowerCase().includes(search.toLowerCase()));
      const matchRole = filterRole === "All" || u.role === filterRole;
      const matchStatus = filterStatus === "All" || u.status === filterStatus;
      return matchSearch && matchRole && matchStatus;
    });
  }, [search, filterRole, filterStatus, users]);

  const activeCount = getActiveCount(users);
  const adminCount = getAdminCount(users);
  const memberCount = getMemberCount(users);
  const invitedCount = getInvitedCount(users);

  const summaryCards = [
    {
      title: "Total Users",
      value: String(users.length),
      icon: UsersIcon,
      iconColor: "#ea580c",
      iconBg: "#fff7ed",
      badge: `${activeCount} active`,
      badgeColor: "#ea580c",
      badgeBg: "rgba(249,115,22,0.09)",
      note: "Across the workspace",
    },
    {
      title: "Administrators",
      value: String(adminCount),
      icon: ShieldCheck,
      iconColor: "#ea580c",
      iconBg: "#fff7ed",
      badge: "Full access",
      badgeColor: "#ea580c",
      badgeBg: "rgba(249,115,22,0.09)",
      note: "Can manage users & budgets",
    },
    {
      title: "Members",
      value: String(memberCount),
      icon: UserCheck,
      iconColor: "#2563eb",
      iconBg: "#eff6ff",
      badge: "Standard",
      badgeColor: "#2563eb",
      badgeBg: "rgba(37,99,235,0.09)",
      note: "Operational access",
    },
    {
      title: "Pending Invites",
      value: String(invitedCount),
      icon: Mail,
      iconColor: "#d97706",
      iconBg: "#fffbeb",
      badge: "Awaiting",
      badgeColor: "#d97706",
      badgeBg: "rgba(217,119,6,0.09)",
      note: "Invitation sent, not joined",
    },
  ];

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
      <TopNav title="User Management" subtitle="Roles, Access & Team Members" onMenuClick={onMenuClick} />

      <main className="flex-1 flex flex-col gap-4 md:gap-6 p-4 md:p-[28px_32px_48px]">
        {/* Hero Section */}
        <div
          className="relative overflow-hidden flex flex-wrap items-center justify-between gap-6 rounded-2xl md:rounded-[32px] p-5 md:p-[32px_34px] shadow-[0_22px_60px_rgba(12,23,43,0.28)]"
          style={{
            background:
              "radial-gradient(circle at 88% 0%, rgba(249,115,22,0.16), transparent 22rem), radial-gradient(circle at 6% 120%, rgba(37,99,235,0.10), transparent 20rem), linear-gradient(135deg, #0c172b, #15233d)",
          }}
        >
          <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "6px 13px",
                borderRadius: "999px",
                background: "rgba(249,115,22,0.16)",
                border: "1px solid rgba(249,115,22,0.30)",
                color: "#fdba74",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              <ShieldHalf size={12} strokeWidth={2.5} />
              Administration
            </div>
            <div
              style={{
                fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                fontSize: "1.85rem",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.05em",
                lineHeight: 1.05,
                marginTop: "14px",
              }}
            >
              Manage your team & access
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.58)",
                fontSize: "0.92rem",
                fontWeight: 500,
                marginTop: "8px",
                maxWidth: "440px",
                lineHeight: 1.5,
              }}
            >
              Invite members, assign roles, and control who can record transactions,
              manage budgets, and approve P2MW financial activity.
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "44px",
                  padding: "0 20px",
                  borderRadius: "13px",
                  background: "linear-gradient(180deg, #fb7a18 0%, #ea580c 100%)",
                  color: "white",
                  border: "1px solid rgba(194,65,12,0.30)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  boxShadow: "0 14px 30px rgba(234,88,12,0.32), inset 0 1px 0 rgba(255,255,255,0.20)",
                  letterSpacing: "-0.01em",
                }}
              >
                <UserPlus size={16} />
                Invite User
              </button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  height: "44px",
                  padding: "0 18px",
                  borderRadius: "13px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                }}
              >
                <UsersIcon size={15} style={{ color: "#fdba74" }} />
                {users.length} team members
              </div>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            {([
              { label: "Admins", count: adminCount, color: "#fb923c" },
              { label: "Members", count: memberCount, color: "#60a5fa" },
              { label: "Pending", count: invitedCount, color: "#fbbf24" },
            ] as const).map((t) => (
              <div
                key={t.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 18px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  minWidth: "180px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "32px",
                    borderRadius: "999px",
                    background: t.color,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: "1.4rem",
                      fontWeight: 800,
                      color: "white",
                      letterSpacing: "-0.05em",
                      lineHeight: 1,
                    }}
                  >
                    {t.count}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.50)",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      marginTop: "3px",
                    }}
                  >
                    {t.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[18px]">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                style={{
                  padding: "22px",
                  borderRadius: "28px",
                  background:
                    "radial-gradient(circle at 100% 0%, rgba(249,115,22,.06), transparent 12rem), linear-gradient(180deg, #ffffff, #fffdf9)",
                  border: "1px solid rgba(17,24,39,0.08)",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "15px",
                      background: card.iconBg,
                      border: `1px solid ${card.iconColor}22`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: card.iconColor,
                    }}
                  >
                    <Icon size={19} strokeWidth={2} />
                  </div>
                  <div
                    style={{
                      padding: "3px 9px",
                      borderRadius: "999px",
                      background: card.badgeBg,
                      color: card.badgeColor,
                      fontSize: "0.70rem",
                      fontWeight: 700,
                    }}
                  >
                    {card.badge}
                  </div>
                </div>
                <div style={{ color: "#737f91", fontSize: "0.79rem", fontWeight: 600 }}>
                  {card.title}
                </div>
                <div
                  style={{
                    fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                    fontSize: "2rem",
                    fontWeight: 800,
                    letterSpacing: "-0.055em",
                    lineHeight: 1,
                    marginTop: "5px",
                    color: "#182033",
                  }}
                >
                  {card.value}
                </div>
                <div style={{ marginTop: "7px", color: "#737f91", fontSize: "0.77rem" }}>
                  {card.note}
                </div>
              </div>
            );
          })}
        </div>

        {/* User Management Table */}
        <div
          style={{
            borderRadius: "32px",
            background: "white",
            border: "1px solid rgba(17,24,39,0.08)",
            boxShadow: "0 18px 46px rgba(15,23,42,0.10)",
            overflow: "hidden",
          }}
        >
          <div
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 md:p-[22px_28px]"
            style={{
              borderBottom: "1px solid rgba(17,24,39,0.07)",
              background:
                "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.06), transparent 16rem), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.72))",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#ea580c",
                  fontSize: "0.73rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                <div style={{ width: "18px", height: "2px", borderRadius: "999px", background: "#f97316" }} />
                Team Directory
              </div>
              <div
                style={{
                  fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                  fontSize: "1.28rem",
                  fontWeight: 700,
                  color: "#182033",
                  letterSpacing: "-0.045em",
                  marginTop: "5px",
                  lineHeight: 1,
                }}
              >
                All Users
              </div>
              <div style={{ color: "#556174", fontSize: "0.80rem", marginTop: "5px" }}>
                {filtered.length} of {users.length} members
                {filtered.length < users.length && " (filtered)"}
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
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
                boxShadow: "0 12px 28px rgba(234,88,12,0.22), inset 0 1px 0 rgba(255,255,255,0.20)",
                letterSpacing: "-0.01em",
                flexShrink: 0,
              }}
            >
              <UserPlus size={15} />
              Add User
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-[10px] p-4 md:p-[14px_20px] bg-[#fafbfc] border-b border-gray-900/5">
            <div
              className="flex items-center gap-[9px] w-full lg:flex-1 lg:max-w-[300px] h-[38px] px-[13px] rounded-[11px] bg-white border border-gray-900/10 shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
            >
              <Search size={14} className="text-[#737f91] shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, position..."
                className="bg-transparent border-none outline-none text-[#182033] text-[0.82rem] w-full p-0 h-auto min-h-auto shadow-none rounded-none"
              />
            </div>

            <div className="flex gap-[5px] overflow-x-auto hide-scrollbar pb-1 lg:pb-0">
              {(["All", "ADMIN", "MEMBER"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRole(r)}
                  style={{
                    height: "36px",
                    padding: "0 13px",
                    borderRadius: "10px",
                    border:
                      filterRole === r
                        ? "1px solid rgba(249,115,22,0.22)"
                        : "1px solid rgba(17,24,39,0.08)",
                    background: filterRole === r ? "rgba(255,247,237,0.8)" : "white",
                    color: filterRole === r ? "#ea580c" : "#556174",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "0.16s",
                  }}
                  className="shrink-0 whitespace-nowrap"
                >
                  {r === "ADMIN" ? "Admin" : r === "MEMBER" ? "Member" : "All"}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-auto lg:ml-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as UserStatus | "All")}
                style={{
                  height: "36px",
                  padding: "0 30px 0 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(17,24,39,0.09)",
                  background: "white",
                  color: filterStatus !== "All" ? "#182033" : "#556174",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  appearance: "none",
                  outline: "none",
                  boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
                  minHeight: "auto",
                }}
                className="w-full lg:w-auto"
              >
                {["All", "ACTIVE", "INVITED", "INACTIVE"].map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Statuses" : s === "ACTIVE" ? "Active" : s === "INVITED" ? "Invited" : "Inactive"}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#737f91] pointer-events-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto w-full pb-2">
            <div className="min-w-[1050px]">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "38px 1fr 150px 120px 110px 120px 80px",
                  gap: "14px",
                  padding: "10px 20px",
                  background: "#f8fafc",
                  borderBottom: "1px solid rgba(17,24,39,0.06)",
                }}
              >
                {["", "Member", "Position", "Role", "Status", "Last Active", ""].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      color: "#737f91",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>

              <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: "5px", minHeight: "200px" }}>
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="animate-spin text-orange-500" size={32} />
                  </div>
                ) : filtered.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      padding: "48px 24px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "18px",
                        background: "#fff7ed",
                        border: "1px solid rgba(249,115,22,0.16)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ea580c",
                      }}
                    >
                      <Search size={22} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.92rem",
                          fontWeight: 700,
                          color: "#182033",
                          letterSpacing: "-0.025em",
                        }}
                      >
                        No users found
                      </div>
                      <div style={{ color: "#737f91", fontSize: "0.82rem", marginTop: "4px" }}>
                        Try adjusting your search or filter criteria.
                      </div>
                    </div>
                  </div>
                ) : (
                  filtered.map((user) => (
                    <UserRow key={user.id} user={user} onSelect={setSelectedUser} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <PermissionsOverview />
          <RecentUserActivity />
        </div>
      </main>

      <UserDrawer 
        user={selectedUser} 
        onClose={() => {
          setSelectedUser(null);
          loadUsers(); // Refresh when drawer closes
        }} 
      />

      {showAddModal && (
        <AddUserModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
            setShowAddModal(false);
            loadUsers();
          }} 
        />
      )}
    </div>
  );
}
