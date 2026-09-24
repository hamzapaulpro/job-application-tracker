import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer id="about" className={styles.footer}>
            <p>Job Tracker — Organize your next career move.</p>

            <a href="https://github.com/hamzapaulpro/job-application-tracker">
                View project on GitHub
            </a>
        </footer>
    )
}