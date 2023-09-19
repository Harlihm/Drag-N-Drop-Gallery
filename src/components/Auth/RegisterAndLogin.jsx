/* eslint-disable no-unused-vars */
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { database } from "../../FireBaseConfig";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./RegisterAndLogin.css"
const RegisterAndLogin = () => {
    const [login, setLogin] = useState(false);

    const history = useNavigate();

    const handleSubmit = (e, type) => {
        e.preventDefault();
        const email = e.target.email.value
        const password = e.target.password.value
        if (type == 'signup') {
            createUserWithEmailAndPassword(database, email, password).then(data => {
                // console.log(data,"auth Data");
                history("/home")
            }).catch(err => {
                alert(err.code);
            })
        } else {
            signInWithEmailAndPassword(database, email, password).then(data => {
                // console.log(data,"auth Data");
                history("/home")
            }).catch(err => {
                alert(err.code);
                setLogin(true);
            })

        }

    }

    return (

        <section>
            <div className="login_wrapper">
                <div className="Sigin_out">
                    <div className={login == false ? "activeColor" : "pointer"} onClick={() => setLogin(false)}>
                        Sign Up
                    </div>
                    <div className={login == true ? "activeColor" : "pointer"} onClick={() => setLogin(true)}>
                        Sign In
                    </div>
                </div>
                <h1>{login ? "SIGN IN TO YOUR ACCOUT" : "SIGN UP FOR AN ACCOUNT"} </h1>
                <form className="login_form" onSubmit={(e) => { handleSubmit(e, login ? "signin" : "signup") }}>
                    <input type="text" name="email" placeholder="Email" />
                    <input type="password" name="password" placeholder="Password" />
                    <button className="log_btn">{login ? "SIGN IN" : "SIGN UP"}</button>
                </form>
            </div>
        </section>
    )
}

export default RegisterAndLogin
