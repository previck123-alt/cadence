import React from "react";
import styles from "./Header.module.css";

import {
    FiPlus,
    FiSearch,
    FiBell,
} from "react-icons/fi";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";



const Header = () => {

    const navigate = useNavigate();

    // ==========================
    // REDUX USER DATA
    // ==========================

    const { user } = useSelector(
        (state) => state.userAuth
    );




    // ==========================
    // USER NAME
    // ==========================


    const fullName = 
        `${user?.firstName || ""} ${user?.lastName || ""}`
        .trim();



    const displayName =
        fullName || "User";





    // ==========================
    // AVATAR INITIALS
    // ==========================


    const getInitials = () => {


        if(!user){
            return "US";
        }


        const first =
            user.firstName
            ?
            user.firstName.charAt(0)
            :
            "";


        const last =
            user.lastName
            ?
            user.lastName.charAt(0)
            :
            "";



        return (
            `${first}${last}`
            ||
            "US"
        ).toUpperCase();


    };







    return (

        <div className={styles.top}>


            <header className={styles.header}>


                <div className={styles.searchBar}>


                    <FiSearch />


                    <input

                        type="text"

                        placeholder="Search in the app"

                    />


                </div>






                <div className={styles.headerRight}>


                    <button 
                        className={styles.iconButton}
                    >

                        <FiBell 
                            style={{
                                color:"#fff"
                            }}
                        />


                    </button>






                    <button
                        type="button"
                        className={styles.avatar}
                        onClick={() => navigate("/profile")}
                        aria-label="Open profile"
                        title="Profile"
                    >
                        {
                            getInitials()
                        }
                    </button>




                </div>





            </header>









            <section className={styles.hero}>


                <div className={styles.heroLeft}>


                    <div>


                        <h2 
                            className={
                                styles.greeting
                            }
                        >

                            Hi, {displayName}


                        </h2>


                    </div>



                </div>





                <button 
                    className={
                        styles.floatingButton
                    }
                >

                    <FiPlus />


                </button>




            </section>




        </div>


    );

};


export default Header;