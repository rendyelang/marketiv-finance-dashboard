import type { UserProfile } from "../../../services/user.service";
export type { UserProfile } from "../../../services/user.service";

export type UserRole = "ADMIN" | "MEMBER";
export type UserStatus = "ACTIVE" | "INVITED" | "INACTIVE";

/* ── Role visual styling (matches Marketiv palette) ── */
export function getRoleStyle(role: string) {
  switch (role) {
    case "ADMIN":
      return {
        color: "#ea580c",
        bg: "#fff7ed",
        border: "rgba(249,115,22,0.22)",
      };
    case "MEMBER":
    default:
      return {
        color: "#2563eb",
        bg: "#eff6ff",
        border: "rgba(37,99,235,0.20)",
      };
  }
}

/* ── Status visual styling ── */
export function getUserStatusStyle(status: string) {
  switch (status) {
    case "ACTIVE":
      return {
        color: "#16a34a",
        bg: "rgba(22,163,74,0.09)",
        border: "rgba(22,163,74,0.22)",
      };
    case "INVITED":
      return {
        color: "#d97706",
        bg: "rgba(217,119,6,0.09)",
        border: "rgba(217,119,6,0.22)",
      };
    case "INACTIVE":
    default:
      return {
        color: "#737f91",
        bg: "rgba(115,127,145,0.09)",
        border: "rgba(115,127,145,0.22)",
      };
  }
}


/* ── Permission catalogue ── */
export interface PermissionDef {
  key: string;
  label: string;
  description: string;
}

export const PERMISSIONS: PermissionDef[] = [
  {
    key: "manage_transactions",
    label: "Manage Transactions",
    description: "Create, edit, and submit financial transactions",
  },
  {
    key: "manage_rab",
    label: "Manage RAB / Budget",
    description: "Create and adjust budget line items and categories",
  },
  {
    key: "approve_verify",
    label: "Approve & Verify",
    description: "Verify transactions and approve budget realization",
  },
  {
    key: "view_reports",
    label: "View Reports",
    description: "Access dashboards, reports, and the audit trail",
  },
  {
    key: "manage_users",
    label: "Manage Users",
    description: "Invite members and assign roles & permissions",
  },
  {
    key: "export_data",
    label: "Export Data",
    description: "Export financial records and P2MW accountability files",
  },
];

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: PERMISSIONS.map((p) => p.key),
  MEMBER: ["manage_transactions", "manage_rab", "view_reports"],
};



export function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatUserDate(dateStr: string | null): string {
  if (!dateStr || dateStr === "—") return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("id-ID", { 
    day: "numeric", 
    month: "short", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).replace(/\./g, ":"); // Use colon instead of dot for time format
}

export function getActiveCount(usersList: UserProfile[]): number {
  return usersList.filter((u) => u.status === "ACTIVE").length;
}

export function getAdminCount(usersList: UserProfile[]): number {
  return usersList.filter((u) => u.role === "ADMIN").length;
}

export function getMemberCount(usersList: UserProfile[]): number {
  return usersList.filter((u) => u.role === "MEMBER").length;
}

export function getInvitedCount(usersList: UserProfile[]): number {
  return usersList.filter((u) => u.status === "INVITED").length;
}
