export type ApprovalStatus = "Planned" | "In Progress" | "Completed";

export interface RABItem {
  id: string;
  mainActivity: string;
  activity: string;
  itemType: string;
  qty: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  targetOutput: string;
  pic: string;
  status: ApprovalStatus;
  usedAmount: number;
  justification: string;
}

export interface RABCategory {
  id: string;
  name: string;
  budget: number;
  color: string;
  lightColor: string;
  borderColor: string;
  items: RABItem[];
}

export const rabCategories: RABCategory[] = [
  {
    id: "proddev",
    name: "Product Development & Research",
    budget: 8_000_000,
    color: "#f97316",
    lightColor: "#fff7ed",
    borderColor: "rgba(249,115,22,0.18)",
    items: [
      {
        id: "pd-1",
        mainActivity: "Application Development",
        activity: "Web Application Development",
        itemType: "Service",
        qty: 1,
        unit: "lot",
        unitPrice: 2_500_000,
        totalAmount: 2_500_000,
        targetOutput: "Platform MVP",
        pic: "Ahmad Rizky",
        status: "Completed",
        usedAmount: 2_500_000,
        justification: "Core platform development",
      },
      {
        id: "pd-2",
        mainActivity: "Application Development",
        activity: "Cloud Hosting (12 months)",
        itemType: "Subscription",
        qty: 12,
        unit: "month",
        unitPrice: 100_000,
        totalAmount: 1_200_000,
        targetOutput: "99.9% Uptime",
        pic: "Rendy",
        status: "Completed",
        usedAmount: 600_000,
        justification: "AWS/Vercel infrastructure",
      },
      {
        id: "pd-3",
        mainActivity: "Research",
        activity: "Domain Registration (1 year)",
        itemType: "Subscription",
        qty: 1,
        unit: "year",
        unitPrice: 300_000,
        totalAmount: 300_000,
        targetOutput: "marketiv.id domain",
        pic: "Admin",
        status: "Completed",
        usedAmount: 300_000,
        justification: "Custom domain setup",
      },
      {
        id: "pd-4",
        mainActivity: "AI Development",
        activity: "AI API Integration (6 months)",
        itemType: "Service",
        qty: 6,
        unit: "month",
        unitPrice: 300_000,
        totalAmount: 1_800_000,
        targetOutput: "AI Features Live",
        pic: "Ahmad Rizky",
        status: "Planned",
        usedAmount: 0,
        justification: "OpenAI GPT-4 API access",
      },
      {
        id: "pd-5",
        mainActivity: "Research",
        activity: "Market Research & Analysis",
        itemType: "Report",
        qty: 1,
        unit: "lot",
        unitPrice: 700_000,
        totalAmount: 700_000,
        targetOutput: "Research Document",
        pic: "Team",
        status: "Completed",
        usedAmount: 700_000,
        justification: "Competitor & market analysis",
      },
      {
        id: "pd-6",
        mainActivity: "Research",
        activity: "Research Equipment",
        itemType: "Equipment",
        qty: 3,
        unit: "unit",
        unitPrice: 500_000,
        totalAmount: 1_500_000,
        targetOutput: "Prototype testing kit",
        pic: "Team",
        status: "Planned",
        usedAmount: 0,
        justification: "R&D equipment support",
      },
    ],
  },
  {
    id: "production",
    name: "Production",
    budget: 5_000_000,
    color: "#2563eb",
    lightColor: "#eff6ff",
    borderColor: "rgba(37,99,235,0.18)",
    items: [
      {
        id: "pr-1",
        mainActivity: "Content Production",
        activity: "Blog & Article Writing",
        itemType: "Service",
        qty: 10,
        unit: "article",
        unitPrice: 200_000,
        totalAmount: 2_000_000,
        targetOutput: "10 Published Articles",
        pic: "Sari",
        status: "Completed",
        usedAmount: 2_000_000,
        justification: "Content marketing strategy",
      },
      {
        id: "pr-2",
        mainActivity: "Marketing Materials",
        activity: "Brand Kit Design",
        itemType: "Design",
        qty: 1,
        unit: "lot",
        unitPrice: 1_500_000,
        totalAmount: 1_500_000,
        targetOutput: "Complete Brand Kit",
        pic: "Dini",
        status: "Completed",
        usedAmount: 1_500_000,
        justification: "Visual brand identity assets",
      },
      {
        id: "pr-3",
        mainActivity: "Video Production",
        activity: "Product Demo Videos",
        itemType: "Service",
        qty: 2,
        unit: "video",
        unitPrice: 500_000,
        totalAmount: 1_000_000,
        targetOutput: "2 Demo Videos",
        pic: "Tim Media",
        status: "Completed",
        usedAmount: 1_000_000,
        justification: "Product showcase & pitch",
      },
      {
        id: "pr-4",
        mainActivity: "Promotional Activities",
        activity: "Social Media Advertising",
        itemType: "Ads",
        qty: 1,
        unit: "campaign",
        unitPrice: 500_000,
        totalAmount: 500_000,
        targetOutput: "50K Organic Reach",
        pic: "Admin",
        status: "Planned",
        usedAmount: 0,
        justification: "IG & TikTok paid promotion",
      },
    ],
  },
  {
    id: "legalization",
    name: "Company Legalization",
    budget: 2_500_000,
    color: "#7c3aed",
    lightColor: "#f5f3ff",
    borderColor: "rgba(124,58,237,0.18)",
    items: [
      {
        id: "lg-1",
        mainActivity: "Business Registration",
        activity: "Business Permit (NIB)",
        itemType: "Service",
        qty: 1,
        unit: "doc",
        unitPrice: 500_000,
        totalAmount: 500_000,
        targetOutput: "NIB Certificate",
        pic: "Admin",
        status: "Completed",
        usedAmount: 500_000,
        justification: "OSS.go.id registration",
      },
      {
        id: "lg-2",
        mainActivity: "Company Registration",
        activity: "PT Registration & Notary",
        itemType: "Service",
        qty: 1,
        unit: "doc",
        unitPrice: 1_000_000,
        totalAmount: 1_000_000,
        targetOutput: "Akta Pendirian PT",
        pic: "Admin",
        status: "Completed",
        usedAmount: 1_000_000,
        justification: "Legal consultant & notary fee",
      },
      {
        id: "lg-3",
        mainActivity: "Tax Registration",
        activity: "NPWP Badan Registration",
        itemType: "Service",
        qty: 1,
        unit: "doc",
        unitPrice: 500_000,
        totalAmount: 500_000,
        targetOutput: "NPWP Card",
        pic: "Admin",
        status: "Completed",
        usedAmount: 500_000,
        justification: "KPP tax office registration",
      },
      {
        id: "lg-4",
        mainActivity: "Trademark",
        activity: "Brand Trademark Registration",
        itemType: "Service",
        qty: 1,
        unit: "doc",
        unitPrice: 500_000,
        totalAmount: 500_000,
        targetOutput: "Trademark Certificate",
        pic: "Admin",
        status: "Planned",
        usedAmount: 0,
        justification: "DJKI HAKI registration",
      },
    ],
  },
  {
    id: "certification",
    name: "HR Certification",
    budget: 2_500_000,
    color: "#16a34a",
    lightColor: "#f0fdf4",
    borderColor: "rgba(22,163,74,0.18)",
    items: [
      {
        id: "hr-1",
        mainActivity: "Professional Certification",
        activity: "Digital Marketing Certification",
        itemType: "Training",
        qty: 2,
        unit: "person",
        unitPrice: 300_000,
        totalAmount: 600_000,
        targetOutput: "2 Certified Members",
        pic: "Sari, Dini",
        status: "Completed",
        usedAmount: 600_000,
        justification: "Google & Meta certifications",
      },
      {
        id: "hr-2",
        mainActivity: "Workshops",
        activity: "UI/UX Design Workshop",
        itemType: "Workshop",
        qty: 1,
        unit: "event",
        unitPrice: 600_000,
        totalAmount: 600_000,
        targetOutput: "Workshop Completion Report",
        pic: "Tim",
        status: "Completed",
        usedAmount: 600_000,
        justification: "Design skill development",
      },
      {
        id: "hr-3",
        mainActivity: "Professional Certification",
        activity: "Project Management Certification",
        itemType: "Training",
        qty: 1,
        unit: "person",
        unitPrice: 800_000,
        totalAmount: 800_000,
        targetOutput: "PMP Certificate",
        pic: "Ahmad",
        status: "Planned",
        usedAmount: 0,
        justification: "PMI PMP certification path",
      },
      {
        id: "hr-4",
        mainActivity: "Training Programs",
        activity: "Leadership & Soft Skills Training",
        itemType: "Training",
        qty: 1,
        unit: "event",
        unitPrice: 500_000,
        totalAmount: 500_000,
        targetOutput: "Training Certificate",
        pic: "Rendy",
        status: "Planned",
        usedAmount: 0,
        justification: "Leadership development program",
      },
    ],
  },
  {
    id: "atk",
    name: "Office Supplies & Support",
    budget: 2_000_000,
    color: "#1e3a5f",
    lightColor: "#f3f7fb",
    borderColor: "rgba(30,58,95,0.18)",
    items: [
      {
        id: "atk-1",
        mainActivity: "Office Supplies",
        activity: "Stationery & Office Supplies",
        itemType: "Supply",
        qty: 1,
        unit: "lot",
        unitPrice: 300_000,
        totalAmount: 300_000,
        targetOutput: "Office supplies stock",
        pic: "Admin",
        status: "Completed",
        usedAmount: 300_000,
        justification: "Pens, paper, folders, etc.",
      },
      {
        id: "atk-2",
        mainActivity: "Office Supplies",
        activity: "Printing & Copying Materials",
        itemType: "Print",
        qty: 1,
        unit: "lot",
        unitPrice: 200_000,
        totalAmount: 200_000,
        targetOutput: "Print materials ready",
        pic: "Admin",
        status: "Completed",
        usedAmount: 200_000,
        justification: "Letterhead, brochures, flyers",
      },
      {
        id: "atk-3",
        mainActivity: "Administrative",
        activity: "Administrative & Notary Expenses",
        itemType: "Admin",
        qty: 1,
        unit: "lot",
        unitPrice: 800_000,
        totalAmount: 800_000,
        targetOutput: "Admin documents complete",
        pic: "Admin",
        status: "Planned",
        usedAmount: 0,
        justification: "Notary fees & stamp duty",
      },
      {
        id: "atk-4",
        mainActivity: "Equipment",
        activity: "Minor Office Equipment",
        itemType: "Equipment",
        qty: 1,
        unit: "lot",
        unitPrice: 700_000,
        totalAmount: 700_000,
        targetOutput: "Equipment operational",
        pic: "Admin",
        status: "Planned",
        usedAmount: 0,
        justification: "Small tools & office devices",
      },
    ],
  },
];

export const TOTAL_FUNDING = 20_000_000;

export function getCategoryRealization(cat: RABCategory): number {
  return cat.items.reduce((sum, item) => sum + item.usedAmount, 0);
}

export function getCategoryRemaining(cat: RABCategory): number {
  return cat.budget - getCategoryRealization(cat);
}

export function getCategoryPct(cat: RABCategory): number {
  return Math.round((getCategoryRealization(cat) / cat.budget) * 100);
}

export function getTotalRealization(): number {
  return rabCategories.reduce((sum, cat) => sum + getCategoryRealization(cat), 0);
}

export function getStatusStyle(status: ApprovalStatus) {
  switch (status) {
    case "Completed":
      return { color: "#16a34a", bg: "rgba(22,163,74,0.09)", border: "rgba(22,163,74,0.22)" };
    case "In Progress":
      return { color: "#d97706", bg: "rgba(217,119,6,0.09)", border: "rgba(217,119,6,0.22)" };
    case "Planned":
      return { color: "#2563eb", bg: "rgba(37,99,235,0.09)", border: "rgba(37,99,235,0.22)" };
  }
}

export function getUtilizationStatus(pct: number) {
  if (pct >= 90) return { label: "Critical", color: "#dc2626", bg: "rgba(220,38,38,0.08)" };
  if (pct >= 75) return { label: "Warning", color: "#d97706", bg: "rgba(217,119,6,0.08)" };
  return { label: "On Track", color: "#16a34a", bg: "rgba(22,163,74,0.08)" };
}

export function formatRp(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}
