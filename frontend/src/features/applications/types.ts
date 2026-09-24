export type ApplicationStatus =
    | 'APPLIED'
    | 'SCREENING'
    | 'INTERVIEW'
    | 'OFFER'
    | 'REJECTED'
    | 'WITHDRAWN'

export interface JobApplication {
    id: number
    company: string
    position: string
    status: ApplicationStatus
}

export interface ValidationErrorResponse {
    code: 'VALIDATION_ERROR'
    fieldErrors: {
        company?: string
        position?: string
    }
}

export interface ApplicationStatusHistory {
    id: number
    previousStatus: ApplicationStatus
    newStatus: ApplicationStatus
    changedAt: string
}