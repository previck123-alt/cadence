import React, { useState, useCallback } from "react";
import styles from "./Signup.module.css";

import { FiEye, FiEyeOff } from "react-icons/fi";

import {
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiOutlineArrowRight
} from "react-icons/hi2";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login } from "../store/action/userAppStorage";

import Loader from "../components/Loader";
import Modal from "../components/Modal";


const Login = () => {


    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [userEmail,setUserEmail] = useState("");
    const [userPassword,setUserPassword] = useState("");

    const [userEmailError,setUserEmailError] = useState("");
    const [userPasswordError,setUserPasswordError] = useState("");

    const [showPassword,setShowPassword] = useState(false);
    const [remember,setRemember] = useState(false);
    const [token,setToken] = useState(false);


    const [isLoading,setIsLoading] = useState(false);
    const [isError,setIsError] = useState(false);
    const [isErrorInfo,setIsErrorInfo] = useState("");
    const [isUrl,setIsUrl] = useState("");



    const isFormValid =
        userEmail &&
        !userEmailError &&
        userPassword &&
        !userPasswordError;



    const handleChange = useCallback((e)=>{


        setIsError(false);


        const {name,value} = e.target;



        if(name === "email"){

            setUserEmail(value);


            if(!value.trim()){

                setUserEmailError(
                    "Email is required"
                );

            }
            else if(
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ){

                setUserEmailError(
                    "Invalid email address"
                );

            }
            else{

                setUserEmailError("");

            }

        }




        if(name === "password"){


            setUserPassword(value);


            if(!value.trim()){

                setUserPasswordError(
                    "Password is required"
                );

            }
            else if(value.length < 6){

                setUserPasswordError(
                    "Minimum of 6 characters"
                );

            }
            else{

                setUserPasswordError("");

            }

        }


    },[]);







    const submitHandler = async(e)=>{


        e.preventDefault();


        if(!isFormValid)
            return;



        setIsLoading(true);



        try{


            const response =
                await dispatch(
                    login({

                        email:userEmail,

                        password:userPassword,

                        remember,

                        token

                    })
                );



            setIsLoading(false);

            setIsError(true);

            setIsErrorInfo(response.message);

            setIsUrl(response.url);



        }catch(error){


            setIsLoading(false);

            setIsError(true);

            setIsErrorInfo(
                "Something went wrong. Please try again."
            );

        }


    };





    const closeModal = ()=>{


        setIsError(false);


        if(isUrl){

            navigate(isUrl);

        }

    };





return (

<>


{
isLoading &&
<Loader/>
}



{
isError &&

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

xpress Online Banking

</h1>



<p>

Securely access your account, manage your finances,
transfer money and monitor your banking activity
anytime, anywhere.

</p>



</div>


</div>







{/* RIGHT SIDE */}



<div className={styles.rightSection}>


<form

className={styles.signupCard}

onSubmit={submitHandler}

>


<h2>

Welcome Back

</h2>



<p className={styles.subtitle}>

Sign in to continue to your account.

</p>







<div className={styles.inputGroup}>


<label>

EMAIL ADDRESS

</label>



<div className={styles.inputWrapper}>


<HiOutlineEnvelope

className={styles.inputIcon}

/>



<input

type="email"

name="email"

placeholder="Enter your email"

value={userEmail}

onChange={handleChange}

/>


</div>



{
userEmailError &&
<small>
{userEmailError}
</small>
}



</div>









<div className={styles.inputGroup}>


<label>

PASSWORD

</label>



<div className={styles.inputWrapper}>


<HiOutlineLockClosed

className={styles.inputIcon}

/>



<input


type={
showPassword
?
"text"
:
"password"
}


name="password"


placeholder="Enter your password"


value={userPassword}


onChange={handleChange}


/>



<button

type="button"

className={styles.eyeBtn}

onClick={()=>
setShowPassword(!showPassword)
}

>


{
showPassword
?
<FiEyeOff/>
:
<FiEye/>
}


</button>



</div>




{
userPasswordError &&
<small>
{userPasswordError}
</small>
}



</div>







<div className={styles.options}>


<label>


<input

type="checkbox"

checked={remember}

onChange={()=>
setRemember(!remember)
}

/>


Remember me


</label>




<label>


<input

type="checkbox"

checked={token}

onChange={()=>
setToken(!token)
}

/>


Use token


</label>



</div>








<button

type="submit"

disabled={
!isFormValid ||
isLoading
}

className={styles.signupBtn}

>


Sign In


<HiOutlineArrowRight/>


</button>








<div className={styles.loginSection}>


<span>

Don't have an account?

</span>



<button

type="button"

className={styles.loginBtn}

onClick={()=>
navigate("/signup")
}

>

Create Account

</button>



</div>





</form>


</div>





</div>


</div>


</>


);


};


export default Login;