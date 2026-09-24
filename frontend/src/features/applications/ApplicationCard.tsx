import type { JobApplication } from './types'
import styles from "./ApplicationCard.module.css"
import { Link } from 'react-router'

interface ApplicationCardProps {
    application: JobApplication
}

export default function ApplicationCard({application}: ApplicationCardProps) {
    return (
        <li className={styles.applicationCard}>
            <h3>
                <Link to={`/applications/${application.id}`}>
                    {application.company}
                </Link>
            </h3>
            <p>{application.position}</p>
            <span className={styles.statusBadge}>{application.status}</span>
        </li>
    )
}