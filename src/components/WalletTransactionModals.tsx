import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, CheckCircle2, ShieldCheck, XCircle, Printer, Download, CreditCard, User, Building2, Calendar, Clock } from 'lucide-react';

export const TransferModal = ({ isOpen, onClose, currentBalance, currentSettings, onTransfer }: any) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleTransfer = () => {
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }
    if (numAmount > currentBalance) {
      alert('الرصيد غير كافٍ لإتمام التحويل');
      return;
    }
    if (onTransfer) {
      onTransfer(numAmount);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col dark:bg-[#0f172a]">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2"><ArrowLeftRight className="w-5 h-5 text-primary"/> تحويل رصيد للإدارة</h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 dark:text-slate-300 dark:bg-[#0f172a]"><XCircle className="w-6 h-6"/></button>
          </div>
          <div className="p-6 space-y-5 bg-slate-50 dark:bg-[#0f172a]">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
               <span className="text-sm font-bold text-slate-700 dark:text-white">الرصيد المتوفر</span>
               <span className="font-black text-primary text-xl flex items-center gap-1" dir="ltr">{Number(currentBalance).toLocaleString()} <span className="text-sm">{currentSettings.label}</span></span>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3 dark:bg-[#0f172a] dark:border-slate-800">
               <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="font-bold text-slate-800 text-[14px] dark:text-white">محفظة إدارة SURIIX</h4>
                  <p className="text-xs text-slate-500 font-medium dark:text-slate-300">التحويل المباشر لحساب النظام</p>
               </div>
            </div>

            <div>
              <label className="text-[14px] font-bold text-slate-800 mb-2 block dark:text-white">المبلغ المراد تحويله</label>
              <div className="relative">
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-white border border-slate-200 rounded-[14px] px-4 py-3.5 focus:border-primary outline-none focus:ring-1 focus:ring-primary text-lg font-bold text-left dark:bg-[#0f172a] dark:border-slate-800" dir="ltr" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 font-bold text-slate-500 dark:text-slate-300">{currentSettings.label}</div>
              </div>
            </div>
            <p className="text-xs text-amber-600 font-bold bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> العملية مجانية، لا توجد رسوم تحويل.</p>
          </div>
          <div className="p-5 border-t border-slate-100 bg-white dark:bg-[#0f172a]">
            <button onClick={handleTransfer} className="w-full bg-primary hover:bg-[#4338CA] text-white font-bold py-3.5 rounded-[14px] transition flex items-center justify-center gap-2">تأكيد التحويل <ArrowLeftRight className="w-5 h-5"/></button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const InvoiceModal = ({ isOpen, onClose, transactions, currentSettings, storeData }: any) => {
  if (!isOpen) return null;
  const recentTrans = transactions?.slice(0, 5) || [];
  
  const totalAmount = recentTrans.reduce((sum: number, t: any) => sum + Math.abs(t.amount || 0), 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto" dir="rtl">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col my-auto relative overflow-hidden dark:bg-[#0f172a]">
          
          {/* Top Actions Floating */}
          <div className="absolute top-6 left-6 flex items-center gap-2 z-10 print:hidden">
             <button onClick={() => window.print()} className="w-10 h-10 bg-white/80 hover:bg-white text-slate-700 shadow-sm rounded-full flex items-center justify-center transition border border-slate-200 dark:text-white dark:bg-[#0f172a] dark:border-slate-800" title="طباعة"><Printer className="w-5 h-5"/></button>
             <button onClick={onClose} className="w-10 h-10 bg-white/80 hover:bg-slate-100 text-slate-700 shadow-sm rounded-full flex items-center justify-center transition border border-slate-200 dark:text-white dark:bg-[#0f172a] dark:border-slate-800"><XCircle className="w-6 h-6"/></button>
          </div>

          <div className="p-8 sm:p-12 print:p-0 flex-1">
             
             {/* Header */}
             <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-10 gap-6">
                <div className="text-right sm:text-right flex flex-col order-2 sm:order-1 items-end w-full">
                   <h1 className="font-black text-3xl sm:text-4xl text-slate-800 mb-2 font-display dark:text-white">فاتورة وكشف حساب</h1>
                   <p className="text-slate-500 text-sm font-medium dark:text-slate-300">فاتورة إلكترونية معتمدة</p>
                </div>
                <div className="order-1 sm:order-2 shrink-0">
                   <img src="/img/logo.png" alt="SURIIX Logo" className="h-[50px] object-contain" />
                </div>
             </div>

             {/* Info Section */}
             <div className="flex flex-col sm:flex-row gap-6 mb-10 w-full justify-between items-stretch">
                
                {/* Store Profile Info */}
                <div className="flex-1 flex gap-5 items-center">
                   <div className="flex flex-col justify-center">
                      <h2 className="font-black text-2xl text-slate-800 mb-3 dark:text-white">{storeData?.name || 'متجر الفاخر'}</h2>
                      <div className="space-y-1.5 text-sm">
                         <p className="text-slate-500 dark:text-slate-300"><span className="text-slate-400 font-medium ml-1 dark:text-slate-300">رقم العميل:</span> {storeData?.id?.replace('local-','') || 'CUS-2025-00421'}</p>
                         <p className="text-slate-500 dark:text-slate-300"><span className="text-slate-400 font-medium ml-1 dark:text-slate-300">البريد الإلكتروني:</span> <span dir="ltr">{storeData?.url || storeData?.email || 'example@alfakher205.com'}</span></p>
                         <p className="text-slate-500 dark:text-slate-300"><span className="text-slate-400 font-medium ml-1 dark:text-slate-300">رقم الجوال:</span> <span dir="ltr">{storeData?.phone || '+967 77 123 4567'}</span></p>
                      </div>
                   </div>
                   <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center shrink-0 ml-auto overflow-hidden">
                      <img src="/img/logo.png" className="w-full h-full object-contain drop-shadow-xl" />
                   </div>
                </div>

                {/* Violet Invoice Number Box */}
                <div className="w-full sm:w-[280px] shrink-0 border border-slate-100 rounded-2xl overflow-hidden flex flex-col shadow-sm">
                   <div className="bg-[#7e6af2] text-white p-4 text-center">
                      <p className="text-xs font-semibold opacity-90 mb-1">رقم الفاتورة</p>
                      <h3 className="text-xl font-bold font-display tracking-widest shrink-0" dir="ltr">INV-2025-{Math.floor(100000 + Math.random() * 900000)}</h3>
                   </div>
                   <div className="bg-white p-4 flex flex-col gap-4 dark:bg-[#0f172a]">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 dark:bg-[#0f172a] dark:text-slate-300"><Calendar className="w-5 h-5"/></div>
                         <div>
                            <p className="text-[10px] text-slate-400 font-bold dark:text-slate-300">تاريخ الإصدار</p>
                            <p className="text-sm font-bold text-slate-700 dark:text-white" dir="ltr">{new Date().toLocaleDateString('en-GB')}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 dark:bg-[#0f172a] dark:text-slate-300"><Clock className="w-5 h-5"/></div>
                         <div>
                            <p className="text-[10px] text-slate-400 font-bold dark:text-slate-300">وقت الإصدار</p>
                            <p className="text-sm font-bold text-slate-700 dark:text-white" dir="ltr">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Table */}
             <div className="border border-slate-200 rounded-2xl overflow-hidden mb-8 dark:border-slate-800">
                <table className="w-full text-right">
                   <thead className="bg-[#7e6af2] text-white">
                      <tr>
                         <th className="py-4 px-6 font-bold text-sm w-16 text-center">#</th>
                         <th className="py-4 px-6 font-bold text-sm text-right">بيان الخدمة</th>
                         <th className="py-4 px-6 font-bold text-sm text-center">الكمية</th>
                         <th className="py-4 px-6 font-bold text-sm text-center">سعر الوحدة</th>
                         <th className="py-4 px-6 font-bold text-sm text-center">الإجمالي</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 bg-white dark:bg-[#0f172a]">
                      {recentTrans.length === 0 ? (
                         <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-500 font-medium bg-slate-50 dark:bg-[#0f172a] dark:text-slate-300">لا توجد عمليات مسجلة متوفرة حالياً</td>
                         </tr>
                      ) : (
                         recentTrans.map((row: any, idx: number) => (
                           <tr key={idx} className="hover:bg-slate-50/50 transition dark:bg-[#0f172a]">
                              <td className="py-4 px-6 text-center text-slate-500 font-medium dark:text-slate-300">{idx + 1}</td>
                              <td className="py-4 px-6 font-bold text-slate-700 dark:text-white">{row.description || (row.type === 'transfer' ? 'تحويل رصيد' : 'إضافة رصيد إلى المحفظة')}</td>
                              <td className="py-4 px-6 text-center font-medium text-slate-600 dark:text-slate-300">1</td>
                              <td className="py-4 px-6 text-center font-medium text-slate-600 dark:text-slate-300" dir="ltr">{Math.abs(row.amount || 0).toLocaleString()} {currentSettings.label}</td>
                              <td className="py-4 px-6 text-center font-bold text-slate-800 dark:text-white" dir="ltr">{Math.abs(row.amount || 0).toLocaleString()} {currentSettings.label}</td>
                           </tr>
                         ))
                      )}
                   </tbody>
                </table>
             </div>

             {/* Totals & Payment Method */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {/* Total Left */}
                <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4 dark:bg-[#0f172a] dark:border-slate-800">
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium dark:text-slate-300">المجموع الفرعي</span>
                      <span className="font-bold text-slate-700 dark:text-white" dir="ltr">{totalAmount.toLocaleString()} {currentSettings.label}</span>
                   </div>
                   <div className="w-full h-px bg-slate-100 dark:bg-[#0f172a]" />
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium dark:text-slate-300">ضريبة القيمة المضافة (0%)</span>
                      <span className="font-bold text-slate-700 dark:text-white" dir="ltr">0 {currentSettings.label}</span>
                   </div>
                   <div className="w-full h-px bg-slate-100 dark:bg-[#0f172a]" />
                   <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-lg text-[#7e6af2]">الإجمالي الكلي</span>
                      <span className="font-black text-2xl text-[#7e6af2]" dir="ltr">{totalAmount.toLocaleString()} <span className="text-lg">{currentSettings.label}</span></span>
                   </div>
                </div>

                {/* Method Right */}
                <div className="border border-slate-200 rounded-2xl p-6 bg-white flex flex-col justify-center items-center text-center dark:bg-[#0f172a] dark:border-slate-800">
                   <div className="w-14 h-14 bg-indigo-50 text-[#7e6af2] rounded-full flex items-center justify-center mb-4">
                      <CreditCard className="w-6 h-6" />
                   </div>
                   <p className="text-xs text-slate-400 font-bold mb-1 dark:text-slate-300">طريقة الدفع</p>
                   <h3 className="font-bold text-slate-800 mb-4 dark:text-white">المحفظة الإلكترونية</h3>
                   <div className="w-full h-px bg-slate-100 mb-4 dark:bg-[#0f172a]" />
                   <p className="text-xs text-slate-400 font-bold mb-1 dark:text-slate-300">رقم العملية</p>
                   <p className="font-medium text-slate-600 tracking-wide text-sm dark:text-slate-300" dir="ltr">TRX-{new Date().toISOString().replace(/[-:T]/g,'').substring(0,14)}</p>
                </div>
             </div>

             {/* Success Alert */}
             <div className="bg-[#f3f0ff] rounded-2xl p-6 flex items-center justify-between border border-[#e5defc] mb-10">
                <div>
                   <h3 className="font-bold text-xl text-[#7e6af2] mb-1">تمت العملية بنجاح</h3>
                   <p className="text-slate-600 text-sm font-medium dark:text-slate-300">تم إضافة المبلغ إلى محفظتك الرقمية بنجاح والمعاملات موثقة.</p>
                </div>
                <div className="w-14 h-14 bg-[#7e6af2] rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                   <CheckCircle2 className="w-7 h-7" />
                </div>
             </div>

             <div className="w-full h-px bg-slate-200 mb-8" />

             {/* Footer with QR */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-20 h-20 bg-white p-1 rounded-xl border border-slate-200 shrink-0 dark:bg-[#0f172a] dark:border-slate-800">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://suriix.store/verify/INV-2025`} alt="QR" className="w-full h-full opacity-80" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs text-slate-400 font-bold dark:text-slate-300">للتحقق من صحة الفاتورة</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-300">امسح رمز QR</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-300">أو قم بزيارة: <a href="#" className="text-[#7e6af2] hover:underline">suriix.store/verify</a></p>
                   </div>
                </div>
                
                <div className="flex flex-col items-end text-right gap-2">
                   <div className="flex items-center gap-2">
                      <div className="text-right">
                         <h4 className="font-bold text-slate-800 text-lg dark:text-white">شكراً لاستخدامك منصة SURIIX</h4>
                         <p className="text-xs text-slate-500 font-medium dark:text-slate-300">هذه الفاتورة صادرة آلياً وموثقة بواسطة منصة SURIIX للمعاملات الرقمية</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-[#7e6af2] shrink-0">
                         <ShieldCheck className="w-6 h-6" />
                      </div>
                   </div>
                </div>
             </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
