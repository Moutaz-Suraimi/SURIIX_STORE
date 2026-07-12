import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0f0f13] transition-colors">
      <SEO noIndex={true} title="404 - Page Not Found" description="The page you are looking for does not exist." />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="mb-4 text-xl text-muted-foreground dark:text-gray-400">عذراً! الصفحة غير موجودة</p>
        <a href="/" className="text-primary underline hover:text-primary/90 font-bold">
          العودة للصفحة الرئيسية
        </a>
      </div>
    </div>
  );
};

export default NotFound;
