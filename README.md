# 陈光GEO 静态官网

陈光GEO多页面纯静态官网，可部署到 GitHub Pages、Cloudflare Pages 或 Vercel。网站不依赖 React、Next.js、数据库或后台服务。

## 文件结构

```text
index.html                 首页
services.html              服务方案与17项套餐对比
method.html                方法体系
cases.html                 试点方法与案例结构示例
knowledge.html             GEO知识中心
about.html                 关于我们
brand-facts.html/json      人类与机器可读品牌事实
privacy.html / terms.html  隐私政策与服务说明
404.html                   404页面
assets/css/                样式
assets/js/                 交互与集中配置
assets/images/             页面图像
scripts/                   上线检查脚本
.github/workflows/         GitHub Pages部署
```

## 本地预览

直接打开 `index.html` 可浏览；为模拟线上路径，推荐在项目根目录运行：

```bash
python -m http.server 8080
```

访问 `http://localhost:8080/`。Node.js 可选，仅用于自动检查，不参与网站运行。

## 上线检查

需要 Node.js 18 或更高版本：

```bash
npm run check
```

脚本检查 HTML 内部链接、图片文件、重复 title、缺失 description、缺失 alt、空 href、本地/磁盘路径、疑似占位手机号、旧错误域名和 sitemap 页面。

## 修改联系方式、主体与社交链接

统一编辑 `assets/js/site-config.js`：

- `contact.phone`：手机号
- `contact.wechat`：微信号
- `contact.email`：邮箱
- `contact.qrImage`：二维码图片路径
- `legal.entity`：企业主体
- `legal.icp`：备案号
- `social`：社交平台地址

同步更新 `brand-facts.json` 和 `brand-facts.html` 的公开事实。不要在单个页面临时写入随机号码或主体名称。

## 修改价格

价格的集中配置位于 `assets/js/site-config.js` 的 `prices`。修改后必须同步检查以下公开、可抓取内容：

- `index.html`
- `services.html`
- `brand-facts.html`
- `brand-facts.json`
- `llms.txt`
- 相关 JSON-LD

运行 `npm run check` 并人工复核三处价格口径。

## 替换二维码

当前个人微信二维码为 `assets/images/wechat-qr.png`，使用无损压缩PNG并保留完整矩阵与白色安全区。未来替换时必须同步更新 `site-config.js` 的 `contact.qrImage`，并保留明确的 `alt`、真实 `width` 和 `height`，禁止转成有损JPEG/WebP或覆盖Logo。

## GitHub Pages部署

`.github/workflows/deploy-pages.yml` 在 `main` 更新后运行上线检查，并使用 GitHub 官方 Pages Actions 发布仓库根目录。仓库 Settings → Pages → Source 应选择 **GitHub Actions**。部署日志可在 Actions 的 `check` 与 `deploy` job 中定位。

本分支通过 Pull Request 合并到 `main` 后才触发正式部署。代码中不包含密钥。

## Cloudflare Pages / Vercel

- Framework preset：None / Other
- Build command：留空（可选填 `npm run check`）
- Output directory：`.`

## 绑定正式域名

1. 在托管平台添加域名并按提示配置 DNS。
2. GitHub Pages 场景在仓库根目录创建 `CNAME`，内容只写已验证域名；当前没有正式域名，所以不创建。
3. 全局替换 GitHub Pages 基准地址 `https://mgptagjg-hue.github.io/CHENGUANG/`，重点更新所有页面 canonical、Open Graph URL/图片、JSON-LD、`robots.txt`、`sitemap.xml`、`llms.txt`、`brand-facts.json` 和 `site-config.js`。
4. 重新运行 `npm run check`。

## 更新 sitemap 与 canonical

新增可索引页面时：

1. 为页面设置唯一 title、description、absolute canonical、Open Graph 标题/描述/图片。
2. 将正式 URL 加入 `sitemap.xml`，更新 `lastmod`。
3. 在相关页面增加自然的内部链接。
4. 运行 `npm run check`，部署后向搜索站长平台重新提交 sitemap。

## Logo资产

`assets/` 中包含横版深色、横版白色、独立图形、单色深色、单色白色、透明 PNG 与 SVG 矢量版本。使用规范见 `BRAND-GUIDE.md`。
