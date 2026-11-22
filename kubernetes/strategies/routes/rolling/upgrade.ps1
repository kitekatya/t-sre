
param(
    [ValidateSet('v1', 'v2')]
    [string]$Version = 'v2'
)

$ErrorActionPreference = 'Stop'
$deployment = 'backend-v1'

$patch = @{
    spec = @{
        template = @{
            metadata = @{
                labels = @{ version = $Version }
            }
            spec = @{
                containers = @(
                    @{
                        name = 'backend'
                        image = "task-tracker-backend:$Version"
                        env = @(
                            @{
                                name = 'APP_VERSION'
                                value = $Version
                            }
                        )
                    }
                )
            }
        }
    }
} | ConvertTo-Json -Depth 10 -Compress

$tempFile = New-TemporaryFile

try {
    [System.IO.File]::WriteAllText(
        $tempFile.FullName,
        $patch,
        [System.Text.UTF8Encoding]::new($false)
    )

    kubectl patch deployment $deployment --type=strategic --patch-file $tempFile.FullName

    if ($LASTEXITCODE -ne 0) {
        throw "Cannot patch deployment/$deployment"
    }

    kubectl rollout status deployment/$deployment

    if ($LASTEXITCODE -ne 0) {
        throw 'Rolling update failed'
    }
}
finally {
    Remove-Item $tempFile.FullName -Force -ErrorAction SilentlyContinue
}
