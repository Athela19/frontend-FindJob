import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPencilAlt } from "react-icons/fa";
import CropImage from "./CropImage"; // Import komponen CropImage

function Profile() {
  const [profile, setProfile] = useState({});
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });
  const [src, setSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [comment, setComment] = useState(""); // State untuk menyimpan komentar
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

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

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (error) {
      toast.error("Gagal mengambil data profil");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updateData = new FormData();
    updateData.append("name", formData.name || profile.name);
    updateData.append("email", formData.email || profile.email);
    if (formData.password) updateData.append("password", formData.password);
    if (croppedImage) updateData.append("file", dataURLtoFile(croppedImage, "profile.jpg"));

    try {
      await axios.patch(`http://localhost:5000/profile/${userId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profil berhasil diperbarui");
      fetchProfile();
    } catch (error) {
      toast.error("Gagal memperbarui profil");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setSrc(reader.result);
        setShowCropModal(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value); // Update state komentar
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    if (!comment.trim()) {
      toast.error("Komentar tidak boleh kosong");
      return;
    }
  
    try {
      await axios.post(
        "http://localhost:5000/comments",
        { komentar: comment }, // Sesuaikan dengan backend
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Komentar berhasil dikirim");
      setComment(""); // Reset input setelah sukses
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim komentar");
    }
  };
  

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>
      <div className="profile-image-container">
        {profile?.url ? (
          <img src={profile.url} alt="Profile" className="profile-image" />
        ) : (
          <div className="no-image">No Image</div>
        )}
        <label className="upload-icon">
          <FaPencilAlt />
          <input type="file" className="file-input" onChange={handleFileChange} />
        </label>
      </div>
      {showCropModal && (
        <CropImage
          src={src}
          onCropComplete={(croppedImage) => {
            setCroppedImage(croppedImage);
            setShowCropModal(false);
          }}
          onClose={() => setShowCropModal(false)}
        />
      )}
      <form onSubmit={handleUpdateProfile} className="profile-form">
        <div className="form-group">
          <label>Nama</label>
          <input 
            type="text" 
            name="name" 
            className="form-input" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder={profile.name || "Masukkan nama"} 
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            className="form-input" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder={profile.email || "Masukkan email"} 
          />
        </div>
        <div className="form-group">
          <label>Password (Opsional)</label>
          <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit" className="update-button">Update Profile</button>
      </form>

      {/* Form untuk mengirim komentar */}
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <div className="form-group">
          <label>Komentar</label>
          <textarea
            name="comment"
            className="form-input"
            value={comment}
            onChange={handleCommentChange}
            placeholder="Masukkan komentar Anda"
          />
        </div>
        <button type="submit" className="comment-button">Kirim Komentar</button>
      </form>
    </div>
  );
}

export default Profile;