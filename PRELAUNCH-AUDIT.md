# 陈光GEO 静态官网上线前审计

审计日期：2026-07-23  
审计分支：`codex/prelaunch-audit`  
目标仓库：`mgptagjg-hue/CHENGUANG`

## 已完成项目

- 保留既有深蓝科技视觉、内容方向、原创“晨光光轮”Logo与三档正式价格。
- 补齐首页、服务方案、方法体系、案例方法、知识中心、关于、品牌事实、隐私政策、服务说明和404页面。
- 将套餐统一为：基础启动包1288元；基础持续服务首月1688元、首月基础建设完成后续费888元/月；进阶年度方案28888元/年。
- 建立17项同序套餐对比矩阵，以 `✓`、`×` 和“一次 / 按月 / 每季度 / 持续维护 / 按实际审核结果执行”区分权益。
- 明确一次性交付、持续维护、年度第三方权威来源建设三类定位与服务边界。
- 删除无接收能力的假表单；联系方式缺失时只显示“待配置”，不展示随机手机号或二维码。
- 新增 `assets/js/site-config.js`，集中管理域名、品牌、联系方式、主体、备案、价格和社交平台状态。
- 补齐Logo深色横版、白色横版、独立图形、单色深色、单色白色、透明PNG和SVG版本。
- 为可索引页面配置独立 title、description、canonical、Open Graph标题/描述/图片。
- 完善 Organization、WebSite、Service、OfferCatalog、FAQPage、BreadcrumbList；未使用无真实地址依据的 LocalBusiness。
- 完善 `robots.txt`、`sitemap.xml`、`llms.txt`、`brand-facts.json`、`manifest.webmanifest`、favicon和 `.nojekyll`。
- 使用相对静态资源路径，兼容本地预览、GitHub Pages项目路径与未来独立域名。
- 添加 GitHub Pages官方Actions工作流，`main`更新时先检查再部署仓库根目录。
- 添加 Node.js 上线检查脚本与完整README运维说明。
- 支持移动菜单、键盘FAQ、清晰focus状态与 `prefers-reduced-motion`。

## 仍待用户提供的信息

- 正式域名。
- 正式手机号、微信号、邮箱与二维码图片。
- 合法企业主体名称与备案号（如适用）。
- 经确认的社交平台官方主页。
- 如需展示真实案例：客户书面授权、可核验事实、来源URL与允许公开的数据范围。

以上信息当前集中标记为“待配置”，未编造替代内容。

## 发现并修复的问题

- 原目录不是Git仓库：已初始化并创建 `codex/prelaunch-audit` 分支。
- 缺少 `services.html`、`method.html`、`cases.html`：已补齐，并保留 `methodology.html` 兼容跳转。
- 旧页面存在未确认正式域名 `chenguanggeo.cn`：已统一为当前可验证的GitHub Pages项目基准地址。
- 套餐说明散落且比较顺序不统一：已改为17项同序矩阵。
- 基础持续服务旧名称/续费解释不够统一：已统一名称，并明确888元/月是在首月基础建设完成后的续费。
- 旧咨询区是只复制文本的模拟表单：已移除，避免让用户误以为数据会被接收。
- 多个子页缺少完整Open Graph、canonical或结构化数据：已补齐。
- 缺少隐私政策、服务说明和用户提交提示：已新增。
- 缺少单色Logo与Open Graph图：已基于现有原创Logo补齐矢量资产。
- 资源目录扁平：已整理为 `assets/css/`、`assets/js/`、`assets/images/`，Logo保留在 `assets/` 根层。
- 404页元数据与品牌表现不足：已统一品牌视觉和有效返回链接。

## 尚未解决的问题

- 正式域名和联系方式尚未提供，因此当前不能完成真实咨询链路，也未创建 `CNAME`。
- GitHub仓库Pages设置需要仓库管理员确认 Source 为“GitHub Actions”。
- Lighthouse CLI/浏览器插件在本地环境未安装，因此没有伪造分数；已执行下述等价自动化与人工审计。
- 第三方平台、媒体、地图和经销商页的实际发布结果只能在客户提供真实资质后按平台审核推进。

## 部署方式

### GitHub Pages

合并Pull Request到 `main` 后，`.github/workflows/deploy-pages.yml` 自动运行：

1. checkout代码；
2. Node 20运行 `npm run check`；
3. 上传仓库根目录静态文件；
4. 使用官方 `actions/deploy-pages` 发布。

无需构建命令，不使用密钥。部署失败可分别查看 `check` 与 `deploy` job 日志。

### Cloudflare Pages / Vercel

框架选择 None / Other，构建命令留空或使用 `npm run check`，输出目录为 `.`。

## 正式上线前最后操作

1. 在 `assets/js/site-config.js` 填入正式联系方式、主体与社交链接。
2. 同步更新 `brand-facts.html`、`brand-facts.json` 和 `llms.txt`。
3. 若有正式域名，更新全部canonical、Open Graph URL、JSON-LD、robots、sitemap与配置文件；验证后再添加 `CNAME`。
4. 替换正式二维码并补充尺寸、alt与压缩版本。
5. 运行 `npm run check`，人工复核首页和服务页价格。
6. 在GitHub Pages设置中选择GitHub Actions，合并PR后检查首次部署日志与线上404。
7. 上线地址确定后运行正式Lighthouse，目标 Performance/Accessibility/Best Practices ≥90，SEO ≥95；未达标则不要对外宣布上线完成。

## 测试结果

### 自动上线检查

命令：`npm run check`  
结果：通过。检查11个HTML页面，内部链接、图片存在性、重复title、meta description、alt、空href、本地路径、localhost/file协议、疑似占位手机号、旧错误域名与sitemap页面均通过。

### 浏览器渲染与交互QA

Browser插件不可用，按前端测试流程使用本地Chrome + Playwright回退验证。

- 首页视口：360、390、430、1366、1440、1920像素，全部无页面级横向溢出。
- 首页只有一个H1。
- 移动菜单可打开，Escape可关闭。
- FAQ可通过键盘Enter展开，`aria-expanded`同步更新。
- 套餐表完整显示17行；390像素下只在表格容器内横向滚动，页面本身不溢出。
- services、method、cases、knowledge、about、brand-facts、privacy、terms和404页面均正常渲染。
- 浏览器控制台无页面错误。
- 已生成首页桌面端、首页手机端与套餐对比区域三张截图。

### Lighthouse

本地未安装Lighthouse CLI，且当前会话没有Browser插件，故未输出或猜测Lighthouse分数。等价审计已覆盖：语义化结构、唯一H1、独立元数据、内部链接、图片尺寸与懒加载适用性、无外部字体CDN、defer脚本、无框架运行时、响应式视口、键盘交互、focus状态、reduced motion、控制台错误和静态资源可达性。
