# 香港服务器部署说明

正式站点地址：`https://8.218.105.222/`

服务器使用 Nginx 提供纯静态文件，站点目录为 `/var/www/chenguanggeo`。仓库不保存 SSH 私钥、密码、Token 或证书私钥。

## 部署变量

- `SSHUser`：服务器用户名，通过命令参数提供。
- `SSHPort`：SSH 端口，默认 `22`。
- `SSHKey`：本机 SSH 私钥完整路径，通过命令参数提供。
- `ServerIP`：默认 `8.218.105.222`。

示例：

```powershell
.\scripts\deploy-to-server.ps1 `
  -SSHUser '<SSH_USER>' `
  -SSHPort 22 `
  -SSHKey '<SSH_KEY_PATH>'
```

脚本先运行 `npm run check`，再使用显式文件白名单生成 `chenguanggeo-deploy.tar.gz`，上传至 `/tmp` 并调用 `scripts/server-update.sh`。压缩包不包含 `.git`、`node_modules`、Excel、测试截图或测试产物。

## 备份与更新

首次初始化前的服务器状态保存在 `/root/chenguang-backups/predeploy-*/`。每次更新前，现有站点会备份至：

```text
/root/chenguang-backups/site-YYYYMMDD-HHMMSS/
```

更新脚本先在临时目录解压并验证 `index.html`，再移动到正式目录，设置 `nginx:nginx` 所有权，并在 Nginx 已运行时执行配置测试和重载。

## Nginx 与证书

- 站点配置：`/etc/nginx/conf.d/chenguanggeo.conf`
- 静态文件：`/var/www/chenguanggeo`
- IP 证书：以 Certbot 实际返回的 `/etc/letsencrypt/live/.../` 路径为准。
- 自动续期：`chenguang-cert-renew.timer` 每日两次检查。

检查：

```bash
nginx -t
systemctl status nginx
systemctl status chenguang-cert-renew.timer
systemctl list-timers --all | grep chenguang
```

## 线上验证

```bash
curl -I http://8.218.105.222/
curl -I https://8.218.105.222/
curl -I https://8.218.105.222/services.html
curl -I https://8.218.105.222/assets/css/styles.css
curl -I https://8.218.105.222/assets/images/wechat-qr.png
curl -I https://8.218.105.222/robots.txt
curl -I https://8.218.105.222/sitemap.xml
curl -I https://8.218.105.222/llms.txt
curl -I https://8.218.105.222/不存在页面
```

证书检查：

```bash
echo | openssl s_client -connect 8.218.105.222:443 -servername 8.218.105.222 2>/dev/null | openssl x509 -noout -subject -issuer -dates
```

## 回滚

先找到需要恢复的备份目录，再执行以下命令；不要把通配符直接用于移动或删除：

```bash
backup=/root/chenguang-backups/site-YYYYMMDD-HHMMSS
test -f "$backup/site.tar.gz"
mv /var/www/chenguanggeo "/var/www/chenguanggeo.failed-$(date +%Y%m%d-%H%M%S)"
tar -xzf "$backup/site.tar.gz" -C /var/www
chown -R nginx:nginx /var/www/chenguanggeo
nginx -t && systemctl reload nginx
```

如需回滚 Nginx 配置，恢复对应的部署前备份后运行 `nginx -t`，确认通过再重载。
