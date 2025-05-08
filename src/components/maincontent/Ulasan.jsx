import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Star } from "lucide-react";

function Ulasan() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
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

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim() || rating === 0) {
      toast.error("Komentar dan rating harus diisi");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/comments",
        {
          komentar: comment,
          rating: parseInt(rating),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Ulasan berhasil dikirim");
      setComment("");
      setRating(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim ulasan");
    }
  };

  const addShortcut = (text) => {
    setComment((prev) => (prev ? `${prev} ${text}` : text));
  };

  return (
    <div className="ulasan-container" style={{
      maxWidth: "900px",
      margin: "auto",
      padding: "20px",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <h2 className="profile-title">Ulasan Pengguna</h2>

      <form onSubmit={handleCommentSubmit} className="comment-form">
        <div className="form-group">
          <label>Kritik dan Saran</label>
          <textarea
            name="comment"
            className="form-input"
            value={comment}
            onChange={handleCommentChange}
            style={{
              height: "150px",
              resize: "none",
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "10px",
            }}
          />

          <div className="ulasan-shortcut-container" style={{ marginBottom: "1rem" }}>
            <label>Ulasan cepat:</label>

            <div className="ulasan-shortcut-buttons" style={{ display: "flex", flexWrap: "wrap", gap: "1px" }}>
              <button type="button" onClick={() => addShortcut("Pelayanan sangat memuaskan!")}>Pelayanan sangat memuaskan!</button>
              <button type="button" onClick={() => addShortcut("Web mudah digunakan.")}>Web mudah digunakan.</button>
              <button type="button" onClick={() => addShortcut("Sangat membantu dan profesional.")}>Sangat membantu dan profesional.</button>
              <button type="button" onClick={() => addShortcut("Tampilan web sederhana.")}>Tampilan web sederhana.</button>
              <button type="button" onClick={() => addShortcut("Fleksibel.")}>Fleksibel.</button>
              <button type="button" onClick={() => addShortcut("Pelayanan cepat.")}>Pelayanan cepat.</button>
            </div>
          </div>

        <b />
          <label>Beri Kami Nilai!</label>
          <div className="flex gap-2 mt-2 mb-4" style={{ display: "flex", gap: "10px" }}>
            {[1, 2, 3, 4, 5].map((value) => {
              const isFilled = hovered ? value <= hovered : value <= rating;
              return (
                <Star
                  key={value}
                  size={28}
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHovered(value)}
                  onMouseLeave={() => setHovered(null)}
                  className={isFilled ? "text-yellow-500" : "text-gray-300"}
                  fill={isFilled ? "orange" : "none"}
                  strokeWidth={1}
                  style={{ cursor: "pointer" }}
                />
              );
            })}
          </div>
        </div>
        
        <br/>
        <button type="submit" className="btn-db">
          Kirim Ulasan
        </button>
      </form>
    </div>
  );
}

export default Ulasan;
