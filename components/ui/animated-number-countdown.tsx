"use client";

import React, { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";

const MotionNumberFlow = motion.create(NumberFlow);

export interface CountdownProps {
  endDate: Date | string | number;
  startDate?: Date | string | number;
  className?: string;
  onComplete?: () => void;
  showLabels?: boolean;
  labelClassName?: string;
  numberClassName?: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function AnimatedNumberCountdown({
  endDate,
  startDate,
  className,
  onComplete,
  showLabels = true,
  labelClassName,
  numberClassName,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const start = startDate ? new Date(startDate) : new Date();
      const end = new Date(endDate);
      const difference = end.getTime() - start.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) {
          onComplete();
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate, startDate, onComplete]);

  return (
    <div className={`flex items-center justify-center gap-4 ${className || ""}`}>
      <div className="flex flex-col items-center">
        <MotionNumberFlow
          value={timeLeft.hours}
          className={numberClassName || "text-5xl font-semibold tracking-tighter"}
          format={{ minimumIntegerDigits: 2 }}
        />
        {showLabels && <span className={labelClassName || "text-sm text-gray-500"}>Hours</span>}
      </div>
      <div className="text-2xl font-bold">:</div>
      <div className="flex flex-col items-center">
        <MotionNumberFlow
          value={timeLeft.minutes}
          className={numberClassName || "text-5xl font-semibold tracking-tighter"}
          format={{ minimumIntegerDigits: 2 }}
        />
        {showLabels && <span className={labelClassName || "text-sm text-gray-500"}>Minutes</span>}
      </div>
      <div className="text-2xl font-bold">:</div>
      <div className="flex flex-col items-center">
        <MotionNumberFlow
          value={timeLeft.seconds}
          className={numberClassName || "text-5xl font-semibold tracking-tighter"}
          format={{ minimumIntegerDigits: 2 }}
        />
        {showLabels && <span className={labelClassName || "text-sm text-gray-500"}>Seconds</span>}
      </div>
    </div>
  );
}

export { AnimatedNumberCountdown };
