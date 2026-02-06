# TaskList Application

[![C#](https://img.shields.io/badge/C%23-12-239120.svg)](https://docs.microsoft.com/en-us/dotnet/csharp/)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4.svg)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-17-DD0031.svg)](https://angular.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-00758F.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg)](https://www.docker.com/)

A comprehensive task management system that helps users organize, prioritize, and track their tasks efficiently.

This project simulates a real-world task management system commonly used by teams to organize daily work and improve productivity.


## The Problem

In daily life and work, task management often becomes chaotic with to-do items scattered across different apps, notes, and reminders, reducing productivity and increasing the risk of forgetting important tasks.

## What I Built

I built a comprehensive task management system that provides:

- **Task Management** - Complete CRUD operations for task tracking
- **Category System** - Organize tasks with custom categories and colors
- **Priority & Status** - Track task priority and completion status
- **Secure Authentication** - JWT-based authentication system
- **Dashboard Analytics** - Overview of tasks and productivity metrics

The application features JWT authentication, well-defined REST APIs, Angular frontend, and a fully containerized environment with Docker.

## Technical Challenges

- Implementing Clean Architecture in .NET with proper layer separation
- Defining a clear domain model for tasks, categories, and users
- Integrating Angular frontend with .NET backend using TypeScript
- Creating a reproducible development environment with Docker Compose
- Implementing Entity Framework Core migrations for database versioning
- Standardizing API responses and error handling

## What I Learned from the Project

- Backend code organization following Clean Architecture principles
- Entity Framework Core for data access and migrations
- Practical use of Docker in multi-service environments
- Importance of strong typing in both C# and TypeScript
- Building modern SPAs with Angular 17 and Tailwind CSS
- Structuring projects with maintainability and scalability in mind

## What I Would Improve

- Implement task reminders and notifications
- Add automated testing (unit and integration tests)
- Create a CI/CD pipeline with GitHub Actions
- Add task sharing and collaboration features
- Improve observability with logging and metrics
- Implement recurring tasks functionality

## Technology Stack

### Backend
- **Language:** C# 12
- **Framework:** ASP.NET Core 8.0
- **ORM:** Entity Framework Core
- **Authentication:** JWT (JSON Web Tokens)
- **Architecture:** Clean Architecture (Core, Application, Infrastructure, API)
- **API Documentation:** Swagger/OpenAPI

### Frontend
- **Framework:** Angular 17
- **Build Tool:** Angular CLI
- **State Management:** RxJS
- **HTTP Client:** Angular HttpClient
- **Routing:** Angular Router
- **UI:** Tailwind CSS 3+
- **Language:** TypeScript

### Database
- **DBMS:** MySQL 8.0+
- **Migrations:** Entity Framework Core Migrations

### DevOps
- **Containers:** Docker + Docker Compose
- **Web Server:** Nginx (frontend), Kestrel (backend)
- **Environment Management:** .NET and Angular environment configs

---

## Quick Start

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/cosmicnodestudio/tasklist.git
cd tasklist
```

### 2️⃣ Configure environment variables

Environment variables are configured in docker-compose.yml with default development values.

### 3️⃣ Start Docker

```bash
# Start all services
docker-compose up -d
```

### 4️⃣ Access the application

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:5000
- **Swagger UI:** http://localhost:5000/swagger
- **MySQL:** localhost:3306

### 5️⃣ Default credentials

Create an account through the registration page or use the API to register.

---

## Features

### MVP (Phase 1)

- [x] JWT Authentication & Authorization
- [x] User Registration & Login
- [x] Task CRUD Operations
- [x] Task Status Management (Todo, InProgress, Done)
- [x] Priority Levels (Low, Medium, High, Urgent)
- [x] Category Management with Custom Colors
- [x] Due Date Tracking
- [x] Responsive Dashboard
- [x] Profile Management

### Roadmap (Phase 2)

- [ ] Task reminders and notifications
- [ ] Export tasks to CSV/Excel
- [ ] Advanced filtering and search
- [ ] Task sharing and collaboration
- [ ] Recurring tasks
- [ ] Task templates
- [ ] Mobile application

---

## API Documentation

### Main Endpoints

#### Authentication
```
POST   /api/auth/register           # Register new user
POST   /api/auth/login              # Login user
```

#### Tasks
```
GET    /api/tasks                   # List all tasks (with filters)
POST   /api/tasks                   # Create new task
GET    /api/tasks/{id}              # Get task details
PUT    /api/tasks/{id}              # Update task
DELETE /api/tasks/{id}              # Delete task
```

#### Categories
```
GET    /api/categories              # List all categories
POST   /api/categories              # Create new category
GET    /api/categories/{id}         # Get category details
PUT    /api/categories/{id}         # Update category
DELETE /api/categories/{id}         # Delete category
```

---

## Logs and Uninstall

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down
```
