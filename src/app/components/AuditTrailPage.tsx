import { useState, useEffect, useCallback } from "react";
import { TopNav } from "./TopNav";
import { fetchAuditLogs, type AuditLogItem } from "../../services/activity.service";
import { ACTION_META, DEFAULT_META } from "../../constants/activityMeta";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AuditTrailPageProps {
  onMenuClick?: () => void;
}

function LogDetailView({ oldVal, newVal }: { oldVal: any; newVal: any }) {
  if (!oldVal && !newVal) return null;
  return (
    <div
      style={{
        marginTop: "16px",
        padding: "16px",
        borderRadius: "16px",
        background: "#f8fafc",
        border: "1px solid rgba(17,24,39,0.06)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        fontSize: "0.75rem",
        fontFamily: "'JetBrains Mono', monospace",
        overflowX: "auto",
      }}
    >
      {oldVal && (
        <div>
          <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: "8px" }}>Old Value</div>
          <pre style={{ margin: 0, color: "#556174", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {JSON.stringify(oldVal, null, 2)}
          </pre>
        </div>
      )}
      {newVal && (
        <div>
          <div style={{ color: "#10b981", fontWeight: 700, marginBottom: "8px" }}>New Value</div>
          <pre style={{ margin: 0, color: "#556174", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {JSON.stringify(newVal, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function LogItem({ log }: { log: AuditLogItem }) {
  const [expanded, setExpanded] = useState(false);
  const meta = ACTION_META[log.action] || DEFAULT_META;
  const Icon = meta.icon;
  
  const d = new Date(log.created_at);
  const dateStr = d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const hasDetails = log.old_value || log.new_value;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "48px minmax(0,1fr)",
        gap: "20px",
        alignItems: "flex-start",
        position: "relative",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: meta.iconBg,
          border: `1px solid ${meta.iconBorder}`,
          boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
          position: "relative",
          zIndex: 1,
          color: meta.iconColor,
          flexShrink: 0,
        }}
      >
        <Icon size={20} strokeWidth={2.2} />
      </div>

      {/* Content */}
      <div
        style={{
          padding: "20px",
          borderRadius: "24px",
          background: "rgba(255,255,255,0.8)",
          border: "1px solid rgba(17,24,39,0.06)",
          boxShadow: "0 8px 24px rgba(15,23,42,0.03)",
          transition: "0.2s ease-in-out",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "#182033",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
                marginBottom: "4px",
              }}
            >
              {meta.label}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "#556174",
                  fontWeight: 600,
                }}
              >
                By <span style={{ color: "#182033", fontWeight: 700 }}>{log.user_name}</span>
              </div>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#cbd5e1" }} />
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "#737f91",
                  fontWeight: 600,
                }}
              >
                {dateStr} at {timeStr}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 12px",
                borderRadius: "999px",
                background: meta.tagBg,
                color: meta.tagColor,
                fontSize: "0.75rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "999px",
                  background: meta.tagColor,
                }}
              />
              {meta.tag}
            </div>

            {hasDetails && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: expanded ? "rgba(17,24,39,0.04)" : "transparent",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#556174",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
        </div>

        {expanded && hasDetails && (
          <LogDetailView oldVal={log.old_value} newVal={log.new_value} />
        )}
      </div>
    </div>
  );
}

export function AuditTrailPage({ onMenuClick }: AuditTrailPageProps) {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 20;

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, count, error: fetchErr } = await fetchAuditLogs(PAGE_SIZE, 0);
    if (fetchErr) {
      setError(fetchErr);
    } else {
      setLogs(data);
      setTotalCount(count);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const loadMore = async () => {
    setIsLoadingMore(true);
    const { data, fetchErr } = await fetchAuditLogs(PAGE_SIZE, logs.length);
    if (!fetchErr && data) {
      setLogs((prev) => [...prev, ...data]);
    }
    setIsLoadingMore(false);
  };

  const hasMore = logs.length < totalCount;

  return (
    <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
      <TopNav
        title="Audit Trail"
        subtitle="System-wide activity log"
        onMenuClick={onMenuClick}
      />

      <main className="flex-1 p-4 md:p-6 lg:px-8 lg:py-7 flex flex-col gap-6">
        <div
          className="p-6 lg:p-8 rounded-[32px] border border-slate-900/5 shadow-[0_18px_46px_rgba(15,23,42,0.06)] flex flex-col"
          style={{
            background: "linear-gradient(180deg, #ffffff, #f8fafc)",
          }}
        >
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "#182033",
                letterSpacing: "-0.04em",
                lineHeight: 1,
                marginBottom: "8px",
              }}
            >
              Activity History
            </div>
            <div style={{ color: "#556174", fontSize: "0.9rem", fontWeight: 500 }}>
              Chronological record of all system activities and data mutations.
            </div>
          </div>

          {error ? (
            <div
              style={{
                padding: "16px 20px",
                borderRadius: "16px",
                background: "rgba(220,38,38,0.06)",
                border: "1px solid rgba(220,38,38,0.18)",
                color: "#dc2626",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Failed to load audit logs: {error}
            </div>
          ) : (
            <div style={{ position: "relative", paddingLeft: "4px" }}>
              {/* Vertical timeline line */}
              <div
                style={{
                  position: "absolute",
                  left: "28px", // 4px + 24px (center of 48px icon)
                  top: "24px",
                  bottom: "24px",
                  width: "2px",
                  borderRadius: "999px",
                  background: "linear-gradient(180deg, rgba(249,115,22,0.4), rgba(249,115,22,0.05))",
                }}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{ height: "100px", borderRadius: "24px", background: "#f1f5f9", marginLeft: "68px" }} />
                  ))
                ) : logs.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "#737f91", fontWeight: 600, marginLeft: "68px" }}>
                    No activity logs found.
                  </div>
                ) : (
                  logs.map((log) => <LogItem key={log.id} log={log} />)
                )}
              </div>

              {hasMore && !isLoading && (
                <div style={{ marginTop: "32px", marginLeft: "68px" }}>
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    style={{
                      height: "46px",
                      padding: "0 28px",
                      borderRadius: "16px",
                      background: "white",
                      border: "1px solid rgba(17,24,39,0.12)",
                      color: "#182033",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      cursor: isLoadingMore ? "not-allowed" : "pointer",
                      boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
                      transition: "0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      maxWidth: "240px",
                      margin: "0 auto",
                    }}
                  >
                    {isLoadingMore ? "Loading..." : "Load More Activity"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
