param(
  [int]$Count = 0,
  [int]$DelayMs = 200,
  [string]$Url = 'http://localhost:8888/version',
  [string]$Group = ''
)

if ($Count -lt 0) { throw 'Count must be >= 0 (0 means infinite).' }
if ($DelayMs -lt 0) { throw 'DelayMs must be >= 0.' }

$i = 0
Write-Host 'Generating traffic. Press Ctrl+C to stop. Count=0 means unlimited requests.'
while ($Count -eq 0 -or $i -lt $Count) {
  $i++
  try {
    $headers = @{}
    if ($Group -ne '') { $headers['x-user-group'] = $Group }
    $r = Invoke-RestMethod -Uri $Url -Headers $headers -TimeoutSec 5
    "$(Get-Date -Format 'HH:mm:ss.fff') | version=$($r.version) pod=$($r.pod)"
  } catch {
    "$(Get-Date -Format 'HH:mm:ss.fff') | ERROR: $($_.Exception.Message)"
  }
  if ($DelayMs -gt 0) { Start-Sleep -Milliseconds $DelayMs }
}
