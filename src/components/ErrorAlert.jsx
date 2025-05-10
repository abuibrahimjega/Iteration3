import { useState, useEffect } from "react";
import "./ErrorAlert.css";

export default function ErrorAlert({ message, onClose, duration = 5000 }) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);

    if (message && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`error-alert ${visible ? "visible" : "hidden"}`}
      role="alert"
    >
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <span className="error-message">{message}</span>
      </div>
      <button
        className="error-close"
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
      >
        ×
      </button>
    </div>
  );
}
