// 构建脚本：data/site.yaml + src/template.html + assets/*  →  dist/
// 数据不写进 HTML：生成独立的 assets/data.json，页面运行时 fetch 加载。
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const data = load(readFileSync(join(root, 'data', 'site.yaml'), 'utf8'));
const json = JSON.stringify(data, null, 2);

const dist = join(root, 'dist');
mkdirSync(join(dist, 'assets'), { recursive: true });

// 1) 模板 → dist/index.html（数据不注入）
copyFileSync(join(root, 'src', 'template.html'), join(dist, 'index.html'));
// 2) 静态资源 → dist/assets
['style.css', 'main.js'].forEach(function (f) {
  copyFileSync(join(root, 'assets', f), join(dist, 'assets', f));
});
// 3) 数据 → dist/assets/data.json 与 根 assets/data.json（根 index.html 直接可用）
writeFileSync(join(dist, 'assets', 'data.json'), json, 'utf8');
writeFileSync(join(root, 'assets', 'data.json'), json, 'utf8');

console.log('[build] 完成 → dist/  + assets/data.json');
