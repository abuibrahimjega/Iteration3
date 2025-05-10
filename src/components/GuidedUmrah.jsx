import { useState } from "react";
import { useTranslation } from "react-i18next";

const steps = [
  {
    title: "Ihram",
    description: "Enter the state of Ihram and make the intention for Umrah",
    audioSrc: "/audio/ihram-guide.mp3",
  },
  {
    title: "Tawaf",
    description: "Perform seven circuits around the Kaaba",
    audioSrc: "/audio/tawaf-guide.mp3",
  },
  {
    title: "Sa'i",
    description: "Walk seven times between the hills of Safa and Marwah",
    audioSrc: "/audio/sai-guide.mp3",
  },
  {
    title: "Halq/Taqsir",
    description: "Cut or trim hair to complete the Umrah",
    audioSrc: "/audio/halq-guide.mp3",
  },
];

export default function GuidedUmrah() {
  const [currentStep, setCurrentStep] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const { t } = useTranslation();

  const playAudio = () => {
    const audio = new Audio(steps[currentStep].audioSrc);
    audio.onended = () => setAudioPlaying(false);
    audio.play();
    setAudioPlaying(true);
  };

  return (
    <div className="guided-umrah">
      <h2>{t("guidedUmrah.title")}</h2>

      <div className="progress-bar">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`progress-step ${
              index <= currentStep ? "completed" : ""
            } ${index === currentStep ? "current" : ""}`}
            onClick={() => setCurrentStep(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <div className="step-content">
        <h3>{steps[currentStep].title}</h3>
        <p>{steps[currentStep].description}</p>

        <button
          className="audio-btn"
          onClick={playAudio}
          disabled={audioPlaying}
        >
          {audioPlaying ? t("guidedUmrah.playing") : t("guidedUmrah.listen")}
        </button>
      </div>

      <div className="step-navigation">
        <button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((prev) => prev - 1)}
        >
          {t("guidedUmrah.previous")}
        </button>
        <button
          disabled={currentStep === steps.length - 1}
          onClick={() => setCurrentStep((prev) => prev + 1)}
        >
          {t("guidedUmrah.next")}
        </button>
      </div>
    </div>
  );
}
