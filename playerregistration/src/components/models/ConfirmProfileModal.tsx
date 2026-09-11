import React, { useEffect } from "react";
import ReactDOM from "react-dom";

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  weight: number;
  height: number;
}

interface ConfirmProfileModalProps {
  open: boolean;
  data: ProfileData;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmProfileModal: React.FC<ConfirmProfileModalProps> = ({
  open,
  data,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const portalRoot = document.getElementById("modal-root") ?? document.body;

  const display = (v: unknown): string => {
    if (v === null || v === undefined) return "no changes";
    if (typeof v === "string" && v.trim() === "") return "no changes";
    return String(v); // handles numbers too (0 stays "0")
  };

  const Row: React.FC<{ label: string; value: React.ReactNode }> = ({
    label,
    value,
  }) => (
    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
      <div style={{ width: 140, fontWeight: 600 }}>{label}</div>
      <div style={{ flex: 1, wordBreak: "break-word" }}>{value ?? ""}</div>
    </div>
  );

  return ReactDOM.createPortal(
    <div
      aria-modal="true"
      role="dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div
        style={{
          width: "min(560px, 100%)",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #eee" }}>
          <h3 style={{ margin: 0 }}>Confirm Profile Updates</h3>
          <p style={{ margin: "6px 0 0", color: "#666" }}>
            Please review the changes and confirm to save.
          </p>
        </div>

        <div style={{ padding: 20 }}>
          <Row label="First Name" value={display(data.firstName)} />
          <Row label="Last Name" value={display(data.lastName)} />
          <Row label="Email" value={display(data.email)} />
          <Row label="Contact Number" value={display(data.contact)} />
          <Row label="Weight" value={display(data.weight)} />
          <Row label="Height" value={display(data.height)} />
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
            padding: 16,
            borderTop: "1px solid #eee",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Confirm & Save
          </button>
        </div>
      </div>
    </div>,
    portalRoot
  );
};

export default ConfirmProfileModal;
