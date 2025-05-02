import React from "react";
import { motion } from "framer-motion";
import logo from "../../img/logo-white.png"; // Sesuaikan path jika perlu
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUser } from "@fortawesome/free-solid-svg-icons";

const About = () => {
  return (
    <section id="about" className="about-edit">
      <div className="row-edit">
        {/* Animasi Gambar dari Kiri */}
        <motion.div
          className="about-img-edit"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        // viewport={{ once: true }}
        >
          <motion.img
            src={logo}
            alt="Tentang Kami"
            animate={{ y: [0, -20, 0] }} // Animasi naik turun
            transition={{
              duration: 2, // Durasi animasi
              repeat: Infinity, // Looping tanpa henti
              ease: "easeInOut", // Efek easing
            }}
          />
          <div className="about-circle"></div> {/* Lingkaran */}
        </motion.div>
        {/* Animasi Teks dari Kanan */}
        <motion.div
          className="content-edit"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        // viewport={{ once: true }}
        >
          <p style={{ color: "white" }}>
            Platform ini secara khusus ditujukan bagi individu yang sering
            menghadapi tantangan dalam mendapatkan pekerjaan, seperti mereka
            yang hanya memiliki pendidikan dasar atau menengah, atau tanpa
            sertifikasi formal. Dengan Findjob, mereka dapat menampilkan
            keterampilan praktis mereka baik dalam pekerjaan manual, jasa, atau
            tugas teknis sederhana tanpa harus melalui proses seleksi yang
            rumit.
          </p>
          <div className="fitur">
            <div className="card-fitur">
              <i style={{ fontSize: "3rem" }}>
                <FontAwesomeIcon icon={faClock} className="icon" />
              </i>{""}
              <p>
                <code>Fleksibilitas</code>
                <p>Dapat digunakan dimana dan kapan saja</p>
              </p>
            </div>
            <div className="card-fitur">
              <i style={{ fontSize: "3rem" }}>
                <FontAwesomeIcon icon={faUser} className="icon" />
              </i>{""}
              <p>
                <code>Aksesibilitas</code>
                <p>Dapat digunakan oleh semua pengguna</p>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
