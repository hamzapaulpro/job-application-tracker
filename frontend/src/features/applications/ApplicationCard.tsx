import type { JobApplication } from './types'
import styles from "./ApplicationCard.module.css"

interface ApplicationCardProps {
    application: JobApplication
}

export default function ApplicationCard({application}: ApplicationCardProps) {
    return (
        <li className={styles.applicationCard}>
            <h3>{application.company}</h3>
            <p>{application.position}</p>
            <span className={styles.statusBadge}>{application.status}</span>
        </li>
    )
}