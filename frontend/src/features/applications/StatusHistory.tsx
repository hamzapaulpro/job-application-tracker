import { useEffect, useState } from 'react'
import type { ApplicationStatusHistory } from './types'
import {getApplicationHistory} from "./api.ts";
import styles from './StatusHistory.module.css'

interface StatusHistoryProps {
    applicationId: string
}

export default function StatusHistory({applicationId}: StatusHistoryProps) {
    const [history, setHistory] = useState<ApplicationStatusHistory[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let ignore = false

        async function loadHistory() {
            setLoading(true)
            setError('')
            setHistory([])

            try {
                const data = await getApplicationHistory(applicationId)

                if (!ignore) {
                    setHistory(data)
                }
            } catch (error) {
                if (!ignore) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : 'Could not load application history',
                    )
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        }

        void loadHistory()

        return () => {
            ignore = true
        }
    }, [applicationId])

    return (
        <section>
            <h2>Status history</h2>
            {loading && <p role="status">Loading history…</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && !error && (
                history.length === 0 ? (<p>No status changes yet.</p>) :
                    (<ol className={styles.timeline}>{
                        history.map((entry) => (
                            <li key={entry.id} className={styles.entry}>
                                <p>
                                    {entry.previousStatus} → {entry.newStatus}
                                </p>

                                <time dateTime={entry.changedAt}>
                                    {new Date(entry.changedAt).toLocaleString()}
                                </time>
                            </li>)
                        )
                    }</ol>)
            )}
        </section>
    )
}