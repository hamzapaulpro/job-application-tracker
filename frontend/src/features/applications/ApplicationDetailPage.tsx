import { Link, useParams} from "react-router";
import { useEffect, useState } from 'react'
import type {JobApplication} from './types'
import { getApplication } from './api'
import styles from './ApplicationDetailPage.module.css'
import StatusHistory from './StatusHistory'

export default function ApplicationDetailPage() {
    const { id } = useParams()
    const [application, setApplication] = useState<JobApplication | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(
        () => {
        let ignore = false

        async function loadApplication() {
            setLoading(true)
            setError('')
            setApplication(null)

            if (!id) {
                setError('Application ID is missing')
                setLoading(false)
                return
            }

            try {
                const data = await getApplication(id)

                if (!ignore) {
                    setApplication(data)
                }
            } catch (error) {
                if (!ignore) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : 'Could not load the application',
                    )
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        }

        void loadApplication()

        return () => {
            ignore = true
        }
    }, [id])

    if (loading) {
        return <p role="status">Loading application…</p>
    }

    if (error) {
        return <p role="alert">{error}</p>
    }

    if (!application) {
        return <p>No application to display.</p>
    }

    return (
        <section className={styles.details}>
            <Link className={styles.backLink} to="/applications">← Back to applications</Link>
            <h1>{application.company}</h1>
            <p>{application.position}</p>
            <p>Status: {application.status}</p>
            <StatusHistory applicationId={String(application.id)} />
        </section>
    )
}