import type {CoverLetterResponse, CreateCoverLetterRequest} from "./types.ts";

export async function generateCoverLetter(request: CreateCoverLetterRequest): Promise<CoverLetterResponse> {
    const response = await fetch(
        '/api/cover-letters',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(request)
        }
    )

    if (!response.ok) {
        if (response.status === 400) {
            throw new Error(
                'Please check your CV, job description, language, and instructions.',
            )
        }

        if (response.status === 502) {
            throw new Error(
                'The AI service could not generate your letter. Please try again.',
            )
        }
    }

    const data: unknown = await response.json()

    if (typeof data !== 'object' || data === null || !('content' in data) ||
        typeof data.content !== 'string' || data.content.trim() === '') {

        throw new Error('The server returned an invalid cover letter.')
    }

    return { content: data.content }
}