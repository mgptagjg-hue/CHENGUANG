param(
  [Parameter(Mandatory = $true)]
  [string]$SSHUser,

  [Parameter(Mandatory = $true)]
  [string]$SSHKey,

  [string]$ServerIP = '8.218.105.222',
  [int]$SSHPort = 22,
  [string]$PackagePath = 'chenguanggeo-deploy.tar.gz'
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$resolvedKey = (Resolve-Path -LiteralPath $SSHKey).Path
$archivePath = Join-Path $projectRoot $PackagePath
$serverScript = Join-Path $PSScriptRoot 'server-update.sh'

Push-Location $projectRoot
try {
  npm run check

  $siteFiles = @(
    '.nojekyll',
    '404.html',
    'about.html',
    'brand-facts.html',
    'brand-facts.json',
    'cases.html',
    'index.html',
    'knowledge.html',
    'llms.txt',
    'manifest.webmanifest',
    'method.html',
    'methodology.html',
    'privacy.html',
    'robots.txt',
    'services.html',
    'sitemap.xml',
    'terms.html',
    'assets'
  )

  tar.exe -czf $archivePath @siteFiles
  if ($LASTEXITCODE -ne 0) { throw 'Failed to create deployment archive.' }

  tar.exe -tf $archivePath | Select-String -Pattern '(^|/)(\.git|node_modules|playwright-report|test-results)(/|$)|\.xlsx$' | ForEach-Object {
    throw "Forbidden content found in deployment archive: $($_.Line)"
  }

  scp.exe -P $SSHPort -i $resolvedKey $archivePath "${SSHUser}@${ServerIP}:/tmp/chenguanggeo-deploy.tar.gz"
  if ($LASTEXITCODE -ne 0) { throw 'Failed to upload deployment archive.' }

  scp.exe -P $SSHPort -i $resolvedKey $serverScript "${SSHUser}@${ServerIP}:/tmp/server-update.sh"
  if ($LASTEXITCODE -ne 0) { throw 'Failed to upload server update script.' }

  ssh.exe -p $SSHPort -i $resolvedKey "${SSHUser}@${ServerIP}" 'bash /tmp/server-update.sh /tmp/chenguanggeo-deploy.tar.gz'
  if ($LASTEXITCODE -ne 0) { throw 'Server update failed. Follow DEPLOY-SERVER.md to roll back.' }
}
finally {
  Pop-Location
}
