import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPlusCircle
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../img/logo.png"

function Navbar({ setShowJobForm }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Cek apakah lokasi saat ini benar-benar hanya "/" (bukan /dashboard, /dashboard/jobuser, dll)
  const isHomePage = location.pathname === "/";

  return (
    <nav className="navbar-db">
      <div className="navbar-logo-db">
      <img src={logo} alt="logo"></img>
        <p>
          Find<span>Job</span><span style={{ color: "var(--tertiary)" }}>.</span>
        </p>
      </div>

      {isHomePage ? (
        // Navbar untuk halaman "/"
        <div className="navbar-menu-db">
          <ul>
            <li><a href="#home">Beranda</a></li>
            <li><a href="#about">Tentang kami</a></li>
            <li><a href="#creator">Pengembang</a></li>
          </ul>
        </div>
      ) : (
        // Navbar untuk halaman "/dashboard" (default)
        <div className="navbar-user-db">
          <button className="btn-db" onClick={() => setShowJobForm(true)}>
          <FontAwesomeIcon icon={faPlusCircle} className="icon" /> {" "}Buat
          </button>
        </div>
      )}

      {/* Tombol Sign In hanya muncul di halaman "/" */}
      {isHomePage && (
        <div className="navbar-signin-db">
          <button className="btn-db" onClick={() => navigate("/login")}>
            <FontAwesomeIcon icon={faUser} className="icon" /> {" "}Masuk
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
