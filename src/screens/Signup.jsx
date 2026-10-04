import React, { useState, useCallback } from "react";
import styles from "./Signup.module.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { signup } from "../store/action/userAppStorage";

import {
    HiOutlineUser,
    HiOutlineEnvelope,
    HiOutlinePhone,
    HiOutlineLockClosed,
    HiOutlineIdentification,
    HiOutlineArrowRight
} from "react-icons/hi2";

const Signup = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    /*=========================================
                FORM STATES
    =========================================*/

    const [fullName, setFullName] = useState("");
    const [fullNameError, setFullNameError] = useState("");

    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    /*=========================================
                UI STATES
    =========================================*/

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isErrorInfo, setIsErrorInfo] = useState("");

    /*=========================================
                FORM VALIDITY
    =========================================*/

    const isFormValid =
        fullName &&
        !fullNameError &&
        username &&
        !usernameError &&
        email &&
        !emailError &&
        phone &&
        !phoneError &&
        password &&
        !passwordError &&
        confirmPassword &&
        !confirmPasswordError;

    /*=========================================
                INPUT HANDLER
    =========================================*/

    const handleChange = useCallback((e) => {

        const { name, value } = e.target;

        setIsError(false);

        switch (name) {

            case "fullName":

                setFullName(value);

                setFullNameError(
                    value.trim()
                        ? ""
                        : "Full Name is required"
                );

                break;

            case "username":

                setUsername(value);

                setUsernameError(
                    value.trim()
                        ? ""
                        : "Username is required"
                );

                break;

            case "email":

                setEmail(value);

                if (!value.trim()) {

                    setEmailError("Email is required");

                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                ) {

                    setEmailError("Invalid email address");

                } else {

                    setEmailError("");

                }

                break;

            case "phone":

                setPhone(value);

                setPhoneError(
                    value.trim()
                        ? ""
                        : "Phone number is required"
                );

                break;

            case "password":

                setPassword(value);

                if (!value) {

                    setPasswordError("Password is required");

                } else if (value.length < 6) {

                    setPasswordError("Minimum of 6 characters");

                } else {

                    setPasswordError("");

                }

                if (
                    confirmPassword &&
                    confirmPassword !== value
                ) {

                    setConfirmPasswordError(
                        "Passwords do not match"
                    );

                } else {

                    setConfirmPasswordError("");

                }

                break;

            case "confirmPassword":

                setConfirmPassword(value);

                if (!value) {

                    setConfirmPasswordError(
                        "Confirm your password"
                    );

                } else if (value !== password) {

                    setConfirmPasswordError(
                        "Passwords do not match"
                    );

                } else {

                    setConfirmPasswordError("");

                }

                break;

            default:
                break;

        }

    }, [password, confirmPassword]);

    /*=========================================
                SUBMIT
    =========================================*/

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!isFormValid) return;

        setIsLoading(true);

        const data = {

            fullName,
            username,
            email,
            phone,
            password,
            confirmPassword

        };

        const response = await dispatch(signup(data));

        setIsLoading(false);

        if (!response.bool) {

            setIsError(true);

            setIsErrorInfo(response.message);

            setTimeout(() => {

                navigate(response.url);

            }, 3000);

        } else {

            setTimeout(() => {

                navigate(response.url);

            }, 3000);

        }

    };

    const closeModal = () => {

        setIsError(false);

    };

    return (

        <>

            {isLoading && <Loader />}

            {isError &&

                <Modal
                    content={isErrorInfo}
                    closeModal={closeModal}
                />

            }

            <div className={styles.container}>

                <div className={styles.signupWrapper}>

                    {/* LEFT SIDE */}

                    <div className={styles.leftSection}>

                        <div className={styles.brand}>

                            <div className={styles.logo}>
                                C
                            </div>

                            <h1>
                                cadence Online Banking
                            </h1>

                            <p>

                                Open your secure digital banking account in just a
                                few minutes. Manage your finances, transfer money,
                                pay bills and monitor your accounts anytime,
                                anywhere.

                            </p>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}

                    <div className={styles.rightSection}>

                        <form
                            className={styles.signupCard}
                            onSubmit={handleSubmit}
                        >

                            <h2>Create Account</h2>

                            <p className={styles.subtitle}>

                                Complete the information below to get started.

                            </p>

                            {/* FULL NAME */}

                            <div className={styles.inputGroup}>

                                <label>FULL NAME</label>

                                <div className={styles.inputWrapper}>

                                    <HiOutlineUser
                                        className={styles.inputIcon}
                                    />

                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        value={fullName}
                                        onChange={handleChange}
                                    />

                                </div>

                                {fullNameError &&
                                    <small>{fullNameError}</small>
                                }

                            </div>

                            {/* USERNAME */}

                            <div className={styles.inputGroup}>

                                <label>USERNAME</label>

                                <div className={styles.inputWrapper}>

                                    <HiOutlineIdentification
                                        className={styles.inputIcon}
                                    />

                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Choose a username"
                                        value={username}
                                        onChange={handleChange}
                                    />

                                </div>

                                {usernameError &&
                                    <small>{usernameError}</small>
                                }

                            </div>

                            {/* EMAIL */}

                            <div className={styles.inputGroup}>

                                <label>EMAIL ADDRESS</label>

                                <div className={styles.inputWrapper}>

                                    <HiOutlineEnvelope
                                        className={styles.inputIcon}
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={handleChange}
                                    />

                                </div>

                                {emailError &&
                                    <small>{emailError}</small>
                                }

                            </div>

                                                        {/* PHONE */}

                            <div className={styles.inputGroup}>

                                <label>PHONE NUMBER</label>

                                <div className={styles.inputWrapper}>

                                    <HiOutlinePhone
                                        className={styles.inputIcon}
                                    />

                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        value={phone}
                                        onChange={handleChange}
                                    />

                                </div>

                                {phoneError &&
                                    <small>{phoneError}</small>
                                }

                            </div>

                            {/* PASSWORD */}

                            <div className={styles.inputGroup}>

                                <label>PASSWORD</label>

                                <div className={styles.inputWrapper}>

                                    <HiOutlineLockClosed
                                        className={styles.inputIcon}
                                    />

                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Create password"
                                        value={password}
                                        onChange={handleChange}
                                    />

                                </div>

                                {passwordError &&
                                    <small>{passwordError}</small>
                                }

                            </div>

                            {/* CONFIRM PASSWORD */}

                            <div className={styles.inputGroup}>

                                <label>CONFIRM PASSWORD</label>

                                <div className={styles.inputWrapper}>

                                    <HiOutlineLockClosed
                                        className={styles.inputIcon}
                                    />

                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={handleChange}
                                    />

                                </div>

                                {confirmPasswordError &&
                                    <small>{confirmPasswordError}</small>
                                }

                            </div>

                            <button
                                type="submit"
                                disabled={!isFormValid || isLoading}
                                className={styles.signupBtn}
                            >

                                Create Account

                                <HiOutlineArrowRight />

                            </button>

                            <div className={styles.loginSection}>

                                <span>

                                    Already have an account?

                                </span>

                                <button
                                    type="button"
                                    className={styles.loginBtn}
                                    onClick={() => navigate("/login")}
                                >

                                    Sign In

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </>

    );

};

export default Signup;