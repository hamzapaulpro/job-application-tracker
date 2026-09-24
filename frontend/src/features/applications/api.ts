import type {ApplicationStatusHistory, JobApplication, ValidationErrorResponse} from './types'

export class ApplicationValidationError extends Error {
    fieldErrors: ValidationErrorResponse['fieldErrors']

    constructor(fieldErrors: ValidationErrorResponse['fieldErrors']) {
        super('Please check the highlighted fields.')
        this.name = 'ApplicationValidationError'
        this.fieldErrors = fieldErrors
    }
}

export async function createApplication(
    company: string,
    position: string,
): Promise<JobApplication> {
    const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company, position }),
    })

    if (!response.ok) {
        if (response.status === 400) {
            const errorBody = await response.json()

            if (errorBody.code === 'VALIDATION_ERROR') {
                throw new ApplicationValidationError(errorBody.fieldErrors)
            }
        }

        throw new Error('Could not save the application')
    }

    return response.json()
}

export async function getApplications(): Promise<JobApplication[]> {
    const response = await fetch('/api/applications')

    if (!response.ok) {
        throw new Error('Could not load applications')
    }

    return response.json()
}

export async function getApplication(id: string): Promise<JobApplication> {
    const response = await fetch(
        `/api/applications/${encodeURIComponent(id)}`,
    )

    if (response.status === 404) {
        throw new Error('Application not found')
    }

    if (!response.ok) {
        throw new Error('Could not load the application')
    }

    return response.json()
}

export async function getApplicationHistory(id: string): Promise<ApplicationStatusHistory[]> {
    const response = await fetch(`/api/applications/${encodeURIComponent(id)}/history`)

    if (response.status === 404) {
        throw new Error("Application not found")
    }

    if (!response.ok) {
        throw new Error('Could not load application history')
    }

    return response.json();
}