import "./LoadingSpinner.css";

export default function LoadingSpinner({ size = "medium", fullPage = false }) {
  const sizeClass =
    {
      small: "spinner-small",
      medium: "spinner-medium",
      large: "spinner-large",
    }[size] || "spinner-medium";

  if (fullPage) {
    return (
      <div className="spinner-fullpage">
        <div className={`spinner ${sizeClass}`}></div>
      </div>
    );
  }

  return <div className={`spinner ${sizeClass}`}></div>;
}
