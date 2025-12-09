$baseUrl = "http://localhost:8081/api/v1"
$email = "test@test.com"
$password = "password"

# 1. Authenticate
Write-Host "Authenticating..."
$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $authResponse = Invoke-RestMethod -Uri "$baseUrl/auth/authenticate" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $authResponse.token
    Write-Host "Authentication successful. Token received."
} catch {
    Write-Error "Authentication failed: $_"
    exit
}

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

# 2. Create Mood Entries
Write-Host "Creating Mood Entries..."
$moods = @(
    @{ moodScore = 8; moodLabel = "Happy"; note = "Had a great day!"; timestamp = (Get-Date).AddDays(-6).ToString("yyyy-MM-ddTHH:mm:ss") },
    @{ moodScore = 5; moodLabel = "Neutral"; note = "Just a regular day."; timestamp = (Get-Date).AddDays(-5).ToString("yyyy-MM-ddTHH:mm:ss") },
    @{ moodScore = 3; moodLabel = "Stressed"; note = "Lots of assignments due."; timestamp = (Get-Date).AddDays(-4).ToString("yyyy-MM-ddTHH:mm:ss") },
    @{ moodScore = 6; moodLabel = "Okay"; note = "Finished one assignment."; timestamp = (Get-Date).AddDays(-3).ToString("yyyy-MM-ddTHH:mm:ss") },
    @{ moodScore = 9; moodLabel = "Excited"; note = "Weekend is coming!"; timestamp = (Get-Date).AddDays(-2).ToString("yyyy-MM-ddTHH:mm:ss") },
    @{ moodScore = 7; moodLabel = "Good"; note = "Relaxed."; timestamp = (Get-Date).AddDays(-1).ToString("yyyy-MM-ddTHH:mm:ss") },
    @{ moodScore = 8; moodLabel = "Happy"; note = "Feeling productive."; timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss") }
)

foreach ($mood in $moods) {
    try {
        Invoke-RestMethod -Uri "$baseUrl/mood" -Method Post -Body ($mood | ConvertTo-Json) -Headers $headers
        Write-Host "Created mood: $($mood.moodLabel)"
    } catch {
        Write-Error "Failed to create mood: $_"
    }
}

# 3. Create Journal Entries
Write-Host "Creating Journal Entries..."
$journals = @(
    @{ title = "Project Kickoff"; content = "Started the new SDA project today. Feeling optimistic but there is a lot to do."; moodTag = "Excited"; createdAt = (Get-Date).AddDays(-5).ToString("yyyy-MM-ddTHH:mm:ss") },
    @{ title = "Mid-week checkin"; content = "Struggling a bit with the backend configuration. Need to read more docs."; moodTag = "Stressed"; createdAt = (Get-Date).AddDays(-3).ToString("yyyy-MM-ddTHH:mm:ss") },
    @{ title = "Breakthrough"; content = "Finally fixed the login issue! It was a stale token problem. So relieved."; moodTag = "Happy"; createdAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss") }
)

foreach ($journal in $journals) {
    try {
        Invoke-RestMethod -Uri "$baseUrl/journal" -Method Post -Body ($journal | ConvertTo-Json) -Headers $headers
        Write-Host "Created journal: $($journal.title)"
    } catch {
        Write-Error "Failed to create journal: $_"
    }
}

# 4. Create Tasks
Write-Host "Creating Tasks..."
$tasks = @(
    @{ title = "Setup Backend"; description = "Configure Spring Boot and H2"; dueDate = (Get-Date).AddDays(-2).ToString("yyyy-MM-dd"); status = "DONE"; priority = "HIGH" },
    @{ title = "Frontend Login"; description = "Implement login page with React"; dueDate = (Get-Date).AddDays(-1).ToString("yyyy-MM-dd"); status = "DONE"; priority = "HIGH" },
    @{ title = "Database Schema"; description = "Design the database schema for users and journals"; dueDate = (Get-Date).AddDays(1).ToString("yyyy-MM-dd"); status = "IN_PROGRESS"; priority = "MEDIUM" },
    @{ title = "API Documentation"; description = "Write Swagger docs"; dueDate = (Get-Date).AddDays(3).ToString("yyyy-MM-dd"); status = "TODO"; priority = "LOW" },
    @{ title = "User Testing"; description = "Get feedback from 5 users"; dueDate = (Get-Date).AddDays(5).ToString("yyyy-MM-dd"); status = "TODO"; priority = "MEDIUM" }
)

foreach ($task in $tasks) {
    try {
        Invoke-RestMethod -Uri "$baseUrl/tasks" -Method Post -Body ($task | ConvertTo-Json) -Headers $headers
        Write-Host "Created task: $($task.title)"
    } catch {
        Write-Error "Failed to create task: $_"
    }
}

Write-Host "Data population complete!"
