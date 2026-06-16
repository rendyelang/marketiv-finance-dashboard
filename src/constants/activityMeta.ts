import {
  CreditCard,
  FileText,
  Edit3,
  UserPlus,
  Archive,
  Upload,
  Trash2,
  Activity,
  LucideIcon
} from "lucide-react";

export interface ActivityMetaItem {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  label: string;
  tagColor: string;
  tagBg: string;
  tag: string;
}

export const ACTION_META: Record<string, ActivityMetaItem> = {
  TRANSACTION_CREATED: {
    icon: CreditCard,
    iconColor: "#16a34a",
    iconBg: "#f0fdf4",
    iconBorder: "rgba(22,163,74,0.18)",
    label: "New Transaction",
    tagColor: "#16a34a",
    tagBg: "rgba(22,163,74,0.09)",
    tag: "Created",
  },
  TRANSACTION_UPDATED: {
    icon: Edit3,
    iconColor: "#2563eb",
    iconBg: "#eff6ff",
    iconBorder: "rgba(37,99,235,0.18)",
    label: "Transaction Updated",
    tagColor: "#2563eb",
    tagBg: "rgba(37,99,235,0.09)",
    tag: "Updated",
  },
  TRANSACTION_ARCHIVED: {
    icon: Archive,
    iconColor: "#d97706",
    iconBg: "#fffbeb",
    iconBorder: "rgba(217,119,6,0.18)",
    label: "Transaction Archived",
    tagColor: "#d97706",
    tagBg: "rgba(217,119,6,0.09)",
    tag: "Archived",
  },
  ATTACHMENT_UPLOADED: {
    icon: Upload,
    iconColor: "#ea580c",
    iconBg: "#fff7ed",
    iconBorder: "rgba(249,115,22,0.18)",
    label: "Attachment Uploaded",
    tagColor: "#ea580c",
    tagBg: "rgba(249,115,22,0.09)",
    tag: "Upload",
  },
  ATTACHMENT_DELETED: {
    icon: Trash2,
    iconColor: "#dc2626",
    iconBg: "#fef2f2",
    iconBorder: "rgba(220,38,38,0.18)",
    label: "Attachment Deleted",
    tagColor: "#dc2626",
    tagBg: "rgba(220,38,38,0.09)",
    tag: "Deleted",
  },
  BUDGET_ITEM_CREATED: {
    icon: FileText,
    iconColor: "#16a34a",
    iconBg: "#f0fdf4",
    iconBorder: "rgba(22,163,74,0.18)",
    label: "Budget Item Created",
    tagColor: "#16a34a",
    tagBg: "rgba(22,163,74,0.09)",
    tag: "Created",
  },
  BUDGET_ITEM_UPDATED: {
    icon: Edit3,
    iconColor: "#7c3aed",
    iconBg: "#f5f3ff",
    iconBorder: "rgba(124,58,237,0.18)",
    label: "Budget Item Updated",
    tagColor: "#7c3aed",
    tagBg: "rgba(124,58,237,0.09)",
    tag: "Updated",
  },
  BUDGET_ITEM_ARCHIVED: {
    icon: Archive,
    iconColor: "#d97706",
    iconBg: "#fffbeb",
    iconBorder: "rgba(217,119,6,0.18)",
    label: "Budget Item Archived",
    tagColor: "#d97706",
    tagBg: "rgba(217,119,6,0.09)",
    tag: "Archived",
  },
  USER_CREATED: {
    icon: UserPlus,
    iconColor: "#0ea5e9",
    iconBg: "#f0f9ff",
    iconBorder: "rgba(14,165,233,0.18)",
    label: "User Created",
    tagColor: "#0ea5e9",
    tagBg: "rgba(14,165,233,0.09)",
    tag: "Created",
  },
  USER_UPDATED: {
    icon: Edit3,
    iconColor: "#2563eb",
    iconBg: "#eff6ff",
    iconBorder: "rgba(37,99,235,0.18)",
    label: "User Updated",
    tagColor: "#2563eb",
    tagBg: "rgba(37,99,235,0.09)",
    tag: "Updated",
  },
};

export const DEFAULT_META: ActivityMetaItem = {
  icon: Activity,
  iconColor: "#556174",
  iconBg: "#f8fafc",
  iconBorder: "rgba(17,24,39,0.10)",
  label: "Activity",
  tagColor: "#556174",
  tagBg: "rgba(85,97,116,0.09)",
  tag: "Action",
};
