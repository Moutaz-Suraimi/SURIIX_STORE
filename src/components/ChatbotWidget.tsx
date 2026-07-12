import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Headset, Sparkles, Loader2 } from "lucide-react";

const WHATSAPP_NUMBER = "967780930635";
const API_KEY = "AIzaSyAeyaCMVKNtZeonXdq5hYgqQes1xlBzru4";

interface Message {
  role: "bot" | "user";
  text: string;
}

const systemPrompt = `أنت مساعد ذكي وموظف مبيعات رسمي لشركة Suriix.

🎯 هدفك الأساسي:
الترحيب الحار بالعملاء باسم الشركة "Suriix"، تقديم نصائح قيمة للعملاء الجدد بناءً على رؤية الشركة، ثم تحويلهم إلى عملاء مهتمين ودفعهم للتواصل عبر واتساب.

📌 تخصصك:
- تصميم وتطوير المواقع
- تصميم الهوية البصرية
- الخدمات الرقمية (التسويق، تحسين محركات البحث، وتطوير حضورك الرقمي)

🧠 أسلوبك:
- ترحيب دائماً باسم الشركة (مثال: "يا أهلاً بك في Suriix! يسعدني جداً مساعدتك...") في بداية المحادثة.
- مختصر (لا تكتب فقرات طويلة)
- احترافي وواثق
- ودود بدون مبالغة
- واضح وسهل الفهم

💡 تقديم النصائح للمشاريع الجديدة (مستمدة من موقعنا):
- إذا طلب العميل نصيحة أو كان مبتدئاً، قدم له نصائح مبنية على خدماتنا ورؤيتنا الرقمية:
  * أهمية سرعة التحميل وتجربة المستخدم السلسة لأنها تضاعف المبيعات.
  * كيف أن الذكاء الاصطناعي والأتمتة يغيران قواعد اللعبة ويختصران الوقت.
  * أهمية بناء "مرآة رقمية" قوية (لكي لا يكون مشروعك مخفياً عن عملائك أو موجوداً بلا مبيعات).
- اربط النصيحة دائماً بالحلول والباقات التي نقدمها في Suriix.

🌟 منهجية Suriix (ابنِ، بِع، نمُو):
- "ابنِ" (Build): نبني للعميل حضوراً رقمياً قوياً من الصفر (تصميم مواقع احترافية، هويات بصرية، وبنية تحتية متينة).
- "بِع" (Sell): نصمم المتاجر ونحسن تجربة المستخدم (UI/UX) لتحويل الزوار إلى عملاء فعليين وزيادة المبيعات.
- "نمُو" (Grow): نضمن للمشروع نمواً مستمراً عبر استراتيجيات التسويق، تحسين محركات البحث SEO، وأتمتة الذكاء الاصطناعي.
إذا سألك العميل عن هذه المنهجية، اشرح له كيف نطبقها على مشروعه.

📦 الباقات:
1. باقة Start:
مناسبة للمشاريع الصغيرة والأفراد، صفحة هبوط واحدة، تصميم متجاوب

2. باقة Growth:
موقع حتى 5 صفحات + تصميم احترافي + تحسين تجربة المستخدم

3. باقة Premium:
حل كامل مخصص للشركات + SEO + أداء عالي + دعم + لوحة تحكم

📌 قواعد مهمة:
- مالك الموقع والمؤسس هو: "المهندس معتز وائل الصريمي". أجب بذلك بفخر واعتزاز إذا سُئلت عن المالك.
- لا تخرج عن خدمات Suriix
- لا تتكلم عن السياسة أو الدين أو مواضيع خارج العمل
- لا تعطي أسعار إذا لم يتم تحديدها
- لا تخترع معلومات غير موجودة
- إذا ما عرفت الجواب قل: "أحتاج تفاصيل أكثر عشان أفيدك بشكل أدق"

📈 طريقة البيع:
- اسأل العميل عن احتياجه (نوع المشروع) أو قدم له نصيحة إذا طلب.
- اقترح باقة مناسبة.
- وضّح الفائدة وليس فقط الميزة.
- حاول دائمًا إنهاء الرد بدعوة للتواصل.

💬 أمثلة أسلوب الرد:
- "مرحباً بك في Suriix! كيف أقدر أساعدك اليوم في إطلاق مشروعك؟"
- "نصيحتي لك كصاحب مشروع جديد أن تركز على تجربة مستخدم سريعة وممتازة. باقة Start راح تكون انطلاقة ممتازة لك."
- "تقدر تتواصل معنا مباشرة عبر واتساب ونجهز لك كل التفاصيل"

🚫 ممنوع:
- الرد الطويل
- الخروج عن الموضوع
- استخدام لغة معقدة

🔥 النهاية:
أي رد لازم يقرب العميل من اتخاذ خطوة (سؤال / اقتراح / تواصل).`;

const ChatbotWidget = () => {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hasOpened, setHasOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    { key: "chatbot.quick.pricing" },
    { key: "chatbot.quick.portfolio" },
    { key: "chatbot.quick.contact" },
    { key: "chatbot.quick.services" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleOpen = () => {
    setIsOpen(true);
    if (!hasOpened) {
      setHasOpened(true);
      setMessages([{ role: "bot", text: lang === 'ar' ? "مرحباً بك في Suriix! كيف يمكنني مساعدتك اليوم؟" : "Welcome to Suriix! How can I help you today?" }]);
    }
  };

  const generateAIResponse = async (userText: string, chatHistory: Message[]): Promise<string> => {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

      const validHistory = [...chatHistory];
      // Gemini strictly requires the first message to be from the 'user'
      while (validHistory.length > 0 && validHistory[0].role === "bot") {
        validHistory.shift();
      }

      const mergedContents: { role: string; parts: { text: string }[] }[] = [];
      
      for (const msg of validHistory) {
        const role = msg.role === "bot" ? "model" : "user";
        if (mergedContents.length > 0 && mergedContents[mergedContents.length - 1].role === role) {
          mergedContents[mergedContents.length - 1].parts[0].text += "\n" + msg.text;
        } else {
          mergedContents.push({ role, parts: [{ text: msg.text }] });
        }
      }

      // Add current user input
      if (mergedContents.length > 0 && mergedContents[mergedContents.length - 1].role === "user") {
        mergedContents[mergedContents.length - 1].parts[0].text += "\n" + userText;
      } else {
        mergedContents.push({ role: "user", parts: [{ text: userText }] });
      }

      // Inject system prompt into the first user message to guarantee compatibility
      if (mergedContents.length > 0) {
        mergedContents[0].parts[0].text = `[System Instructions: ${systemPrompt}]\n\nUser Input: ` + mergedContents[0].parts[0].text;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: mergedContents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("API Error Response:", data);
        if (response.status === 429) {
          return lang === 'ar' 
            ? "عذراً، أواجه ضغطاً كبيراً في الرسائل حالياً 😅! يرجى الانتظار دقيقة أو التحدث مع خبير حقيقي عبر واتساب." 
            : "Sorry, I'm receiving too many messages right now 😅! Please wait a minute or talk to a human on WhatsApp.";
        }
        return lang === 'ar' ? "عذراً، حدث خطأ في النظام. يرجى التواصل معنا عبر واتساب." : "Sorry, a system error occurred. Please contact us via WhatsApp.";
      }

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      return lang === 'ar' ? "عذراً، حدث خطأ في النظام. يرجى التواصل معنا عبر واتساب." : "Sorry, a system error occurred. Please contact us via WhatsApp.";
    } catch (error) {
      console.error("AI Error:", error);
      return lang === 'ar' ? "عذراً، أواجه مشكلة في الاتصال حالياً. يرجى مراسلتنا عبر الواتساب." : "Sorry, I'm having connection issues right now. Please message us on WhatsApp.";
    }
  };

  const processUserMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;
    
    setInput("");
    const currentHistory = [...messages];
    
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    const response = await generateAIResponse(userText, currentHistory);
    
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: response },
    ]);
    setIsLoading(false);
  };

  const handleSend = () => {
    processUserMessage(input);
  };

  const handleQuickReply = (key: string) => {
    // If the translation key exists, use it. Otherwise use a fallback (we only care to trigger the AI).
    const fallbackText = lang === 'ar' ? "أخبرني المزيد" : "Tell me more";
    const userText = t(key) !== key ? t(key) : fallbackText;
    processUserMessage(userText);
  };

  const isRtl = lang === "ar";

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOpen}
            className="fixed bottom-6 z-50 w-14 h-14 rounded-full gradient-purple text-primary-foreground flex items-center justify-center neon-glow-strong cursor-pointer"
            style={{ [isRtl ? "left" : "right"]: "1.5rem" }}
          >
            <MessageCircle className="w-6 h-6" />
            {/* Pulse indicator */}
            <span className={`absolute -top-1 ${isRtl ? "-left-1" : "-right-1"} w-4 h-4 rounded-full bg-accent animate-ping`} />
            <span className={`absolute -top-1 ${isRtl ? "-left-1" : "-right-1"} w-4 h-4 rounded-full bg-accent`} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 z-50 w-[340px] max-h-[500px] flex flex-col glass-strong rounded-2xl neon-border overflow-hidden shadow-2xl"
            style={{ [isRtl ? "left" : "right"]: "1.5rem" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 gradient-purple">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Headset className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-foreground">
                    {lang === 'ar' ? 'مساعد Suriix' : lang === 'zh' ? 'Suriix 助手' : 'Suriix Assistant'}
                  </p>
                  <p className="text-[10px] text-primary-foreground/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                    {t("chatbot.online")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors text-primary-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] max-h-[350px] custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm shadow-md"
                        : "glass neon-border text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.role === "bot" && (
                      <Sparkles className="w-3 h-3 text-primary inline mr-1 mb-0.5" />
                    )}
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="px-3 py-2 rounded-xl glass neon-border text-foreground rounded-bl-sm">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick action: Talk to Human */}
            <div className="px-4 py-2 border-t border-border/20">
               <button 
                 onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
                 className="w-full py-2 text-xs font-semibold rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
               >
                 <MessageCircle className="w-3.5 h-3.5" />
                 {lang === 'ar' ? 'تحدث مع خبير حقيقي (واتساب)' : 'Talk to a human (WhatsApp)'}
               </button>
            </div>

            {/* Quick replies (only show if few messages to save space) */}
            {messages.length < 3 && !isLoading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {quickReplies.map((qr) => (
                  t(qr.key) !== qr.key ? (
                    <button
                      key={qr.key}
                      onClick={() => handleQuickReply(qr.key)}
                      className="px-3 py-1.5 rounded-full text-xs glass neon-border text-primary hover:bg-primary/10 transition-colors"
                    >
                      {t(qr.key)}
                    </button>
                  ) : null
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-4 pt-1">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t("chatbot.placeholder")}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="p-2 rounded-xl gradient-purple text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
