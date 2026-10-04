import React, { useState } from "react";
import styles from "./Transfer.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Tab from "../components/Bottom";
import Header from "../components/Header";
import Modal from "../components/TransferModal";

import { transferFunds } from "../store/action/userAppStorage";

import { HiOutlineCreditCard } from "react-icons/hi2";
import {
  HiOutlineArrowsRightLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";

import { FiChevronDown, FiArrowRight } from "react-icons/fi";
import { FaDollarSign, FaArrowDown } from "react-icons/fa";

const Transfer = () => {
  // ===========================
  // REDUX
  // ===========================

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, accounts } = useSelector(
    (state) => state.userAuth
  );

  // ===========================
  // FORM STATE
  // ===========================

  const [selectedAccount, setSelectedAccount] = useState(
    accounts.length > 0 ? accounts[0] : null
  );

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // ===========================
  // GENERAL STATE
  // ===========================

  const [loading, setLoading] = useState(false);

  const [isAuthError, setIsAuthError] =
    useState(false);

  const [authInfo, setAuthInfo] =
    useState("");

  // ===========================
  // TRANSFER MODAL
  // ===========================

  const [transferModal, setTransferModal] =
    useState({
      open: false,
      progress: 25,
      title: "",
      label: "",
      placeholder: "",
      value: "",
      error: "",
      codeType: "",
    });

  // ===========================
  // HELPERS
  // ===========================

  const formatMoney = (amount) => {
    if (!amount) return "$0.00";

    return Number(amount).toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    );
  };

  const maskAccount = (number) => {
    if (!number) return "";

    return `****${number
      .toString()
      .slice(-4)}`;
  };

  const updateAuthError = () => {
    setIsAuthError(false);
    setAuthInfo("");
  };

  // ===========================
  // HANDLE TRANSFER
  // ===========================

  

// ===========================
// HANDLE TRANSFER
// ===========================

const handleTransfer = async () => {
  if (loading) return;

  if (
    !selectedAccount ||
    !bankName ||
    !accountNumber ||
    !beneficiaryName ||
    !amount
  ) {
    setAuthInfo(
      "Please complete all required fields."
    );
    setIsAuthError(true);
    return;
  }

  if (
    Number(selectedAccount?.Balance ?? 0) <
    Number(amount)
  ) {
    setAuthInfo("Insufficient fund.");
    setIsAuthError(true);
    return;
  }

  // ===========================
  // TAX CHECK
  // ===========================

  if (!user?.taxVerified) {
    return setTransferModal({
      open: true,
      progress: 25,
      title:
        "Use the TAX Code given to you to proceed",
      label: "TAX Code",
      placeholder: "Enter TAX Code",
      value: "",
      error: "",
      codeType: "tax",
    });
  }

  // ===========================
  // BSA CHECK
  // ===========================

  if (!user?.bsaVerified) {
    return setTransferModal({
      open: true,
      progress: 50,
      title:
        "Enter your BSA Code to continue",
      label: "BSA Code",
      placeholder: "Enter BSA Code",
      value: "",
      error: "",
      codeType: "bsa",
    });
  }

  // ===========================
  // TAC CHECK
  // ===========================

  if (!user?.tacVerified) {
    return setTransferModal({
      open: true,
      progress: 75,
      title:
        "Enter your TAC Code to continue",
      label: "TAC Code",
      placeholder: "Enter TAC Code",
      value: "",
      error: "",
      codeType: "tac",
    });
  }

  const data = {
    user,
    account: selectedAccount,
    bankName,
    accountNumber,
    beneficiaryName,
    amount,
    description,
  };

  try {
    setLoading(true);

    const res = await dispatch(
      transferFunds(data)
    );

    if (!res?.bool) {
      setLoading(false);

      setAuthInfo(
        res?.message ??
        "Transfer failed."
      );

      setIsAuthError(true);
      return;
    }

    setLoading(false);

    setAuthInfo(
      "Transfer submitted successfully."
    );

    setIsAuthError(true);

    setBankName("");
    setAccountNumber("");
    setBeneficiaryName("");
    setAmount("");
    setDescription("");

  } catch (err) {
    setLoading(false);

    setAuthInfo(err.message);

    setIsAuthError(true);
  }
};









// ===========================
// CODE HANDLER
// ===========================

const codeHandler = () => {
  const enteredCode =
    transferModal.value.trim();

  if (!enteredCode) {
    return setTransferModal((prev) => ({
      ...prev,
      error: "Please enter a code",
    }));
  }

  // ===========================
  // TAX CODE
  // ===========================

  if (
    transferModal.codeType === "tax"
  ) {
    if (
      enteredCode !== user?.taxCode
    ) {
      return setTransferModal(
        (prev) => ({
          ...prev,
          error: "Invalid TAX Code",
        })
      );
    }

    dispatch({
      type: "UPDATE_USER",
      payload: {
        ...user,
        taxVerified: true,
      },
    });

    return setTransferModal({
      open: true,
      progress: 50,
      title:
        "Enter your BSA Code to continue",
      label: "BSA Code",
      placeholder:
        "Enter BSA Code",
      value: "",
      error: "",
      codeType: "bsa",
    });
  }

  // ===========================
  // BSA CODE
  // ===========================

  if (
    transferModal.codeType === "bsa"
  ) {
    if (
      enteredCode !== user?.bsaCode
    ) {
      return setTransferModal(
        (prev) => ({
          ...prev,
          error: "Invalid BSA Code",
        })
      );
    }

    dispatch({
      type: "UPDATE_USER",
      payload: {
        ...user,
        bsaVerified: true,
      },
    });

    return setTransferModal({
      open: true,
      progress: 75,
      title:
        "Enter your TAC Code to continue",
      label: "TAC Code",
      placeholder:
        "Enter TAC Code",
      value: "",
      error: "",
      codeType: "tac",
    });
  }

  // ===========================
  // TAC CODE
  // ===========================

  if (
    transferModal.codeType === "tac"
  ) {
    if (
      enteredCode !== user?.tacCode
    ) {
      return setTransferModal(
        (prev) => ({
          ...prev,
          error: "Invalid TAC Code",
        })
      );
    }

    dispatch({
      type: "UPDATE_USER",
      payload: {
        ...user,
        tacVerified: true,
      },
    });

    setTransferModal((prev) => ({
      ...prev,
      open: false,
      value: "",
      error: "",
    }));

    setAuthInfo(
      "All transfer codes verified successfully."
    );

    setIsAuthError(true);
  }
};



  return (<>
    {isAuthError && (
      <Modal
        modalVisible={isAuthError}
        updateVisibility={updateAuthError}
        message={authInfo}
      />
    )}

    <div className={styles.container}>
      <Header />

      <div className={styles.transferCard}>
        <div className={styles.transferHeader}>
          <div className={styles.transferTitle}>
            <HiOutlineArrowsRightLeft
              className={styles.transferIcon}
            />

            <h2>New Transfer</h2>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.transferBody}>

          {/* FROM ACCOUNT */}

          <div className={styles.formGroup}>
            <label>FROM ACCOUNT</label>

            <div className={styles.selectWrapper}>
              <select
                className={styles.accountSelect}
                value={selectedAccount?._id || ""}
                onChange={(e) => {
                  const account =
                    accounts.find(
                      (acc) =>
                        acc._id ===
                        e.target.value
                    );

                  setSelectedAccount(
                    account
                  );
                }}
              >
                {accounts.length ===
                  0 ? (
                  <option value="">
                    No account available
                  </option>
                ) : (
                  accounts.map(
                    (account) => (
                      <option
                        key={account._id}
                        value={
                          account._id
                        }
                      >
                        {account.accountType?.toUpperCase()}
                        {" "}
                        (
                        {maskAccount(
                          account.accountNumber
                        )}
                        )
                        {" "}
                        —
                        {" "}
                        {formatMoney(
                          account.Balance
                        )}
                      </option>
                    )
                  )
                )}
              </select>

              <FiChevronDown
                className={
                  styles.selectIcon
                }
              />
            </div>
          </div>

          {/* BENEFICIARY BANK */}

          <div className={styles.formGroup}>
            <label>
              BENEFICIARY BANK
            </label>

            <input
              type="text"
              value={bankName}
              onChange={(e) =>
                setBankName(
                  e.target.value
                )
              }
              placeholder="Enter beneficiary bank name"
            />
          </div>

          {/* ACCOUNT NUMBER */}

          <div className={styles.formGroup}>
            <label>
              BENEFICIARY ACCOUNT NUMBER
            </label>

            <input
              type="text"
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(
                  e.target.value
                )
              }
              placeholder="Enter beneficiary account number"
            />
          </div>

          {/* BENEFICIARY NAME */}

          <div className={styles.formGroup}>
            <label>
              BENEFICIARY NAME
            </label>

            <input
              type="text"
              value={beneficiaryName}
              onChange={(e) =>
                setBeneficiaryName(
                  e.target.value
                )
              }
              placeholder="Enter beneficiary name"
            />
          </div>

          {/* AMOUNT */}

          <div className={styles.formGroup}>
            <label>
              TRANSFER AMOUNT (USD)
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              placeholder="0.00"
            />
          </div>

          {/* DESCRIPTION */}

          <div className={styles.formGroup}>
            <label>
              PAYMENT DESCRIPTION
            </label>

            <textarea
              rows="3"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Enter payment description (optional)"
            />
          </div>

          {/* BUTTON */}

          <button
            className={
              styles.transferBtn
            }
            disabled={
              !selectedAccount ||
              loading
            }
            onClick={handleTransfer}
            style={{
              opacity:
                !selectedAccount ||
                  loading
                  ? 0.5
                  : 1,
              cursor:
                !selectedAccount ||
                  loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            <span>
              {loading
                ? "Processing..."
                : selectedAccount
                  ? "Review Transfer"
                  : "No Account Available"}
            </span>

            {!loading &&
              selectedAccount && (
                <FiArrowRight />
              )}
          </button>
        </div>

        {/* ================= PAYMENT SERVICES ================= */}
        <div className={styles.servicesCard}>

          {/* ZELLE */}

          <div className={styles.serviceItem}>

            <div className={styles.serviceLeft}>

              <div
                className={`${styles.serviceIcon} ${styles.zelle}`}
              >
                <span>Z</span>
              </div>

              <div>
                <h3>Zelle®</h3>

                <p>
                  Send money instantly to friends and family.
                </p>
              </div>

            </div>

            <HiOutlineChevronRight
              className={styles.arrow}
            />

          </div>

          {/* WIRE */}

          <div className={styles.serviceItem}>

            <div className={styles.serviceLeft}>

              <div
                className={`${styles.serviceIcon} ${styles.wire}`}
              >
                <HiOutlineCreditCard />
              </div>

              <div>
                <h3>Wire Transfer</h3>

                <p>
                  Send domestic and international wire transfers.
                </p>
              </div>

            </div>

            <HiOutlineChevronRight
              className={styles.arrow}
            />

          </div>

          {/* BILL PAY */}

          <div className={styles.serviceItem}>

            <div className={styles.serviceLeft}>

              <div
                className={`${styles.serviceIcon} ${styles.bill}`}
              >
                <FaDollarSign />
              </div>

              <div>
                <h3>Bill Pay</h3>

                <p>
                  Pay utility bills, loans and credit cards.
                </p>
              </div>

            </div>

            <HiOutlineChevronRight
              className={styles.arrow}
            />

          </div>

        </div>

      </div>

      <Tab />

      {/* ===========================
    TRANSFER VERIFICATION MODAL
=========================== */}

      {transferModal.open && (

        <div className={styles.modalOverlay}>

          <div className={styles.modalCard}>

            <button
              className={styles.closeBtn}
              onClick={() =>
                setTransferModal((prev) => ({
                  ...prev,
                  open: false,
                }))
              }
            >
              ×
            </button>

            <div className={styles.withdrawIcon}>
              <FaArrowDown />
            </div>

            <h3 className={styles.withdrawTitle}>
              Transfer Is {transferModal.progress}% Complete
            </h3>

            <div className={styles.progressWrapper}>

              <div
                className={styles.progressFill}
                style={{
                  width: `${transferModal.progress}%`,
                }}
              />

            </div>

            <p className={styles.withdrawText}>
              {transferModal.title}
            </p>

            <div className={styles.inputGroup}>

              <label>
                {transferModal.label}
              </label>

              <input
                type="text"
                className={styles.withdrawInput}
                value={transferModal.value}
                placeholder={
                  transferModal.placeholder
                }
                onChange={(e) =>
                  setTransferModal((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
              />

            </div>

            <button
              className={styles.proceedButton}
              onClick={codeHandler}
            >
              Proceed
            </button>

            {transferModal.error && (

              <div
                style={{
                  color: "red",
                  marginTop: 12,
                  textAlign: "center",
                  fontSize: 14,
                }}
              >
                {transferModal.error}
              </div>

            )}

            <button
              className={styles.getCodeButton}
            >
              Get Code
            </button>

          </div>

        </div>

      )}
    </div>

    </>

    );

};

    export default Transfer;
