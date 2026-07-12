import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ArrowRight, X, BookOpen } from "lucide-react";

const WHATSAPP = "https://wa.me/967780930635";

const blogPosts = [
  {
    titleKey: "blog.post1.title",
    excerptKey: "blog.post1.excerpt",
    contentKey: "blog.post1.content",
    category: "blog.cat.strategy",
    date: "2026-02-10",
    readTime: 5,
    gradient: "from-primary to-accent",
  },
  {
    titleKey: "blog.post2.title",
    excerptKey: "blog.post2.excerpt",
    contentKey: "blog.post2.content",
    category: "blog.cat.design",
    date: "2026-01-28",
    readTime: 7,
    gradient: "from-accent to-neon-blue",
  },
  {
    titleKey: "blog.post3.title",
    excerptKey: "blog.post3.excerpt",
    contentKey: "blog.post3.content",
    category: "blog.cat.tech",
    date: "2026-01-15",
    readTime: 6,
    gradient: "from-neon-blue to-primary",
  },
  {
    titleKey: "blog.post4.title",
    excerptKey: "blog.post4.excerpt",
    contentKey: "blog.post4.content",
    category: "blog.cat.marketing",
    date: "2026-01-05",
    readTime: 4,
    gradient: "from-primary to-neon-blue",
  },
];

const BlogSection = ({ isHome = false }: { isHome?: boolean }) => {
  const { t, lang } = useLanguage();
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  
  // Comments state
  const [comments, setComments] = useState<{name: string, text: string, date: string}[]>([]);
  const [newComment, setNewComment] = useState("");

  // Load comments when a post is opened
  const handleOpenPost = (index: number) => {
    setExpandedPost(index);
    const savedComments = localStorage.getItem(`suriix_blog_comments_${index}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      setComments([]);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || expandedPost === null) return;
    
    const comment = {
      name: lang === "ar" ? "زائر" : "Visitor", // In a real app this would be the logged in user
      text: newComment.trim(),
      date: new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { year: 'numeric', month: 'short', day: 'numeric' })
    };
    
    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    setNewComment("");
    
    // Save to localStorage so it persists
    localStorage.setItem(`suriix_blog_comments_${expandedPost}`, JSON.stringify(updatedComments));
  };

  const location = useLocation();
  const isDedicatedPage = location.pathname === "/blog" || !isHome;
  const displayPosts = isHome ? blogPosts.slice(0, 3) : blogPosts;

  return (
    <section id="blog" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            {isDedicatedPage ? (
              <h1 className="text-3xl md:text-5xl font-bold gradient-text mb-4">
                {t("blog.title")}
              </h1>
            ) : (
              <h2 className="text-3xl md:text-5xl font-bold gradient-text mb-4">
                {t("blog.title")}
              </h2>
            )}
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("blog.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div className={`grid gap-6 ${isHome ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
          {displayPosts.map((post, i) => (
            <ScrollReveal
              key={i}
              delay={i * 0.1}
              direction={i % 2 === 0 ? "left" : "right"}
            >
              <motion.div
                className="card-3d glass rounded-2xl neon-border overflow-hidden cursor-pointer group"
                whileHover={{ y: -5 }}
                onClick={() => handleOpenPost(i)}
              >
                {/* Gradient header */}
                <div className={`h-2 bg-gradient-to-r ${post.gradient}`} />

                <div className="p-6">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {t(post.category)}
                  </span>

                  <h3 className="text-xl font-bold text-foreground mt-4 mb-2 group-hover:text-primary transition-colors">
                    {t(post.titleKey)}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {t(post.excerptKey)}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime} min
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {isHome && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mt-12"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-primary to-accent hover:shadow-[0_12px_24px_rgba(139,92,246,0.3)] hover:opacity-98 transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg border border-white/10"
            >
              <span>
                {lang === "ar" 
                  ? "عرض جميع المقالات" 
                  : lang === "zh" 
                  ? "查看所有文章" 
                  : "View All Blog Posts"}
              </span>
              <ArrowRight className="w-5 h-5 rtl:rotate-180" />
            </Link>
          </motion.div>
        )}
      </div>

      {/* Expanded reading mode */}
      <AnimatePresence>
        {expandedPost !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setExpandedPost(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="glass-strong rounded-2xl neon-border max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setExpandedPost(null)}
                className="absolute top-4 end-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div
                className={`h-1 w-20 rounded-full bg-gradient-to-r ${blogPosts[expandedPost].gradient} mb-6`}
              />

              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {t(blogPosts[expandedPost].category)}
              </span>

              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-4 mb-2">
                {t(blogPosts[expandedPost].titleKey)}
              </h2>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{" "}
                  {blogPosts[expandedPost].date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />{" "}
                  {blogPosts[expandedPost].readTime} min
                </span>
              </div>

              <div className="text-muted-foreground leading-relaxed whitespace-pre-line mb-8">
                {t(blogPosts[expandedPost].contentKey)}
              </div>

              {/* Comments Section */}
              <div className="mt-8 pt-8 border-t border-border/30">
                <h3 className="text-xl font-bold text-foreground mb-4">{t("blog.comments") || (lang === "ar" ? "التعليقات" : "Comments")}</h3>
                
                {/* Add Comment */}
                <div className="mb-6 flex flex-col gap-3">
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={lang === "ar" ? "أضف رأيك هنا..." : "Write your opinion here..."}
                    className="w-full bg-background/50 border border-border/50 rounded-xl p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none h-24"
                  />
                  <button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="self-end px-5 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50 transition-colors text-sm font-bold"
                  >
                    {lang === "ar" ? "إرسال التعليق" : "Post Comment"}
                  </button>
                </div>

                {/* Display Comments */}
                <div className="space-y-4 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4 italic">
                      {lang === "ar" ? "لا توجد تعليقات بعد. كن أول من يشارك برأيه!" : "No comments yet. Be the first to share your opinion!"}
                    </p>
                  ) : (
                    comments.map((comment, idx) => (
                      <div key={idx} className="bg-background/40 border border-border/30 rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {comment.name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-foreground">{comment.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{comment.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed pl-8">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 flex items-center justify-center border-t border-border/10">
                <a
                  href={`${WHATSAPP}?text=${encodeURIComponent(t("blog.cta.message"))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-purple text-primary-foreground font-medium neon-glow-strong hover:shadow-[0_0_40px_hsl(265_90%_60%/0.4)] transition-shadow"
                >
                  <BookOpen className="w-4 h-4" />
                  {t("blog.cta")}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BlogSection;
