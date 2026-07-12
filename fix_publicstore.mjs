import fs from 'fs';
import path from 'path';

try {
  const filePath = path.join(process.cwd(), 'src/pages/PublicStore.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the syntax error around line 1730 where the a tag was cut off
  content = content.replace(
/\{storeData\?\.whatsapp && \(\s*<a href={`https:\/\/wa\.me\/\$\{storeData\.whatsapp\.replace\('\+',\s*''\)\}\?text=\$\{encodeURIComponent\('مرحباً، أريد الاستفسار عن حالة طلبي\.'\)\}`} target="_blank" cl\s*<div className="pt-4 flex flex-col items-center">\s*<p className="text-center text-sm text-slate-500 dark:text-slate-300">sName="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 dark:bg-\[#0f172a\]">/g,

`              {storeData?.whatsapp && (
                <a href={\`https://wa.me/\${storeData.whatsapp.replace('+', '')}?text=\${encodeURIComponent('مرحباً، أريد الاستفسار عن حالة طلبي.')}\`} target="_blank" className="mt-6 bg-[#25D366] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition">
                  <MessageSquare className="w-5 h-5" /> استفسر عن طلبك عبر واتساب
                </a>
              )}
            </div>
          </section>
        )}

        {activePage === 'contact' && (
          <section className="bg-white rounded-3xl p-12 text-center min-h-[400px] flex flex-col items-center justify-center border border-slate-100 shadow-sm dark:bg-[#0f172a]">
            <Headphones className="w-16 h-16 text-[#5B5EE5] mb-6 opacity-80" />
            <h2 className="text-3xl font-black text-slate-800 mb-4 dark:text-white">تواصل معنا</h2>
            <p className="text-slate-500 mb-8 max-w-md dark:text-slate-300">نحن هنا لمساعدتك والإجابة على جميع استفساراتك. لا تتردد في الاتصال بنا.</p>
            <div className="flex justify-center gap-4">
              <a href={\`https://wa.me/\${storeData?.whatsapp?.replace('+', '')}\`} target="_blank" className="bg-[#25D366] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition"><MessageSquare className="w-5 h-5"/> واتساب</a>
              <a href={\`mailto:\${storeData?.email || 'support@suriix.com'}\`} className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition dark:text-white dark:bg-[#0f172a]">البريد الإلكتروني</a>
            </div>
          </section>
        )}

        {activePage === 'login' && (
          <section className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 dark:bg-[#0f172a]">`
  );

  // Fix the google auth replacement error
  content = content.replace(
/<div className="pt-2 border-t border-slate-100 flex flex-col items-center">[\s\S]*?<p className="text-center text-sm text-slate-500 dark:text-slate-300">/g,
`<div className="pt-4 flex flex-col items-center">
                 <p className="text-center text-sm text-slate-500 dark:text-slate-300">`
  );

  // Write back as generic UTF-8 this should fix the charset error parsing
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully fixed PublicStore.tsx syntax and encoding!");
} catch (error) {
  console.error("Error patching file:", error);
}
