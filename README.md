# Job Application Tracker
[![Backend CI](https://github.com/hamzapaulpro/job-application-tracker/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/hamzapaulpro/job-application-tracker/actions/workflows/backend-ci.yml)

A web application for organizing job applications, tracking progress,
and managing interviews and follow-ups.

## Project status

The initial Spring Boot API is implemented. Applications are currently
stored in memory and are cleared when the backend restarts.

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

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/applications | List applications |
| POST | /api/applications | Create an application |

### Example request

POST /api/applications
Content-Type: application/json

{
"company": "Example Company",
"position": "Working Student Java Developer"
}

Successful requests return HTTP 201.
Invalid company or position values return HTTP 400 with field-specific errors.