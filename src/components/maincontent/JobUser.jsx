import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faClock,
  faMapLocation,
  faMoneyBill,
  faTrash,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
import denied from "../../img/denied.svg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { toast } from "react-toastify";

dayjs.extend(relativeTime);

const JobUser = () => {
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    fetchJobs();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = JSON.parse(atob(response.data.accessToken.split(".")[1]));
      setUserId(decoded.userId);
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
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!jobId) return;
    try {
      const response = await fetch(`http://localhost:5000/delete/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchJobs();
        toast.success("Pekerjaan berhasil dihapus!");
      } else {
        toast.error("Gagal menghapus pekerjaan.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus pekerjaan.");
    }
  };

  return (
    <div>
      <h2>Daftar Pekerjaan Saya</h2>
      {jobs.filter((job) => job.userId === userId).length === 0 ? (
        <div className="no-jobs-container">
          <img
            src={denied}
            alt="Tidak ada pekerjaan"
            className="no-jobs-image"
          />
          <p className="no-jobs-message">Belum ada pekerjaan yang tersedia.</p>
        </div>
      ) : (
        <ul className="job-list-daftar">
          {jobs
            .filter((job) => job.userId === userId)
            .map((job) => (
              <li key={job.id} className="job-item-daftar">
                <div className="job-left-daftar">
                  <h3 className="nama-job-daftar">{job.pekerjaan}</h3>
                  <p className="isi-job-daftar">
                    <FontAwesomeIcon icon={faUser} className="icon" />{" "}
                    {job.username}
                  </p>
                  <p className="alamat-job">
                    <FontAwesomeIcon icon={faMapLocation} className="icon" />{" "}
                    {job.alamat}
                  </p>
                  <p className="alamat-job">
                    <FontAwesomeIcon icon={faMoneyBill} className="icon" />{" "}
                    {job.harga}
                  </p>
                  <p className="isi-job-daftar">
                    <FontAwesomeIcon icon={faClock} className="icon" />{" "}
                    {dayjs(job.createdAt).fromNow()}
                  </p>
                </div>
                <div className="job-right-daftar">
                  <p className="isi-job-daftar">{job.deskripsi}</p>
                  <div
                    style={{ display: "flex", flexDirection: "row", left: "0" }}
                  >
                    <button
                      className="delete-btn-daftar"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      <i>
                        <FontAwesomeIcon icon={faTrash} className="icon" />
                      </i>{" "}
                      Hapus
                    </button>
                    <button className="edit-btn-daftar">
                      <i>
                        <FontAwesomeIcon icon={faEdit} className="icon" />
                      </i>{" "}
                      Edit
                    </button>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default JobUser;
