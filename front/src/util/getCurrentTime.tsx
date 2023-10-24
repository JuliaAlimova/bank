import { useEffect, useState } from "react";

function getCurrentTime(): string {
  const now: Date = new Date();
  const hours: number = now.getHours();
  const minutes: number = now.getMinutes();

  const formattedHours: string = hours < 10 ? `0${hours}` : hours.toString();
  const formattedMinutes: string = minutes < 10 ? `0${minutes}` : minutes.toString();

  const currentTime: string = `${formattedHours}:${formattedMinutes}`;

  return currentTime;
}

function Component(): string {
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return currentTime;
}

export default Component;