& "C:\Users\Toqeer Ahmed\.gemini\maven\apache-maven-3.9.6\bin\mvn.cmd" clean install -DskipTests
if ($LASTEXITCODE -eq 0) {
    java -jar target/backend-0.0.1-SNAPSHOT.jar --server.port=8081
} else {
    Write-Host "Build failed. Check the error above."
}
