// components/Video360Viewer.jsx
import React, { useRef, useEffect } from "react";
//import "./Video360Viewer.css";

export default function Video360Viewer({ videoSrc, onComplete }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  let isDragging = false;
  let startX, startY;

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    const handleMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Adjust video currentTime based on drag (simulate 360° view)
      if (video) {
        const newTime = video.currentTime + dx * 0.001;
        video.currentTime = Math.max(0, Math.min(newTime, video.duration));
      }

      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="video-360-container" ref={containerRef}>
      <video ref={videoRef} src={videoSrc} autoPlay loop onEnded={onComplete} />
      <div className="instructions">
        Drag horizontally to look around the Kaaba
      </div>
    </div>
  );
}
