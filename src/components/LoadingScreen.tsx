import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center space-y-6"
      >
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Outer glowing ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-primary/30 w-full h-full"
          />
          {/* Inner fast ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-2 rounded-full border-b-2 border-primary w-[calc(100%-1rem)] h-[calc(100%-1rem)]"
          />
          {/* Center icon */}
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center space-y-2"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Suriix Store</h2>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">جاري التحميل...</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
