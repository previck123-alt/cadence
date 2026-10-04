import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FiX,
} from "react-icons/fi";

import {
  MdOutlinePhoneIphone,
  MdOutlineDocumentScanner,
  MdOutlineSwapHoriz,
} from "react-icons/md";

import { FaDollarSign } from "react-icons/fa";

import Tab from "../components/Bottom";
import Header from "../components/Header";

import Loader from "../components/Loader";
import Modal from "../components/Modal";



const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ===========================
  // REDUX
  // ===========================
  const { user, histories, accounts } = useSelector(
    (state) => state.userAuth
  );

  // ===========================
  // LOCAL STATES
  // ===========================
  const [quickMenus, setQuickMenus] = useState([
    {
      id: 1,
      title: "Set Up\nApple Pay",
      icon: <MdOutlinePhoneIphone style={{ color: "#fff" }} />,
    },
    {
      id: 2,
      title: "Deposit\nChecks",
      icon: <MdOutlineDocumentScanner style={{ color: "#fff" }} />,
    },
    {
      id: 3,
      title: "Account\nTransfer",
      icon: <MdOutlineSwapHoriz style={{ color: "#fff" }} />,
    },
    {
      id: 4,
      title: "Pay a Bill",
      icon: <FaDollarSign style={{ color: "#fff" }} />,
    },
  ]);

  const [deposits, setDeposits] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorInfo, setIsErrorInfo] = useState("");
  const [isUrl, setIsUrl] = useState("");



  // ===========================
  // FETCH ACCOUNTS
  // ===========================


 
  // ===========================
  // REMOVE QUICK ACTION
  // ===========================
  const removeQuickMenu = (id) => {
    setQuickMenus((prev) => prev.filter((item) => item.id !== id));
  };

  // ===========================
  // MODAL
  // ===========================
  const closeModal = () => {
    setIsError(false);
    setIsErrorInfo("");

    if (isUrl) {
      navigate(isUrl);
    }
  };

  // ===========================
  // HELPERS
  // ===========================
  const formatMoney = (amount) => {
    if (!amount) return "$0.00";

    return Number(amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const maskAccount = (number) => {
    if (!number) return "";

    const value = number.toString();

    return `**${value.slice(-4)}`;
  };

  // ===========================
  // NAVIGATION
  // ===========================
  const openAccount = () => {
    setIsError(true)
    setIsErrorInfo('Contact admin to open a new account')
  };

  const transfer = () => {
    navigate("/transfer");
  };

  const deposit = () => {
    setIsError(true)
    setIsErrorInfo('Contact admin to open a new account')
  };

  return (
    <>
      {isLoading && <Loader />}

      {isError && (
        <Modal
          content={isErrorInfo}
          closeModal={closeModal}
        />
      )}

      <div className={styles.container}>
                {/* HEADER */}
        <Header />

        <div className={styles.quickActions}>
          {quickMenus.map((item) => (
            <div
              className={styles.actionCard}
              key={item.id}
            >
              <button
                className={styles.closeButton}
                onClick={() => removeQuickMenu(item.id)}
              >
                <FiX />
              </button>

              <div className={styles.iconCircle}>
                {item.icon}
              </div>

              <span>
                {item.title.split("\n").map((text, i) => (
                  <span key={i}>
                    {text}
                    <br />
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>

        {/* ACCOUNTS */}
        <section className={styles.accountsCard}>
          <div className={styles.cardHeader}>
            
          </div>

          {/* Total Balance */}
          <div
            className={styles.accountRow}
            style={{
              borderBottom: "1px solid #ececec",
              marginBottom: "12px",
            }}
          >
            <div className={styles.accountLeft}>
              <div className={styles.accountTitle}>
                Accounts
              </div>

              <div className={styles.accountNumber}>
                {accounts.length} Account
                {accounts.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className={styles.accountRight}>
              {formatMoney(
                accounts.reduce(
                  (sum, item) => sum + Number(item.Balance || 0),
                  0
                )
              )}
            </div>
          </div>

          {/* Dynamic Accounts */}
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <div
                className={styles.accountRow}
                key={account._id}
                onClick={transfer}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.accountLeft}>
                  <div className={styles.accountTitle}>
                    {account.accountType?.toUpperCase()}

                    <span className={styles.chevron}>
                      ›
                    </span>
                  </div>

                  <div className={styles.accountNumber}>
                    {maskAccount(
                      account.accountNumber
                    )}
                  </div>
                </div>

                <div className={styles.accountRight}>
                  {formatMoney(account.Balance)}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                padding: "25px",
                textAlign: "center",
                color: "#777",
              }}
            >
              No account found.
            </div>
          )}

          <div
            className={styles.openAccount}
            onClick={openAccount}
            style={{ cursor: "pointer" }}
          >
            <span className={styles.plus}>+</span>
            <span>Open an Account</span>
          </div>
        </section>

        {/* Recent Activity Preview */}
        {deposits.length > 0 && (
          <section
            className={styles.accountsCard}
            style={{ marginTop: "18px" }}
          >
            <div className={styles.cardHeader}>
              <h3>Recent Activity</h3>
            </div>

            {deposits.slice(0, 3).map((item) => (
              <div
                key={item._id}
                className={styles.accountRow}
              >
                <div className={styles.accountLeft}>
                  <div className={styles.accountTitle}>
                    {item.transactionType}
                  </div>

                  <div className={styles.accountNumber}>
                    {item.reason}
                  </div>
                </div>

                <div
                  className={styles.accountRight}
                  style={{
                    color:
                      item.transactionType ===
                        "Transfer" ||
                      item.transactionType ===
                        "Debit" ||
                      item.transactionType ===
                        "withdraw"
                        ? "#d32f2f"
                        : "#1b5e20",
                  }}
                >
                  {formatMoney(item.amount)}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* cadence Offers */}

                <section className={styles.cadenceOffers}>

          <div className={styles.offerHeader}>
            <div>
              <h3>cadence offers</h3>
              <p>Add deals, shop and get money back.</p>
            </div>

            <span className={styles.allOffers}>
              All offers ›
            </span>
          </div>

          <div className={styles.offerCards}>

            <div className={styles.card}>
              <div className={`${styles.logo} ${styles.cardLogo}`}>
                💳
              </div>
              <span>Cards</span>
            </div>

            <div className={`${styles.card} ${styles.office}`}>
              <strong>Office</strong>
              <strong>DEPOT</strong>
              <small>OfficeMax</small>
            </div>

            <div className={`${styles.card} ${styles.nfl}`}>
              <strong>NFL</strong>
              <small>NETWORK</small>
            </div>

            <div className={`${styles.card} ${styles.dell}`}>
              <strong>Dell</strong>
            </div>

            <div className={`${styles.card} ${styles.amazon}`}>
              <strong>amazon</strong>
            </div>

            <div className={`${styles.card} ${styles.spotify}`}>
              <strong>Spotify</strong>
            </div>

          </div>

        </section>

        {/* INVEST SECTION */}

        <section className={styles.quickLinksCard}>

          <div
            className={styles.quickRow}
            onClick={deposit}
            style={{ cursor: "pointer" }}
          >

            <div className={styles.left}>
              <h4>Deposit Funds</h4>
              <p>
                Securely fund your account using your preferred payment
                method.
              </p>
            </div>

            <span className={styles.arrow}>›</span>

          </div>

          <div
            className={styles.quickRow}
            onClick={transfer}
            style={{ cursor: "pointer" }}
          >

            <div className={styles.left}>
              <h4>Transfer Money</h4>
              <p>
                Send money between your accounts or to another bank
                account.
              </p>
            </div>

            <span className={styles.arrow}>›</span>

          </div>

          <div
            className={styles.quickRow}
            onClick={openAccount}
            style={{ cursor: "pointer" }}
          >

            <div className={styles.left}>
              <h4>Open New Account</h4>
              <p>
                Create another checking or savings account in minutes.
              </p>
            </div>

            <span className={styles.arrow}>›</span>

          </div>

        </section>

        {/* ACCOUNT SUMMARY */}


        {/* Bottom Navigation */}

        <Tab />

      </div>
    </>
  );
};

export default Dashboard;