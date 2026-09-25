# Job Application Tracker

[![Backend CI](https://github.com/hamzapaulpro/job-application-tracker/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/hamzapaulpro/job-application-tracker/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/hamzapaulpro/job-application-tracker/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/hamzapaulpro/job-application-tracker/actions/workflows/frontend-ci.yml)

A web application for organizing job applications and tracking their progress.

Built as a portfolio project focused on Java backend engineering, with a React and TypeScript frontend under development.

## Project status

The backend supports application creation, listing, individual lookup, status changes, and status history.

Data is stored in PostgreSQL, with schema migrations managed by Flyway. Integration tests use temporary PostgreSQL databases through Testcontainers. GitHub Actions runs the tests and verifies the backend Docker image build.

The application is under development and is not yet publicly deployed.

## Technology stack

- **Backend:** Java 21, Spring Boot, Spring Data JPA
- **Database:** PostgreSQL 17, Flyway
- **Frontend:** React, TypeScript, Vite — under development
- **Testing:** JUnit, MockMvc, Mockito, Testcontainers
- **Build and delivery:** Maven Wrapper, Docker Compose, GitHub Actions

## Implemented features

- Create applications with generated IDs and an initial `APPLIED` status
- List applications and retrieve individual applications
- Validate company and position fields
- Return structured validation and not-found errors
- Change application status and record timestamped history
- Retrieve status history in chronological order
- Save status changes and history in one transaction
- Avoid duplicate history when the status is unchanged
- Lock an application row during status updates
- Verify rollback when saving history fails

Supported statuses:

`APPLIED`, `SCREENING`, `INTERVIEW`, `OFFER`, `REJECTED`, `WITHDRAWN`

Currently, applications can move between any supported statuses.

## Planned features

- Complete the React interface
- Edit application details
- Search, filtering, and pagination
- Interview scheduling and follow-up dates
- Dashboard summaries
- Authentication and user-level authorization
- Public demo with fictional data

## Architecture

The backend is organized by feature, with separate responsibilities:

- **Controllers** handle HTTP requests and responses.
- **Services** coordinate business operations and transactions.
- **Repositories** access PostgreSQL through Spring Data JPA.
- **DTOs** define API request and response data.
- **Entities** map Java objects to database tables.

Flyway manages versioned database changes. Application status updates and their history entries are saved within the same transaction.

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | List applications |
| POST | `/api/applications` | Create an application |
| GET | `/api/applications/{id}` | Retrieve one application |
| PATCH | `/api/applications/{id}/status` | Change status and record history |
| GET | `/api/applications/{id}/history` | Retrieve history, oldest first |

Endpoints targeting an individual application return `404 Not Found` if it does not exist.

### Create an application

```bash
curl -i -X POST http://localhost:8080/api/applications \
  -H 'Content-Type: application/json' \
  -d '{
    "company": "Example Company",
    "position": "Working Student Java Developer"
  }'
```

Successful requests return `201 Created`. Invalid company or position values return `400 Bad Request` with field-specific errors.

### Change application status

Replace `1` with an existing application ID:

```bash
curl -i -X PATCH http://localhost:8080/api/applications/1/status \
  -H 'Content-Type: application/json' \
  -d '{"status": "INTERVIEW"}'
```

Successful requests return `200 OK` with the updated application. Repeating the current status does not create another history entry.

## Getting started

### Requirements

- Git
- Docker with Docker Compose
- Java 21 for running the backend locally or running tests
- Node.js and npm for frontend development

A separate Maven installation is not required; the backend includes the Maven Wrapper.

### Initial setup

Clone the repository:

```bash
git clone https://github.com/hamzapaulpro/job-application-tracker.git
cd job-application-tracker
```

Copy the environment template:

```bash
cp .env.example .env
```

Set `DB_PASSWORD` in `.env` to your chosen local database password. Keep `.env` out of Git.

PostgreSQL sets this password when initializing a new database volume. Editing `.env` afterward does not change the password stored in an existing database.

### Option 1: Run the backend and database in Docker

From the repository root:

```bash
docker compose --profile app up --build -d
```

Stop any backend running in IntelliJ first to free port `8080`.

The backend waits for PostgreSQL to become healthy, then applies pending Flyway migrations during startup.

The API is available at:

[http://localhost:8080/api/applications](http://localhost:8080/api/applications)

View backend logs:

```bash
docker compose logs -f backend
```

Press `Ctrl+C` to stop following logs. The container continues running.

### Option 2: Run the backend in IntelliJ

From the repository root, stop the containerized backend if it is running and start PostgreSQL:

```bash
docker compose stop backend
docker compose up -d postgres
```

Then:

1. Open the project in IntelliJ and load `backend/pom.xml` as a Maven project.
2. Select Java 21 for the backend.
3. Set `DB_PASSWORD` in the backend run configuration to match the database password.
4. Run `BackendApplication`.

Docker Compose reads `.env` automatically. The IntelliJ backend run configuration must receive its environment variables separately.

### Database connection settings

| Variable | Local default |
|----------|---------------|
| `DB_URL` | `jdbc:postgresql://localhost:5432/jobtracker` |
| `DB_USERNAME` | `jobtracker` |
| `DB_PASSWORD` | Required; no default |

Docker Compose overrides `DB_URL` with `jdbc:postgresql://postgres:5432/jobtracker`, where `postgres` is the database service name.

### Frontend development

The frontend is under development. From the repository root:

```bash
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### Stop the Docker services

From the repository root:

```bash
docker compose --profile app down
```

Database data remains in the named Docker volume. Adding `--volumes` would delete that data.

## Running backend tests

Keep Docker running. From the repository root:

```bash
cd backend
bash mvnw --batch-mode --no-transfer-progress verify
```

Tests start their own temporary PostgreSQL databases and apply the Flyway migrations. They do not require the development database or its password.

Coverage includes:

- Application creation and retrieval
- Input validation and structured errors
- Missing applications
- Status changes and history retrieval
- Duplicate-history prevention
- Transaction rollback when saving history fails

## Continuous integration

GitHub Actions runs on pushes and pull requests and can also be triggered manually.

The backend workflow:

1. Sets up Java 21.
2. Builds the backend and runs tests with Testcontainers.
3. Builds the backend Docker image after the tests pass.

Tests run separately from image construction. The Docker build skips test execution because the integration tests require Docker access.

The workflow does not publish the image or deploy the application.