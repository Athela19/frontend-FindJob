import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import codingImage from "../../img/coding.svg";

const Hero = () => {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1.5); // Untuk animasi scale
  const [translateX, setTranslateX] = useState(0); // Untuk animasi translateX

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Animasi scale (untuk lingkaran)
      const newScale = Math.max(1.5 - scrollY / 500, 0.2);
      setScale(newScale);

      // Animasi translateX (untuk .hero-left)
      const newTranslateX = Math.max(-scrollY / 2, -100); // Bergerak ke kiri, maksimal -100px
      setTranslateX(newTranslateX);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="hero-bg">
      <section className="hero-edit" id="home">
        {/* Lingkaran dengan animasi scale */}
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="circle-hero"
            style={{ transform: `scale(${scale})` }}
          ></div>
        ))}

        {/* Bagian kiri dengan animasi translateX */}
        <div
          className="hero-left"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          <h1>
            Raih Peluang<span> Terbaikmu!</span>
          </h1>
          <h1>
            Wujudkan <span style={{ color: "var(--tertiary)" }}>Impianmu</span>
          </h1>
          <p>Mulai langkahmu sekarang dan gapai impianmu bersama kami!</p>

          <button
            className="btn-db"
            onClick={() => navigate("/dashboard")}
            style={{ padding: "0.7rem 2.5rem", fontSize: "1.2rem" }}
          >
            Mulai Sekarang
          </button>
        </div>

        {/* Bagian kanan */}
        <div className="hero-right">
          <div
            className="hero-circle"
            style={{ transform: `scale(${scale})` }}
          ></div>
          <img
            src={codingImage}
            alt="Coding Illustration"
            className="hero-image"
          />
        </div>
      </section>
    </div>
  );
};

export default Hero;
