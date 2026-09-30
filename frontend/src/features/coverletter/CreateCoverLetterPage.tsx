import styles from './CreateCoverLetterPage.module.css'
import { useState } from 'react'
import type {CoverLetterLanguage} from "./types.ts";
import {generateCoverLetter} from "./api.ts";

export default function CreateCoverLetterPage() {
    const [cvSource, setCvSource] = useState<'saved' | 'text'>('saved')
    const [cvText, setCvText] = useState('')
    const [jobDescription, setJobDescription] = useState('')
    const [language, setLanguage] = useState<CoverLetterLanguage>('ENGLISH')
    const [instructions, setInstructions] = useState('')
    const [content, setContent] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [generationError, setGenerationError] = useState('')

    async function handleGenerate() {
        if (isGenerating) return

        setGenerationError('')
        if (cvSource !== 'text') {
            setGenerationError(
                'Please select Paste CV text for now. Saved CV support is coming next.',
            )
            return
        }

        if (!cvText.trim() || !jobDescription.trim()) {
            setGenerationError('Please provide your CV text and job description.')
            return
        }

        try {
            const response = await generateCoverLetter({
                cvText: cvText.trim(),
                jobDescription: jobDescription.trim(),
                language,
                instructions: instructions.trim() || undefined,
            })

            setContent(response.content)
        } catch (error) {
            setGenerationError(
                error instanceof Error
                    ? error.message
                    : 'Something went wrong. Please try again.',
            )
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Create your cover letter</h1>
            <p className={styles.description}>
                Turn your experience into a tailored draft
                you can review and edit.
            </p>
            <div className={styles.workspace}>
                <section className={styles.panel} aria-labelledby="cover-letter-input-heading">
                    <h2 id="cover-letter-input-heading" className={styles.panelTitle}>
                        Your information
                    </h2>
                    <fieldset className={styles.sourceSelector}>
                        <legend className={styles.label}>CV source</legend>
                        <div className={styles.sourceOptions}>
                            <label className={styles.sourceOption}>
                                <input
                                    type="radio"
                                    name="cvSource"
                                    value="saved"
                                    checked={cvSource === 'saved'}
                                    onChange={() => setCvSource('saved')}
                                />
                                <span>Use saved CV</span>
                            </label>
                            <label className={styles.sourceOption}>
                                <input
                                    type="radio"
                                    name="cvSource"
                                    value="text"
                                    checked={cvSource === 'text'}
                                    onChange={() => setCvSource('text')}
                                />
                                <span>Paste CV text</span>
                            </label>
                        </div>
                    </fieldset>
                    {cvSource === 'text' && (
                        <div className={styles.field}>
                            <label htmlFor="cover-letter-cv">Your CV text</label>
                            <textarea
                                id="cover-letter-cv"
                                name="cvText"
                                rows={8}
                                maxLength={6000}
                                value={cvText}
                                placeholder="Paste your education, experience, projects, and skills."
                                onChange={(event) => setCvText(event.target.value)}
                                aria-describedby="cover-letter-cv-hint"
                            />
                            <span id="cover-letter-cv-hint" className={styles.fieldHint}>
                                Up to 6,000 characters.
                            </span>
                        </div>
                    )}
                    <div className={styles.field}>
                        <label htmlFor="cover-letter-job-description">Job description</label>
                        <textarea
                            id="cover-letter-job-description"
                            name="jobDescription"
                            rows={6}
                            maxLength={6000}
                            value={jobDescription}
                            onChange={(event) => setJobDescription(event.target.value)}
                            placeholder="Paste the job advertisement, including responsibilities and requirements."
                            aria-describedby="cover-letter-job-hint"
                            required
                        />
                        <span id="cover-letter-job-hint" className={styles.fieldHint}>
                            Up to 6,000 characters. Include the company and job title.
                        </span>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="cover-letter-language">Language</label>
                        <select
                            id="cover-letter-language"
                            name="language"
                            value={language}
                            onChange={(event) => {
                                const value = event.target.value

                                if (value === 'ENGLISH' || value === 'GERMAN') {
                                    setLanguage(value)
                                }
                            }}
                        >
                            <option value="ENGLISH">English</option>
                            <option value="GERMAN">German</option>
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="cover-letter-instructions">
                            Additional information and instructions (optional)
                        </label>
                        <textarea
                            id="cover-letter-instructions"
                            name="instructions"
                            rows={4}
                            maxLength={1000}
                            value={instructions}
                            onChange={(event) => setInstructions(event.target.value)}
                            placeholder="Focus on my Java project. Mention availability for 15 hours per week. Use three short paragraphs."
                            aria-describedby="cover-letter-instructions-hint"
                        />
                        <span
                            id="cover-letter-instructions-hint"
                            className={styles.fieldHint}
                        >
        Add missing facts, points to highlight, or your preferred
        structure. Up to 1,000 characters.
    </span>
                    </div>
                    {generationError && (
                        <p className={styles.errorMessage} role="alert">
                            {generationError}
                        </p>
                    )}
                    <button
                        type="button"
                        className={styles.generateButton}
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    >
                        {isGenerating ? 'Generating…' : 'Generate draft'}
                    </button>
                    {isGenerating && (
                        <p className={styles.fieldHint} role="status">
                            Creating your draft. The local model may take a moment.
                        </p>
                    )}
                </section>
                <section className={styles.panel} aria-labelledby="cover-letter-draft-heading">
                    <h2 id="cover-letter-draft-heading" className={styles.panelTitle}>
                        Your draft
                    </h2>
                    <div className={styles.field}>
                        <label htmlFor="cover-letter-content">Cover letter draft</label>
                        <textarea
                            id="cover-letter-content"
                            name="content"
                            rows={18}
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            placeholder="Your generated letter will appear here. You can edit it before using it."
                            aria-describedby="cover-letter-review-hint"
                        />
                        <span
                            id="cover-letter-review-hint"
                            className={styles.fieldHint}
                        >
                            Review the draft for accuracy before using it.
                        </span>
                    </div>
                </section>
            </div>
        </div>
    )
}