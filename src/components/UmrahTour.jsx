// components/UmrahTour.jsx
import React, { useState } from "react";
import Video360Viewer from "./Video360Viewer";
import "./UmrahTour.css";

const UmrahTour = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [tourCompleted, setTourCompleted] = useState(false);

  const scenes = [
    {
      type: "video",
      title: "Tawaf Around the Kaaba",
      description:
        "Begin your virtual Umrah by performing Tawaf, circling the Kaaba seven times counterclockwise.",
      media: "https://www.youtube.com/embed/D6FRezJF3rU?start=90&end=210", // Direct YouTube embed
      duration: 120, // seconds
    },
    {
      type: "streetview",
      title: "Sa'i Between Safa and Marwah",
      description:
        "Now perform Sa'i, walking seven times between the hills of Safa and Marwah.",
      location: { lat: 21.4225, lng: 39.8262 },
      heading: 180,
      pitch: 0,
      fov: 90,
    },
  ];

  const handleNext = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    } else {
      setTourCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
    }
  };

  if (tourCompleted) {
    return (
      <div className="certificate">
        <h2>Congratulations!</h2>
        <p>You've completed the Virtual Umrah Experience</p>
        <button onClick={() => setCurrentScene(0)}>Restart Tour</button>
      </div>
    );
  }

  const scene = scenes[currentScene];

  return (
    <div className="tour-container">
      <aside className="tour-sidebar">
        <h2>{scene.title}</h2>
        <p>{scene.description}</p>

        <div className="tour-controls">
          <button onClick={handlePrevious} disabled={currentScene === 0}>
            ← Previous
          </button>
          <button onClick={handleNext}>
            {currentScene === scenes.length - 1 ? "Complete Tour" : "Next →"}
          </button>
        </div>
      </aside>

      <main className="tour-viewer">
        {scene.type === "video" ? (
          <Video360Viewer videoSrc={scene.media} onComplete={handleNext} />
        ) : (
          <iframe
            title="Street View"
            width="100%"
            height="100%"
            frameBorder="0"
            src={`https://www.google.com/maps/embed/v1/streetview?key=AIzaSyCgDlYv5Yx9JW7NGY6 - lvOhEYWDaaacoHM;
            &location=${scene.location.lat},${scene.location.lng}&heading=${scene.heading}&pitch=${scene.pitch}&fov=${scene.fov}`}
            allowFullScreen
          />
        )}
      </main>
    </div>
  );
};

export default UmrahTour;
