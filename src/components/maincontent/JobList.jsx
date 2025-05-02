import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faMapLocation,
  faMoneyBill,
  faEdit,
  faUser,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import denied from "../../img/denied.svg";
import user from "../../img/user.png";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import search from "../../img/search.svg";
import Footer from "../subcomponent/Footer";

dayjs.extend(relativeTime);

const JobList = () => {
  const [token, setToken] = useState("");
  const [jobs, setJobs] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  // List of Indonesian cities
  const cities = [
    "Semua Kota",
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

  useEffect(() => {
    const fetchData = async () => {
      await refreshToken();
      await fetchJobs();
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
    } catch (error) {
      navigate("/login");
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/get");
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
        fetchProfiles(data);
      } else {
        console.error("Gagal mengambil data");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const fetchProfiles = async (jobList) => {
    let profileData = {};
    for (const job of jobList) {
      if (!profileData[job.userId]) {
        try {
          const response = await axios.get(
            `http://localhost:5000/profile/${job.userId}`
          );
          profileData[job.userId] = response.data.url;
        } catch (error) {
          console.error(
            `Gagal mengambil foto profil untuk userId ${job.userId}`
          );
        }
      }
    }
    setProfiles(profileData);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.pekerjaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = 
      selectedCity === "" || 
      selectedCity === "Semua Kota" ||
      job.kota.toLowerCase().includes(selectedCity.toLowerCase());
    
    return matchesSearch && matchesCity;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  return (
    <div>
      <div className="hero-db">
        <div className="floating-boxes">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="floating-box"></div>
          ))}
        </div>

        <div className="content-db">
          <h1>
            Get <span>Your Job</span>
          </h1>
          <h1>
            Change <span>Your Life</span>
          </h1>
          <p>Find your job based on your choice, with us.</p>
          <div className="navbar-search-db">
            {window.location.pathname !== "/dashboard/saya" && (
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Cari Pekerjaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="city-dropdown-container">
                  <button 
                    className="city-dropdown-button"
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                  >
                    {selectedCity || "Semua Kota"} 
                    <FontAwesomeIcon icon={faChevronDown} className="icon" />
                  </button>
                  {showCityDropdown && (
                    <div className="city-dropdown">
                      {cities.map((city) => (
                        <div
                          key={city}
                          className="city-dropdown-item"
                          onClick={() => {
                            setSelectedCity(city === "Semua Kota" ? "" : city);
                            setShowCityDropdown(false);
                          }}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="gambar-db">
          <img src={search} alt="work" />
        </div>
      </div>

      <h2>Cari Lowongan Pekerjaan</h2>
      {jobs.length === 0 ? (
        <div className="no-jobs-container">
          <img
            src={denied}
            alt="Tidak ada pekerjaan"
            className="no-jobs-image"
          />
          <p className="no-jobs-message">Belum ada pekerjaan yang tersedia.</p>
        </div>
      ) : (
        <div>
          <ul className="job-list-db">
            {currentItems.map((job) => (
              <li
                key={job.id}
                className="job-item-db"
                onClick={() => setSelectedJob(job)}
              >
                <div className="job-left">
                  <div className="author">
                    <div className="author-img">
                      <img
                        src={profiles[job.userId] || user}
                        alt="Profile"
                        className="profile-image-list"
                      />
                    </div>
                    <div className="author-text">
                      <p>{job.username}</p>
                      <h3 className="nama-job">
                        {job.pekerjaan.length > 30
                          ? job.pekerjaan.slice(0, 30) + "..."
                          : job.pekerjaan}
                      </h3>
                    </div>
                  </div>
                  <p className="isi-job">
                    <strong>
                      <i>
                        <FontAwesomeIcon
                          icon={faMapLocation}
                          className="icon"
                        />
                      </i>
                    </strong>{" "} {job.kota}, {job.alamat}
                  </p>
                  <p className="isi-job">
                    <strong>
                      <i>
                        <FontAwesomeIcon icon={faEdit} className="icon" />
                      </i>
                    </strong>{" "}
                    {job.deskripsi.length > 25
                      ? job.deskripsi.slice(0, 25) + "..."
                      : job.deskripsi}
                  </p>
                </div>
                <div className="job-right">
                  <p>
                    <i>
                      <FontAwesomeIcon icon={faMoneyBill} className="icon" />
                    </i>{" "}
                    {job.harga}
                  </p>
                  <code
                    style={{
                      color: "grey",
                      fontFamily: "arial",
                      fontSize: "14px",
                      marginTop: "1.3rem",
                    }}
                  >
                    <i>
                      <FontAwesomeIcon icon={faClock} className="icon" />
                    </i>{" "}
                    {dayjs(job.createdAt).fromNow()}
                  </code>
                </div>
              </li>
            ))}
          </ul>
          <div className="pagination-db">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i>
                <FontAwesomeIcon icon={faChevronLeft} className="icon" />
              </i>
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i>
                <FontAwesomeIcon icon={faChevronRight} className="icon" />
              </i>
            </button>
          </div>
        </div>
      )}
      <Footer />

      {selectedJob && (
        <div
          className="modal-overlayjob-db"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="modal-contentjob-db"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="job-left">
              <div className="detailsUp">
                <div className="detail-page1">
                  <div
                    style={{
                      marginBottom: "16px",
                      textAlign: "left",
                    }}
                  >
                    <h1>{selectedJob.pekerjaan}</h1>
                  </div>
                  <div className="detail-atas1">
                    <div style={{ marginRight: "2rem" }}>
                      <i>
                        <FontAwesomeIcon icon={faUser} className="icon" />
                      </i>{" "}
                      {selectedJob.username}
                    </div>
                    <div style={{ color: "grey" }}>
                      <i style={{ color: "grey" }}>
                        <FontAwesomeIcon icon={faClock} className="icon" />
                      </i>{" "}
                      {dayjs(selectedJob.createdAt).fromNow()}
                    </div>
                  </div>
                </div>
                <div className="detail-page2">
                  <a
                    href={`https://wa.me/${selectedJob.noWa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="hubungi-btn-db">
                      Hubungi {selectedJob.username}
                    </button>
                  </a>
                </div>
              </div>
              <div className="detailsDown">
                <div className="detail-page2">
                  <p>
                    <i>
                      <FontAwesomeIcon icon={faMapLocation} className="icon" />
                    </i>{" "}
                    Lokasi : {selectedJob.kota}, {selectedJob.alamat}
                  </p>
                  <p>
                    <i>
                      <FontAwesomeIcon icon={faMoneyBill} className="icon" />
                    </i>{" "}
                    Gaji : {selectedJob.harga}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                    marginTop: "10px",
                    padding: "10px",
                    borderTop: "1px solid lightgrey",
                  }}
                >
                  <p style={{ marginBottom: "6px" }}>
                    <i>
                      <FontAwesomeIcon icon={faEdit} className="icon" />
                    </i>{" "}
                    Deskripsi :
                  </p>
                  <p>{selectedJob.deskripsi}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;