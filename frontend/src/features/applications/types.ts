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