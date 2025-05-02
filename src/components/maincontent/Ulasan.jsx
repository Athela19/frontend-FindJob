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
          rating: parseInt(rating), // ✅ Pastikan rating dikirim sebagai int
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

  return (
    <div className="profile-container">
      <h2 className="profile-title">Ulasan Pengguna</h2>

      <form onSubmit={handleCommentSubmit} className="comment-form">
        <div className="form-group">
          <br />
          <label>Kritik dan Saran</label>
          <textarea
            name="comment"
            className="form-input"
            value={comment}
            onChange={handleCommentChange}
            placeholder="Masukkan kritik dan saran"
            style={{ height: "150px", resize: "none" }} // ✅ Ukuran tetap
          />

          <br />
          <br />
          <label>Beri Kami Nilai!</label>
          <div className="flex gap-1 mt-2 mb-4">
            {[1, 2, 3, 4, 5].map((value) => {
              const isFilled = hovered ? value <= hovered : value <= rating;
              return (
                <Star
                  key={value}
                  size={30}
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHovered(value)}
                  onMouseLeave={() => setHovered(null)}
                  className={`cursor-pointer transition-colors ${
                    isFilled ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill={isFilled ? "#facc15" : "none"}
                />
              );
            })}
          </div>
        </div>

        <button type="submit" className="btn-db">
          Kirim Ulasan
        </button>
      </form>
    </div>
  );
}

export default Ulasan;
