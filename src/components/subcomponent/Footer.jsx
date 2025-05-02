import React from "react";
import "../../css/dashboard.css"; // Sesuaikan dengan lokasi file CSS jika berbeda

function Footer() {
  return (
    <footer className="footer-db">
      <div className="footer-content-db">
        <div>
          <div className="navbar-logo-db">
            <p>
              Find<span>Job</span>.
            </p>
          </div>
          <p className="footer-detail">
            Findjob is a web app that simplifies worker recruitment inclusively,
            accepting them based on skills without strict criteria.
          </p>
        </div>
        <div className="footer-text">
          <p>Tentang Kami</p>
          <a href="https://www.instagram.com/findjobcomunity?igsh=OTQwMG5hOTl2YTR5">
            findjobcomunity@gmail.com
          </a>
          <a href="https://www.instagram.com/m.syarifnr/profilecard/?igsh=MWhrdDNkMWJwNmV6dw==">
            Muhammad Syarif Nurrohman
          </a>
          <a href="https://www.instagram.com/rrvy.m.z?igsh=MTBqdHI0OW1wdHR2Nw==">
            Muhammad Revy Rizky
          </a>
          <a href="https://www.instagram.com/adelyaact_/profilecard/?igsh=MTN4eGRtbmdrYmoxZQ==">
            Adelya Octaviani
          </a>
        </div>
        <div className="footer-text">
          <p>Partner</p>
          <a href="https://www.instagram.com/smkn1cmi?igsh=MWZncHhxN2tqN3BwMA==">
            SMK NEGERI 1 CIMAHI
          </a>
          <a href="https://www.instagram.com/tkjsija_smkn1cimahi?igsh=eHYzYmNkZmpnMHV1">
            SIJA SMK NEGERI 1 CIMAHI
          </a>
        </div>
      </div>
      <p className="footer-copyright">&copy; 2024 FindJob. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
