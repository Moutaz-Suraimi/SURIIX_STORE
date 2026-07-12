import React, { memo } from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

// Static lookup — defined once outside component (no re-creation on render)
const directionMap: Record<string, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
};

// memo prevents re-renders when props haven't changed
const ScrollReveal: React.FC<ScrollRevealProps> = memo(({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 40,
}) => {
  const d = directionMap[direction];
  const initial = {
    opacity: 0,
    x: d.x * distance,
    y: d.y * distance,
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

ScrollReveal.displayName = "ScrollReveal";

export default ScrollReveal;
