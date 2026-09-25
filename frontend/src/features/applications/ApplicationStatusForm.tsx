import type { ApplicationStatus, JobApplication } from './types'
import { useState } from 'react'
import { updateApplicationStatus } from './api'
import styles from './ApplicationStatusForm.module.css'

interface ApplicationStatusFormProps {
    currentStatus: ApplicationStatus
    applicationId: number
    onStatusUpdated: (application: JobApplication) => void
}

export default function ApplicationStatusForm({currentStatus, applicationId, onStatusUpdated}: ApplicationStatusFormProps) {
    const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(currentStatus)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    async function handleUpdate() {
        setIsSaving(true)
        setError('')
        setSuccessMessage('')

        try {
            const updatedApplication = await updateApplicationStatus(
                applicationId,
                selectedStatus,
            )

            onStatusUpdated(updatedApplication)
            setSuccessMessage('Status updated successfully.')
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Could not update status',
            )
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className={styles.statusForm}>
            <label htmlFor="application-status">{currentStatus}</label>

            <select
                id="application-status"
                value={selectedStatus}
                disabled={isSaving}
                onChange={
                (event) =>
                    {
                        setSelectedStatus(event.target.value as ApplicationStatus)
                        setSuccessMessage('')
                        setError('')
                    }
                }
            >
                <option value="APPLIED">Applied</option>
                <option value="SCREENING">Screening</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
                <option value="WITHDRAWN">Withdrawn</option>
            </select>

            <button
                className={styles.updateButton}
                type="button"
                disabled={isSaving || selectedStatus === currentStatus}
                onClick={handleUpdate}
            >
                {isSaving ? 'Updating…' : 'Update status'}
            </button>
            {successMessage && (
                <p role="status" className={styles.successMessage}>
                    {successMessage}
                </p>
            )}
            {error && <p role="alert">{error}</p>}
        </div>
    )
}