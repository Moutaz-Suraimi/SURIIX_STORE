import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Zap, CheckCircle, Store, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  const navigate = useNavigate();

  const handleStart = () => {
    onClose();
    navigate("/create-store");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 28 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-4xl w-full dark:bg-[#0f172a]"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 left-5 z-20 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white transition-all dark:text-white dark:bg-[#0f172a]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* ── LEFT: Illustration ── */}
              <div className="relative flex flex-col items-center justify-center p-10 overflow-hidden bg-gradient-to-br from-purple-50 via-fuchsia-50/60 to-white min-h-[400px]">
                {/* Soft background glow blobs */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-purple-200/50 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-fuchsia-200/40 rounded-full blur-2xl" />

                {/* Floating sparkle */}
                <motion.div
                  animate={{ y: [-4, 4, -4], rotate: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute top-12 right-12 text-purple-400 text-2xl select-none"
                >✦</motion.div>

                {/* Floating bar chart badge */}
                <motion.div
                  animate={{ x: [-3, 3, -3] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="absolute top-16 left-10 bg-white shadow-lg rounded-2xl p-3 z-10 dark:bg-[#0f172a]"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
                </motion.div>

                {/* Main phone mockup */}
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="relative z-10 w-48 h-[320px] bg-white rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden dark:bg-[#0f172a]"
                  style={{ boxShadow: "0 30px 60px -10px rgba(147,51,234,0.2), 0 10px 20px -5px rgba(0,0,0,0.08)" }}
                >
                  {/* Striped awning */}
                  <div className="h-16 w-full flex overflow-hidden rounded-t-[2rem]">
                    {[0,1,2,3,4,5,6].map(i => (
                      <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-purple-400' : 'bg-pink-400'}`} />
                    ))}
                  </div>

                  {/* Store icons grid */}
                  <div className="p-3 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-purple-50 rounded-xl flex items-center justify-center py-4 text-2xl">🛒</div>
                      <div className="bg-pink-50 rounded-xl flex items-center justify-center py-4 text-2xl">❤️</div>
                      <div className="bg-blue-50 rounded-xl flex items-center justify-center py-4 text-2xl">👕</div>
                      <div className="bg-purple-50 rounded-xl flex items-center justify-center py-4 text-2xl">💳</div>
                    </div>
                    {/* Checkout bar */}
                    <div className="bg-gray-50 rounded-xl px-3 py-2 flex justify-between items-center mt-1 dark:bg-[#0f172a]">
                      <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">Checkout</div>
                      <span className="text-xs font-bold text-gray-700 dark:text-white">$125.00</span>
                    </div>
                  </div>
                </motion.div>

                {/* Floating shopping bags */}
                <motion.div
                  animate={{ x: [4, -4, 4], y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="absolute bottom-20 right-6 text-5xl select-none z-10 drop-shadow-lg"
                >🛍️</motion.div>

                {/* Steps row */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center border-t border-gray-100 bg-white/80 backdrop-blur-sm py-4 dark:bg-[#0f172a]">
                  {[
                    { emoji: "🎨", label: "خصص متجرك" },
                    { emoji: "🏪", label: "أنشئ متجرك" },
                    { emoji: "✅", label: "ابدأ البيع" },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col items-center space-y-1">
                      <div className="w-11 h-11 bg-gray-50 rounded-full flex items-center justify-center text-xl shadow-sm dark:bg-[#0f172a]">{s.emoji}</div>
                      <span className="text-[10px] font-bold text-gray-500 dark:text-slate-300">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── RIGHT: Content ── */}
              <div className="flex flex-col justify-center px-10 py-14 space-y-7">

                {/* Tag */}
                <div className="inline-flex items-center space-x-2 space-x-reverse border border-gray-200 text-gray-500 px-4 py-1.5 rounded-full text-sm w-fit dark:border-slate-800 dark:text-slate-300">
                  <span className="text-purple-500">✦</span>
                  <span>الجيل الجديد للتجارة الذكية</span>
                </div>

                {/* Headline */}
                <div className="space-y-1 leading-tight">
                  <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">مرحباً بك في تجريتك</h2>
                  <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-l from-purple-600 to-fuchsia-500">
                    الذكية لبناء متجرك
                  </h2>
                </div>

                {/* Description */}
                <p className="text-gray-500 leading-relaxed text-base dark:text-slate-300">
                  خصص هويتك، ارفع شعارك، واختر ألوان متجرك المفضل في أقل من دقيقة. سننشئ لك نسخة فاخرة ومخصصة فوراً للدخول والتجربة.
                </p>

                {/* CTA button */}
                <button
                  onClick={handleStart}
                  className="flex items-center justify-center space-x-3 space-x-reverse bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-8 py-4 rounded-2xl font-bold text-lg w-full hover:shadow-[0_0_28px_rgba(168,85,247,0.4)] transition-all hover:-translate-y-0.5"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>ابدأ تجريتك الآن</span>
                </button>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-slate-300">
                  <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />إنشاء سريع</span>
                  <span className="flex items-center gap-1.5">🗓️ لا بحاجة لبطاقة ائتمانية</span>
                  <span className="flex items-center gap-1.5">🔒 آمن وموثوق</span>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;
