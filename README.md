# Job Application Tracker

[![Backend CI](https://github.com/hamzapaulpro/job-application-tracker/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/hamzapaulpro/job-application-tracker/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/hamzapaulpro/job-application-tracker/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/hamzapaulpro/job-application-tracker/actions/workflows/frontend-ci.yml)

A web application for tracking job applications and creating downloadable CVs.

Built with **Java 21, Spring Boot, PostgreSQL, React, and TypeScript**. The project combines a transactional REST API with a custom-styled frontend and browser-based PDF generation.

Developed as a learning and portfolio project, with an emphasis on understandable code, data consistency, automated backend tests, and practical user workflows.

## Features

### Application tracker

- Create applications with a generated ID and initial `APPLIED` status.
- View applications and open individual detail pages.
- Edit company and position without changing application status.
- Search by company or position and filter by status in the frontend.
- Change application status and view its timestamped history.
- Display field-specific validation errors and loading/error states.
- Persist applications and status history in PostgreSQL.

Supported statuses:

`APPLIED` · `SCREENING` · `INTERVIEW` · `OFFER` · `REJECTED` · `WITHDRAWN`

Applications can currently move between any supported statuses. Selecting the existing status does not create another history entry.

### CV builder

- Edit personal details, summary, education, experience, projects, skills, and languages.
- Switch between form sections using sidebar buttons without losing entered values.
- Add and remove education, experience, project, and language entries.
- Include education descriptions, responsibilities, achievements, and project technologies.
- Save drafts automatically in browser `localStorage` and restore them after refresh.
- Exclude untouched empty repeatable entries from saved drafts.
- Preview an A4 PDF with section headings, dates, bullet points, and clickable links.
- Update the preview after a 500ms typing pause to reduce regeneration while editing.
- Display multiple PDF pages and resize the preview to its container.
- Download the same generated PDF used by the preview as `CV.pdf`.
- Disable downloading while changes are waiting to be rendered or PDF generation is in progress.

CV generation runs in the browser. It does not require a CV-generation endpoint or upload the CV to the Spring Boot backend.

## Technology stack

| Area | Technologies |
| --- | --- |
| Backend | Java 21, Spring Boot 4.1.1, Spring Web MVC, Bean Validation |
| Persistence | Spring Data JPA, Hibernate, PostgreSQL 17, Flyway |
| Frontend | React, TypeScript, Vite, React Router |
| Styling | Custom CSS and CSS Modules |
| PDF generation | `@react-pdf/renderer` |
| PDF preview | `react-pdf` with PDF.js |
| Backend testing | JUnit, MockMvc, Mockito, Testcontainers |
| Tooling | Maven Wrapper, npm, ESLint, Docker Compose, GitHub Actions |

Frontend dependency versions are recorded in `frontend/package.json` and `frontend/package-lock.json`. The Node.js major version is defined in `frontend/.nvmrc`.

## Architecture and design decisions

```text
React / TypeScript frontend
├── Application tracker
│   └── /api/applications
│       └── Spring Boot controller → service → JPA repositories
│           └── PostgreSQL, with Flyway migrations
└── CV builder
    ├── React state ↔ browser localStorage
    └── PDF template → generated PDF
        ├── PDF.js preview
        └── Download of the same file
```

### Backend

The backend is organized by feature. Controllers handle HTTP requests, services coordinate business operations, repositories access the database, and DTOs define API inputs and outputs.

Status changes and history entries are saved in a single transaction. A pessimistic write lock serializes changes to the same application row during status and detail updates. A dedicated test verifies that a failed history save rolls back the status change.

Flyway owns schema changes. Hibernate validates the schema rather than creating or updating it automatically, and Open Session in View is disabled.

### Frontend and PDF generation

The frontend groups application and CV functionality into separate feature folders. Shared navigation and footer components provide the surrounding layout.

The CV template uses React PDF components rather than an HTML-to-image conversion. The preview renders the generated PDF itself, so the downloaded file shares its content and page layout. Debouncing separates immediate form updates from more expensive document generation.

## Repository structure

```text
job-application-tracker/
├── .github/workflows/
│   ├── backend-ci.yml
│   └── frontend-ci.yml
├── backend/
│   ├── src/main/java/com/hamzapaulpro/jobtracker/
│   │   ├── application/
│   │   │   ├── dto/
│   │   │   ├── exception/
│   │   │   └── history/
│   │   └── error/
│   ├── src/main/resources/db/migration/
│   ├── src/test/java/com/hamzapaulpro/jobtracker/
│   ├── Dockerfile
│   ├── mvnw
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── applications/
│   │   │   └── cv/
│   │   └── pages/
│   ├── .nvmrc
│   └── package.json
├── .env.example
├── compose.yaml
└── README.md
```

## Run locally

### Requirements

- Git
- Docker with Docker Compose
- Node.js 24 and npm
- Java 21 when running the backend outside Docker or running backend tests

The repository includes the Maven Wrapper; a separate Maven installation is not required. Commands below assume a Bash-compatible terminal.

### 1. Clone and configure

```bash
git clone https://github.com/hamzapaulpro/job-application-tracker.git
cd job-application-tracker
cp .env.example .env
```

Add the following to `.env`, replacing the placeholder with a local development password:

```dotenv
DB_PASSWORD=replace_with_your_local_password
```

Keep `.env` out of Git. PostgreSQL uses this password when initializing a new database volume. Changing `.env` later does not change the password of an existing database user.

### 2. Start the backend and database

From the repository root:

```bash
docker compose --profile app up --build -d
```

Stop any backend already running in IntelliJ first to free port `8080`.

The backend waits for PostgreSQL's health check before starting. Flyway applies pending migrations during backend startup. The backend image uses a multi-stage Java build and runs as a non-root user.

Check the services or follow backend logs:

```bash
docker compose --profile app ps
docker compose logs -f backend
```

### 3. Start the frontend

In another terminal, from the repository root:

```bash
cd frontend
npm ci
npm run dev
```

If you use nvm, run `nvm install` and `nvm use` inside `frontend` first; both use `.nvmrc`.

Open the URL printed by Vite, usually [http://localhost:5173](http://localhost:5173).

| Location | Purpose |
| --- | --- |
| `/applications` | Browse, search, filter, and create applications |
| `/applications/:id` | Edit an application and view/change its status |
| `/cv` | Create a CV, preview it, and download a PDF |
| `/about` | Project information |
| `http://localhost:8080/api/applications` | Backend API |

Vite forwards development requests beginning with `/api` to `http://localhost:8080`. Docker Compose currently runs the backend and database; the frontend runs separately through Vite.

### CV builder without the backend

To try only the CV builder, start the frontend and open `/cv`. Its form, local draft storage, preview, and PDF download operate in the browser. The application-tracking pages still need the backend and database.

### Run the backend in IntelliJ instead

From the repository root:

```bash
docker compose stop backend
docker compose up -d postgres
```

Then:

1. Open the project and load `backend/pom.xml` as a Maven project.
2. Configure Java 21.
3. Set `DB_PASSWORD` in the run configuration to match your database password.
4. Run `BackendApplication`.

Docker Compose reads `.env`; Spring Boot launched from IntelliJ does not automatically load that file.

| Environment variable | Default / requirement |
| --- | --- |
| `DB_URL` | `jdbc:postgresql://localhost:5432/jobtracker` |
| `DB_USERNAME` | `jobtracker` |
| `DB_PASSWORD` | Required; no default |

Compose sets `DB_URL` to `jdbc:postgresql://postgres:5432/jobtracker` so the backend container connects to the database service by name. PostgreSQL and the backend are published on host loopback ports `5432` and `8080`.

### Stop services

Stop Vite with `Ctrl+C`. From the repository root, stop the Docker services with:

```bash
docker compose --profile app down
```

The named PostgreSQL volume preserves application data. Adding `--volumes` deletes that volume and its data.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/applications` | List applications |
| POST | `/api/applications` | Create an application |
| GET | `/api/applications/{id}` | Retrieve an application |
| PUT | `/api/applications/{id}` | Update company and position |
| PATCH | `/api/applications/{id}/status` | Update status and record history |
| GET | `/api/applications/{id}/history` | Retrieve history, oldest first |

### Create an application

```bash
curl -i -X POST http://localhost:8080/api/applications \
  -H 'Content-Type: application/json' \
  -d '{"company":"Example Company","position":"Working Student Java Developer"}'
```

Returns `201 Created`. Company and position must be nonblank and at most 150 characters. Validation failures return `400 Bad Request` with field-specific errors.

### Update details

Replace `1` with an existing application ID:

```bash
curl -i -X PUT http://localhost:8080/api/applications/1 \
  -H 'Content-Type: application/json' \
  -d '{"company":"Example Company","position":"Java Backend Developer"}'
```

Returns the updated application without changing its status.

### Change status and read history

```bash
curl -i -X PATCH http://localhost:8080/api/applications/1/status \
  -H 'Content-Type: application/json' \
  -d '{"status":"INTERVIEW"}'

curl http://localhost:8080/api/applications/1/history
```

Repeating the current status does not add duplicate history. Requests targeting a missing application return `404 Not Found`.

Search and status filtering currently happen in React; the list endpoint does not provide server-side search or pagination.

## Tests and quality checks

### Backend

With Docker running, from the repository root:

```bash
cd backend
bash mvnw --batch-mode --no-transfer-progress verify
```

Testcontainers starts temporary PostgreSQL databases with Flyway migrations. The tests do not require the development database or its password.

The suite covers application creation and retrieval, validation, missing records, status history, duplicate-history prevention, detail updates, and rollback when history persistence fails.

### Frontend

From the repository root:

```bash
cd frontend
npm run lint
npm run build
```

The build runs TypeScript checks and creates the production bundle in `frontend/dist`. There is currently no frontend unit-test or end-to-end test suite configured.

Useful manual checks include adding and removing repeated CV entries, restoring drafts after refresh, editing text without cursor disruption, checking multi-page PDFs, and comparing the downloaded file with the preview.

## Continuous integration

Both workflows run on pushes and pull requests and support manual runs.

| Workflow | Checks |
| --- | --- |
| Backend CI | Java 21 setup, Maven verification with Testcontainers, backend Docker image build |
| Frontend CI | Node.js from `.nvmrc`, `npm ci`, ESLint, TypeScript and Vite build |

The Dockerfile skips tests during image construction; backend CI runs them beforehand. The workflows do not publish images or deploy the application.

## Data storage and current limitations

- **Applications:** stored in PostgreSQL. Authentication and per-user ownership are not implemented; the API currently works with a shared application dataset.
- **CV drafts:** stored in `localStorage` in the current browser profile and origin. They survive normal browser restarts but do not sync between devices or addresses. Clearing site data removes them; private browsing usually removes them when the session ends.
- **PDFs:** generated in the browser. The application currently has no CV upload, server-side CV storage, or AI provider integration.
- **Draft privacy:** browser storage is not an encrypted personal vault. Use care on shared browser profiles.
- **Deployment:** currently intended for local development. A public multi-user tracker needs authentication and authorization. Production hosting must also configure frontend routing and API forwarding; Vite's development proxy is not a production server configuration.

## Troubleshooting

| Problem | Check |
| --- | --- |
| PostgreSQL password authentication fails | Confirm the backend password matches the existing database user. Editing `.env` does not update an initialized database password. |
| Port `8080` is already in use | Stop either the IntelliJ backend or the backend container. |
| Application list cannot load | Check backend logs, database health, and Vite's `/api` proxy target. |
| CV draft appears missing | Confirm the same browser profile, protocol, host, and port; check whether site data was cleared or a storage error was shown. |
| PDF preview fails | Inspect the browser console for generation or PDF.js worker errors. Keep dependency versions consistent with the lockfile using `npm ci`. |
| Backend tests cannot start PostgreSQL | Ensure Docker is running and accessible to the user running Maven. |

## Roadmap

Planned work, not implemented features:

- Authentication and authorization for a public multi-user application tracker.
- Server-side search and pagination.
- Interview dates, follow-up reminders, and dashboard summaries.
- More automated frontend and PDF regression checks.
- Explicit controls for clearing browser-saved CV drafts.
- AI-assisted cover-letter drafts using CV details and a pasted job advertisement.
- Evaluation of local models through Ollama and/or a hosted AI provider.
- CV upload and extraction with user review.
- A public student pilot, hosting support, and an open-source license.

## Feedback and contributions

Feedback and bug reports are welcome through [GitHub Issues](https://github.com/hamzapaulpro/job-application-tracker/issues). Include reproduction steps and use fictional information in screenshots or sample CVs.

Discuss larger changes before implementing them. Run the relevant checks above when proposing a change, and never commit passwords, `.env`, or real personal CV data.

## License

An open-source license has not yet been selected or added. Public source availability alone does not grant general reuse rights. Licensing will be clarified before the project is promoted as an open-source release.
