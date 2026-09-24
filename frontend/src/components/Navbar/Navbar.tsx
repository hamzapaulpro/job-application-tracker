import styles from "./Navbar.module.css"
import {Link} from "react-router";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Link className={styles.brand} to="/applications">Job Tracker</Link>

            <div className={styles.navLinks}>
                <Link to={"/applications"}>Applications</Link>
                <a href="#about">About</a>
            </div>
        </nav>
    )
}