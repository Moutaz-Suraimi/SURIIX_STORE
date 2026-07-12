import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

/**
 * RefForwarder – يعترض روابط الإحالة /ref/:code
 * - يُخزّن رمز الإحالة في localStorage
 * - يُوجّه الزائر إلى صفحة /create-store
 */
const RefForwarder = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRef = async () => {
      if (!code) {
        navigate("/create-store");
        return;
      }

      // استخراج رمز الإحالة الفعلي (الجزء بعد "-" الأخير إذا كان الرابط name-CODE)
      const parts = code.split("-");
      const referralCode = parts[parts.length - 1].toUpperCase();

      // البحث عن المسوق في قاعدة البيانات للتحقق من صحة الرمز
      try {
        const { data: marketer } = await supabase
          .from("marketers")
          .select("id, name_ar, name_en, referral_code")
          .eq("referral_code", referralCode)
          .maybeSingle();

        if (marketer) {
          // تخزين رمز الإحالة ومعرّف المسوق واسمه في localStorage
          localStorage.setItem("suriix_referral_code", referralCode);
          localStorage.setItem("suriix_referral_marketer_id", marketer.id);
          localStorage.setItem("suriix_referral_marketer_name", marketer.name_ar || marketer.name_en || "");
        } else {
          // رمز غير صالح - نُوجّه بدون تخزين
          console.warn("Referral code not found:", referralCode);
        }
      } catch (err) {
        console.error("Error looking up referral code:", err);
      }

      // توجيه الزائر إلى صفحة إنشاء المتجر
      navigate("/create-store", { replace: true });
    };

    handleRef();
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]" dir="rtl">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium dark:text-slate-300">جاري التحقق من رابط الإحالة...</p>
      </div>
    </div>
  );
};

export default RefForwarder;
