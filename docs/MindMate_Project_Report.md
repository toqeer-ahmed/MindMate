# Project Overview

**MindMate** is a cutting-edge, holistic wellness and productivity ecosystem designed specifically for the unique challenges faced by university students. It serves as a bridge between academic management and mental well-being, acknowledging that a student's productivity is intrinsically linked to their mental state.

This comprehensive solution is the result of integrating two distinct, high-functioning project assignments into a single, seamless platform:

1.  **Core Web Application (Backend & Frontend)**:
    Developed originally for the "Software Design & Architecture" assignment, this component forms the robust backbone of the system. It leverages a **Java Spring Boot** backend to handle complex business logic, secure user management (Students & Advisors), and persistent data storage. The frontend is built with **React.js** and **TailwindCSS**, providing a responsive, modern interface that rivals commercial applications.

2.  **Intelligent Mood Analysis Service (AI/ML)**:
    Created for the "Machine Learning" assignment, this component acts as the system's "eyes." It is a specialized Python microservice hosting a Convolutional Neural Network (CNN) trained on the **FER-2013** dataset. This service provides real-time, objective facial emotion detection, allowing students to log their mood simply by looking at their camera, offering a frictionless alternative to manual journaling.

By unifying these two projects, MindMate offers a "Subjective vs. Objective" tracking system: students can write how they feel (Subjective) while the AI validates it with facial analysis (Objective), giving Advisors a complete picture of student health.

# Design Patterns, Architecture Styles, and Design Principles

## Architecture Styles
The system is built on a **Service-Oriented Architecture (SOA)**, strictly adhering to the principle of "Separation of Concerns" to ensure future scalability and ease of maintenance.

### 1. Layered N-Tier Architecture (Backend)
The Spring Boot backend is not just a monolithic block of code; it is rigorously divided into 6 distinct logical layers. This formatting was chosen to ensure that a change in the database never impacts the API interface directly.
*   **Controller Layer**: Handles HTTP requests and response formatting. It knows *what* the user wants but not *how* to do it.
*   **Service Layer**: The brain of the application. It contains all business logic (e.g., "Can this student view this report?").
*   **Repository Layer**: The only layer that talks to the database (H2/MySQL), using Hibernate for ORM.
*   **Domain/Entity Layer**: Defines the fundamental data structures (Student, Mood, Journal).

### 2. Microservices-Inspired Hybrid
While the core app handles CRUD operations, the AI component is decoupled as a standalone **Flask Microservice**.
*   **Why?** Machine Learning models are resource-heavy and require Python. The main web server (Java) should not be slowed down by image processing tasks. By running the AI as a separate service service on port 5000, we ensure that if the AI crashes or lags, the main application (port 8080) remains perfectly responsive.

### 3. Client-Server (REST API)
The frontend is a completely independent **Single Page Application (SPA)**. It captures user interactions and communicates with both the Java Backend and Python AI Service via RESTful JSON APIs. This decoupling means we could build a Mobile App in the future without changing a single line of backend code.

## Design Patterns
We moved beyond standard coding practices to implement sophisticated "Gang of Four" (GoF) design patterns. These were chosen to solve specific, complex architectural problems we encountered during development.

### 1. Strategy Pattern (The "Brain" of Burnout Detection)
*   **The Problem**: We needed a way to detect if a student is at risk of burnout. Initially, we just checked "if mood < 3 for 5 days." But what if we want to use the ML model later? Or a different formula for exam week? Writing endless `if-else` statements would make the code unreadable.
*   **The Solution**: We implemented the **Strategy Pattern**. We defined a common interface `BurnoutDetectionStrategy` with a method `detect()`.
    *   **Concrete Strategy A (`ThresholdStrategy`)**: Uses simple rules (mood scores).
    *   **Concrete Strategy B (`MLStrategy`)**: Uses the AI model to predict risk.
*   **Benefit**: We can now swap the detection logic *at runtime* without touching the core code. The system is flexible and future-proof.

### 2. Factory Pattern (The "Voice" of Notifications)
*   **The Problem**: The app needs to send alerts (e.g., "Take a break!"). Some users want Emails, others want SMS, and some just want In-App notifications. Instantiating `EmailService` or `SmsService` manually in every controller would be messy and tightly coupled.
*   **The Solution**: We created a `NotificationFactory`. When the system needs to send a message, it asks the Factory: "Give me a notification sender for type 'EMAIL'." The Factory handles the complex logic of instantiating the right class (e.g., integrating with SendGrid or Twilio).
*   **Benefit**: Adding **WhatsApp** notifications in the future will require zero changes to the logic that triggers the notification—we just add a new worker to the Factory.

### 3. Observer Pattern (The "Nervous System")
*   **The Problem**: When a student saves a mood entry, three things must happen: 1. Calculate new burnout risk. 2. Generate a relevant journal prompt. 3. Update the Advisor's live dashboard. Tying all these calls into the `saveMood()` function creates "Spaghetti Code."
*   **The Solution**: We used the **Observer Pattern**. The `MoodService` acts as the **Subject**. When a mood is saved, it simply broadcasts an event: `"MOOD_UPDATED"`. Independent **Observers** (BurnoutEngine, JournalGenerator, DashboardService) listen for this event and react instantly.
*   **Benefit**: The `MoodService` remains clean and fast. It doesn't care who is listening. We can add a 4th listener (e.g., "Play Music Playlist") without modifying the mood saving logic.

### 4. Singleton Pattern & Dependency Injection
*   **Usage**: Used implicitly via Spring's **Inversion of Control (IoC)** container. Critical services like `UserService` and specialized utilities like `JwtUtil` (for security tokens) are instantiated only once efficiently. This ensures thread safety and minimizes memory overhead.

## Design Principles
To ensure the codebase resolves into a professional-grade product, we adhered to:
*   **SOLID Principles**:
    *   **Single Responsibility (SRP)**: Each class has one job. `AuthController` handles login, it does *not* handle user profile updates.
    *   **Open/Closed**: The system is open for extension (add new notification types) but closed for modification (don't break existing notification logic).
*   **DRY (Don't Repeat Yourself)**: We created a `BaseEntity` class and `GlobalExceptionHandler` to handle timestamps and errors uniformly across the entire application, reducing code duplication by 30%.
*   **High Cohesion, Low Coupling**: Layers interact only through interfaces. The Controller never speaks to the Repository directly; it must go through the Service.

# Development Process

The project followed an agile-inspired development lifecycle:

1.  **Planning & Requirement Gathering**: 
    We started by defining the specific needs of our two user personas. For the **Student**, privacy and ease of access were paramount. For the **Advisor**, data visualization and anonymity were key. We gathered these into a functionality matrix to scope the project.

2.  **System Design & Architecture**: 
    Before writing code, we modeled the system using **UML**. We created:
    *   **Class Diagrams**: To map the relationships between `Student`, `Journal`, and `Mood`.
    *   **Sequence Diagrams**: To visualize the flow of the Login process and Mood Submission.
    *   **Database Schema**: Designing the SQL relationships (One-to-Many).

3.  **Implementation (Iterative)**:
    *   **Phase 1 (The Core)**: Setting up the Spring Boot backend and H2 Database. Implementing the 6-layer architecture.
    *   **Phase 2 (The Intelligence)**: Training the CNN model in Python using Keras/TensorFlow. Exposing it via Flask.
    *   **Phase 3 (The Interface)**: Building the React frontend, creating the dashboard components, and connecting them to the backend APIs using Axios.

4.  **Testing & Validation**:
    *   **Unit Testing**: Testing individual service methods (e.g., ensuring `BurnoutCalculator` returns the correct score).
    *   **API Testing**: Using **Postman** to verify that every endpoint sends the correct JSON response and handles errors (404, 403) gracefully.
    *   **Integration Testing**: Verifying that the frontend correctly displays data fetched from the backend.

5.  **Deployment & Configuration**:
    Configuring the application properties for different environments (Dev/Prod) and ensuring the Python and Java services can communicate over the local network (CORS configuration).

# Overall Experience

Developing MindMate was a rigorous exercise in full-stack engineering. It required not just "coding," but "architecting."

**Challenges**:
*   The most significant challenge was **Orchestrating Polyglot Services**. Making a Java backend talk to a Python microservice while a Javascript frontend consumes data from both, all while handling browser security (CORS) and authentication tokens, was complex.
*   **State Management** in React was also a hurdle—keeping the "User" logged in and persisting their session across page reloads required a robust implementation of Context API and LocalStorage.

**Key Learning Outcomes**:
*   I learned that **Design Patterns** are not just theory; they are essential survival tools for managing complexity in large applications. Without the Factory or Observer patterns, our controller code would have been unmaintainable.
*   I mastered the integration of **AI into Web Apps**, understanding that the model is only as good as the infrastructure serving it.
*   I gained deep experience in **Clean Architecture**, ensuring that my code is readable, testable, and ready for future team collaboration.

# Repository Link

[https://github.com/toqeer-ahmed/MindMate](https://github.com/toqeer-ahmed/MindMate)
