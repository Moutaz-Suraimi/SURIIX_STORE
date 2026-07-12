import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Volume2, VolumeX, SkipForward } from "lucide-react";

const introText: Record<string, { line1: string; line2: string }> = {
  ar: {
    line1: "مرحباً بك…",
    line2: "لقد دخلت الآن عالم Suriix الرقمي",
  },
  en: {
    line1: "Welcome…",
    line2: "You have entered the digital world of Suriix",
  },
  zh: {
    line1: "欢迎…",
    line2: "你已进入苏里米数字世界",
  },
};

const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
  const { lang } = useLanguage();
  const [phase, setPhase] = useState<"logo" | "text" | "fadeout">("logo");
  const [muted, setMuted] = useState(true);
  const [typedLine1, setTypedLine1] = useState("");
  const [typedLine2, setTypedLine2] = useState("");
  const timerRef = useRef<number>();

  const text = introText[lang] || introText.en;

  const skip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("fadeout");
    setTimeout(onComplete, 500);
  }, [onComplete]);

  // Phase progression
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 800);
    return () => { clearTimeout(t1); };
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (phase !== "text") return;

    let i = 0;
    const line1 = text.line1;
    const line2 = text.line2;

    const typeLine1 = () => {
      if (i <= line1.length) {
        setTypedLine1(line1.slice(0, i));
        i++;
        timerRef.current = window.setTimeout(typeLine1, 30);
      } else {
        i = 0;
        timerRef.current = window.setTimeout(typeLine2, 150);
      }
    };

    const typeLine2 = () => {
      if (i <= line2.length) {
        setTypedLine2(line2.slice(0, i));
        i++;
        timerRef.current = window.setTimeout(typeLine2, 20);
      } else {
        timerRef.current = window.setTimeout(() => {
          setPhase("fadeout");
          setTimeout(onComplete, 500);
        }, 800);
      }
    };

    typeLine1();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, text, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "fadeout" ? (
        <motion.div
          key="intro"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-gradient-to-tr from-[#e3e8ff] via-[#fbfcff] to-[#eddfff] dark:from-[#090714] dark:via-[#0e0b21] dark:to-[#171530] transition-colors duration-500"
        >
          {/* Pure-CSS rotating ambient glows — zero JS runtime cost (GPU-composited).
              Replaces Framer Motion animate={{ rotate }} which ran a JS RAF loop every frame. */}
          <div
            className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] opacity-80 mix-blend-multiply dark:mix-blend-screen"
            style={{ animation: "introSpin 40s linear infinite", willChange: "transform" }}
          >
            <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0.05) 50%, transparent 70%)" }} />
            <div className="absolute bottom-[20%] right-[20%] w-[45%] h-[45%] rounded-full" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.05) 50%, transparent 70%)" }} />
            <div className="absolute top-[40%] right-[30%] w-[40%] h-[40%] rounded-full" style={{ background: "radial-gradient(circle, rgba(217,70,239,0.18) 0%, rgba(217,70,239,0.04) 50%, transparent 70%)" }} />
            <div className="absolute bottom-[30%] left-[30%] w-[35%] h-[35%] rounded-full" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(14,165,233,0.03) 50%, transparent 70%)" }} />
          </div>
          
          {/* Theme adaptive overlay without heavy blur */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/40 backdrop-blur-[2px] transition-colors duration-500" />

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
            <AnimatePresence mode="wait">
              {(phase === "logo" || phase === "text") && (
                <motion.div
                  key="logo-text"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center justify-center gap-6"
                >
                  <div className="flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-white/40 dark:bg-primary/20 blur-2xl rounded-full animate-pulse-glow" />
                    <img 
                      src="/favicon-192x192.png" 
                      alt="Suriix Logo" 
                      className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-full shadow-[0_0_50px_rgba(139,92,246,0.25)] border border-white/50 dark:border-white/10 bg-white dark:bg-[#110d29]" 
                    />
                  </div>
                  
                  <div className="text-center mt-2">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight drop-shadow-sm gradient-text">
                      Suriix
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#2c1558]/40 dark:to-white/20" />
                      <p className="text-xs md:text-sm tracking-[0.5em] text-[#2c1558]/80 dark:text-white/80 uppercase font-bold">
                        Digital
                      </p>
                      <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#2c1558]/40 dark:to-white/20" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Premium Typewriter text */}
            <div className="mt-14 h-20 flex flex-col items-center justify-center">
              {phase === "text" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4 text-center w-full"
                >
                  <p className="text-lg md:text-xl text-[#2c1558]/95 dark:text-white font-bold tracking-wide">
                    {typedLine1}
                    {typedLine1.length < text.line1.length && (
                      <span className="inline-block w-[2px] h-5 bg-[#462b78] dark:bg-primary animate-pulse ml-1 align-middle" />
                    )}
                  </p>
                  <p className="text-sm md:text-base text-[#2c1558]/80 dark:text-white/70 font-semibold tracking-wider">
                    {typedLine2}
                    {typedLine1.length >= text.line1.length && typedLine2.length < text.line2.length && (
                      <span className="inline-block w-[2px] h-4 bg-[#462b78] dark:bg-primary animate-pulse ml-1 align-middle" />
                    )}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-8 right-8 flex items-center gap-3 z-20">
            <button
              onClick={() => setMuted(!muted)}
              className="p-3 bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-full text-[#2c1558]/80 dark:text-white/80 hover:text-[#2c1558] dark:hover:text-white transition-all shadow-lg"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={skip}
              className="flex items-center gap-2 px-5 py-3 bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-full text-[#2c1558]/80 dark:text-white/80 hover:text-[#2c1558] dark:hover:text-white transition-all shadow-lg text-sm font-bold tracking-wide"
            >
              <SkipForward className="w-4 h-4" />
              تخطي
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default CinematicIntro;

