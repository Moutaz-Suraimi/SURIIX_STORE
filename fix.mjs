import fs from 'fs';
let code = fs.readFileSync('src/pages/CreateStore.tsx', 'utf8');
const lines = code.split(/\r?\n/);
const startIdx = lines.findIndex(l => l.includes('<Lock className="w-5 h-5 text-purple-600 absolute right-3.5 top-3.5" />'));
if (startIdx !== -1) {
  lines.splice(startIdx, 8, 
    '                  <Lock className="w-5 h-5 text-purple-600 absolute right-3.5 top-3.5" />',
    '                  {authMode === "register" && (',
    '                    <button type="button" onClick={handleGeneratePassword} title="اقتراح كلمة مرور قوية" className="absolute right-11 top-3.5 text-[#5B5EE5] hover:text-[#4a4ec4] transition-colors" tabIndex={-1}>',
    '                      <Wand2 className="w-5 h-5" />',
    '                    </button>',
    '                  )}',
    '                  <button type="button" onClick={() => setShowCreatePassword(v => !v)} className="absolute left-3.5 top-3.5 text-purple-400 hover:text-purple-700 dark:hover:text-white transition-colors" tabIndex={-1}>',
    '                    {showCreatePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}',
    '                  </button>'
  );
  fs.writeFileSync('src/pages/CreateStore.tsx', lines.join('\n'));
  console.log('Successfully fixed file');
} else {
  console.log('Failed to find Lock icon line');
}
