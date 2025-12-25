---
description: Run the full stack MindMate application (Backend, Frontend, ML Service)
---
This workflow starts all three components of the MindMate application.

1. Start the ML Service (Python/Flask)
   - Runs on port 5000
   ```powershell
   cd "d:\SDA Project\MindMate\ml_service"
   .\run_ml_service.ps1
   ```

2. Start the Backend (Java/Spring Boot)
   - Runs on port 8081
   - Uses the existing script to clean, build and run
   ```powershell
   cd "d:\SDA Project\MindMate\backend"
   .\run_backend.ps1
   ```

3. Start the Frontend (React/Vite)
   - Runs on port 5173
   ```powershell
   cd "d:\SDA Project\MindMate\frontend"
   npm run dev
   ```
