$commits = 80
for ($i=1; $i -le $commits; $i++) {
    Add-Content -Path "activity_log.txt" -Value "Commit number $i at $(Get-Date)"
    git add activity_log.txt
    git commit -m "Enhancement: Project activity update $i"
    Write-Host "Created commit $i"
}
Write-Host "Generated $commits commits."
