param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]] $PlaywrightArgs
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Node = Join-Path $Root ".tools\node\node.exe"
$Vite = Join-Path $Root "node_modules\vite\bin\vite.js"
$Playwright = Join-Path $Root "node_modules\@playwright\test\cli.js"
$Port = 4173
$Url = "http://127.0.0.1:$Port"
$Server = $null
$StartedServer = $false

function Test-PreviewServer {
  try {
    Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 | Out-Null
    return $true
  } catch {
    return $false
  }
}

if (-not (Test-PreviewServer)) {
  $Server = Start-Process `
    -FilePath $Node `
    -ArgumentList @($Vite, "preview", "--host", "127.0.0.1", "--port", "$Port") `
    -WorkingDirectory $Root `
    -WindowStyle Hidden `
    -PassThru
  $StartedServer = $true

  $Ready = $false
  foreach ($Attempt in 1..40) {
    if (Test-PreviewServer) {
      $Ready = $true
      break
    }

    Start-Sleep -Milliseconds 500
  }

  if (-not $Ready) {
    throw "Vite preview did not become ready at $Url."
  }
}

try {
  & $Node $Playwright test @PlaywrightArgs
  $ExitCode = $LASTEXITCODE
} finally {
  if ($StartedServer -and $Server -and -not $Server.HasExited) {
    Stop-Process -Id $Server.Id -Force
  }
}

exit $ExitCode
