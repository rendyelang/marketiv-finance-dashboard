export type TransactionType = "Income" | "Expense";
export type TransactionStatus = "Draft" | "Completed" | "Archived";
export type FileType = "PDF" | "JPG" | "PNG" | "WEBP";
export type AttachmentCategory =
  | "Invoice"
  | "Receipt"
  | "Transfer Proof"
  | "Contract"
  | "Supporting Document"
  | "Other";

export interface Attachment {
  id: string;
  name: string;
  fileType: FileType;
  category: AttachmentCategory;
  size: string;
  uploadDate: string;
  uploadTime: string;
  uploadedBy: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  time: string;
  user: string;
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
  "Product Development & Research": {
    color: "#ea580c",
    bg: "#fff7ed",
    border: "rgba(249,115,22,0.20)",
  },
  Production: { color: "#2563eb", bg: "#eff6ff", border: "rgba(37,99,235,0.20)" },
  "Company Legalization": {
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "rgba(124,58,237,0.20)",
  },
  "HR Certification": { color: "#16a34a", bg: "#f0fdf4", border: "rgba(22,163,74,0.20)" },
  "Office Supplies & Support": {
    color: "#d97706",
    bg: "#fffbeb",
    border: "rgba(217,119,6,0.20)",
  },
};

export function getStatusStyle(status: TransactionStatus) {
  switch (status) {
    case "Completed":
      return {
        color: "#16a34a",
        bg: "rgba(22,163,74,0.09)",
        border: "rgba(22,163,74,0.22)",
        dot: "#16a34a",
      };
    case "Draft":
      return {
        color: "#d97706",
        bg: "rgba(217,119,6,0.09)",
        border: "rgba(217,119,6,0.22)",
        dot: "#d97706",
      };
    case "Archived":
      return {
        color: "#737f91",
        bg: "rgba(115,127,145,0.09)",
        border: "rgba(115,127,145,0.22)",
        dot: "#737f91",
      };
  }
}

export function formatRp(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export const transactions: Transaction[] = [
  {
    id: "TXN-001",
    date: "2026-06-01",
    type: "Income",
    description: "P2MW Program Funding Disbursement",
    category: "—",
    amount: 20_000_000,
    pic: "Admin",
    status: "Completed",
    notes:
      "Full P2MW 2025 funding disbursement. Received via bank transfer from program committee. Reference number: P2MW/2025/MKT/001.",
    attachments: [
      {
        id: "att-001-1",
        name: "Bukti Transfer P2MW.pdf",
        fileType: "PDF",
        category: "Transfer Proof",
        size: "245 KB",
        uploadDate: "2026-06-01",
        uploadTime: "09:18",
        uploadedBy: "Admin",
      },
      {
        id: "att-001-2",
        name: "Surat Penerimaan Dana.pdf",
        fileType: "PDF",
        category: "Contract",
        size: "182 KB",
        uploadDate: "2026-06-01",
        uploadTime: "09:22",
        uploadedBy: "Admin",
      },
    ],
    history: [
      {
        id: "h-001-1",
        date: "2026-06-01",
        time: "09:10",
        user: "Admin",
        action: "Transaction created",
      },
      {
        id: "h-001-2",
        date: "2026-06-01",
        time: "09:18",
        user: "Admin",
        action: "Attachment uploaded: Bukti Transfer P2MW.pdf",
      },
      {
        id: "h-001-3",
        date: "2026-06-01",
        time: "09:22",
        user: "Admin",
        action: "Attachment uploaded: Surat Penerimaan Dana.pdf",
      },
      {
        id: "h-001-4",
        date: "2026-06-01",
        time: "10:05",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-002",
    date: "2026-06-02",
    type: "Expense",
    description: "Web Application Development",
    category: "Product Development & Research",
    amount: 2_500_000,
    pic: "Ahmad Rizky",
    status: "Completed",
    notes:
      "Full payment for core platform MVP development. Contracted to freelance full-stack developer. Includes source code handover.",
    attachments: [
      {
        id: "att-002-1",
        name: "Invoice Web Dev.pdf",
        fileType: "PDF",
        category: "Invoice",
        size: "312 KB",
        uploadDate: "2026-06-02",
        uploadTime: "14:30",
        uploadedBy: "Ahmad Rizky",
      },
      {
        id: "att-002-2",
        name: "Bukti Transfer Dev.jpg",
        fileType: "JPG",
        category: "Transfer Proof",
        size: "1.2 MB",
        uploadDate: "2026-06-02",
        uploadTime: "14:35",
        uploadedBy: "Ahmad Rizky",
      },
    ],
    history: [
      {
        id: "h-002-1",
        date: "2026-06-02",
        time: "13:45",
        user: "Ahmad Rizky",
        action: "Transaction created",
      },
      {
        id: "h-002-2",
        date: "2026-06-02",
        time: "14:30",
        user: "Ahmad Rizky",
        action: "Attachment uploaded: Invoice Web Dev.pdf",
      },
      {
        id: "h-002-3",
        date: "2026-06-02",
        time: "14:35",
        user: "Ahmad Rizky",
        action: "Attachment uploaded: Bukti Transfer Dev.jpg",
      },
      {
        id: "h-002-4",
        date: "2026-06-02",
        time: "15:00",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-003",
    date: "2026-06-03",
    type: "Expense",
    description: "Domain Registration — marketiv.id",
    category: "Product Development & Research",
    amount: 300_000,
    pic: "Admin",
    status: "Completed",
    notes: "Annual domain registration for marketiv.id via Niagahoster. Expires June 2027.",
    attachments: [
      {
        id: "att-003-1",
        name: "Domain Invoice.pdf",
        fileType: "PDF",
        category: "Invoice",
        size: "156 KB",
        uploadDate: "2026-06-03",
        uploadTime: "10:15",
        uploadedBy: "Admin",
      },
    ],
    history: [
      { id: "h-003-1", date: "2026-06-03", time: "10:00", user: "Admin", action: "Transaction created" },
      {
        id: "h-003-2",
        date: "2026-06-03",
        time: "10:15",
        user: "Admin",
        action: "Attachment uploaded: Domain Invoice.pdf",
      },
      {
        id: "h-003-3",
        date: "2026-06-03",
        time: "10:20",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-004",
    date: "2026-06-03",
    type: "Expense",
    description: "Cloud Hosting — AWS/Vercel (6 months)",
    category: "Product Development & Research",
    amount: 600_000,
    pic: "Rendy",
    status: "Completed",
    notes:
      "6-month cloud hosting subscription. Covers June–November 2026. Includes server, CDN, and database.",
    attachments: [
      {
        id: "att-004-1",
        name: "AWS Invoice Jun–Nov.pdf",
        fileType: "PDF",
        category: "Invoice",
        size: "198 KB",
        uploadDate: "2026-06-03",
        uploadTime: "11:30",
        uploadedBy: "Rendy",
      },
    ],
    history: [
      { id: "h-004-1", date: "2026-06-03", time: "11:20", user: "Rendy", action: "Transaction created" },
      {
        id: "h-004-2",
        date: "2026-06-03",
        time: "11:30",
        user: "Rendy",
        action: "Attachment uploaded: AWS Invoice Jun–Nov.pdf",
      },
      {
        id: "h-004-3",
        date: "2026-06-03",
        time: "14:00",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-005",
    date: "2026-06-04",
    type: "Expense",
    description: "Market Research & Competitor Analysis",
    category: "Product Development & Research",
    amount: 700_000,
    pic: "Team",
    status: "Completed",
    notes:
      "Comprehensive market research covering key competitors, target segments, and market size analysis.",
    attachments: [
      {
        id: "att-005-1",
        name: "Market Research Report.pdf",
        fileType: "PDF",
        category: "Supporting Document",
        size: "2.4 MB",
        uploadDate: "2026-06-04",
        uploadTime: "16:00",
        uploadedBy: "Team",
      },
    ],
    history: [
      { id: "h-005-1", date: "2026-06-04", time: "09:00", user: "Team", action: "Transaction created" },
      {
        id: "h-005-2",
        date: "2026-06-04",
        time: "16:00",
        user: "Team",
        action: "Attachment uploaded: Market Research Report.pdf",
      },
      {
        id: "h-005-3",
        date: "2026-06-04",
        time: "17:00",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-006",
    date: "2026-06-05",
    type: "Expense",
    description: "Blog & Article Content Production (10 articles)",
    category: "Production",
    amount: 2_000_000,
    pic: "Sari",
    status: "Completed",
    notes:
      "10 articles produced for content marketing. Covers product features, use cases, and industry insights.",
    attachments: [
      {
        id: "att-006-1",
        name: "Content Invoice.pdf",
        fileType: "PDF",
        category: "Invoice",
        size: "287 KB",
        uploadDate: "2026-06-05",
        uploadTime: "13:00",
        uploadedBy: "Sari",
      },
    ],
    history: [
      { id: "h-006-1", date: "2026-06-05", time: "12:45", user: "Sari", action: "Transaction created" },
      {
        id: "h-006-2",
        date: "2026-06-05",
        time: "13:00",
        user: "Sari",
        action: "Attachment uploaded: Content Invoice.pdf",
      },
      {
        id: "h-006-3",
        date: "2026-06-05",
        time: "15:30",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-007",
    date: "2026-06-05",
    type: "Expense",
    description: "Brand Kit Design — Complete Visual Identity",
    category: "Production",
    amount: 1_500_000,
    pic: "Dini",
    status: "Completed",
    notes:
      "Complete brand identity package: logo, color system, typography, brand guidelines PDF, and social media templates.",
    attachments: [
      {
        id: "att-007-1",
        name: "Brand Kit Invoice.pdf",
        fileType: "PDF",
        category: "Invoice",
        size: "221 KB",
        uploadDate: "2026-06-05",
        uploadTime: "16:15",
        uploadedBy: "Dini",
      },
      {
        id: "att-007-2",
        name: "Brand Guidelines v1.pdf",
        fileType: "PDF",
        category: "Supporting Document",
        size: "5.6 MB",
        uploadDate: "2026-06-05",
        uploadTime: "16:22",
        uploadedBy: "Dini",
      },
    ],
    history: [
      { id: "h-007-1", date: "2026-06-05", time: "16:00", user: "Dini", action: "Transaction created" },
      {
        id: "h-007-2",
        date: "2026-06-05",
        time: "16:15",
        user: "Dini",
        action: "Attachment uploaded: Brand Kit Invoice.pdf",
      },
      {
        id: "h-007-3",
        date: "2026-06-05",
        time: "16:22",
        user: "Dini",
        action: "Attachment uploaded: Brand Guidelines v1.pdf",
      },
      {
        id: "h-007-4",
        date: "2026-06-05",
        time: "17:00",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-008",
    date: "2026-06-06",
    type: "Expense",
    description: "Product Demo Video Production (2 videos)",
    category: "Production",
    amount: 1_000_000,
    pic: "Tim Media",
    status: "Completed",
    notes:
      "Two product demonstration videos: 1-minute platform overview and 3-minute investor demo.",
    attachments: [
      {
        id: "att-008-1",
        name: "Video Production Invoice.pdf",
        fileType: "PDF",
        category: "Invoice",
        size: "178 KB",
        uploadDate: "2026-06-06",
        uploadTime: "11:00",
        uploadedBy: "Tim Media",
      },
    ],
    history: [
      {
        id: "h-008-1",
        date: "2026-06-06",
        time: "10:45",
        user: "Tim Media",
        action: "Transaction created",
      },
      {
        id: "h-008-2",
        date: "2026-06-06",
        time: "11:00",
        user: "Tim Media",
        action: "Attachment uploaded: Video Production Invoice.pdf",
      },
      {
        id: "h-008-3",
        date: "2026-06-06",
        time: "14:00",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-009",
    date: "2026-06-07",
    type: "Expense",
    description: "Business Permit Registration (NIB)",
    category: "Company Legalization",
    amount: 500_000,
    pic: "Admin",
    status: "Completed",
    notes: "Business Identification Number (NIB) registration via OSS system. Required for P2MW reporting.",
    attachments: [
      {
        id: "att-009-1",
        name: "NIB Certificate.pdf",
        fileType: "PDF",
        category: "Supporting Document",
        size: "445 KB",
        uploadDate: "2026-06-07",
        uploadTime: "14:00",
        uploadedBy: "Admin",
      },
    ],
    history: [
      {
        id: "h-009-1",
        date: "2026-06-07",
        time: "13:30",
        user: "Admin",
        action: "Transaction created",
      },
      {
        id: "h-009-2",
        date: "2026-06-07",
        time: "14:00",
        user: "Admin",
        action: "Attachment uploaded: NIB Certificate.pdf",
      },
      {
        id: "h-009-3",
        date: "2026-06-07",
        time: "14:30",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-010",
    date: "2026-06-08",
    type: "Expense",
    description: "PT Registration & Notary Fee",
    category: "Company Legalization",
    amount: 1_000_000,
    pic: "Admin",
    status: "Completed",
    notes: "Company establishment (PT) registration. Notary and legal consultant fees included.",
    attachments: [
      {
        id: "att-010-1",
        name: "Akta Pendirian PT.pdf",
        fileType: "PDF",
        category: "Contract",
        size: "892 KB",
        uploadDate: "2026-06-08",
        uploadTime: "15:00",
        uploadedBy: "Admin",
      },
      {
        id: "att-010-2",
        name: "Invoice Notaris.pdf",
        fileType: "PDF",
        category: "Invoice",
        size: "156 KB",
        uploadDate: "2026-06-08",
        uploadTime: "15:05",
        uploadedBy: "Admin",
      },
    ],
    history: [
      {
        id: "h-010-1",
        date: "2026-06-08",
        time: "14:30",
        user: "Admin",
        action: "Transaction created",
      },
      {
        id: "h-010-2",
        date: "2026-06-08",
        time: "15:00",
        user: "Admin",
        action: "Attachment uploaded: Akta Pendirian PT.pdf",
      },
      {
        id: "h-010-3",
        date: "2026-06-08",
        time: "15:05",
        user: "Admin",
        action: "Attachment uploaded: Invoice Notaris.pdf",
      },
      {
        id: "h-010-4",
        date: "2026-06-08",
        time: "16:00",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-011",
    date: "2026-06-08",
    type: "Expense",
    description: "NPWP Badan Registration",
    category: "Company Legalization",
    amount: 500_000,
    pic: "Admin",
    status: "Completed",
    notes: "Corporate tax ID (NPWP Badan) registration at KPP Pratama tax office.",
    attachments: [
      {
        id: "att-011-1",
        name: "NPWP Card.pdf",
        fileType: "PDF",
        category: "Supporting Document",
        size: "233 KB",
        uploadDate: "2026-06-08",
        uploadTime: "16:30",
        uploadedBy: "Admin",
      },
    ],
    history: [
      {
        id: "h-011-1",
        date: "2026-06-08",
        time: "16:00",
        user: "Admin",
        action: "Transaction created",
      },
      {
        id: "h-011-2",
        date: "2026-06-08",
        time: "16:30",
        user: "Admin",
        action: "Attachment uploaded: NPWP Card.pdf",
      },
      {
        id: "h-011-3",
        date: "2026-06-08",
        time: "17:00",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-012",
    date: "2026-06-09",
    type: "Expense",
    description: "Digital Marketing Certification (2 persons)",
    category: "HR Certification",
    amount: 600_000,
    pic: "Sari, Dini",
    status: "Completed",
    notes: "Google Ads and Meta Business certifications for 2 team members. Sari and Dini.",
    attachments: [
      {
        id: "att-012-1",
        name: "DM Cert Receipt.pdf",
        fileType: "PDF",
        category: "Receipt",
        size: "198 KB",
        uploadDate: "2026-06-09",
        uploadTime: "11:00",
        uploadedBy: "Sari",
      },
      {
        id: "att-012-2",
        name: "Google Cert — Sari.pdf",
        fileType: "PDF",
        category: "Supporting Document",
        size: "456 KB",
        uploadDate: "2026-06-10",
        uploadTime: "09:00",
        uploadedBy: "Sari",
      },
    ],
    history: [
      { id: "h-012-1", date: "2026-06-09", time: "10:30", user: "Sari", action: "Transaction created" },
      {
        id: "h-012-2",
        date: "2026-06-09",
        time: "11:00",
        user: "Sari",
        action: "Attachment uploaded: DM Cert Receipt.pdf",
      },
      {
        id: "h-012-3",
        date: "2026-06-10",
        time: "09:00",
        user: "Sari",
        action: "Attachment uploaded: Google Cert — Sari.pdf",
      },
      {
        id: "h-012-4",
        date: "2026-06-10",
        time: "10:00",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-013",
    date: "2026-06-10",
    type: "Expense",
    description: "UI/UX Design Workshop",
    category: "HR Certification",
    amount: 600_000,
    pic: "Tim",
    status: "Completed",
    notes: "Full-day UI/UX design workshop. Covers wireframing, prototyping, and user research methods.",
    attachments: [
      {
        id: "att-013-1",
        name: "Workshop Invoice.pdf",
        fileType: "PDF",
        category: "Invoice",
        size: "167 KB",
        uploadDate: "2026-06-10",
        uploadTime: "18:00",
        uploadedBy: "Tim",
      },
    ],
    history: [
      { id: "h-013-1", date: "2026-06-10", time: "17:30", user: "Tim", action: "Transaction created" },
      {
        id: "h-013-2",
        date: "2026-06-10",
        time: "18:00",
        user: "Tim",
        action: "Attachment uploaded: Workshop Invoice.pdf",
      },
      {
        id: "h-013-3",
        date: "2026-06-10",
        time: "18:30",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-014",
    date: "2026-06-11",
    type: "Expense",
    description: "Stationery & Office Supplies",
    category: "Office Supplies & Support",
    amount: 300_000,
    pic: "Admin",
    status: "Completed",
    notes: "Office stationery: pens, paper, folders, sticky notes. Purchased at Gramedia Merdeka.",
    attachments: [
      {
        id: "att-014-1",
        name: "Struk Gramedia.jpg",
        fileType: "JPG",
        category: "Receipt",
        size: "987 KB",
        uploadDate: "2026-06-11",
        uploadTime: "12:00",
        uploadedBy: "Admin",
      },
    ],
    history: [
      {
        id: "h-014-1",
        date: "2026-06-11",
        time: "11:45",
        user: "Admin",
        action: "Transaction created",
      },
      {
        id: "h-014-2",
        date: "2026-06-11",
        time: "12:00",
        user: "Admin",
        action: "Attachment uploaded: Struk Gramedia.jpg",
      },
      {
        id: "h-014-3",
        date: "2026-06-11",
        time: "13:00",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-015",
    date: "2026-06-11",
    type: "Expense",
    description: "Printing & Document Materials",
    category: "Office Supplies & Support",
    amount: 200_000,
    pic: "Admin",
    status: "Completed",
    notes: "Printing of company letterheads, brochures, proposal templates, and internal documents.",
    attachments: [
      {
        id: "att-015-1",
        name: "Bukti Print.jpg",
        fileType: "JPG",
        category: "Receipt",
        size: "756 KB",
        uploadDate: "2026-06-11",
        uploadTime: "14:30",
        uploadedBy: "Admin",
      },
    ],
    history: [
      {
        id: "h-015-1",
        date: "2026-06-11",
        time: "14:15",
        user: "Admin",
        action: "Transaction created",
      },
      {
        id: "h-015-2",
        date: "2026-06-11",
        time: "14:30",
        user: "Admin",
        action: "Attachment uploaded: Bukti Print.jpg",
      },
      {
        id: "h-015-3",
        date: "2026-06-11",
        time: "15:00",
        user: "Admin",
        action: "Status changed to Completed",
      },
    ],
  },
  {
    id: "TXN-016",
    date: "2026-06-12",
    type: "Expense",
    description: "Social Media Advertising Campaign",
    category: "Production",
    amount: 500_000,
    pic: "Admin",
    status: "Draft",
    notes:
      "Planned Instagram & TikTok advertising campaign for product launch. Draft — awaiting completion before execution.",
    attachments: [],
    history: [
      {
        id: "h-016-1",
        date: "2026-06-12",
        time: "09:00",
        user: "Admin",
        action: "Transaction created as Draft",
      },
    ],
  },
  {
    id: "TXN-017",
    date: "2026-06-12",
    type: "Expense",
    description: "Brand Trademark Registration (DJKI)",
    category: "Company Legalization",
    amount: 500_000,
    pic: "Admin",
    status: "Draft",
    notes: "Brand trademark registration at DJKI for Marketiv brand protection. Pending document preparation.",
    attachments: [],
    history: [
      {
        id: "h-017-1",
        date: "2026-06-12",
        time: "10:30",
        user: "Admin",
        action: "Transaction created as Draft",
      },
    ],
  },
  {
    id: "TXN-018",
    date: "2026-05-20",
    type: "Expense",
    description: "Research Equipment Purchase (Cancelled)",
    category: "Product Development & Research",
    amount: 350_000,
    pic: "Team",
    status: "Archived",
    notes:
      "Transaction archived. Equipment purchase was cancelled after budget reallocation to cloud infrastructure. No funds disbursed.",
    attachments: [
      {
        id: "att-018-1",
        name: "Cancelled PO.pdf",
        fileType: "PDF",
        category: "Supporting Document",
        size: "88 KB",
        uploadDate: "2026-05-20",
        uploadTime: "11:00",
        uploadedBy: "Team",
      },
    ],
    history: [
      {
        id: "h-018-1",
        date: "2026-05-20",
        time: "10:00",
        user: "Team",
        action: "Transaction created",
      },
      {
        id: "h-018-2",
        date: "2026-05-20",
        time: "11:00",
        user: "Team",
        action: "Attachment uploaded: Cancelled PO.pdf",
      },
      {
        id: "h-018-3",
        date: "2026-05-28",
        time: "15:30",
        user: "Admin",
        action: "Transaction archived — budget reallocation to cloud infrastructure",
      },
    ],
  },
  {
    id: "TXN-019",
    date: "2026-05-10",
    type: "Expense",
    description: "Office Furniture (Replaced by ATK)",
    category: "Office Supplies & Support",
    amount: 1_200_000,
    pic: "Admin",
    status: "Archived",
    notes:
      "Originally planned for office furniture. Archived after scope change — budget reallocated to operational support items.",
    attachments: [],
    history: [
      {
        id: "h-019-1",
        date: "2026-05-10",
        time: "09:30",
        user: "Admin",
        action: "Transaction created",
      },
      {
        id: "h-019-2",
        date: "2026-05-15",
        time: "16:00",
        user: "Admin",
        action: "Transaction archived — scope change, budget reallocated",
      },
    ],
  },
];

export function getTotalIncome(): number {
  return transactions
    .filter((t) => t.type === "Income" && t.status === "Completed")
    .reduce((s, t) => s + t.amount, 0);
}

export function getTotalExpenses(): number {
  return transactions
    .filter((t) => t.type === "Expense" && t.status === "Completed")
    .reduce((s, t) => s + t.amount, 0);
}

export function getNetBalance(): number {
  return getTotalIncome() - getTotalExpenses();
}

export function getArchivedCount(): number {
  return transactions.filter((t) => t.status === "Archived").length;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
