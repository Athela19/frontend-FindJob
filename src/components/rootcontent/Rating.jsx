import React, { useEffect, useState } from "react";
import axios from "axios";
import user from "../../img/user.png"

function Rating() {
  const [comments, setComments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    if (comments.length > 3) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % comments.length);
      }, 3000); // Geser setiap 3 detik
      return () => clearInterval(interval);
    }
  }, [comments]);

  const fetchComments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/comments", {
        withCredentials: true, // jika butuh autentikasi dengan cookie
      });
      setComments(response.data);
    } catch (error) {
      console.error("Gagal mengambil komentar:", error);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const visibleComments = comments.length > 3 ? comments.concat(comments.slice(0, 3)) : comments;

  return (
    <div className="komentar-container" id="ulasan">
      <h1 className="komentar-title">
        Ulasan <span style={{ color: "var(--primary)" }}>Pengguna</span>
      </h1>
      {loading ? (
        <p className="loading-text">Memuat komentar...</p>
      ) : comments.length > 0 ? (
        <div className="komentar-carousel">
          <div
            className="carousel-track"
            style={{
              display: "flex",
              transition: "transform 0.5s ease-in-out",
              transform: `translateX(-${currentIndex * 33.33}%)`,
              width: `${(visibleComments.length) * 33.33}%`,
            }}
          >
            {visibleComments.map((comment, index) => (
              <div key={comment.id || index} className="komentar-card">
                <div className="komentar-header">
                  <span className="komentar-author">
                    <img
                      src={comment.user?.url || user}
                      alt={comment.user?.name || "Pengguna"}
                    />
                    {comment.user?.name || "Anonim"}
                  </span>
                  <span className="komentar-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="komentar-text">{truncateText(comment.komentar, 200)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="no-komentar">Tidak ada komentar.</p>
      )}
    </div>
  );
}

export default Rating;
