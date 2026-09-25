import { useState } from 'react'
import type { JobApplication, ValidationErrorResponse } from './types'
import styles from './EditApplicationForm.module.css'
import type { SubmitEvent } from 'react'
import { ApplicationValidationError, updateApplicationDetails } from './api'

interface EditApplicationFormProps {
    application: JobApplication
    onDetailsUpdated: (application: JobApplication) => void
}

export default function EditApplicationForm({application, onDetailsUpdated}: EditApplicationFormProps) {
    const [company, setCompany] = useState(application.company)
    const [position, setPosition] = useState(application.position)
    const [isSaving, setIsSaving] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [fieldErrors, setFieldErrors] = useState<ValidationErrorResponse['fieldErrors']>({})

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSaving(true)
        setFieldErrors({})
        setErrorMessage("")

        try {
            const updatedApplication = await updateApplicationDetails(
                application.id,
                company,
                position,
            )
            onDetailsUpdated(updatedApplication)
        } catch (error) {
            if (error instanceof ApplicationValidationError) {
                setFieldErrors(error.fieldErrors)
                setErrorMessage(error.message)
            } else {
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'Could not update application details',
                )
            }
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.field}>
                <label htmlFor="edit-company">Company</label>
                <input
                    id="edit-company"
                    type="text"
                    value={company}
                    disabled={isSaving}
                    aria-invalid={Boolean(fieldErrors.company)}
                    aria-describedby={fieldErrors.company ? 'edit-company-error' : undefined}
                    onChange={(event) => setCompany(event.target.value)}
                    required
                    maxLength={150}
                />
                {fieldErrors.company && (
                    <p id="edit-company-error" className={styles.errorMessage}>
                        {fieldErrors.company}
                    </p>
                )}
            </div>

            <div className={styles.field}>
                <label htmlFor="edit-position">Position</label>
                <input
                    id="edit-position"
                    type="text"
                    value={position}
                    disabled={isSaving}
                    aria-invalid={Boolean(fieldErrors.position)}
                    aria-describedby={fieldErrors.position ? 'edit-position-error' : undefined}
                    onChange={(event) => setPosition(event.target.value)}
                    required
                    maxLength={150}
                />
                {fieldErrors.position && (
                    <p id="edit-position-error" className={styles.errorMessage}>
                        {fieldErrors.position}
                    </p>
                )}
            </div>

            <button
                className={styles.saveButton}
                type="submit" disabled={isSaving}
            >
                {isSaving ? 'Saving…' : 'Save changes'}
            </button>
            {errorMessage && (
                <p className={styles.errorMessage} role="alert">
                    {errorMessage}
                </p>
            )}
        </form>
    )
}