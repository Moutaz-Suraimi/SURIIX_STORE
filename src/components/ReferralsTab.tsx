import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Gift, Link as LinkIcon, CheckCircle2, Share2, TrendingUp, Users } from 'lucide-react';
import { supabase } from "@/lib/supabase";

export const ReferralsTab = ({ storeData }: { storeData: any }) => {
  const [referralCode, setReferralCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ totalClicks: 0, successfulSignups: 0, earnedBalance: 0, pendingBalance: 0 });

  useEffect(() => {
    const fetchReferralData = async () => {
      if (storeData && storeData.id && String(storeData.id).includes('-')) { // Valid UUID implies Supabase
        const uid = (storeData as any).owner_id || storeData.id;
        try {
          const { data, error } = await supabase.from('users').select('referral_code, pending_wallet_balance').eq('id', uid).single();
          if (data) {
            let code = data.referral_code;
            if (!code) {
              const baseName = (storeData.name || 'store').replace(/\s+/g, '').slice(0, 3).toUpperCase();
              code = `${baseName}${Math.floor(Math.random() * 90000) + 10000}`;
              await supabase.from('users').update({ referral_code: code }).eq('id', uid);
            }
            setReferralCode(code);
            setStats(prev => ({ ...prev, pendingBalance: data.pending_wallet_balance || 0 }));
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        // Fallback for local stores
        const code = `REF${Math.floor(Math.random() * 900000) + 100000}`;
        setReferralCode(code);
      }
    };
    fetchReferralData();
  }, [storeData]);

  const referralLink = `https://suriix.store/register?ref=${referralCode || 'PENDING'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto pt-4 pb-12 w-full px-4 md:px-0">
      
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Gift className="w-6 h-6 text-primary" /> برنامج التسويق بالعمولة
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          شارك رابط الإحالة الخاص بك مع تجار آخرين، واحصل على رصيد مجاني في محفظتك عند اشتراكهم في أي باقة مدفوعة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Referral Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-primary to-[#4143a3] text-white rounded-[24px] p-8 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none dark:bg-[#0f172a]" />
          <h4 className="text-lg font-bold mb-2">رابط الدعوة الخاص بك</h4>
          <p className="text-white/80 text-sm mb-6 max-w-md line-clamp-2">
            استخدم هذا الرابط لدعوة التجار لمنصة Suriix. فور تسجيلهم واشتراكهم، سيضاف الرصيد لمحفظتك تلقائياً.
          </p>
          
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl dark:bg-[#0f172a]">
             <div className="flex items-center justify-center w-10 shrink-0 text-white/60">
                 <LinkIcon className="w-4 h-4" />
             </div>
             <input 
               readOnly 
               value={referralLink} 
               dir="ltr"
               className="bg-transparent text-white font-medium text-sm flex-1 outline-none font-mono" 
             />
             <button 
               onClick={copyToClipboard}
               className="bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 hover:bg-white/90 transition dark:bg-[#0f172a]"
             >
               {copied ? <><CheckCircle2 className="w-4 h-4" /> تم النَسخ</> : <><Copy className="w-4 h-4" /> نسخ الرابط</>}
             </button>
          </div>
        </div>

        {/* Reward Explanation */}
        <div className="bg-white dark:bg-slate-800 rounded-[24px] border border-border/40 shadow-sm p-8 flex flex-col justify-center items-center text-center dark:border-slate-800">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-8 h-8 text-green-500" />
            </div>
            <h4 className="font-bold text-foreground text-lg mb-2">المكافآت المتوقعة</h4>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium">
               تحصل على نسبة <span className="text-green-600 font-bold">15%</span> من قيمة الاشتراك الأول لأي متجر يسجل عبر الرابط الخاص بك.
            </p>
        </div>

      </div>

      {/* Stats Area */}
      <h4 className="text-lg font-bold mt-8 mb-4">إحصائيات الإحالة</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-border/40 shadow-sm dark:border-slate-800">
             <div className="flex items-center gap-3 mb-3 text-muted-foreground">
                 <Users className="w-4 h-4" />
                 <span className="text-xs font-bold">التسجيلات الناجحة</span>
             </div>
             <span className="text-2xl font-black text-foreground">{stats.successfulSignups}</span>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-border/40 shadow-sm dark:border-slate-800">
             <div className="flex items-center gap-3 mb-3 text-muted-foreground">
                 <TrendingUp className="w-4 h-4" />
                 <span className="text-xs font-bold">الرصيد المكتسب</span>
             </div>
             <h4 className="text-2xl font-black text-green-600">
               {stats.earnedBalance.toLocaleString()} <span className="text-xs text-muted-foreground font-bold">ر.ي</span>
             </h4>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-border/40 shadow-sm dark:border-slate-800">
             <div className="flex items-center gap-3 mb-3 text-muted-foreground">
                 <Share2 className="w-4 h-4" />
                 <span className="text-xs font-bold">رصيد معلّق (تحت المراجعة)</span>
             </div>
             <h4 className="text-2xl font-black text-amber-500">
               {stats.pendingBalance.toLocaleString()} <span className="text-xs text-muted-foreground font-bold">ر.ي</span>
             </h4>
          </div>
      </div>
    </motion.div>
  );
};
