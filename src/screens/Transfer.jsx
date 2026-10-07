import React, { useEffect, useState } from "react";
import styles from "./Transfer.module.css";
import { useDispatch, useSelector } from "react-redux";

import Tab from "../components/Bottom";
import Header from "../components/Header";
import Modal from "../components/TransferModal";
import TransferReceipt from "../components/TransferReceipt";

import { transferFunds } from "../store/action/userAppStorage";

import {
  HiOutlineCreditCard,
  HiOutlineArrowsRightLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { FiChevronDown, FiArrowRight } from "react-icons/fi";
import { FaDollarSign, FaArrowDown } from "react-icons/fa";

const Transfer = () => {
  const dispatch = useDispatch();
  const { accounts = [], userToken } = useSelector((state) => state.userAuth);

  const [selectedAccount, setSelectedAccount] = useState(accounts[0] || null);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [authInfo, setAuthInfo] = useState("");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinError, setPinError] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [transferFee, setTransferFee] = useState(5.00);
  const [feeLoading, setFeeLoading] = useState(true);

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  useEffect(() => {
    let mounted = true;

    const loadTransferFee = async () => {
      if (!userToken) {
        if (mounted) setFeeLoading(false);
        return;
      }

      try {
        const apiUrl =
          process.env.REACT_APP_API_URL ||
          "https://achiever-bank-backend.onrender.com";

        const response = await fetch(`${apiUrl}/transfer-fee/${userToken}`, {
          headers: {
            "Content-Type": "application/json",
            header: userToken,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.response || "Unable to load transfer fee.");
        }

        const serverFee = Number(data?.response?.transferFee);

        if (!Number.isFinite(serverFee) || serverFee <= 0) {
          throw new Error("A valid transfer fee is not configured.");
        }

        if (mounted) setTransferFee(serverFee);
      } catch (error) {
        if (mounted) {
          setTransferFee(5.00);
          setPinError(error.message || "Unable to load transfer fee.");
        }
      } finally {
        if (mounted) setFeeLoading(false);
      }
    };

    loadTransferFee();

    return () => {
      mounted = false;
    };
  }, [userToken]);

  const maskAccount = (number) => {
    if (!number) return "";
    return `****${String(number).slice(-4)}`;
  };

  const showMessage = (message) => {
    setAuthInfo(message);
    setIsErrorModal(true);
  };

  const resetForm = () => {
    setBankName("");
    setAccountNumber("");
    setBeneficiaryName("");
    setAmount("");
    setDescription("");
    setPin("");
  };

  const openPinStep = () => {
    if (loading) return;

    if (!selectedAccount || !bankName || !accountNumber || !beneficiaryName || !amount) {
      showMessage("Please complete all required fields.");
      return;
    }

    if (Number(amount) <= 0) {
      showMessage("Enter a valid transfer amount.");
      return;
    }

    const totalDebit = Number(amount) + Number(transferFee);

    if (!Number.isFinite(transferFee) || transferFee <= 0) {
      showMessage("Transfer fee is currently unavailable.");
      return;
    }

    if (Number(selectedAccount?.Balance || 0) < totalDebit) {
      showMessage(
        `Insufficient funds. You need ${formatMoney(totalDebit)} including the ${formatMoney(transferFee)} transfer fee.`
      );
      return;
    }

    setPinError("");
    setPin("");
    setPinModalOpen(true);
  };

  const submitTransfer = async () => {
    if (!/^\d{4}$/.test(pin)) {
      setPinError("Enter your 4-digit transaction PIN.");
      return;
    }

    const data = {
      account: selectedAccount,
      bankName,
      accountNumber,
      beneficiaryName,
      amount,
      description,
      transactionPin: pin,
    };

    try {
      setLoading(true);
      setPinError("");

      const res = await dispatch(transferFunds(data));

      if (!res?.bool) {
        setPinError(res?.message || "Transfer failed.");
        return;
      }

      setPinModalOpen(false);
      setReceipt(res.transfer || res.message?.transfer || null);
      resetForm();
    } catch (error) {
      setPinError(error.message || "Transfer failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isErrorModal && (
        <Modal
          modalVisible={isErrorModal}
          updateVisibility={() => setIsErrorModal(false)}
          message={authInfo}
        />
      )}

      <div className={styles.container}>
        <Header />

        <div className={styles.transferCard}>
          <div className={styles.transferHeader}>
            <div className={styles.transferTitle}>
              <HiOutlineArrowsRightLeft className={styles.transferIcon} />
              <h2>New Transfer</h2>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.transferBody}>
            <div className={styles.formGroup}>
              <label>FROM ACCOUNT</label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.accountSelect}
                  value={selectedAccount?._id || ""}
                  onChange={(e) =>
                    setSelectedAccount(
                      accounts.find((acc) => acc._id === e.target.value) || null
                    )
                  }
                >
                  {accounts.length === 0 ? (
                    <option value="">No account available</option>
                  ) : (
                    accounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.accountType?.toUpperCase()} ({maskAccount(account.accountNumber)}) — {formatMoney(account.Balance)}
                      </option>
                    ))
                  )}
                </select>
                <FiChevronDown className={styles.selectIcon} />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>BENEFICIARY BANK</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter beneficiary bank name"
              />
            </div>

            <div className={styles.formGroup}>
              <label>BENEFICIARY ACCOUNT NUMBER</label>
              <input
                type="text"
                inputMode="numeric"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter beneficiary account number"
              />
            </div>

            <div className={styles.formGroup}>
              <label>BENEFICIARY NAME</label>
              <input
                type="text"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                placeholder="Enter beneficiary name"
              />
            </div>

            <div className={styles.formGroup}>
              <label>TRANSFER AMOUNT (USD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className={styles.formGroup}>
              <label>PAYMENT DESCRIPTION</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter payment description (optional)"
              />
            </div>

            <div
              style={{
                marginTop: 4,
                marginBottom: 18,
                padding: "16px 18px",
                borderRadius: 14,
                background: "#f7f8fb",
                border: "1px solid #e8eaf0",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#667085", fontSize: 13 }}>Transfer amount</span>
                <strong>{formatMoney(amount)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#667085", fontSize: 13 }}>Transaction fee</span>
                <strong>{feeLoading ? "Loading..." : formatMoney(transferFee)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #e5e7eb" }}>
                <span style={{ color: "#101828", fontSize: 13, fontWeight: 700 }}>Total debit</span>
                <strong>{feeLoading ? "Loading..." : formatMoney(Number(amount || 0) + transferFee)}</strong>
              </div>
            </div>

            <button
              className={styles.transferBtn}
              disabled={!selectedAccount || loading || feeLoading}
              onClick={openPinStep}
              style={{ opacity: !selectedAccount || loading ? 0.5 : 1 }}
            >
              <span>{loading ? "Processing..." : selectedAccount ? "Review Transfer" : "No Account Available"}</span>
              {!loading && selectedAccount && <FiArrowRight />}
            </button>
          </div>

          <div className={styles.servicesCard}>
            <div className={styles.serviceItem}>
              <div className={styles.serviceLeft}>
                <div className={`${styles.serviceIcon} ${styles.zelle}`}><span>Z</span></div>
                <div><h3>Zelle®</h3><p>Send money instantly to friends and family.</p></div>
              </div>
              <HiOutlineChevronRight className={styles.arrow} />
            </div>

            <div className={styles.serviceItem}>
              <div className={styles.serviceLeft}>
                <div className={`${styles.serviceIcon} ${styles.wire}`}><HiOutlineCreditCard /></div>
                <div><h3>Wire Transfer</h3><p>Send domestic and international wire transfers.</p></div>
              </div>
              <HiOutlineChevronRight className={styles.arrow} />
            </div>

            <div className={styles.serviceItem}>
              <div className={styles.serviceLeft}>
                <div className={`${styles.serviceIcon} ${styles.bill}`}><FaDollarSign /></div>
                <div><h3>Bill Pay</h3><p>Pay utility bills, loans and credit cards.</p></div>
              </div>
              <HiOutlineChevronRight className={styles.arrow} />
            </div>
          </div>
        </div>

        <Tab />

        {pinModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
              <button
                className={styles.closeBtn}
                onClick={() => !loading && setPinModalOpen(false)}
                aria-label="Close"
              >×</button>

              <div className={styles.withdrawIcon}><FaArrowDown /></div>
              <h3 className={styles.withdrawTitle}>Confirm Transfer</h3>
              <div className={styles.progressWrapper}>
                <div className={styles.progressFill} style={{ width: "100%" }} />
              </div>

              <p className={styles.withdrawText}>
                Enter your 4-digit transaction PIN to authorize this transfer.
              </p>

              <div
                style={{
                  margin: "16px 0",
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "#f7f8fb",
                  border: "1px solid #e8eaf0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <span style={{ color: "#667085" }}>Transfer</span>
                  <strong>{formatMoney(amount)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <span style={{ color: "#667085" }}>Fee</span>
                  <strong>{formatMoney(transferFee)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 9, borderTop: "1px solid #e5e7eb" }}>
                  <span style={{ fontWeight: 700 }}>Total deducted</span>
                  <strong>{formatMoney(Number(amount || 0) + transferFee)}</strong>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>TRANSACTION PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                  className={styles.withdrawInput}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="••••"
                  autoFocus
                />
              </div>

              {pinError && <div style={{ color: "red", marginTop: 12, textAlign: "center", fontSize: 14 }}>{pinError}</div>}

              <button className={styles.proceedButton} onClick={submitTransfer} disabled={loading}>
                {loading ? "Processing..." : "Confirm & Send"}
              </button>
            </div>
          </div>
        )}

        {receipt && <TransferReceipt transfer={receipt} onClose={() => setReceipt(null)} />}
      </div>
    </>
  );
};

export default Transfer;
