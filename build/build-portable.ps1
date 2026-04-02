# Fish Tank Development Workflow
# ================================
#
# DEVELOPMENT WORKFLOW:
# 1. Edit the source files (index.html, styles.css, background.js, idle-fish.js)
# 2. Test changes using index.html in browser
# 3. When ready to share/deploy: Run build-portable.bat or build-portable.ps1
# 4. Share the generated index-portable.html file
#
# The portable version is a "compiled" snapshot - regenerate it whenever
# you want to create a new distributable version with your latest changes.

# Quick build script (PowerShell alternative to batch file)
param(
    [string]$OutputFile = "..\dist\index-portable.html"
)

Write-Host "Building portable fish tank..." -ForegroundColor Green

# Check source files exist
$sourceFiles = @("..\src\index.html", "..\src\styles.css", "..\src\background.js", "..\src\idle-fish.js")
foreach ($file in $sourceFiles) {
    if (!(Test-Path $file)) {
        Write-Host "ERROR: $file not found!" -ForegroundColor Red
        exit 1
    }
}

# Read source files
Write-Host "Reading source files..."
$htmlContent = Get-Content "..\src\index.html" -Raw
$cssContent = Get-Content "..\src\styles.css" -Raw
$bgJsContent = Get-Content "..\src\background.js" -Raw
$fishJsContent = Get-Content "..\src\idle-fish.js" -Raw

# Extract body content from HTML (everything between <main> tags)
$mainContent = [regex]::Match($htmlContent, '<main.*?</main>', [System.Text.RegularExpressions.RegexOptions]::Singleline).Value

# Build the portable HTML
$portableHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Idle Fish Tank</title>
  <style>
$cssContent
  </style>
</head>
<body>
$mainContent

  <script>
// background.js content
$bgJsContent
  </script>

  <script>
// idle-fish.js content
$fishJsContent
  </script>

</body>
</html>
"@

# Write to output file
$portableHtml | Out-File -FilePath $OutputFile -Encoding UTF8

# Show results
$fileSize = (Get-Item $OutputFile).Length / 1KB
Write-Host "SUCCESS: Portable fish tank created as $OutputFile" -ForegroundColor Green
Write-Host "File size: $([math]::Round($fileSize, 2)) KB" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now share $OutputFile - it works from any device!" -ForegroundColor Yellow