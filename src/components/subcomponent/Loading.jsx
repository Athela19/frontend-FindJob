import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScrewdriver,
  faHammer,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import "../../css/loading.css"; // File CSS untuk animasi

const LoadingAnimation = () => {
  return (
    <div className="loading-container">
      <div className="loading-icon">
        <FontAwesomeIcon icon={faScrewdriver} className="tool-icon" /> {/* Obeng */}
        <FontAwesomeIcon icon={faHammer} className="tool-icon" /> {/* Palu */}
        <FontAwesomeIcon icon={faWrench} className="tool-icon" /> {/* Kunci Inggris */}
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingAnimation;