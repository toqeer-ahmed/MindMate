$baseUrl = "http://localhost:8081/api/v1"
$email = "test@test.com"
$password = "password"

# Authenticate
$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $authResponse = Invoke-RestMethod -Uri "$baseUrl/auth/authenticate" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $authResponse.token
    Write-Host "Token received."
} catch {
    Write-Error "Auth failed: $_"
    exit
}

$headers = @{
    Authorization = "Bearer $token"
}

# Check Moods
try {
    $moods = Invoke-RestMethod -Uri "$baseUrl/mood" -Headers $headers
    Write-Host "Mood count: $($moods.Count)"
} catch {
    Write-Error "Failed to get moods: $_"
}

# Check Journals
try {
    $journals = Invoke-RestMethod -Uri "$baseUrl/journal" -Headers $headers
    Write-Host "Journal count: $($journals.Count)"
} catch {
    Write-Error "Failed to get journals: $_"
}

# Check Tasks
try {
    $tasks = Invoke-RestMethod -Uri "$baseUrl/tasks" -Headers $headers
    Write-Host "Task count: $($tasks.Count)"
} catch {
    Write-Error "Failed to get tasks: $_"
}
