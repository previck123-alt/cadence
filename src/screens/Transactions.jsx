import React, { useState } from "react";
import styles from "./Transactions.module.css";

import { useSelector } from "react-redux";

import Tab from "../components/Bottom.js";
import Header from "../components/Header.js";

import {
    HiArrowUp,
    HiArrowDown,
    HiOutlineCreditCard
} from "react-icons/hi2";



const Transactions = () => {


    // ==========================
    // REDUX DATA
    // ==========================

    const {
        user,
        accounts = [],
        histories = []
    } = useSelector(
        (state) => state.userAuth
    );



    // ==========================
    // ACCOUNT STATE
    // ==========================

    const [selectedAccount, setSelectedAccount] =
        useState(null);



    const [transactionFilter, setTransactionFilter] =
        useState("all");



    // ==========================
    // HELPERS
    // ==========================


    const formatMoney = (amount) => {

        if (!amount) return "$0.00";


        return Number(amount).toLocaleString(
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        );
    };



    const maskAccount = (number) => {

        if (!number) return "";


        const value =
            number.toString();


        return `**${value.slice(-4)}`;

    };




    const formatDate = (date) => {

        if (!date) return "";


        return new Date(date)
            .toLocaleString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                }
            );

    };





    // ==========================
    // ACCOUNT SELECTION
    // ==========================


    const activeAccount =
        selectedAccount;



    const selectAccount = (account) => {

        if (account === "all") {

            setSelectedAccount(null);

            return;
        }


        setSelectedAccount(account);

    };






    // ==========================
    // FILTER TRANSACTIONS
    // ==========================


    let filteredTransactions =
        histories || [];



    /*
       If an account is selected,
       only show transactions belonging
       to that account
    */


    if (activeAccount) {

        filteredTransactions =
            filteredTransactions.filter(
                (item) =>

                    item.sourceAccountNumber ===
                    activeAccount.accountNumber

            );

    }




    // ==========================
    // IN / OUT FILTER
    // ==========================


    if (transactionFilter === "in") {

        filteredTransactions =
            filteredTransactions.filter(
                (item) =>

                    item.transactionType !==
                    "Transfer"

            );

    }




    if (transactionFilter === "out") {

        filteredTransactions =
            filteredTransactions.filter(
                (item) =>

                    item.transactionType ===
                    "Transfer"

            );

    }





    // ==========================
    // BALANCE CALCULATION
    // ==========================


    const totalBalance =
        accounts.reduce(
            (total, item) =>

                total +
                Number(item.Balance || 0),

            0
        );





    const currentBalance =
        activeAccount
            ?
            activeAccount.Balance
            :
            totalBalance;




    const currentTransactions =
        filteredTransactions;






    return (

        <div className={styles.container}>


            {/* HEADER */}

            <Header />



            {/*

                PART 2 STARTS HERE:

                ACCOUNT CARDS

            */}
// ================= ACCOUNTS CARDS =================


            // ================= ACCOUNTS CARDS =================


            <div className={styles.accountsSection}>


                {/* ALL ACCOUNTS CARD */}


                <div
                    className={`${styles.accountCard} ${!selectedAccount
                            ? styles.activeCard
                            : ""
                        }`}

                    onClick={() => selectAccount("all")}

                    style={{

                        cursor: "pointer",

                        border:
                            !selectedAccount
                                ?
                                "2px solid #1976d2"
                                :
                                "1px solid #e5e5e5",

                        background:
                            !selectedAccount
                                ?
                                "#f0f7ff"
                                :
                                "#ffffff",

                        transform:
                            !selectedAccount
                                ?
                                "translateY(-3px)"
                                :
                                "translateY(0)",

                        transition: "all 0.25s ease"

                    }}

                >

                    <h3>
                        All Accounts
                    </h3>


                    <p className={styles.accountType}>
                        Overview
                    </p>


                    <h2>
                        {formatMoney(totalBalance)}
                    </h2>


                    <span className={styles.status}>

                        <span className={styles.dot}></span>

                        Active

                    </span>


                </div>





                {/* USER ACCOUNTS */}



                {
                    accounts.map((account) => {


                        const active =
                            selectedAccount?._id ===
                            account._id;



                        return (

                            <div

                                key={account._id}


                                className={`${styles.accountCard} ${active
                                        ?
                                        styles.activeCard
                                        :
                                        ""
                                    }`}


                                onClick={() =>
                                    selectAccount(account)
                                }



                                style={{

                                    cursor: "pointer",


                                    border:

                                        active

                                            ?

                                            "2px solid #1976d2"

                                            :

                                            "1px solid #e5e5e5",



                                    background:

                                        active

                                            ?

                                            "#f0f7ff"

                                            :

                                            "#ffffff",



                                    transform:

                                        active

                                            ?

                                            "translateY(-3px)"

                                            :

                                            "translateY(0)",



                                    boxShadow:

                                        active

                                            ?

                                            "0 8px 20px rgba(25,118,210,0.15)"

                                            :

                                            "none",



                                    transition:
                                        "all 0.25s ease"

                                }}



                            >


                                <h3>

                                    {
                                        account.accountType
                                            ?
                                            account.accountType.toUpperCase()
                                            :
                                            "ACCOUNT"
                                    }

                                </h3>



                                <p className={styles.accountNumber}>

                                    {
                                        maskAccount(
                                            account.accountNumber
                                        )
                                    }

                                </p>




                                <h2>

                                    {
                                        formatMoney(
                                            account.Balance
                                        )
                                    }

                                </h2>



                                <span className={styles.status}>


                                    <span className={styles.dot}></span>


                                    Active


                                </span>


                                {
                                    active && (

                                        <div
                                            style={{

                                                marginTop: "10px",

                                                fontSize: "12px",

                                                color: "#1976d2",

                                                fontWeight: "600"

                                            }}
                                        >

                                            Selected Account

                                        </div>

                                    )
                                }



                            </div>

                        );


                    })
                }


            </div>








            {/* ================= CURRENT BALANCE ================= */}



            <div className={styles.balanceCard}>


                <div className={styles.balanceTop}>


                    <div>


                        <p className={styles.balanceLabel}>

                            CURRENT BALANCE

                        </p>




                        <h1 className={styles.balanceAmount}>


                            {
                                formatMoney(
                                    currentBalance
                                )
                            }


                        </h1>





                        <p className={styles.balanceAccount}>


                            {
                                activeAccount
                                    ?
                                    `Account ending in ${maskAccount(
                                        activeAccount.accountNumber
                                    )}`
                                    :
                                    "All Accounts Balance"
                            }


                        </p>




                    </div>





                    <div className={styles.currencyBadge}>

                        USD

                    </div>



                </div>









                <div className={styles.accountDetails}>




                    <div className={styles.detailRow}>


                        <span>
                            Account Number
                        </span>


                        <strong>


                            {
                                activeAccount
                                    ?
                                    activeAccount.accountNumber
                                    :
                                    "Multiple Accounts"
                            }


                        </strong>


                    </div>







                    <div className={styles.detailRow}>


                        <span>
                            Account Type
                        </span>


                        <strong>


                            {
                                activeAccount
                                    ?
                                    activeAccount.accountType?.toUpperCase()
                                    :
                                    "All Accounts"
                            }


                        </strong>


                    </div>







                    <div className={styles.detailRow}>


                        <span>
                            Total Transactions
                        </span>


                        <strong>

                            {
                                currentTransactions.length
                            }

                        </strong>


                    </div>




                </div>



            </div>







            {/* ================= TRANSACTION SECTION START ================= */}


            <div className={styles.transactionSection}>


                <div className={styles.transactionHeader}>


                    <h2>
                        Transaction History
                    </h2>



                    <div className={styles.filterButtons}>


                        <button

                            className={
                                transactionFilter === "all"
                                    ?
                                    styles.activeFilter
                                    :
                                    ""
                            }


                            onClick={() =>
                                setTransactionFilter("all")
                            }

                        >

                            All

                        </button>





                        <button

                            className={
                                transactionFilter === "in"
                                    ?
                                    styles.activeFilter
                                    :
                                    ""
                            }


                            onClick={() =>
                                setTransactionFilter("in")
                            }

                        >

                            In

                        </button>





                        <button

                            className={
                                transactionFilter === "out"
                                    ?
                                    styles.activeFilter
                                    :
                                    ""
                            }


                            onClick={() =>
                                setTransactionFilter("out")
                            }

                        >

                            Out

                        </button>



                    </div>



                </div>






                <div className={styles.transactionCard}>


                    {
                        currentTransactions.length > 0

                            ?

                            currentTransactions.map((item) => {


                                const isOutgoing =
                                    item.transactionType === "Transfer"
                                    ||
                                    item.transactionType === "Debit"
                                    ||
                                    item.transactionType === "withdraw";



                                return (


                                    <div

                                        key={item._id}

                                        className={styles.transactionRow}

                                    >



                                        <div className={styles.leftSection}>



                                            <div
                                                className={styles.iconBox}
                                            >


                                                {
                                                    isOutgoing

                                                        ?

                                                        <HiArrowDown />

                                                        :

                                                        <HiArrowUp />

                                                }


                                            </div>





                                            <div>


                                                <h3>


                                                    {
                                                        item.reason
                                                        ||
                                                        item.transactionType
                                                        ||
                                                        "Transaction"
                                                    }


                                                </h3>





                                                <p>


                                                    {
                                                        formatDate(
                                                            item.date
                                                        )
                                                    }



                                                    <span>
                                                        {" • "}

                                                        {
                                                            item.status === "active"
                                                                ? "Complete"
                                                                : (item.status || "Pending")
                                                        }

                                                    </span>



                                                </p>




                                                {
                                                    item.nameOfBank && (

                                                        <small>


                                                            {
                                                                item.nameOfBank
                                                            }


                                                            {
                                                                item.accountName &&
                                                                ` - ${item.accountName}`
                                                            }


                                                        </small>

                                                    )
                                                }





                                            </div>




                                        </div>









                                        <div className={styles.rightSection}>


                                            <div>


                                                <h4

                                                    style={{
                                                        color:
                                                            isOutgoing
                                                                ?
                                                                "#d32f2f"
                                                                :
                                                                "#1b5e20"
                                                    }}

                                                >


                                                    {
                                                        isOutgoing
                                                            ?
                                                            "-"
                                                            :
                                                            "+"
                                                    }


                                                    {
                                                        formatMoney(
                                                            item.amount
                                                        )
                                                    }


                                                </h4>
                                                <small>
                                                    Fee:{" "}
                                                    {formatMoney(item.fee)}
                                                </small>

                                                <small>
                                                    Bal:{" "}
                                                    {formatMoney(item.Balance ?? item.balance)}
                                                </small>



                                            </div>







                                            <button

                                                className={
                                                    styles.receiptBtn
                                                }

                                                title="View receipt"

                                            >


                                                <HiOutlineCreditCard />


                                            </button>






                                        </div>







                                    </div>


                                );


                            })


                            :



                            <div

                                style={{
                                    padding: "30px",
                                    textAlign: "center",
                                    color: "#777"
                                }}

                            >

                                No transactions found for this account.


                            </div>


                    }



                </div>



            </div>







            {/* Bottom Navigation */}


            <Tab />



        </div>


    );

};


export default Transactions;


