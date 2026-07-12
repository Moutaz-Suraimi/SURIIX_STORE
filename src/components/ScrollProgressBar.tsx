import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const ScrollProgressBar = () => {
  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, { stiffness: 280, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      rawProgress.set(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [rawProgress]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent"
      style={{ pointerEvents: "none" }}
    >
      <motion.div
        className="h-full origin-left rounded-r-full"
        style={{
          scaleX: smoothProgress,
          background:
            "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--neon-blue)))",
          boxShadow:
            "0 0 10px hsl(var(--primary) / 0.8), 0 0 24px hsl(var(--accent) / 0.5)",
        }}
      />
    </div>
  );
};

export default ScrollProgressBar;
