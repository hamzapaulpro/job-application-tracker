import styles from "./ApplicationsPage.module.css"
import { useEffect, useState } from 'react'
import ApplicationForm from "./ApplicationForm.tsx";
import type { ApplicationStatus, JobApplication } from './types'
import { getApplications } from './api'
import ApplicationCard from './ApplicationCard'

export default function ApplicationsPage() {

    const [showForm, setShowForm] = useState(false)
    const [applications, setApplications] = useState<JobApplication[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL')

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

    const query = searchTerm.trim().toLowerCase()
    const filteredApplications = applications.filter(
        (application) => {
        const matchesSearch =
            application.company.toLowerCase().includes(query) ||
            application.position.toLowerCase().includes(query)

        const matchesStatus = statusFilter === 'ALL' ||
            application.status === statusFilter

        return matchesSearch && matchesStatus
    })

    return (
        <>
            <header id="applications" className={styles.pageHeader}>
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

            <div className={styles.filters}>
                <div className={styles.searchField}>
                    <label htmlFor="application-search">Search applications</label>
                    <input
                        id="application-search"
                        type="search"
                        placeholder="Company or position"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>

                <div className={styles.statusFilter}>
                    <label htmlFor="status-filter">Filter by status</label>

                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value as ApplicationStatus | 'ALL')
                        }
                    >
                        <option value="ALL">All statuses</option>
                        <option value="APPLIED">Applied</option>
                        <option value="SCREENING">Screening</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFER">Offer</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="WITHDRAWN">Withdrawn</option>
                    </select>
                </div>

                <button
                    className={styles.clearButton}
                    type="button"
                    onClick={() => {
                        setSearchTerm('')
                        setStatusFilter('ALL')
                    }}
                    disabled={searchTerm === '' && statusFilter === 'ALL'}
                >
                    Clear filters
                </button>
            </div>

            {showForm && <ApplicationForm onApplicationCreated={handleApplicationCreated} />}
            {loading && <p role="status">Loading applications…</p>}

            {loadError && <p role="alert">{loadError}</p>}

            {!loading && !loadError && (
                <section>
                    <h2>
                        Your applications ({filteredApplications.length} of {applications.length})
                    </h2>

                    {
                        applications.length === 0 ?
                            (<p>No applications yet. Add your first one above.</p>)
                            : filteredApplications.length === 0 ?
                                (<p>No applications match your search and status filter.</p>)
                                : (<ul className={styles.applicationList}>
                                    {
                                        filteredApplications.map((application) => (
                                        <ApplicationCard
                                            key={application.id}
                                            application={application}
                                        />))
                                    }
                                    </ul>)
                    }
                </section>
            )}
        </>
    )
}