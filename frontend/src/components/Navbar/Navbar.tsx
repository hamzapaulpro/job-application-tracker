import styles from "./Navbar.module.css"

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <a className={styles.brand} href="/">Job Tracker</a>

            <div className={styles.navLinks}>
                <a href="#applications">Applications</a>
                <a href="#about">About</a>
            </div>
        </nav>
    )
}