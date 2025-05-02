import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { FaCheck, FaTimes } from "react-icons/fa";

const CropImage = ({ src, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async () => {
    if (!croppedAreaPixels) return;

    const img = new Image();
    img.src = src;
    await new Promise((resolve) => (img.onload = resolve));

    const cropCanvas = document.createElement("canvas");
    const ctx = cropCanvas.getContext("2d");

    const { width, height, x, y } = croppedAreaPixels;
    const outputSize = 300;
    cropCanvas.width = outputSize;
    cropCanvas.height = outputSize;

    // Crop dengan masking lingkaran
    ctx.save();
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, x, y, width, height, 0, 0, outputSize, outputSize);
    ctx.restore();

    const croppedImageUrl = cropCanvas.toDataURL("image/png");
    onCropComplete(croppedImageUrl);
  };

  return (
    <div className="crop-modal">
      <div className="crop-container">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={handleCropComplete}
          cropShape="round"
          showGrid={false}
        />
      </div>

      <input
        type="range"
        min="1"
        max="3"
        step="0.1"
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        className="zoom-slider"
      />

      <div className="crop-actions">
        <button onClick={onClose} className="crop-button cancel">
          <FaTimes /> Batal
        </button>
        <button onClick={getCroppedImg} className="crop-button confirm">
          <FaCheck /> Simpan
        </button>
      </div>
    </div>
  );
};

export default CropImage;
