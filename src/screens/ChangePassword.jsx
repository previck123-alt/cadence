import React from 'react';
import styles from './ChangePassword.module.css';

import { HiOutlineLockClosed } from "react-icons/hi2";

import Tab from '../components/Bottom.js'
import Header from '../components/Header.js'

const ChangePassword = () => {
    return (
        <div className={styles.container}>
            {/* HEADER */}
            <Header />

            {/* ================= CHANGE PASSWORD ================= */}
            <div className={styles.changePasswordCard}>
                <div className={styles.changePasswordHeader}>
                    <div className={styles.changePasswordTitle}>
                        <HiOutlineLockClosed className={styles.changePasswordIcon} />
                        <h3>Change Password</h3>
                    </div>
                </div>

                <div className={styles.changeDivider}></div>

                <div className={styles.changeBody}>
                    <div className={styles.passwordGroup}>
                        <label>CURRENT PASSWORD</label>
                        <input
                            type="password"
                            placeholder=""
                        />
                    </div>

                    <div className={styles.passwordGroup}>
                        <label>NEW PASSWORD</label>
                        <input
                            type="password"
                            placeholder=""
                        />
                    </div>

                    <div className={styles.passwordGroup}>
                        <label>CONFIRM NEW PASSWORD</label>
                        <input
                            type="password"
                            placeholder=""
                        />
                    </div>

                    <button className={styles.updatePasswordBtn}>
                        Update Password
                    </button>
                </div>

                <button className={styles.backProfileBtn}>
                    ← Back to Profile
                </button>
            </div>

            <Tab />
        </div>
    );
};

export default ChangePassword;