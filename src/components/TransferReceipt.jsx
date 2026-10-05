import React from "react";
import styles from "./TransferReceipt.module.css";

const money = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const maskAccount = (value) => {
  if (!value) return "****";
  const text = String(value);
  return `**** ${text.slice(-4)}`;
};

const TransferReceipt = ({ transfer, onClose }) => {
  if (!transfer) return null;

  const date = transfer.date
    ? new Date(transfer.date).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : new Date().toLocaleString();

  return (
    <div className={styles.overlay}>
      <div className={styles.receipt}>
        <button className={styles.close} onClick={onClose} aria-label="Close receipt">
          ×
        </button>

        <div className={styles.brand}>XPRESS</div>
        <h1>Payment Sent</h1>
        <h2>Successfully</h2>
        <p className={styles.reference}>Reference #{transfer.id || "PENDING"}</p>

        <div className={styles.divider} />

        <div className={styles.sentLabel}>You Sent</div>
        <div className={styles.currency}>$</div>
        <div className={styles.amount}>{money(transfer.amount)}</div>

        <div className={styles.details}>
          <Row label="Recipient" value={transfer.accountName || "—"} />
          <Row label="Bank Name" value={transfer.nameOfBank || "—"} />
          <Row label="Account Number" value={maskAccount(transfer.accountNumber)} />
          <Row label="Description" value={transfer.reason || "—"} />
          <Row label="Transaction Date" value={date} />
          <Row label="Transaction Fee" value="$ 0.00" />
          <Row label="New Balance" value={`$ ${money(transfer.balance)}`} last />
        </div>

       

        <button className={styles.doneButton} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
};

const Row = ({ label, value, last }) => (
  <div className={`${styles.row} ${last ? styles.lastRow : ""}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export default TransferReceipt;
