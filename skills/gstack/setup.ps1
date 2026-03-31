# gstack setup — build browser binary + register all skills with Claude Code
# Run in PowerShell (Admin recommended for symlinks)
$ErrorActionPreference = "Stop"

$GstackDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SkillsDir = Split-Path -Parent $GstackDir
$BrowseBin = Join-Path $GstackDir "browse\dist\browse.exe"

function Test-PlaywrightBrowser {
    # Check if Playwright's Chromium directory exists
    $PwDir = Join-Path $env:LOCALAPPDATA "ms-playwright"
    if (-not (Test-Path $PwDir)) { return $false }
    $ChromiumDirs = Get-ChildItem -Path $PwDir -Directory -Filter "chromium-*" -ErrorAction SilentlyContinue
    return $ChromiumDirs.Count -gt 0
}

# 1. Build browse binary if needed (smart rebuild: stale sources, package.json, lock)
$NeedsBuild = $false
if (-not (Test-Path $BrowseBin)) {
    $NeedsBuild = $true
} else {
    $BinTime = (Get-Item $BrowseBin).LastWriteTime
    # Check if any source file is newer than the binary
    $NewerSrc = Get-ChildItem -Path (Join-Path $GstackDir "browse\src") -File -Recurse |
        Where-Object { $_.LastWriteTime -gt $BinTime } | Select-Object -First 1
    if ($NewerSrc) { $NeedsBuild = $true }
    # Check package.json
    $PkgJson = Join-Path $GstackDir "package.json"
    if ((Get-Item $PkgJson).LastWriteTime -gt $BinTime) { $NeedsBuild = $true }
    # Check bun.lock
    $BunLock = Join-Path $GstackDir "bun.lock"
    if ((Test-Path $BunLock) -and (Get-Item $BunLock).LastWriteTime -gt $BinTime) { $NeedsBuild = $true }
}

if ($NeedsBuild) {
    Write-Host "Building browse binary..."
    Push-Location $GstackDir
    bun install
    bun run build
    Pop-Location
}

if (-not (Test-Path $BrowseBin)) {
    Write-Error "gstack setup failed: browse binary missing at $BrowseBin"
    exit 1
}

# 2. Ensure Playwright's Chromium is available
if (-not (Test-PlaywrightBrowser)) {
    Write-Host "Installing Playwright Chromium..."
    Push-Location $GstackDir
    bunx playwright install chromium
    Pop-Location
}

if (-not (Test-PlaywrightBrowser)) {
    Write-Error "gstack setup failed: Playwright Chromium could not be launched"
    exit 1
}

# 3. Only create skill symlinks if we're inside a .claude/skills directory
$SkillsBasename = Split-Path -Leaf $SkillsDir
if ($SkillsBasename -eq "skills") {
    $Linked = @()
    Get-ChildItem -Path $GstackDir -Directory | ForEach-Object {
        $SkillDir = $_.FullName
        $SkillMd = Join-Path $SkillDir "SKILL.md"
        if (Test-Path $SkillMd) {
            $SkillName = $_.Name
            if ($SkillName -eq "node_modules") { return }
            $Target = Join-Path $SkillsDir $SkillName
            # Create or update symlink; skip if a real (non-symlink) file/directory exists
            $IsSymlink = (Test-Path $Target) -and ((Get-Item $Target).Attributes -band [IO.FileAttributes]::ReparsePoint)
            if ($IsSymlink -or -not (Test-Path $Target)) {
                if ($IsSymlink) { Remove-Item $Target -Force }
                $LinkTarget = Join-Path $GstackDir $SkillName
                New-Item -ItemType Junction -Path $Target -Target $LinkTarget | Out-Null
                $Linked += $SkillName
            }
        }
    }

    Write-Host "gstack ready."
    Write-Host "  browse: $BrowseBin"
    if ($Linked.Count -gt 0) {
        Write-Host "  linked skills: $($Linked -join ', ')"
    }
} else {
    Write-Host "gstack ready."
    Write-Host "  browse: $BrowseBin"
    Write-Host "  (skipped skill symlinks -- not inside .claude/skills/)"
}
