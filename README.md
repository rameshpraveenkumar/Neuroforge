# NeuroForge – Enterprise SDLC & DevOps Management System

An end-to-end Enterprise Software Development Life Cycle (SDLC) and DevOps Orchestration Platform built with **React**, **Spring Boot 3.3.x (Java 21 LTS)**, and **MySQL 8.x**.

---

## 🚀 Key Architectural Highlights

- **Backend-Enforced RBAC**: True Spring Security 6 authorization with `@EnableMethodSecurity` and JWT claims for 9 enterprise roles (`System Admin`, `Project Manager`, `Product Owner`, `Business Analyst`, `Software Architect`, `Developer`, `QA/Test Engineer`, `DevOps Engineer`, `Client`).
- **Demo Mode Persona Switcher**: Built-in 1-click persona switcher that requests authentic signed JWTs from `/api/auth/demo-switch` for immediate evaluation without bypassing backend filters.
- **Relational Schema Traceability**: 20 core entities and 5 supporting tables (Requirements $\rightarrow$ Sprints $\rightarrow$ Tasks $\rightarrow$ Commits $\rightarrow$ Test Runs $\rightarrow$ Defects $\rightarrow$ Pipelines $\rightarrow$ Deployments $\rightarrow$ ADRs).
- **Offline-Safe AI Engine**: Built-in heuristic fallback engine producing realistic user stories, Gherkin criteria, multi-vector test cases, and code reviews without requiring an external AI API key.
- **Safe CI/CD Simulator**: In-memory asynchronous state machine emitting real-time build and deployment logs without executing destructive host terminal commands.
- **Automated Demo Seeder**: Pre-seeds all 9 roles, sample projects, sprints, tasks, and test cases on first startup when the database is empty.

---

## 📁 Repository Structure

```
neuroforge/
├── neuroforge-backend/         # Spring Boot 3.3 (Java 21) REST API
│   ├── src/main/java/com/neuroforge/
│   │   ├── config/            # SecurityConfig, JwtTokenProvider, CorsConfig, OpenApiConfig
│   │   ├── controller/        # AuthController & REST endpoints
│   │   ├── dto/               # Request & Response DTOs
│   │   ├── entity/            # 20 JPA Entities + 5 Supporting Tables
│   │   ├── enums/             # 9 Enterprise Roles & SDLC Enums
│   │   ├── exception/         # GlobalExceptionHandler
│   │   ├── repository/        # Spring Data JPA Repositories
│   │   ├── service/           # Business logic & AuthService
│   │   └── util/              # DatabaseDataSeeder (Initial Demo Data)
│   └── src/main/resources/    # application.yml
│
└── neuroforge-frontend/        # React 18 + Vite SPA
    ├── src/
    │   ├── api/               # Axios client & Auth API
    │   ├── components/        # AppLayout, Navbar, Sidebar, PersonaSwitcher
    │   ├── context/           # AuthContext (JWT session state)
    │   ├── pages/             # LoginPage, RoleDashboardPage
    │   └── utils/             # Role permissions & UI constants
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🛠️ Quick Start & Execution

### 1. Database Setup (MySQL 8.x)
Ensure MySQL is running on `localhost:3306`:
```sql
CREATE DATABASE IF NOT EXISTS neuroforge_db;
```

### 2. Backend Startup
Set environment variables or use safe development defaults:
```bash
cd neuroforge/neuroforge-backend

# Optional environment variables:
# export DB_USERNAME=root
# export DB_PASSWORD=your_password
# export JWT_SECRET=your_secret_key

# Run via Maven:
mvn clean spring-boot:run
```
*The backend starts at `http://localhost:8080`.*
*Interactive OpenAPI documentation is accessible at `http://localhost:8080/swagger-ui.html`.*

### 3. Frontend Startup
```bash
cd neuroforge/neuroforge-frontend
npm install
npm run dev
```
*The frontend runs at `http://localhost:5173`.*

---

## 👤 Pre-Seeded Demo Role Credentials

All pre-seeded demo accounts share the password: `password123`

| Role | Email | Full Name |
| :--- | :--- | :--- |
| **System Admin** | `admin@neuroforge.io` | Sarah Jenkins |
| **Project Manager** | `pm@neuroforge.io` | Alex Rivera |
| **Product Owner** | `po@neuroforge.io` | Elena Rostova |
| **Business Analyst** | `ba@neuroforge.io` | Marcus Vance |
| **Software Architect** | `architect@neuroforge.io` | Dr. Devon Hayes |
| **Developer** | `dev@neuroforge.io` | Liam Zhao |
| **QA/Test Engineer** | `qa@neuroforge.io` | Priya Sharma |
| **DevOps Engineer** | `devops@neuroforge.io` | Kurt Becker |
| **Client** | `client@neuroforge.io` | Clara Sterling |
