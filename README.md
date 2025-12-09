# MindMate - Campus Wellness & Productivity Companion

MindMate is a full-stack web application designed to help students manage their mental wellness and productivity, while providing advisors with insights to support them.

## Project Structure

- **Backend**: Java Spring Boot (Maven)
- **Frontend**: React + Vite (TailwindCSS)

## Features

### Student
- **Mood Tracking**: Log daily mood with notes. View mood history charts.
- **Journaling**: Write journal entries with mood tags.
- **Task Management**: Manage tasks with priorities and due dates.
- **Dashboard**: Overview of wellness metrics.

### Advisor
- **Wellness Reports**: View anonymized reports of students.
- **Risk Detection**: System automatically flags high-risk students based on mood trends.

## Architecture & Design Patterns

The backend follows a 6-layer architecture:
1. Domain Layer (Entities)
2. Repository Layer
3. Service Layer
4. Controller Layer
5. Security Layer
6. DTO Layer

**Design Patterns Implemented:**
- **Factory Method**: `NotificationFactory` for creating notification handlers.
- **Singleton**: Spring Beans (Service/Component scope), `JwtService`.
- **Strategy**: `BurnoutDetectionStrategy` (Threshold, ML, Pattern).
- **Adapter**: `NotificationAdapter` (Twilio, Firebase, SendGrid).
- **Observer**: `MoodObserver` (notifies BurnoutEngine, NotificationService, JournalPromptGenerator).
- **Template Method**: `BaseBurnoutDetectionTemplate` (Daily/Weekly checks).

## Setup Instructions

### Backend
1. Navigate to `backend` directory.
2. Run `mvn spring-boot:run`.
3. Server starts on `http://localhost:8080`.
4. H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:mindmatedb`, User: `sa`, Password: `password`).

### Frontend
1. Navigate to `frontend` directory.
2. Run `npm install`.
3. Run `npm run dev`.
4. App starts on `http://localhost:5173`.

## Default Login
- Sign up a new user via the Signup page.
- Select role (Student or Advisor).

## API Documentation
- Auth: `/api/v1/auth/**`
- Mood: `/api/v1/mood/**`
- Journal: `/api/v1/journal/**`
- Tasks: `/api/v1/tasks/**`
- Advisor: `/api/v1/advisor/**`
