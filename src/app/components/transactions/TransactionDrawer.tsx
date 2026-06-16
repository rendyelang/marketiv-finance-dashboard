import { useRef, useState, useEffect } from "react";
import {
  X,
  FileText,
  Image,
  Download,
  Trash2,
  Upload,
  Clock,
  User,
  Tag,
  Calendar,
  MessageSquare,
  Paperclip,
  ChevronRight,
  ArrowUpCircle,
  ArrowDownCircle,
  Edit3,
} from "lucide-react";
import {
  type Transaction,
  type Attachment,
  CATEGORY_MAP,
  getStatusStyle,
  formatRp,
  formatDate,
} from "./transactionData";
import { deleteAttachment, uploadAttachment, fetchTransactionActivityLogs } from "../../../services/transaction.service";

function FileIcon({ fileType }: { fileType: string }) {
  const isPdf = fileType === "PDF";
  return (
    <div
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "13px",
        background: isPdf ? "#fff5f5" : "#f0f6ff",
        border: isPdf ? "1px solid rgba(220,38,38,0.18)" : "1px solid rgba(37,99,235,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isPdf ? "#dc2626" : "#2563eb",
        flexShrink: 0,
      }}
    >
      {isPdf ? <FileText size={18} strokeWidth={2} /> : <Image size={18} strokeWidth={2} />}
    </div>
  );
}

function AttachmentCard({ att, onDelete }: { att: Attachment; onDelete?: (id: string, url: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileExt = att.name.split(".").pop()?.toUpperCase() || "FILE";
  const isPdf = fileExt === "PDF";

  const handleDelete = async () => {
    if (!onDelete) return;
    if (confirm("Are you sure you want to delete this attachment?")) {
      setIsDeleting(true);
      await onDelete(att.id, att.fileUrl);
      setIsDeleting(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "14px 16px",
        borderRadius: "18px",
        background: hovered ? "rgba(249,115,22,0.025)" : "#f8fafc",
        border: hovered ? "1px solid rgba(249,115,22,0.16)" : "1px solid rgba(17,24,39,0.07)",
        transition: "0.18s cubic-bezier(.2,.8,.2,1)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        opacity: isDeleting ? 0.5 : 1,
      }}
    >
      <FileIcon fileType={fileExt} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.84rem",
            fontWeight: 700,
            color: "#182033",
            letterSpacing: "-0.018em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: 1.2,
          }}
        >
          {att.name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "5px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              padding: "2px 8px",
              borderRadius: "6px",
              background: "#eff6ff",
              color: "#2563eb",
              fontSize: "0.68rem",
              fontWeight: 700,
            }}
          >
            {fileExt}
          </span>
        </div>
        <div
          style={{
            marginTop: "4px",
            fontSize: "0.70rem",
            color: "#737f91",
            fontWeight: 600,
          }}
        >
          {att.uploadDate} · {att.uploadTime}
        </div>
      </div>

      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
        <a
          href={att.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "10px",
            background: "white",
            border: "1px solid rgba(17,24,39,0.09)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#556174",
            boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
          }}
          title="Download"
        >
          <Download size={13} />
        </a>
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              background: "rgba(220,38,38,0.06)",
              border: "1px solid rgba(220,38,38,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#dc2626",
            }}
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

function HistoryTimeline({ items }: { items: Transaction["history"] }) {
  return (
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
        {items.map((item, i) => (
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "5px",
                }}
              >
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
                  <User size={10} />
                  {item.user || "System"}
                </span>
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
                  {item.date} · {item.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TransactionDrawerProps {
  transaction: Transaction | null;
  onClose: () => void;
  onAttachmentDeleted?: () => void;
  onEdit?: () => void;
}

type DrawerTab = "details" | "attachments" | "history";

export function TransactionDrawer({ transaction, onClose, onAttachmentDeleted, onEdit }: TransactionDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>("details");
  const [isUploading, setIsUploading] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<Transaction["history"]>(transaction?.history || []);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!transaction) return null;

  useEffect(() => {
    if (activeTab === "history") {
      setIsLoadingHistory(true);
      fetchTransactionActivityLogs(transaction.id).then((res) => {
        if (!res.error) {
          const mappedLogs = res.data.map((log: any) => {
            const d = new Date(log.created_at);
            return {
              id: log.id,
              date: d.toLocaleDateString("en-CA"),
              time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              action: log.action,
              user: log.user_name || "System",
            };
          });
          setHistoryLogs(mappedLogs);
        }
        setIsLoadingHistory(false);
      });
    }
  }, [activeTab, transaction.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && transaction) {
      setIsUploading(true);
      for (const file of Array.from(e.target.files)) {
        const { error } = await uploadAttachment(transaction.id, file);
        if (error) alert("Upload error: " + error);
      }
      setIsUploading(false);
      onAttachmentDeleted?.(); // Refresh data
    }
  };

  const isIncome = transaction.type === "Income";
  const statusStyle = getStatusStyle(transaction.status);
  const catStyle = CATEGORY_MAP[transaction.category] || { color: "#556174", bg: "#f8fafc", border: "rgba(17,24,39,0.1)" };

  const drawerTabs: { id: DrawerTab; label: string; count?: number }[] = [
    { id: "details", label: "Details" },
    { id: "attachments", label: "Documents", count: transaction.attachments.length },
    { id: "history", label: "Activity", count: historyLogs.length },
  ];

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

      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 bottom-0 w-full max-w-[520px] z-[100] bg-[#fbf7ef] shadow-[-8px_0_48px_rgba(12,23,43,0.18)] flex flex-col overflow-y-auto"
      >
        {/* Drawer Header */}
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
          {/* Top bar */}
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
                {transaction.id}
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
                {transaction.status}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {onEdit && (
                <button
                  onClick={onEdit}
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
                >
                  <Edit3 size={14} />
                </button>
              )}
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

          {/* Amount hero */}
          <div
            style={{
              padding: "20px 22px",
              borderRadius: "24px",
              background: isIncome
                ? "linear-gradient(135deg, #f0fdf4, #dcfce7)"
                : "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.08), transparent 14rem), linear-gradient(180deg, #ffffff, #fffdf9)",
              border: isIncome
                ? "1px solid rgba(22,163,74,0.22)"
                : "1px solid rgba(17,24,39,0.08)",
              boxShadow: "0 8px 24px rgba(15,23,42,0.07)",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "10px",
                    background: isIncome ? "rgba(22,163,74,0.12)" : "rgba(220,38,38,0.09)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isIncome ? "#16a34a" : "#dc2626",
                  }}
                >
                  {isIncome ? (
                    <ArrowUpCircle size={16} strokeWidth={2.5} />
                  ) : (
                    <ArrowDownCircle size={16} strokeWidth={2.5} />
                  )}
                </div>
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: isIncome ? "#16a34a" : "#dc2626",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {transaction.type}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  color: "#556174",
                  lineHeight: 1.4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {transaction.description}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                  fontSize: "1.55rem",
                  fontWeight: 800,
                  letterSpacing: "-0.055em",
                  lineHeight: 1,
                  color: isIncome ? "#16a34a" : "#182033",
                }}
              >
                {isIncome ? "+" : "-"}
                {formatRp(transaction.amount)}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "#737f91",
                  marginTop: "4px",
                  fontWeight: 600,
                }}
              >
                {formatDate(transaction.date)}
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              gap: "2px",
              padding: "4px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(17,24,39,0.08)",
              marginBottom: "0",
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
                    boxShadow: isActive
                      ? "0 8px 18px rgba(234,88,12,0.20)"
                      : "none",
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

          <div
            style={{
              height: "1px",
              background: "rgba(17,24,39,0.07)",
              marginTop: "16px",
            }}
          />
        </div>

        {/* Drawer Body */}
        <div style={{ padding: "20px 24px 32px", flex: 1 }}>
          {/* DETAILS TAB */}
          {activeTab === "details" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                {
                  icon: Calendar,
                  label: "Date",
                  value: formatDate(transaction.date),
                  mono: false,
                },
                {
                  icon: Tag,
                  label: "Category",
                  value: transaction.category,
                  badge: catStyle,
                  mono: false,
                },
                {
                  icon: User,
                  label: "Person in Charge",
                  value: transaction.pic,
                  mono: false,
                },
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
                  <div style={{ flex: 1 }}>
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
                    {field.badge ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 10px",
                          borderRadius: "8px",
                          background: field.badge.bg,
                          color: field.badge.color,
                          border: `1px solid ${field.badge.border}`,
                          fontSize: "0.80rem",
                          fontWeight: 700,
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "3px",
                            background: field.badge.color,
                          }}
                        />
                        {field.value}
                      </span>
                    ) : (
                      <div
                        style={{
                          fontSize: "0.86rem",
                          fontWeight: 700,
                          color: "#182033",
                          letterSpacing: "-0.018em",
                        }}
                      >
                        {field.value}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Notes */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "16px",
                  background: "white",
                  border: "1px solid rgba(17,24,39,0.07)",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
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
                    }}
                  >
                    <MessageSquare size={14} strokeWidth={2} />
                  </div>
                  <div
                    style={{
                      fontSize: "0.70rem",
                      color: "#737f91",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Notes
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.84rem",
                    color: "#34435d",
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  {transaction.notes || (
                    <span style={{ color: "#c9d0da", fontStyle: "italic" }}>No notes added.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ATTACHMENTS TAB */}
          {activeTab === "attachments" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {transaction.attachments.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    padding: "40px 24px",
                    borderRadius: "20px",
                    background: "white",
                    border: "1.5px dashed rgba(17,24,39,0.10)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "16px",
                      background: "#fff7ed",
                      border: "1px solid rgba(249,115,22,0.16)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ea580c",
                    }}
                  >
                    <Paperclip size={20} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        color: "#182033",
                        letterSpacing: "-0.02em",
                        marginBottom: "4px",
                      }}
                    >
                      No documents attached
                    </div>
                    <div style={{ fontSize: "0.80rem", color: "#737f91" }}>
                      Upload invoices, receipts, or supporting documents.
                    </div>
                  </div>
                </div>
              ) : (
                transaction.attachments.map((att) => (
                  <AttachmentCard 
                    key={att.id} 
                    att={att} 
                    onDelete={async (id, url) => {
                      const { success, error } = await deleteAttachment(id, url);
                      if (success) {
                        onAttachmentDeleted?.();
                      } else {
                        alert("Failed to delete attachment: " + error);
                      }
                    }} 
                  />
                ))
              )}

              {/* Upload area */}
              <input 
                type="file" 
                multiple 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                style={{ display: "none" }} 
                accept=".pdf,.jpg,.jpeg,.png,.webp"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  height: "46px",
                  borderRadius: "14px",
                  background: "rgba(255,247,237,0.70)",
                  border: "1.5px dashed rgba(249,115,22,0.30)",
                  color: "#ea580c",
                  fontSize: "0.83rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "0.18s",
                  marginTop: "4px",
                  opacity: isUploading ? 0.6 : 1,
                }}
              >
                <Upload size={15} />
                {isUploading ? "Uploading..." : "Upload Document"}
              </button>

              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid rgba(17,24,39,0.07)",
                }}
              >
                <div style={{ fontSize: "0.72rem", color: "#737f91", fontWeight: 600, lineHeight: 1.5 }}>
                  Supported formats: PDF, JPG, PNG, WEBP · Max size: 10 MB per file
                </div>
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === "history" && (
            <div style={{ padding: "20px 24px" }}>
              <div style={{ color: "#182033", fontSize: "0.95rem", fontWeight: 700, marginBottom: "20px" }}>
                Transaction History
              </div>
              {isLoadingHistory ? (
                <div style={{ fontSize: "0.85rem", color: "#737f91" }}>Loading activity...</div>
              ) : historyLogs.length === 0 ? (
                <div style={{ fontSize: "0.85rem", color: "#737f91" }}>No activity recorded yet.</div>
              ) : (
                <HistoryTimeline items={historyLogs} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
