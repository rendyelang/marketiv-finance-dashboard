export type UserRole = "Admin" | "Member";
export type UserStatus = "Active" | "Invited" | "Inactive";

export interface UserActivityItem {
  id: string;
  date: string;
  time: string;
  action: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  position: string;
  joinDate: string;
  lastActive: string;
  txnCount: number;
  permissionKeys: string[];
  history: UserActivityItem[];
}

/* ── Role visual styling (matches Marketiv palette) ── */
export function getRoleStyle(role: UserRole) {
  switch (role) {
    case "Admin":
      return {
        color: "#ea580c",
        bg: "#fff7ed",
        border: "rgba(249,115,22,0.22)",
      };
    case "Member":
      return {
        color: "#2563eb",
        bg: "#eff6ff",
        border: "rgba(37,99,235,0.20)",
      };
  }
}

/* ── Status visual styling ── */
export function getUserStatusStyle(status: UserStatus) {
  switch (status) {
    case "Active":
      return {
        color: "#16a34a",
        bg: "rgba(22,163,74,0.09)",
        border: "rgba(22,163,74,0.22)",
      };
    case "Invited":
      return {
        color: "#d97706",
        bg: "rgba(217,119,6,0.09)",
        border: "rgba(217,119,6,0.22)",
      };
    case "Inactive":
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

/* Role → default permission set */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  Admin: PERMISSIONS.map((p) => p.key),
  Member: ["manage_transactions", "manage_rab", "view_reports"],
};

export const users: AppUser[] = [
  {
    id: "USR-001",
    name: "Admin User",
    email: "admin@marketiv.id",
    role: "Admin",
    status: "Active",
    position: "Treasurer · P2MW",
    joinDate: "2026-05-01",
    lastActive: "2026-06-14",
    txnCount: 9,
    permissionKeys: ROLE_PERMISSIONS.Admin,
    history: [
      { id: "ua-001-1", date: "2026-06-14", time: "08:42", action: "Verified transaction TXN-013" },
      { id: "ua-001-2", date: "2026-06-12", time: "10:30", action: "Created budget item in Company Legalization" },
      { id: "ua-001-3", date: "2026-06-01", time: "09:10", action: "Recorded P2MW funding disbursement" },
      { id: "ua-001-4", date: "2026-05-01", time: "08:00", action: "Account created · assigned Admin role" },
    ],
  },
  {
    id: "USR-002",
    name: "Ahmad Rizky",
    email: "ahmad.rizky@marketiv.id",
    role: "Member",
    status: "Active",
    position: "Lead Developer",
    joinDate: "2026-05-03",
    lastActive: "2026-06-13",
    txnCount: 2,
    permissionKeys: ROLE_PERMISSIONS.Member,
    history: [
      { id: "ua-002-1", date: "2026-06-02", time: "13:45", action: "Created transaction TXN-002" },
      { id: "ua-002-2", date: "2026-06-02", time: "14:30", action: "Uploaded invoice — Web Dev" },
      { id: "ua-002-3", date: "2026-05-03", time: "09:20", action: "Account created · assigned Member role" },
    ],
  },
  {
    id: "USR-003",
    name: "Sari Putri",
    email: "sari.putri@marketiv.id",
    role: "Member",
    status: "Active",
    position: "Marketing & Content",
    joinDate: "2026-05-05",
    lastActive: "2026-06-12",
    txnCount: 3,
    permissionKeys: ROLE_PERMISSIONS.Member,
    history: [
      { id: "ua-003-1", date: "2026-06-09", time: "10:30", action: "Created transaction TXN-012" },
      { id: "ua-003-2", date: "2026-06-05", time: "12:45", action: "Created transaction TXN-006" },
      { id: "ua-003-3", date: "2026-05-05", time: "11:00", action: "Account created · assigned Member role" },
    ],
  },
  {
    id: "USR-004",
    name: "Dini Lestari",
    email: "dini.lestari@marketiv.id",
    role: "Member",
    status: "Active",
    position: "Brand & Design",
    joinDate: "2026-05-05",
    lastActive: "2026-06-11",
    txnCount: 2,
    permissionKeys: ROLE_PERMISSIONS.Member,
    history: [
      { id: "ua-004-1", date: "2026-06-05", time: "16:00", action: "Created transaction TXN-007" },
      { id: "ua-004-2", date: "2026-06-05", time: "16:22", action: "Uploaded Brand Guidelines v1" },
      { id: "ua-004-3", date: "2026-05-05", time: "11:05", action: "Account created · assigned Member role" },
    ],
  },
  {
    id: "USR-005",
    name: "Rendy Saputra",
    email: "rendy.saputra@marketiv.id",
    role: "Admin",
    status: "Active",
    position: "Co-Founder · Operations",
    joinDate: "2026-05-02",
    lastActive: "2026-06-10",
    txnCount: 1,
    permissionKeys: ROLE_PERMISSIONS.Admin,
    history: [
      { id: "ua-005-1", date: "2026-06-03", time: "11:20", action: "Created transaction TXN-004" },
      { id: "ua-005-2", date: "2026-06-03", time: "11:30", action: "Uploaded AWS invoice" },
      { id: "ua-005-3", date: "2026-05-02", time: "10:15", action: "Account created · assigned Admin role" },
    ],
  },
  {
    id: "USR-006",
    name: "Bayu Nugroho",
    email: "bayu.nugroho@marketiv.id",
    role: "Member",
    status: "Invited",
    position: "Finance Assistant",
    joinDate: "2026-06-13",
    lastActive: "—",
    txnCount: 0,
    permissionKeys: ROLE_PERMISSIONS.Member,
    history: [
      { id: "ua-006-1", date: "2026-06-13", time: "15:30", action: "Invitation sent by Admin User" },
    ],
  },
  {
    id: "USR-007",
    name: "Maya Anggraini",
    email: "maya.anggraini@marketiv.id",
    role: "Member",
    status: "Inactive",
    position: "Former Media Team",
    joinDate: "2026-05-08",
    lastActive: "2026-05-28",
    txnCount: 1,
    permissionKeys: ["view_reports"],
    history: [
      { id: "ua-007-1", date: "2026-05-28", time: "15:30", action: "Account deactivated by Admin User" },
      { id: "ua-007-2", date: "2026-06-06", time: "10:45", action: "Created transaction TXN-008" },
      { id: "ua-007-3", date: "2026-05-08", time: "09:30", action: "Account created · assigned Member role" },
    ],
  },
];

/* ── Aggregate workspace activity (newest first) ── */
export interface WorkspaceActivity {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  date: string;
  time: string;
  action: string;
}

export const workspaceActivity: WorkspaceActivity[] = [
  { id: "wa-1", userId: "USR-001", userName: "Admin User", role: "Admin", date: "2026-06-14", time: "08:42", action: "Verified transaction TXN-013" },
  { id: "wa-2", userId: "USR-006", userName: "Bayu Nugroho", role: "Member", date: "2026-06-13", time: "15:30", action: "Was invited to the workspace" },
  { id: "wa-3", userId: "USR-002", userName: "Ahmad Rizky", role: "Member", date: "2026-06-13", time: "11:12", action: "Logged in to the dashboard" },
  { id: "wa-4", userId: "USR-001", userName: "Admin User", role: "Admin", date: "2026-06-12", time: "10:30", action: "Created budget item in Company Legalization" },
  { id: "wa-5", userId: "USR-003", userName: "Sari Putri", role: "Member", date: "2026-06-12", time: "09:05", action: "Updated profile information" },
  { id: "wa-6", userId: "USR-004", userName: "Dini Lestari", role: "Member", date: "2026-06-11", time: "16:48", action: "Exported brand budget report" },
  { id: "wa-7", userId: "USR-005", userName: "Rendy Saputra", role: "Admin", date: "2026-06-10", time: "14:20", action: "Approved budget realization for Production" },
];

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatUserDate(dateStr: string): string {
  if (!dateStr || dateStr === "—") return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function getActiveCount(): number {
  return users.filter((u) => u.status === "Active").length;
}

export function getAdminCount(): number {
  return users.filter((u) => u.role === "Admin").length;
}

export function getMemberCount(): number {
  return users.filter((u) => u.role === "Member").length;
}

export function getInvitedCount(): number {
  return users.filter((u) => u.status === "Invited").length;
}
