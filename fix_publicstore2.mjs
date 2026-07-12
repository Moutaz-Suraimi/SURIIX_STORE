import fs from 'fs';

const filePath = 'c:/Users/ASUS/Desktop/SURIIX_STORE/src/pages/PublicStore.tsx';

// Read with latin1 to preserve all bytes without mangling
let content = fs.readFileSync(filePath, 'latin1');

// The corrupted block starts around line 1729.
// The bad line looks like:
//   <a href={...} target="_blank" cl                <div className="pt-4 flex flex-col items-center">
//   <p className="text-center text-sm text-slate-500 dark:text-slate-300">sName="bg-white ...">
// We need to rebuild the entire corrupt section.

// Find bounds of corruption
const corruptStart = content.indexOf('<a href={`https://wa.me/${storeData.whatsapp.replace');

// Actually let's search for the exact corrupted substring
const badString = `target="_blank" cl                <div className="pt-4 flex flex-col items-center">\n                 <p className="text-center text-sm text-slate-500 dark:text-slate-300">sName="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 dark:bg-[#0f172a]">`;

const idx = content.indexOf('target="_blank" cl                <div');
if (idx === -1) {
  console.log('Corruption marker not found - file may already be fixed or has different encoding');
  // Try to just re-encode as proper UTF-8
  fs.writeFileSync(filePath, content, { encoding: 'latin1' });
  console.log('Re-saved as latin1 (unchanged)');
  process.exit(0);
}

console.log('Found corruption at index:', idx);

// Find the start of the bad <a> tag line  
const aTagStart = content.lastIndexOf('\n', idx) + 1;
// Find the end of the bad section - look for </div>\n          </section>
const sectionEnd = content.indexOf('</div>\n            </div>\n          </section>\n        )}', idx);
const afterBadSection = sectionEnd + '</div>\n            </div>\n          </section>\n        )}'.length;

console.log('aTagStart:', aTagStart, 'afterBadSection:', afterBadSection);

// The good replacement for this whole section
const goodSection = `              {storeData?.whatsapp && (
                <a href={\`https://wa.me/\${storeData.whatsapp.replace('+','')}?text=\${encodeURIComponent('\u0645\u0631\u062d\u0628\u0627\u064b\u060c \u0623\u0631\u064a\u062f \u0627\u0644\u0627\u0633\u062a\u0641\u0633\u0627\u0631 \u0639\u0646 \u062d\u0627\u0644\u0629 \u0637\u0644\u0628\u064a.')}\`} target="_blank" className="mt-6 bg-[#25D366] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition">
                  <MessageSquare className="w-5 h-5" /> \u0627\u0633\u062a\u0641\u0633\u0631 \u0639\u0646 \u0637\u0644\u0628\u0643 \u0639\u0628\u0631 \u0648\u0627\u062a\u0633\u0627\u0628
                </a>
              )}
            </div>
          </section>
        )}

        {activePage === 'contact' && (
          <section className="bg-white rounded-3xl p-12 text-center min-h-[400px] flex flex-col items-center justify-center border border-slate-100 shadow-sm dark:bg-[#0f172a]">
            <Headphones className="w-16 h-16 text-[#5B5EE5] mb-6 opacity-80" />
            <h2 className="text-3xl font-black text-slate-800 mb-4 dark:text-white">\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627</h2>
            <p className="text-slate-500 mb-8 max-w-md dark:text-slate-300">\u0646\u062d\u0646 \u0647\u0646\u0627 \u0644\u0645\u0633\u0627\u0639\u062f\u062a\u0643 \u0648\u0627\u0644\u0625\u062c\u0627\u0628\u0629 \u0639\u0644\u0649 \u062c\u0645\u064a\u0639 \u0627\u0633\u062a\u0641\u0633\u0627\u0631\u0627\u062a\u0643. \u0644\u0627 \u062a\u062a\u0631\u062f\u062f \u0641\u064a \u0627\u0644\u0627\u062a\u0635\u0627\u0644 \u0628\u0646\u0627.</p>
            <div className="flex justify-center gap-4">
              <a href={\`https://wa.me/\${storeData?.whatsapp?.replace('+','')}\`} target="_blank" className="bg-[#25D366] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition"><MessageSquare className="w-5 h-5"/> \u0648\u0627\u062a\u0633\u0627\u0628</a>
              <a href={\`mailto:\${storeData?.email || 'support@suriix.com'}\`} className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition dark:text-white dark:bg-[#0f172a]">\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a</a>
            </div>
          </section>
        )}

        {activePage === 'login' && (
          <section className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 dark:bg-[#0f172a]">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[#5B5EE5]/10 text-[#5B5EE5] rounded-2xl flex items-center justify-center">
                  <LogIn className="w-8 h-8" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-800 text-center mb-2 dark:text-white">{authMode === 'login' ? '\u062a\u0633\u062c\u064a\u0644 \u062f\u062e\u0648\u0644 \u0627\u0644\u0639\u0645\u0644\u0627\u0621' : '\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628 \u0639\u0645\u064a\u0644'}</h2>
              <p className="text-slate-500 text-center text-sm mb-8 dark:text-slate-300">{authMode === 'login' ? '\u0623\u062f\u062e\u0644 \u0628\u064a\u0627\u0646\u0627\u062a\u0643 \u0644\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u062d\u0633\u0627\u0628\u0643 \u0641\u064a \u0627\u0644\u0645\u062a\u062c\u0631' : '\u0633\u062c\u0651\u0644 \u062d\u0633\u0627\u0628\u0643 \u0643\u0639\u0645\u064a\u0644 \u0648\u0627\u0633\u062a\u0645\u062a\u0639 \u0628\u062a\u062c\u0631\u0628\u0629 \u062a\u0633\u0648\u0642 \u0641\u0631\u064a\u062f\u0629'}</p>
              <div className="space-y-4">
                {authMode === 'register' && <input type="text" placeholder="\u0627\u0633\u0645\u0643 \u0627\u0644\u0643\u0627\u0645\u0644" value={authForm.name} onChange={e => setAuthForm(f => ({...f, name: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5B5EE5] transition dark:bg-[#0f172a] dark:border-slate-800" />}
                <input type="email" placeholder="\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a" value={authForm.email} onChange={e => setAuthForm(f => ({...f, email: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5B5EE5] transition dark:bg-[#0f172a] dark:border-slate-800" />
                {authMode === 'register' && <input type="tel" placeholder="\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641" value={authForm.phone} onChange={e => setAuthForm(f => ({...f, phone: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5B5EE5] transition dark:bg-[#0f172a] dark:border-slate-800" />}
                <PasswordField value={authForm.password} onChange={e => setAuthForm(f => ({...f, password: e.target.value}))} />
                {authError && <p className="text-rose-500 text-sm font-bold bg-rose-50 p-3 rounded-xl">{authError}</p>}
                <button onClick={authMode === 'login' ? handleLogin : handleRegister} className="w-full bg-[#5B5EE5] text-white py-4 rounded-xl font-black text-lg hover:bg-[#4a4ec4] transition shadow-lg shadow-[#5B5EE5]/30">
                  {authMode === 'login' ? '\u062f\u062e\u0648\u0644' : '\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628'}
                </button>
                <div className="pt-4 flex flex-col items-center">
                 <p className="text-center text-sm text-slate-500 dark:text-slate-300">
                  {authMode === 'login' ? '\u0644\u064a\u0633 \u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628\u061f ' : '\u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628 \u0628\u0627\u0644\u0641\u0639\u0644\u061f '}
                  <button onClick={() => { setAuthMode(m => m === 'login' ? 'register' : 'login'); setAuthError(''); }} className="text-[#5B5EE5] font-bold hover:underline">
                    {authMode === 'login' ? '\u0633\u062c\u0651\u0644 \u062d\u0633\u0627\u0628\u0643' : '\u0633\u062c\u0651\u0644 \u0627\u0644\u062f\u062e\u0648\u0644'}
                  </button>
                 </p>
                </div>
              </div>
            </div>
          </section>`;

// Replace from the bad a tag (aTagStart) to afterBadSection
content = content.substring(0, aTagStart) + goodSection + content.substring(afterBadSection);

// Write back as UTF-8 explicitly
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully fixed PublicStore.tsx!');
console.log('New file size:', fs.statSync(filePath).size, 'bytes');
