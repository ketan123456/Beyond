"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useEffect, useRef } from "react";

export interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  startValue?: number;
  className?: string;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  startValue = 0,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(
    direction === "down" ? value : startValue,
  );
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (!isInView) return;
    const timeout = window.setTimeout(
      () => motionValue.set(direction === "down" ? startValue : value),
      delay * 1000,
    );
    return () => window.clearTimeout(timeout);
  }, [delay, direction, isInView, motionValue, startValue, value]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (!ref.current) return;
        ref.current.textContent = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)));
      }),
    [decimalPlaces, springValue],
  );

  return (
    <motion.span className={className} ref={ref}>
      {direction === "down" ? value : startValue}
    </motion.span>
  );
}
