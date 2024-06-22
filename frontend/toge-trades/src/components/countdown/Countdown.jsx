import { useState, useEffect } from "react";
import "./Countdown.css";

function calculateRemainingHatchTime(hatchTime) {
  const currentTime = new Date();
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : `${num}`;
  };
  let timeRemaining = hatchTime.getTime() - currentTime.getTime();
  if (timeRemaining <= 0) {
    return { text: "🎉 Ready to hatch", isDone: true };
  } else {
    let seconds = Math.floor(timeRemaining / 1000) % 60;
    let mins = Math.floor(timeRemaining / 1000 / 60) % 60;
    let hours = Math.floor(timeRemaining / 1000 / 60 / 60);
    seconds = formatNumber(seconds);
    mins = formatNumber(mins);
    hours = formatNumber(hours);
    return { text: `${hours}h : ${mins}m : ${seconds}s left`, isDone: false };
  }
}
// Countdown timer for incubators.
export default function Countdown({ deadline, onCountdownComplete }) {
  const [timestamp, setTimestamp] = useState(
    calculateRemainingHatchTime(deadline)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const { text, isDone } = calculateRemainingHatchTime(deadline);
      setTimestamp({ text, isDone });
      if (isDone) {
        clearInterval(intervalId);
        onCountdownComplete(true); // Notify parent component
      }
    }, 1000);
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [timestamp]);

  return (
    <div>
      <p>{timestamp.text}</p>
    </div>
  );
}
