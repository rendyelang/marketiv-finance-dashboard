import { useState, useEffect } from "react";
import { X, FileText, ArrowUpRight, Loader2, Calendar, User } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { formatRp } from "./rabData";

interface RealizationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: { id: string; name: string; budget: number; realization: number; itemIds: string[] } | null;
}

interface MiniTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  person_in_charge: string;
  attachments: { id: string; file_name: string; file_url: string }[];
}

export function RealizationDrawer({ isOpen, onClose, category }: RealizationDrawerProps) {
  const [transactions, setTransactions] = useState<MiniTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && category) {
      const fetchTransactions = async () => {
        setIsLoading(true);
        if (category.itemIds.length === 0) {
          setTransactions([]);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("transactions")
          .select("id, date, description, amount, person_in_charge, attachments(id, file_name, file_url)")
          .in("budget_item_id", category.itemIds)
          .in("type", ["Expense", "expense"])
          .order("date", { ascending: false });

        if (!error && data) {
          setTransactions(data as MiniTransaction[]);
        }
        setIsLoading(false);
      };
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [isOpen, category]);

  if (!isOpen || !category) return null;

  return (
    <>
      {/* Backdrop */}
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

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          bottom: "16px",
          width: "min(520px, calc(100vw - 32px))",
          background: "#f8fafc",
          borderRadius: "32px",
          boxShadow: "0 24px 60px rgba(15,23,42,0.18), inset 0 1px 0 rgba(255,255,255,0.6)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid rgba(17,24,39,0.06)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px",
            background: "white",
            borderBottom: "1px solid rgba(17,24,39,0.06)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#ea580c",
                fontSize: "0.74rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "2px",
                  borderRadius: "999px",
                  background: "#f97316",
                }}
              />
              Category Drill-down
            </div>
            <div
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#182033",
                letterSpacing: "-0.04em",
                marginTop: "6px",
                lineHeight: 1.2,
              }}
            >
              {category.name}
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
              <div>
                <div style={{ fontSize: "0.72rem", color: "#737f91", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                  Budget
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#182033", fontFamily: "'Sora', sans-serif" }}>
                  {formatRp(category.budget)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "#ea580c", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                  Realized
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#ea580c", fontFamily: "'Sora', sans-serif" }}>
                  {formatRp(category.realization)}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "12px",
              background: "#f3f5f8",
              border: "1px solid rgba(17,24,39,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#556174",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#eef2f7")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#f3f5f8")}
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#737f91", gap: "12px" }}>
              <Loader2 size={24} className="animate-spin" />
              <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Loading transactions...</div>
            </div>
          ) : transactions.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#737f91", textAlign: "center" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", border: "1px solid rgba(17,24,39,0.06)" }}>
                <FileText size={24} color="#a0aec0" />
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#182033" }}>No Realization Yet</div>
              <div style={{ fontSize: "0.85rem", marginTop: "4px", maxWidth: "240px" }}>
                There are no expense transactions linked to this category.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#182033", marginBottom: "4px" }}>
                Transaction History ({transactions.length})
              </div>
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "18px",
                    border: "1px solid rgba(17,24,39,0.06)",
                    boxShadow: "0 4px 12px rgba(15,23,42,0.03)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#182033", marginBottom: "4px", lineHeight: 1.4 }}>
                        {tx.description}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#737f91", fontSize: "0.75rem", fontWeight: 600 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Calendar size={13} /> {new Date(tx.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <User size={13} /> {tx.person_in_charge}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 800, color: "#ea580c", background: "#fff7ed", padding: "6px 12px", borderRadius: "10px", border: "1px solid rgba(234,88,12,0.1)" }}>
                      {formatRp(tx.amount)}
                    </div>
                  </div>

                  {/* Attachments */}
                  {tx.attachments && tx.attachments.length > 0 && (
                    <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px dashed rgba(17,24,39,0.08)" }}>
                      <div style={{ fontSize: "0.72rem", color: "#737f91", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "8px" }}>
                        Attached Invoices
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {tx.attachments.map((att) => {
                          return (
                            <a
                              key={att.id}
                              href={att.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                borderRadius: "8px",
                                background: "#f8fafc",
                                border: "1px solid rgba(17,24,39,0.08)",
                                color: "#2563eb",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                textDecoration: "none",
                                transition: "all 0.2s",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = "#eff6ff";
                                e.currentTarget.style.borderColor = "rgba(37,99,235,0.2)";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = "#f8fafc";
                                e.currentTarget.style.borderColor = "rgba(17,24,39,0.08)";
                              }}
                            >
                              <FileText size={14} />
                              {att.file_name}
                              <ArrowUpRight size={12} style={{ opacity: 0.6 }} />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
