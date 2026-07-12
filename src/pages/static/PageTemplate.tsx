import React from 'react';
import FooterSection from '../../components/FooterSection';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';

const PageTemplate = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0B14] font-cairo" dir="rtl">
      
      {/* Simple Header */}
      <header className="bg-white/80 dark:bg-[#151521]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <img src="/favicon-192x192.png" alt="Suriix" className="w-10 h-10 object-contain" />
            <span className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">Suriix</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors dark:text-slate-400">
            <ArrowRight className="w-4 h-4" /> العودة للرئيسية
          </Link>
        </div>
      </header>
      
      <main className="flex-1 w-full pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-[#151521] rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/50 dark:border-white/5"
          >
            <h1 className="text-3xl sm:text-4xl font-black mb-8 text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">{title}</h1>
            <div className="prose prose-slate dark:prose-invert prose-lg max-w-none text-slate-600 dark:text-slate-400 font-medium leading-relaxed space-y-6">
              {children}
            </div>
          </motion.div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default PageTemplate;
