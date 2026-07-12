const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'archive_temp_files');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

const files = fs.readdirSync(__dirname);
let count = 0;
files.forEach(file => {
  if (['tailwind.config.ts', 'eslint.config.js', 'vite.config.ts', 'postcss.config.js', 'vitest.config.ts'].includes(file)) return;
  
  const ext = path.extname(file);
  const isTempJS = file.includes('tmp') || file.includes('test') || file.includes('update_') || file.includes('copy-');

  if (
    ext === '.cjs' || 
    ext === '.mjs' || 
    file.endsWith('.out') || 
    file.endsWith('.log') || 
    file.endsWith('.sql') || 
    (ext === '.js' && isTempJS) ||
    file === 'compile_errors.txt' || 
    file === 'git_pages.txt' || 
    file === 'pages_list.txt' ||
    file.startsWith('tmp_')
  ) {
    // Only move if it is not the current executing file itself
    if (file === 'cleanup_files.cjs' || file === 'cleanup_files.js') return;

    const oldPath = path.join(__dirname, file);
    const newPath = path.join(targetDir, file);
    try {
      fs.renameSync(oldPath, newPath);
      count++;
    } catch(e) {
      console.error('Failed to move:', file);
    }
  }
});
console.log(`✅ تم ترتيب ونقل ${count} ملف إلى المجلد: archive_temp_files بنجاح.`);
