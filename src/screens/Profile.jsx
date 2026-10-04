import React, { useState } from "react";
import styles from "./Profile.module.css";
import { FiCamera } from "react-icons/fi";

import Tab from '../components/Bottom.js'
import Header from '../components/Header.js'
import {
    HiArrowUp,
    HiOutlineCreditCard,
    HiOutlineShieldCheck,
    HiOutlineLockClosed,
    HiOutlineArrowRightOnRectangle
} from "react-icons/hi2";


import { HiOutlinePencilSquare } from "react-icons/hi2";






import {
    HiOutlineUser,
    HiOutlineEnvelope,
    HiOutlinePhone
} from "react-icons/hi2";


const Profile = () => {



    return (

        <div className={styles.container}>
            {/* HEADER */}
            <Header />

            {/* ================= PROFILE HERO ================= */}

            <div className={styles.profileHero}>

                <div className={styles.profileWrapper}>

                    <div className={styles.avatarContainer}>

                        <div className={styles.avatar}>
                            BE
                        </div>

                        <button className={styles.cameraBtn}>
                            <FiCamera />
                        </button>

                    </div>


                    <div className={styles.profileInfo}>

                        <h2>Bryan Edison Greg</h2>

                        <span className={styles.memberBadge}>
                            Chase Premier Member
                        </span>

                    </div>

                </div>

            </div>



            {/* ================= PERSONAL INFORMATION ================= */}

            <div className={styles.infoCard}>

                <div className={styles.infoHeader}>

                    <div className={styles.infoTitle}>

                        <HiOutlineUser className={styles.headerIcon} />

                        <h3>Personal Information</h3>

                    </div>

                </div>

                <div className={styles.infoDivider}></div>

                {/* EMAIL */}

                <div className={styles.infoRow}>

                    <div className={styles.iconBox}>
                        <HiOutlineEnvelope />
                    </div>

                    <div className={styles.infoContent}>

                        <span>Email</span>

                        <h4>bryangregprivate@gmail.com</h4>

                    </div>

                </div>

                {/* PHONE */}

                <div className={styles.infoRow}>

                    <div className={styles.iconBox}>
                        <HiOutlinePhone />
                    </div>

                    <div className={styles.infoContent}>

                        <span>Phone</span>

                        <h4>+1 469 475 4224</h4>

                    </div>

                </div>

            </div>












            {/* ================= ACCOUNT DETAILS ================= */}

<div className={styles.accountCard}>

    <div className={styles.accountHeader}>

        <div className={styles.accountHeaderTitle}>

            <HiOutlineCreditCard className={styles.accountHeaderIcon} />

            <h3>Account Details</h3>

        </div>

    </div>

    <div className={styles.accountDivider}></div>

    {/* ===== CHASE SAVINGS ===== */}

    <div className={styles.accountSection}>

        <div className={styles.accountTop}>

            <h4>CHASE SAVINGS</h4>

            <span>$700,000.00</span>

        </div>

        <div className={styles.accountInfo}>

            <div className={styles.accountRow}>

                <p>Account Number</p>

                <strong>8236534497</strong>

            </div>

            <div className={styles.accountRow}>

                <p>Routing Number</p>

                <strong>021000021</strong>

            </div>

            <div className={styles.accountRow}>

                <p>ACH Number</p>

                <strong>8236534497</strong>

            </div>

        </div>

    </div>

    <div className={styles.accountDivider}></div>

    {/* ===== CHECKING ===== */}

    <div className={styles.accountSection}>

        <div className={styles.accountTop}>

            <h4>TOTAL CHECKING</h4>

            <span>$4,700,000.00</span>

        </div>

       

    </div>

</div>





{/* ================= SECURITY & PRIVACY ================= */}

<div className={styles.securityCard}>

    <div className={styles.securityHeader}>

        <div className={styles.securityTitle}>

            <HiOutlineShieldCheck className={styles.securityHeaderIcon}/>

            <h3>Security & Privacy</h3>

        </div>

    </div>

    <div className={styles.securityDivider}></div>

    <div className={styles.securityBody}>

        <button className={styles.passwordBtn}>

            <HiOutlineLockClosed />

            <span>Change Password</span>

        </button>


        <button className={styles.logoutBtn}>

            <HiOutlineArrowRightOnRectangle />

            <span>Sign Out</span>

        </button>

    </div>

</div>



{/* ================= EDIT PROFILE ================= */}

<div className={styles.editProfileCard}>

    <div className={styles.editProfileHeader}>

        <div className={styles.editProfileTitle}>

            <HiOutlinePencilSquare className={styles.editProfileIcon} />

            <h3>Edit Profile</h3>

        </div>

    </div>

    <div className={styles.editDivider}></div>

    <div className={styles.editBody}>

        <div className={styles.editGroup}>

            <label>FULL NAME</label>

            <input
                type="text"
                defaultValue="Bryan Edison Greg"
            />

        </div>

        <div className={styles.editGroup}>

            <label>USERNAME</label>

            <input
                type="text"
                defaultValue="bryan@gmail.com"
            />

        </div>

        <div className={styles.editGroup}>

            <label>EMAIL</label>

            <input
                type="email"
                defaultValue="bryangregprivate@gmail.com"
            />

        </div>

        <div className={styles.editGroup}>

            <label>PHONE</label>

            <input
                type="text"
                defaultValue="+14694754224"
            />

        </div>

        <button className={styles.saveProfileBtn}>
            Save Changes
        </button>

    </div>

</div>
            {/* Tab  */}
            <Tab />
        </div>

    );

};

export default Profile;