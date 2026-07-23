import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const htmlFiles = (await readdir(root)).filter((name) => extname(name) === '.html');
const titles = new Map();
const exists = async (path) => { try { return (await stat(path)).isFile(); } catch { return false; } };
const report = (file, message) => errors.push(`${file}: ${message}`);

for (const file of htmlFiles) {
  const html = await readFile(join(root, file), 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  if (!title) report(file, '缺少 title');
  else if (titles.has(title)) report(file, `title 与 ${titles.get(title)} 重复`);
  else titles.set(title, file);
  if (!/<meta\s+name=["']description["'][^>]+content=["'][^"']+/i.test(html)) report(file, '缺少 meta description');
  if (/href=["']\s*["']/i.test(html)) report(file, '存在空 href');
  if (/javascript:void\s*\(0\)/i.test(html)) report(file, '存在 javascript:void(0)');
  if (/(?:localhost|file:\/\/\/|[CD]:\\|\/mnt\/data\/)/i.test(html)) report(file, '存在本地或磁盘路径');
  if (/chenguanggeo\.cn/i.test(html)) report(file, '存在未确认的旧正式域名');
  for (const phone of html.matchAll(/\b1[3-9]\d{9}\b/g)) {
    if (phone[0] !== '18006727611') report(file, `存在非官方或疑似占位手机号：${phone[0]}`);
  }
  for (const href of html.matchAll(/href=["']tel:([^"']+)["']/gi)) {
    if (href[1] !== '18006727611') report(file, `电话链接不正确：tel:${href[1]}`);
  }
  for (const href of html.matchAll(/href=["']mailto:([^"']+)["']/gi)) {
    if (href[1] !== '1062269723@qq.com') report(file, `邮箱链接不正确：mailto:${href[1]}`);
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(match[1])) report(file, `图片缺少 alt：${match[0].slice(0, 80)}`);
  }
  for (const match of html.matchAll(/(?:href|src)=["']([^"'#?]+)(?:[?#][^"']*)?["']/gi)) {
    const target = match[1];
    if (/^(?:https?:|mailto:|tel:|data:)/i.test(target)) continue;
    const local = normalize(join(root, dirname(file), target));
    if (!local.startsWith(root) || !(await exists(local))) report(file, `内部资源不存在：${target}`);
  }
}

const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
for (const match of sitemap.matchAll(/<loc>https:\/\/8\.218\.105\.222\/?([^<]*)<\/loc>/g)) {
  const path = match[1] || 'index.html';
  if (!(await exists(join(root, path)))) report('sitemap.xml', `页面不存在：${path}`);
}

if (!(await exists(join(root, 'assets/images/wechat-qr.png')))) report('assets/images/wechat-qr.png', '正式微信二维码不存在');

if (errors.length) {
  console.error(`上线检查失败（${errors.length}项）：\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`上线检查通过：${htmlFiles.length} 个HTML页面；内部链接、图片、title、description、alt、协议、域名和sitemap均通过。`);
