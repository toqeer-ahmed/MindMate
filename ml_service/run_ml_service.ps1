$ErrorActionPreference = "Stop"

Write-Host "Setting up ML Service..."

# 1. Create Virtual Environment if not exists
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}

# 2. Install Dependencies
Write-Host "Installing dependencies... (This may take a while for TensorFlow)"
& ".\venv\Scripts\pip" install -r requirements.txt --default-timeout=1000

# 3. Train Model
if (-not (Test-Path "emotion_model.h5")) {
    Write-Host "Training model..."
    & ".\venv\Scripts\python" train.py
} else {
    Write-Host "Model already exists. Skipping training."
}

# 4. Run App
Write-Host "Starting ML API..."
& ".\venv\Scripts\python" app.py
