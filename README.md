# Job Application Tracker
[![Backend CI](https://github.com/hamzapaulpro/job-application-tracker/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/hamzapaulpro/job-application-tracker/actions/workflows/backend-ci.yml)

A web application for organizing job applications, tracking progress,
and managing interviews and follow-ups.

## Project status

The Spring Boot API supports creating and listing applications,
with PostgreSQL persistence, input validation, and structured errors.

Database schema changes are managed with Flyway.
Integration tests use a temporary PostgreSQL database through Testcontainers.
GitHub Actions builds the backend and runs the tests on every push.

## Planned technologies

- Java and Spring Boot
- PostgreSQL
- React and TypeScript

## Planned features

- Create and manage job applications
- Track application stages and status history
- Search and filter applications
- Record interviews and follow-up dates
- Secure each user's data with authentication and authorization

## Project goals

Demonstrate Java backend development through a practical application,
with a React frontend and documented technical decisions.

## Implemented features

- Create an application with an automatically assigned ID and APPLIED status
- List applications
- Validate company and position fields
- Return field-specific validation errors
- Change application status with timestamped history
- Save status updates and history in one transaction
- Prevent duplicate history when the status is unchanged
- Verify transaction rollback with an automated failure test

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/applications | List applications |
| POST | /api/applications | Create an application |
| GET | /api/applications/{id} | Get one application; returns 404 if not found |
| PATCH | /api/applications/{id}/status | Change status and record history |
| GET | /api/applications/{id}/history | Get status history, oldest first |

### Example request

POST /api/applications
Content-Type: application/json

{
"company": "Example Company",
"position": "Working Student Java Developer"
}

Successful requests return HTTP 201.
Invalid company or position values return HTTP 400 with field-specific errors.

## Running locally

Requirements: Java 21 and Docker with Docker Compose.

1. Copy `.env.example` to `.env` and set `DB_PASSWORD`.
2. From the repository root, run `docker compose up -d`.
3. Open the backend in IntelliJ and load the Maven project.
4. Set `DB_PASSWORD` in the backend run configuration to match `.env`.
5. Run `BackendApplication`.

The API is available at http://localhost:8080/api/applications.

## Running tests

Keep Docker running, then run from the repository root:

```bash
cd backend
bash mvnw --batch-mode verify