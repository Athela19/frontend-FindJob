import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faFolder,
  faUser,
  faChevronLeft,
  faChevronRight,
  faSignOutAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../css/dashboard.css";
import JobList from "./maincontent/JobList";
import JobUser from "./maincontent/JobUser";
import Profil from "./maincontent/Profil";
import Ulasan from "./maincontent/Ulasan";
import { toast } from "react-toastify";
import user from "../img/user.png";
import Navbar from "./subcomponent/Navbar";

// List of Indonesian cities
const cities = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Semarang",
  "Makassar",
  "Palembang",
  "Depok",
  "Tangerang",
  "Bekasi",
  "Bogor",
  "Malang",
  "Yogyakarta",
  "Denpasar",
  "Balikpapan",
  "Pekanbaru",
  "Padang",
  "Bandar Lampung",
  "Banjarmasin",
];

function Dashboard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState({});
  const [jobs, setJobs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [newJob, setNewJob] = useState({
    pekerjaan: "",
    deskripsi: "",
    alamat: "",
    harga: "",
    noWa: "",
    kota: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchJobs();
    }
  }, [userId, token]);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = JSON.parse(atob(response.data.accessToken.split(".")[1]));
      setName(decoded.name);
      setEmail(decoded.email);
      setUserId(decoded.userId);
    } catch (error) {
      if (error.response) {
        navigate("/login");
      }
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/get");
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        console.error("Gagal mengambil data");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const fetchProfile = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Gagal mengambil data profil");
    }
  };

  const handleInputChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleCitySelect = (city) => {
    setNewJob({ ...newJob, kota: city });
    setShowCityDropdown(false);
  };

  const handleAddJob = async () => {
    if (Object.values(newJob).some((val) => !val)) {
      toast.warn("Harap isi semua bidang!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/give", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newJob, createdBy: name }),
      });

      if (response.ok) {
        fetchJobs();
        setShowJobForm(false);
        setNewJob({
          pekerjaan: "",
          deskripsi: "",
          alamat: "",
          harga: "",
          noWa: "",
          kota: "",
        });
        toast.success("Pekerjaan berhasil ditambahkan! 🎉");
      } else {
        toast.error("Gagal menambahkan pekerjaan.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan. Coba lagi nanti.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.delete("http://localhost:5000/logout", {
        withCredentials: true,
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  return (
    <div className="dashboard-container-db">
      {/* Navbar */}
      <Navbar setShowJobForm={setShowJobForm} />

      {/* Sidebar */}
      <div className={`sidebar-db ${sidebarOpen ? "open" : "closed"}`}>
        <button
          className="toggle-sidebar-db"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FontAwesomeIcon
            icon={sidebarOpen ? faChevronLeft : faChevronRight}
          />
        </button>

        <ul className="sidebar-menu-db">
          <li>
            <Link to="/dashboard">
              <i>
                <FontAwesomeIcon icon={faHome} className="icon" />
              </i>{" "}
              Beranda
            </Link>
          </li>
          <li>
            <Link to="/dashboard/joblist">
              <i>
                <FontAwesomeIcon icon={faFolder} className="icon" />
              </i>{" "}
              Daftar
            </Link>
          </li>
          <li>
            <Link to="/dashboard/customerService">
              <i>
                <FontAwesomeIcon icon={faUser} className="icon" />
              </i>{" "}
              Customer Service
            </Link>
          </li>

          {/* Tombol Logout */}
          <div className="logout-button-db">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="image-profile-sb ">
                  <Link to="/dashboard/profile">
                    <img
                      src={profile.url || user}
                      alt="profile"
                      className="profile-image-sb"
                    />
                  </Link>
                </div>
                <div>
                  <p className="p-logout-name">{name}</p>
                  <p className="p-logout-email">{email}</p>
                </div>
              </div>
              <div>
                <button className="btn-logout" onClick={handleLogout}>
                  <i>
                    <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                  </i>{" "}
                </button>
              </div>
            </div>
          </div>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className={`main-content-db ${sidebarOpen ? "expanded" : "collapsed"}`}
      >
        {showJobForm && (
          <div
            className="modal-overlay-db"
            onClick={() => setShowJobForm(false)}
          >
            <div
              className="modal-content-db"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Tambah Pekerjaan</h3>
              <input
                type="text"
                name="pekerjaan"
                placeholder="Nama Pekerjaan"
                onChange={handleInputChange}
                value={newJob.pekerjaan}
                maxLength={30}
              />
              <input
                type="text"
                name="deskripsi"
                placeholder="Deskripsi"
                onChange={handleInputChange}
                value={newJob.deskripsi}
                maxLength={250}
              />
              
              {/* City Dropdown */}
              <div className="city-dropdown-container">
                <button
                  className="city-dropdown-button-buat"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowCityDropdown(!showCityDropdown);
                  }}
                >
                  {newJob.kota || "Pilih Kota"}
                  <FontAwesomeIcon icon={faChevronDown} className="icon" />
                </button>
                {showCityDropdown && (
                  <div className="city-dropdown">
                    {cities.map((city) => (
                      <div
                        key={city}
                        className="city-dropdown-item"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCitySelect(city);
                        }}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                name="alamat"
                placeholder="Detail Alamat"
                onChange={handleInputChange}
                value={newJob.alamat}
                maxLength={30}
              />
              <input
                type="text"
                name="harga"
                placeholder="Harga"
                onChange={handleInputChange}
                value={newJob.harga}
                maxLength={30}
              />
              <input
                type="text"
                name="noWa"
                placeholder="Nomor WhatsApp"
                onChange={handleInputChange}
                value={newJob.noWa}
              />
              <div className="modal-buttons-db">
                <button className="add-job-btn-db" onClick={handleAddJob}>
                  Tambah
                </button>
                <button
                  className="cancel-btn-db"
                  onClick={() => setShowJobForm(false)}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="joblist" element={<JobUser />} />
          <Route path="profile" element={<Profil />} />
          <Route path="customerService" element={<Ulasan />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;