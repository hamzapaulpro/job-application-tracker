import styles from "./ApplicationsPage.module.css"
import { useState } from 'react'
import ApplicationForm from "./ApplicationForm.tsx";

export default function ApplicationsPage() {
    const [showForm, setShowForm] = useState(false)

    return (
        <>
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Applications</h1>
                    <p className={styles.description}>
                        Keep track of your applications and their progress.
                    </p>
                </div>

                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Add application'}
                </button>
            </header>

            {showForm && <ApplicationForm />}
        </>
    )
}