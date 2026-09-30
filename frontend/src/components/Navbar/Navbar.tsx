import styles from "./Navbar.module.css"
import {Link, NavLink} from "react-router";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Link className={styles.brand} to="/applications">Job Tracker</Link>

            <div className={styles.navLinks}>
                <NavLink
                    to="/applications"
                    className={({ isActive }) => (
                        isActive ? styles.activeLink : undefined
                    )}
                >
                    Applications
                </NavLink>

                <NavLink
                    to="/cv"
                    className={
                        ({isActive}) => (isActive ? styles.activeLink : undefined )
                    }
                >
                    Create CV
                </NavLink>
                <NavLink
                    to="/cover-letter/new"
                    className={
                        ({isActive}) => (isActive ? styles.activeLink : undefined )
                    }
                >
                    Cover Letter
                </NavLink>
                <a href="/about">About</a>
            </div>
        </nav>
    )
}