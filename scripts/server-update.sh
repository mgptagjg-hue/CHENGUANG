#!/usr/bin/env bash
set -euo pipefail

package="${1:-/tmp/chenguanggeo-deploy.tar.gz}"
site_dir="/var/www/chenguanggeo"
timestamp="$(date +%Y%m%d-%H%M%S)"
backup_dir="/root/chenguang-backups/site-${timestamp}"
stage_dir="/var/www/chenguanggeo.new-${timestamp}"

if [[ ! -f "$package" ]]; then
  echo "部署包不存在：$package" >&2
  exit 1
fi

mkdir -p "$backup_dir" "$stage_dir"
trap 'if [[ -d "$stage_dir" ]]; then rm -rf -- "$stage_dir"; fi' EXIT

tar -xzf "$package" -C "$stage_dir"
test -f "$stage_dir/index.html"

if find "$stage_dir" -type f \( -name '*.xlsx' -o -name '*.xls' \) -print -quit | grep -q .; then
  echo '部署包含有 Excel 文件，已停止。' >&2
  exit 1
fi

if [[ -e "$site_dir" ]]; then
  tar -czf "$backup_dir/site.tar.gz" -C "$(dirname "$site_dir")" "$(basename "$site_dir")"
  mv "$site_dir" "$backup_dir/site"
fi

mv "$stage_dir" "$site_dir"
chown -R nginx:nginx "$site_dir"
find "$site_dir" -type d -exec chmod 755 {} \;
find "$site_dir" -type f -exec chmod 644 {} \;
trap - EXIT

if systemctl is-active --quiet nginx; then
  nginx -t
  systemctl reload nginx
fi

rm -f -- "$package" /tmp/server-update.sh
echo "部署完成；备份目录：$backup_dir"
