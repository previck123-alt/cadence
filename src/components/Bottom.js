import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Bottom.module.css";

import {
    HiOutlineCreditCard,
    HiOutlineArrowsRightLeft,
} from "react-icons/hi2";

import { LuReceiptText } from "react-icons/lu";


const Tab = () => {

    const navigate = useNavigate();
    const location = useLocation();


    // =====================================
    // CHANGE YOUR TAB LINKS HERE
    // =====================================

    const tabs = [

        {
            name: "Accounts",
            path: "/dashboard",
            icon: HiOutlineCreditCard
        },


        {
            name: "Pay & Collect",
            path: "/transfer",
            icon: HiOutlineArrowsRightLeft
        },


        {
            name: "Transactions",
            path: "/transactions",
            icon: LuReceiptText
        }

    ];



    return (

        <div className={styles.bottomNav}>

            {
                tabs.map((tab, index) => {

                    const Icon = tab.icon;


                    const isActive =
                        location.pathname === tab.path;



                    return (

                        <div
                            key={index}
                            className={
                                `${styles.navItem} ${
                                    isActive 
                                    ? styles.active 
                                    : ""
                                }`
                            }
                            onClick={() => navigate(tab.path)}
                        >


                            <Icon
                                className={styles.navIcon}
                            />


                            <span className={styles.navText}>
                                {tab.name}
                            </span>



                            {
                                isActive && (

                                    <div
                                        className={
                                            styles.activeDot
                                        }
                                    />

                                )
                            }


                        </div>

                    );

                })
            }


        </div>

    );

};


export default Tab;