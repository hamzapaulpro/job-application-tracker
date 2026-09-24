import styles from "./ApplicationsPage.module.css"
import { useEffect, useState } from 'react'
import ApplicationForm from "./ApplicationForm.tsx";
import type { JobApplication } from './types'
import { getApplications } from './api'
import ApplicationCard from './ApplicationCard'

export default function ApplicationsPage() {

    const [showForm, setShowForm] = useState(false)
    const [applications, setApplications] = useState<JobApplication[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(
        () => {
            let ignore = false

            async function loadApplications() {
                try {
                    const data = await getApplications()

                    if (!ignore) {
                        setApplications(data)
                    }
                } catch (error) {
                    if (!ignore) {
                        setLoadError(
                            error instanceof Error ? error.message : 'Could not load applications',
                        )
                    }
                } finally {
                    if (!ignore) {
                        setLoading(false)
                    }
                }
            }

            void loadApplications()
            return () => {ignore = true}
        }
    , [])

    function handleApplicationCreated(application: JobApplication) {
        setApplications((currentApplications) => [
            ...currentApplications,
            application,
        ])

        setShowForm(false)
        setSuccessMessage(`Application saved for ${application.company}.`)
    }

    function handleToggleForm() {
        setSuccessMessage('')
        setShowForm((currentlyOpen) => !currentlyOpen)
    }

    return (
        <>
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Applications</h1>
                    <p className={styles.description}>
                        Keep track of your applications and their progress.
                    </p>
                </div>

                <button
                    type="button"
                    className={styles.addButton}
                    onClick={handleToggleForm}
                >
                    {showForm ? 'Cancel' : 'Add application'}
                </button>
            </header>
            {successMessage && (
                <p role="status" className={styles.successMessage}>
                    {successMessage}
                </p>
            )}
            {showForm && <ApplicationForm onApplicationCreated={handleApplicationCreated} />}
            {loading && <p role="status">Loading applications…</p>}

            {loadError && <p role="alert">{loadError}</p>}

            {!loading && !loadError && (
                <section>
                    <h2>Your applications ({applications.length})</h2>

                    {applications.length === 0 ? (
                        <p>No applications yet. Add your first one above.</p>
                    ) : (
                        <ul className={styles.applicationList}>
                            {applications.map((application) => (
                                <ApplicationCard
                                    key={application.id}
                                    application={application}
                                />
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </>
    )
}