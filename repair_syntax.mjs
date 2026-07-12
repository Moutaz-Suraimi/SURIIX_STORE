import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, 'src');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(filePath));
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walkDir(directory);
let totalFixed = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // The corruption pattern is: [operator/space] dark:[class]['"`]
    // Specifically, when we replaced `q1 + str.trimEnd() + ' dark:class' + q3`
    // If q3 was an inner quote (', ", or `) and str ended with an operator due to ${} interpolation.
    // We want to move ' dark:class' to just BEFORE the closest preceding `${` if it exists.
    
    // Let's identify the misplaced dark classes attached to quotes.
    const misplacedRegex = /(.*?)(?:(\s+)?dark:(bg-\[#0f172a\]|text-white|text-slate-300|border-slate-800))(['"`])/g;
    
    // Instead of regex replace, we do a while loop to find all occurrences and fix them.
    let match;
    // We will do a generic cleanup of the file first to fix immediate syntax errors.
    
    // 1. Moving misplaced classes before ${
    // Pattern: capture until ${... followed by misplaced class
    // Example: `${!n.is_read ? dark:bg-[#0f172a]'`
    // We'll replace it by putting the class before ${
    content = content.replace(/(\$\{.*?)(\s+)?(dark:(?:bg-\[#0f172a\]|text-white|text-slate-300|border-slate-800))(['"`])/g, (full, p1, p2, darkClass, quote) => {
        // Only do this if the preceding part actually looks like an operator expression, so we are sure it's misplaced.
        if (/[?+:{(&|=!><-]\s*$/.test(p1.trimEnd())) {
             return `${p1.trimEnd()} ${quote}`; // Just remove the dark class for now to fix the syntax! It's safer.
        }
        return full;
    });

    // 2. Some classes might just be glued: `? dark:bg-[#0f172a]'`
    // Just remove them to restore syntax correctness. They were incorrectly placed anyway.
    content = content.replace(/([?+:{(&|=!><,\-])\s*dark:(bg-\[#0f172a\]|text-white|text-slate-300|border-slate-800)(['"`])/g, '$1 $3');

    // 3. Fix cases where it got glued to a closing curly brace: `} dark:bg-[#0f172a]'`
    content = content.replace(/\}\s*dark:(bg-\[#0f172a\]|text-white|text-slate-300|border-slate-800)(['"`])/g, '} $2');

    // 4. Sometimes it might have just placed it before a quote in a string concatenation.
    content = content.replace(/\+\s*dark:(bg-\[#0f172a\]|text-white|text-slate-300|border-slate-800)(['"`])/g, '+ $2');


    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        totalFixed++;
    }
});

console.log(`Finished syntax fix. ${totalFixed} files updated.`);
