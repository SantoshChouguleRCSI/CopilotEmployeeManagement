$inputJson = [Console]::In.ReadToEnd()

try {
    $payload = $inputJson | ConvertFrom-Json
}
catch {
    @{
        hookSpecificOutput = @{
            hookEventName = "PreToolUse"
            permissionDecision = "deny"
            permissionDecisionReason = "Safety hook could not parse the tool request."
        }
    } | ConvertTo-Json -Depth 10

    exit 0
}

$toolInput = $payload.tool_input
$inputText = $toolInput | ConvertTo-Json -Depth 20 -Compress

$denyPatterns = @(
    'rm\s+-rf',
    'Remove-Item\s+.*-Recurse.*-Force',
    'DROP\s+DATABASE',
    'DROP\s+TABLE',
    'TRUNCATE\s+TABLE',
    'dotnet\s+ef\s+database\s+drop',
    'git\s+reset\s+--hard',
    'git\s+clean\s+-fd',
    'git\s+push\s+.*--force'
)

$askPatterns = @(
    'git\s+push',
    'dotnet\s+ef\s+migrations\s+add',
    'dotnet\s+ef\s+migrations\s+remove',
    'npm\s+install',
    'npm\s+uninstall',
    'dotnet\s+add\s+.*package',
    'dotnet\s+remove\s+.*package'
)

$allowPatterns = @(
    'dotnet\s+build',
    'dotnet\s+test',
    'dotnet\s+run',
    'git\s+status',
    'git\s+diff',
    'git\s+log',
    'npm\s+test',
    'npm\s+run\s+lint',
    'npm\s+run\s+dev'
)

foreach ($pattern in $denyPatterns) {
    if ($inputText -match $pattern) {
        @{
            hookSpecificOutput = @{
                hookEventName = "PreToolUse"
                permissionDecision = "deny"
                permissionDecisionReason = "Blocked by repository safety policy. The requested operation is destructive."
            }
        } | ConvertTo-Json -Depth 10
        exit 0
    }
}

foreach ($pattern in $askPatterns) {
    if ($inputText -match $pattern) {
        @{
            hookSpecificOutput = @{
                hookEventName = "PreToolUse"
                permissionDecision = "ask"
                permissionDecisionReason = "This operation is sensitive and requires user approval."
            }
        } | ConvertTo-Json -Depth 10
        exit 0
    }
}

foreach ($pattern in $allowPatterns) {
    if ($inputText -match $pattern) {
        @{
            hookSpecificOutput = @{
                hookEventName = "PreToolUse"
                permissionDecision = "allow"
                permissionDecisionReason = "Allowed by repository safety policy."
            }
        } | ConvertTo-Json -Depth 10
        exit 0
    }
}

# Unknown operations require confirmation.
@{
    hookSpecificOutput = @{
        hookEventName = "PreToolUse"
        permissionDecision = "ask"
        permissionDecisionReason = "This operation is not explicitly classified by the repository safety policy."
    }
} | ConvertTo-Json -Depth 10

exit 0