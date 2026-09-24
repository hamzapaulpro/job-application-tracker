import styles from "./ApplicationForm.module.css"
import {useState} from "react";
import type { SubmitEvent } from 'react'
import { createApplication, ApplicationValidationError } from './api'
import type { ValidationErrorResponse } from './types'

export default function ApplicationForm() {
    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [fieldErrors, setFieldErrors] = useState<ValidationErrorResponse['fieldErrors']>({})

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setSuccessMessage('')
        setIsSaving(true)
        setFieldErrors({})

        try {
            const application = await createApplication(company, position)
            setSuccessMessage(`Application saved for ${application.company}!`)

            setCompany('')
            setPosition('')
        } catch (error) {
            if (error instanceof ApplicationValidationError) {
                setFieldErrors(error.fieldErrors)
                setErrorMessage(error.message)
            } else {
                setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
            }
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.field}>
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text"
                       placeholder="Example Company"
                       value={company}
                       required
                       maxLength={150}
                       aria-invalid={Boolean(fieldErrors.company)}
                       aria-describedby={fieldErrors.company ? 'company-error' : undefined}
                       onChange={(event) => setCompany(event.target.value)}
                />
                {fieldErrors.company && (
                    <p id="company-error" className={styles.errorMessage}>
                        {fieldErrors.company}
                    </p>
                )}
            </div>

            <div className={styles.field}>
                <label htmlFor="position">Position</label>
                <input
                    id="position"
                    name="position"
                    type="text"
                    placeholder="Working Student Java Developer"
                    value={position}
                    aria-invalid={Boolean(fieldErrors.position)}
                    aria-describedby={fieldErrors.position ? 'position-error' : undefined}
                    onChange={(event) => setPosition(event.target.value)}
                />
                {fieldErrors.position && (
                    <p id="position-error" className={styles.errorMessage}>
                        {fieldErrors.position}
                    </p>
                )}
            </div>

            <button type="submit"
                    className={styles.submitButton}
                    disabled={isSaving}
            >{isSaving ? 'Saving…' : 'Save application'}</button>

            {successMessage && (
                <p className={styles.successMessage} role="status">
                    {successMessage}
                </p>
            )}

            {errorMessage && (
                <p className={styles.errorMessage} role="alert">
                    {errorMessage}
                </p>
            )}
        </form>
    )
}