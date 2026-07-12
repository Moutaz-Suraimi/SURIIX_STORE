import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ShoppingCart, CheckCircle2, Zap, Globe, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { readyWebsitesData } from "@/data/readyWebsites";



const ReadyWebsitesSection = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <section id="ready-websites" className="section-padding relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 px-4 py-1.5 rounded-full text-sm font-medium">
              {isAr ? "حصري" : "Exclusive"}
            </Badge>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 gradient-text tracking-tight leading-tight"
          >
            {isAr ? "مواقع جاهزة للبيع" : "Ready Websites for Sale"}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-foreground/90 text-lg md:text-xl font-medium mb-8 leading-relaxed max-w-2xl mx-auto"
          >
            {isAr 
              ? "أطلق مشروعك بأسرع وقت مع مواقع احترافية جاهزة — صُممت بجودة عالية وأسلوب عصري ويمكنك تخصيصها لتناسب علامتك التجارية."
              : "Launch your business instantly with pre-built professional websites — crafted with high quality, modern design, and ready to customize for your brand."}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 text-sm font-medium text-foreground/80"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg gradient-icon-box flex items-center justify-center">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span>{isAr ? "تسليم فوري بعد الشراء" : "Instant delivery after purchase"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg gradient-icon-box flex items-center justify-center">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span>{isAr ? "نسخة واحدة فقط لكل تصميم" : "Only one copy per design"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg gradient-icon-box flex items-center justify-center">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <span>{isAr ? "توفر محدود" : "Limited availability"}</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {readyWebsitesData.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group glass rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] flex flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-muted/20 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent z-10" />
                <Badge 
                  className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} z-20 ${
                    product.status === 'Available' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                    product.status === 'Limited' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' :
                    'bg-red-500/20 text-red-400 border-red-500/50'
                  }`}
                  variant="outline"
                >
                  {isAr ? product.statusAr : product.status}
                </Badge>
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 relative z-0"
                />
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-xs text-primary font-medium tracking-wider uppercase mb-2">
                  {isAr ? product.categoryAr : product.category}
                </div>
                <h3 className="text-2xl font-extrabold mb-2 text-foreground tracking-tight line-clamp-1">
                  {isAr ? product.titleAr : product.title}
                </h3>
                
                <div className="text-3xl font-black mt-2 mb-6 gradient-text drop-shadow-sm">
                  ${product.price} <span className="text-sm font-medium text-muted-foreground">{isAr ? "تبدأ من" : "starting from"}</span>
                </div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {(isAr ? product.featuresAr : product.features).map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  <Link to={`/ready-website/${product.id}`} className="flex-1 min-w-[120px]">
                    <Button variant="outline" className="w-full rounded-xl border-border/50 hover:bg-primary/10 hover:text-primary transition-colors group/btn text-xs sm:text-sm">
                      <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform hidden sm:inline" />
                      {isAr ? "التفاصيل" : "Details"}
                    </Button>
                  </Link>
                  {product.demoUrl && (
                    <Button 
                      variant="outline" 
                      className="flex-1 min-w-[120px] rounded-xl border-border/50 hover:bg-neon-blue/10 hover:text-neon-blue hover:border-neon-blue/50 transition-colors group/btn text-xs sm:text-sm"
                      onClick={() => window.open(product.demoUrl, "_blank")}
                    >
                      <Globe className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform hidden sm:inline" />
                      {isAr ? "معاينة حية" : "Live Demo"}
                    </Button>
                  )}
                  <Button 
                    className="flex-[2] min-w-[160px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] transition-all group/btn text-xs sm:text-sm"
                    onClick={() => {
                      const message = isAr 
                        ? `مرحباً، أرغب في شراء الموقع الجاهز: ${product.titleAr}`
                        : `Hello, I'd like to purchase the ready website: ${product.title}`;
                      window.open(`https://wa.me/967780930635?text=${encodeURIComponent(message)}`, "_blank");
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:-translate-x-1 transition-transform hidden sm:inline" />
                    {isAr ? "شراء الآن" : "Buy Now"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReadyWebsitesSection;
