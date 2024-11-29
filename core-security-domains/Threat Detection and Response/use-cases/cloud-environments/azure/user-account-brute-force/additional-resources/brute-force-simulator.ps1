Get-Date

$TenantId = "<microsoft-entra-tenant-id>"

# Define credentials
$username = "<azure-account-username>"
$wrongPassword = "wrong-pwd" | ConvertTo-SecureString -AsPlainText -Force
$correctPassword = "<correct-password>" | ConvertTo-SecureString -AsPlainText -Force
$wrongCredential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $username, $wrongPassword
$correctCredential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $username, $correctPassword

"Performing 20 consecutive failed sign-in providing wrong credentials..."
for ($i = 1; $i -le 20; $i++) {
    
    Write-Output "Iteration number: $i"
    try {
        Connect-AzAccount -Credential $wrongCredential -TenantId $TenantId | Out-Null
        Start-Sleep -Seconds 2
    }
    catch {}
    
}
"Done."
Start-Sleep -Seconds 2

"Performing a successful sign-in..."
Start-Sleep -Seconds 1
Connect-AzAccount -Credential $correctCredential -TenantId $TenantId | Out-Null
"Done."

Get-Date
