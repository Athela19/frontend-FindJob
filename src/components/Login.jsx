import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import reg from "../img/reg.svg";
import log from "../img/log.svg";
import "../css/login.css"

function Login() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
  });
  const navigate = useNavigate();

  // Fungsi untuk toggle form
  const handleSignUpClick = () => {
    setIsSignUpMode(true);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Handle login form submit
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.signInEmail.value;
    const password = event.target.signInPassword.value;

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (response.status === 200) {
        navigate("/dashboard"); // Arahkan ke halaman dashboard atau home
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.msg || "Login failed. Please try again."
      );
    }
  };

  // Handle sign-up form submit
  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    const { name, email, password, confPassword } = signUpData;

    if (password !== confPassword) {
      setErrorMessage("Password dan Konfirmasi Password tidak sesuai.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password harus memiliki minimal 6 karakter.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/users", {
        name,
        email,
        password,
        confpassword: confPassword, // Sesuai dengan parameter backend
      });

      setSuccessMessage("Registrasi berhasil! Silakan login.");
      setErrorMessage("");
      setTimeout(() => {
        setIsSignUpMode(false);
      }, 2000); // Beralih ke mode login setelah 2 detik
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "Terjadi kesalahan.");
      setSuccessMessage("");
    }
  };

  // Handle input perubahan untuk Sign-Up
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={`loginContainer ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign In Form */}
          <form
            className="sign-in-form"
            autoComplete="off"
            onSubmit={handleLoginSubmit}
          >
            <h2 className="judul">Log In</h2>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <div className="input-field">
              <i>
                {" "}
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
              </i>
              <input
                type="email"
                id="signInEmail"
                name="signInEmail"
                placeholder="Email"
                required
              />
            </div>
            <div className="input-field">
              <i>
                {" "}
                <FontAwesomeIcon icon={faLock} className="icon" />
              </i>
              <input
                type="password"
                id="signInPassword"
                name="signInPassword"
                placeholder="Password"
                required
              />
            </div>
            <input type="submit" value="Login" className="btn solid" />
          </form>

          {/* Sign Up Form */}
          <form
            className="sign-up-form"
            autoComplete="off"
            onSubmit={handleSignUpSubmit}
          >
            <h2 className="judul">Register</h2>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && (
              <p style={{ color: "green" }}>{successMessage}</p>
            )}
            <div className="input-field">
              <i>
                <FontAwesomeIcon icon={faUser} className="icon" />
              </i>
              <input
                type="text"
                name="name"
                placeholder="Username"
                value={signUpData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-field">
              <i>
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
              </i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-field">
              <i>
                <FontAwesomeIcon icon={faLock} className="icon" />
              </i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-field">
              <i>
                <FontAwesomeIcon icon={faLock} className="icon" />
              </i>
              <input
                type="password"
                name="confPassword"
                placeholder="Confirm Password"
                value={signUpData.confPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <input type="submit" value="Register" className="btn solid" />
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel-edt left-panel-edt">
          <div className="content">
            <h3>New here?</h3>
            <p>
              Join us to enjoy our services and make your experience better.
            </p>
            <button className="btn transparent" onClick={handleSignUpClick}>
              Sign up
            </button>
          </div>
          <img src={reg} className="image" alt="Register" />
        </div>
        <div className="panel-edt right-panel-edt">
          <div className="content">
            <h3>One of us?</h3>
            <p>Welcome back! Login to continue your journey.</p>
            <button className="btn transparent" onClick={handleSignInClick}>
              Sign in
            </button>
          </div>
          <img src={log} className="image" alt="Login" />
        </div>
      </div>
    </div>
  );
}

export default Login;
