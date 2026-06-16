import { TransactionWithRelations } from "../../services/transaction.service";

export type TransactionType = "Income" | "Expense";
export type TransactionStatus = "Draft" | "Completed" | "Archived";
export type FileType = "PDF" | "JPG" | "PNG" | "WEBP";

export interface Attachment {
  id: string;
  name: string;
  fileUrl: string;
  uploadDate: string;
  uploadTime: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  time: string;
  action: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  category: string;
  amount: number;
  pic: string;
  status: TransactionStatus;
  notes: string;
  attachments: Attachment[];
  history: HistoryItem[];
}

export const CATEGORY_MAP: Record<string, { color: string; bg: string; border: string }> = {
  "Pengembangan Produk/Riset": { color: "#ea580c", bg: "#fff7ed", border: "rgba(249,115,22,0.20)" },
  "Produksi": { color: "#2563eb", bg: "#eff6ff", border: "rgba(37,99,235,0.20)" },
  "Legalitas, Perizinan, Sertifikasi": { color: "#7c3aed", bg: "#f5f3ff", border: "rgba(124,58,237,0.20)" },
  "Peningkatan Kompetensi SDM Bersertifikasi": { color: "#16a34a", bg: "#f0fdf4", border: "rgba(22,163,74,0.20)" },
  "ATK dan Penunjang": { color: "#d97706", bg: "#fffbeb", border: "rgba(217,119,6,0.20)" },
};

export function getStatusStyle(status: TransactionStatus) {
  switch (status) {
    case "Completed":
    case "COMPLETED":
      return { color: "#16a34a", bg: "rgba(22,163,74,0.09)", border: "rgba(22,163,74,0.22)", dot: "#16a34a" };
    case "Draft":
    case "PLANNED":
    case "IN_PROGRESS":
      return { color: "#d97706", bg: "rgba(217,119,6,0.09)", border: "rgba(217,119,6,0.22)", dot: "#d97706" };
    case "Archived":
      return { color: "#737f91", bg: "rgba(115,127,145,0.09)", border: "rgba(115,127,145,0.22)", dot: "#737f91" };
    default:
      return { color: "#556174", bg: "rgba(17,24,39,0.05)", border: "rgba(17,24,39,0.1)", dot: "#556174" };
  }
}

export function formatRp(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// Convert DB relations to frontend model
export function mapDBTransactionToFrontend(dbTx: TransactionWithRelations): Transaction {
  const attachments: Attachment[] = (dbTx.attachments || []).map(att => {
    const d = new Date(att.uploaded_at);
    return {
      id: att.id,
      name: att.file_name,
      fileUrl: att.file_url,
      uploadDate: d.toLocaleDateString("en-CA"), // YYYY-MM-DD
      uploadTime: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  });

  const history: HistoryItem[] = (dbTx.activity_logs || []).map(log => {
    const d = new Date(log.created_at);
    return {
      id: log.id,
      date: d.toLocaleDateString("en-CA"),
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      action: log.action,
    };
  });

  return {
    id: dbTx.id,
    date: dbTx.date,
    type: (dbTx.type as TransactionType) || "Expense",
    description: dbTx.description,
    category: dbTx.budget_items?.budget_activities?.budget_categories?.name || "—",
    amount: dbTx.amount,
    pic: dbTx.person_in_charge,
    status: (dbTx.status as TransactionStatus) || "Draft",
    notes: dbTx.notes || "",
    attachments,
    history,
  };
}
