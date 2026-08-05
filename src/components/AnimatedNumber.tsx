import React, { useEffect, useState, useRef } from 'react';
import { animate } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  delay?: number;
  duration?: number;
  format?: (v: number) => React.ReactNode;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, delay = 0, duration = 2.2, format = (v) => v.toString() }) => {
  const safeValue = isNaN(value) ? 0 : value;
  const [display, setDisplay] = useState(safeValue);
  const prevValue = useRef(safeValue);

  useEffect(() => {
    const val = isNaN(value) ? 0 : value;
    if (prevValue.current !== val) {
      const controls = animate(prevValue.current, val, {
        duration,
        delay,
        onUpdate: (v) => setDisplay(Math.round(v)),
        ease: "easeOut"
      });
      prevValue.current = val;
      return () => controls.stop();
    }
  }, [value, delay, duration]);

  return <>{format(display)}</>;
};