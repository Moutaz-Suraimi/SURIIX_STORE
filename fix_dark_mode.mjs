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
let totalChanged = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Fix dark text colors (400 to 900)
    content = content.replace(/(['"`])([^'"`]*(?:\btext-slate-[456789]00\b|\btext-gray-[456789]00\b|\btext-zinc-[456789]00\b|\btext-black\b)[^'"`]*)(['"`])/g, (match, q1, str, q3) => {
        if (!str.includes('dark:text-')) {
            // For mid-range grays (400-600), we map to a slightly softer white like slate-300
            if (str.match(/\btext-(slate|gray|zinc)-[456]00\b/)) {
                return q1 + str.trimEnd() + ' dark:text-slate-300' + q3;
            }
            // For dark grays (700-900) and black, we map to strong white
            return q1 + str.trimEnd() + ' dark:text-white' + q3;
        }
        return match;
    });

    // Fix light backgrounds
    content = content.replace(/(['"`])([^'"`]*(?:\bbg-white\b|\bbg-slate-50\b|\bbg-gray-50\b|\bbg-slate-100\b|\bbg-[#F4F7FB]\b)[^'"`]*)(['"`])/g, (match, q1, str, q3) => {
        if (!str.includes('dark:bg-')) {
            return q1 + str.trimEnd() + ' dark:bg-[#0f172a]' + q3;
        }
        return match;
    });

    // Fix light borders
    content = content.replace(/(['"`])([^'"`]*(?:\bborder-slate-[23]00\b|\bborder-gray-[23]00\b|\bborder-border\/40\b)[^'"`]*)(['"`])/g, (match, q1, str, q3) => {
        if (!str.includes('dark:border-')) {
            return q1 + str.trimEnd() + ' dark:border-slate-800' + q3;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        totalChanged++;
    }
});

console.log(`Finished processing. ${totalChanged} files updated.`);
