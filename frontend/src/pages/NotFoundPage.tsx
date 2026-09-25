import { Link } from 'react-router'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
    return (
        <section className={styles.page}>
            <h1>Page not found</h1>
            <p>The page you’re looking for doesn’t exist.</p>

            <Link to="/applications">Back to applications</Link>
        </section>
    )
}