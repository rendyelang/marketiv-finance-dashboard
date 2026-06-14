import { useState } from "react";
import { X, ShieldCheck, Check, Minus, Send } from "lucide-react";
import {
  type UserRole,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  getRoleStyle,
} from "./userData";

interface AddUserModalProps {
  onClose: () => void;
  onSave?: (data: any) => void;
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "0 14px",
  borderRadius: "13px",
  background: "white",
  border: "1px solid rgba(17,24,39,0.10)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 12px rgba(15,23,42,0.035)",
  color: "#182033",
  fontSize: "0.85rem",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 800,
  color: "#34435d",
  marginBottom: "6px",
  letterSpacing: "-0.01em",
};

const ROLE_INFO: Record<UserRole, string> = {
  Admin: "Full access — manage users, approve transactions, and configure budgets.",
  Member: "Day-to-day operations — record transactions and budgets, view reports.",
};

export function AddUserModal({ onClose, onSave }: AddUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState<UserRole>("Member");

  const grantedKeys = ROLE_PERMISSIONS[role];

  const handleSave = () => {
    onSave?.({ name, email, position, role, permissionKeys: grantedKeys });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          background: "rgba(12,23,43,0.40)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
          width: "min(580px, calc(100vw - 40px))",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "32px",
          background: "#fbf7ef",
          boxShadow: "0 32px 90px rgba(12,23,43,0.28)",
          border: "1px solid rgba(255,255,255,0.80)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 20px",
            borderBottom: "1px solid rgba(17,24,39,0.07)",
            background:
              "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.07), transparent 14rem), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.72))",
            borderRadius: "32px 32px 0 0",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#182033",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              Invite User
            </div>
            <div style={{ color: "#556174", fontSize: "0.80rem", marginTop: "5px", fontWeight: 500 }}>
              Add a team member and assign their role & access
            </div>
          </div>
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
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Name + Email */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Bayu Nugroho"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={fieldStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              placeholder="e.g. bayu.nugroho@marketiv.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={fieldStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Position</label>
            <input
              type="text"
              placeholder="e.g. Finance Assistant"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              style={fieldStyle}
            />
          </div>

          {/* Role selector */}
          <div>
            <label style={labelStyle}>Role</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {(["Admin", "Member"] as UserRole[]).map((r) => {
                const isSelected = role === r;
                const rs = getRoleStyle(r);
                return (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "16px",
                      textAlign: "left",
                      background: isSelected ? rs.bg : "white",
                      border: isSelected ? `1.5px solid ${rs.border}` : "1px solid rgba(17,24,39,0.09)",
                      cursor: "pointer",
                      transition: "0.18s cubic-bezier(.2,.8,.2,1)",
                      boxShadow: isSelected ? "0 6px 18px rgba(15,23,42,0.08)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <ShieldCheck
                        size={16}
                        strokeWidth={2.4}
                        style={{ color: isSelected ? rs.color : "#a4adbb" }}
                      />
                      <span
                        style={{
                          fontSize: "0.92rem",
                          fontWeight: 700,
                          color: isSelected ? rs.color : "#556174",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {r}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "#737f91",
                        fontWeight: 500,
                        marginTop: "6px",
                        lineHeight: 1.45,
                      }}
                    >
                      {ROLE_INFO[r]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permission preview */}
          <div>
            <label style={labelStyle}>Access Preview</label>
            <div
              style={{
                borderRadius: "16px",
                background: "white",
                border: "1px solid rgba(17,24,39,0.08)",
                boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
                overflow: "hidden",
              }}
            >
              {PERMISSIONS.map((perm, idx) => {
                const granted = grantedKeys.includes(perm.key);
                return (
                  <div
                    key={perm.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "11px 14px",
                      borderBottom: idx === PERMISSIONS.length - 1 ? "none" : "1px solid rgba(17,24,39,0.05)",
                      background: granted ? "transparent" : "#fafbfc",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "8px",
                        background: granted ? "rgba(22,163,74,0.10)" : "#eef2f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: granted ? "#16a34a" : "#a4adbb",
                        flexShrink: 0,
                      }}
                    >
                      {granted ? <Check size={13} strokeWidth={3} /> : <Minus size={13} strokeWidth={3} />}
                    </div>
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: granted ? "#182033" : "#737f91",
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {perm.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: "8px",
                fontSize: "0.73rem",
                color: "#737f91",
                fontWeight: 600,
                lineHeight: 1.45,
              }}
            >
              An invitation email will be sent. The user activates their account by setting a password.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 28px 24px",
            borderTop: "1px solid rgba(17,24,39,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            background: "rgba(255,255,255,0.60)",
            borderRadius: "0 0 32px 32px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              height: "44px",
              padding: "0 22px",
              borderRadius: "13px",
              background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(250,250,250,0.86))",
              border: "1px solid rgba(17,24,39,0.10)",
              boxShadow: "0 8px 20px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.92)",
              color: "#182033",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "-0.01em",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              height: "44px",
              padding: "0 22px",
              borderRadius: "13px",
              background: "linear-gradient(180deg, #fb7a18 0%, #ea580c 100%)",
              color: "white",
              border: "1px solid rgba(194,65,12,0.22)",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 700,
              boxShadow: "0 12px 28px rgba(234,88,12,0.24), inset 0 1px 0 rgba(255,255,255,0.20)",
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <Send size={15} />
            Send Invitation
          </button>
        </div>
      </div>
    </>
  );
}
