import React, { useState, useEffect, useRef } from "react";

const Creator = () => {
  // Data foto dan link Instagram
  const photos = [
    {
      id: "syarif",
      image: "/foto/syarif.jpg",
      caption: "Muhamad Syarif Nurrohman",
      instagramLink: "https://www.instagram.com/m.syarifnr/profilecard/?igsh=MWhrdDNkMWJwNmV6dw==",
    },
    {
      id: "adel",
      image: "/foto/adel.jpg",
      caption: "Adelya Octaviani",
      instagramLink: "https://www.instagram.com/adelyaact_/profilecard/?igsh=MTN4eGRtbmdrYmoxZQ==",
    },
    {
      id: "revy",
      image: "/foto/revy.jpg",
      caption: "Muhammad Revy Rizqy P",
      instagramLink: "https://www.instagram.com/rrvy.m.z?igsh=MTBqdHI0OW1wdHR2Nw==",
    },
  ];

  const [activePhoto, setActivePhoto] = useState(photos[0].id); // Default foto pertama (syarif) terbuka

  // Refs untuk animasi
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const photosRef = useRef(null);

  // Fungsi untuk menangani animasi scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible"); // Reset animasi saat elemen keluar dari viewport
          }
        });
      },
      {
        threshold: 0.1, // Trigger animasi saat 10% elemen terlihat
      }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    if (textRef.current) observer.observe(textRef.current);
    if (photosRef.current) observer.observe(photosRef.current);

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      if (textRef.current) observer.unobserve(textRef.current);
      if (photosRef.current) observer.unobserve(photosRef.current);
    };
  }, []);

  const handlePhotoClick = (photoId, instagramLink) => {
    if (activePhoto === photoId) {
      // Jika foto yang aktif diklik lagi, redirect ke Instagram
      window.location.href = instagramLink;
    } else {
      // Set foto yang diklik sebagai aktif
      setActivePhoto(photoId);
    }
  };

  return (
    <div className="container-creator" id="creator">
      <div className="bg-content-creator">
        <h1 className="title-creator" ref={titleRef}>
          Tim <span style={{color: "var(--tertiary)"}}>Pengembang</span>
        </h1>
        <div className="content-creator">
          <div className="text-creator" ref={textRef}>
            <p>
              Kami adalah siswa-siswi SMK Negeri 1 Cimahi yang sedang menjalankan
              proyek pengembangan aplikasi berbasis web sebagai bagian dari
              tugas Produk Kreatif dan Kewirausahaan. Dengan semangat kolaborasi
              dan inovasi, kami berkomitmen untuk menciptakan solusi teknologi
              yang bermanfaat bagi lingkungan sekitar. Tujuan kami adalah
              memberikan kontribusi nyata melalui pengembangan aplikasi yang
              memudahkan kehidupan sehari-hari dan mendukung kemajuan pendidikan.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="photos-creator" ref={photosRef}>
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className={`photo-creator ${
                    activePhoto === photo.id ? "active-creator" : ""
                  }`}
                  onClick={() => handlePhotoClick(photo.id, photo.instagramLink)}
                >
                  <img
                    src={photo.image} // Path gambar
                    alt={photo.caption}
                    className="image-creator"
                  />
                  <div className="caption-creator">
                    <p>{photo.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Creator;