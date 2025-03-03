"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ReverseProgressButtonProps {
  startTime: string;
  durationInMs: number; // in milliseconds
  runningText: string;
  completedText?: string;
  onClick?: () => void;
  className?: string;
}

export default function ReverseProgressButton({
  startTime,
  durationInMs,
  runningText,
  completedText,
  onClick,
  className = "",
}: ReverseProgressButtonProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let startDate: Date;
    try {
      startDate = new Date(startTime);

      if (isNaN(startDate.getTime())) {
        throw new Error("Invalid date format");
      }
    } catch {
      setError("Invalid start time format");
      return;
    }

    const calculateProgress = () => {
      const now = new Date();
      const elapsedTime = now.getTime() - startDate.getTime();

      if (elapsedTime >= durationInMs) {
        setProgress(100);
        setIsComplete(true);
        return;
      }

      const calculatedProgress = Math.min(
        100,
        (elapsedTime / durationInMs) * 100
      );
      setProgress(calculatedProgress);
    };

    calculateProgress();

    const interval = setInterval(() => {
      calculateProgress();
    }, 300);

    return () => clearInterval(interval);
  }, [startTime, durationInMs]);

  if (error) {
    return (
      <Button
        onClick={onClick}
        className={`relative overflow-hidden bg-red-100 text-red-800 ${className} cursor-pointer`}
      >
        {error}
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      className={`relative overflow-hidden ${className} cursor-pointer`}
      style={{
        position: "relative",
      }}
    >
      {/* Base green layer */}
      <div className="absolute inset-0 bg-green-500" />

      {/* Red overlay that grows from left to right */}
      <div
        className="absolute inset-0 bg-red-500 transition-all duration-500 ease-linear"
        style={{
          width: `${progress}%`,
          left: 0,
        }}
      />

      {/* Content */}
      <span className="relative z-10 font-medium text-black">
        {isComplete ? completedText ?? runningText : runningText}
      </span>
    </Button>
  );
}
