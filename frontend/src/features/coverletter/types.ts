export type CoverLetterLanguage = 'ENGLISH' | 'GERMAN'

export type CreateCoverLetterRequest = {
    cvText: string
    jobDescription: string
    language: CoverLetterLanguage
    instructions?: string
}

export type CoverLetterResponse = {
    content: string
}