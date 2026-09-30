import styles from './AboutPage.module.css'

export default function AboutPage() {
    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <p className={styles.eyebrow}>About the project</p>
                    <h1>A project built from my own job search.</h1>
                    <p className={styles.introduction}>
                        Job Tracker brings application tracking, CV creation,
                        and cover-letter drafting into one place.
                    </p>
                </header>

                <section className={styles.card}>
                    <h2>Why I started</h2>
                    <p>
                        I’m Hamza Paul, a Business Informatics student at the
                        University of Augsburg. After learning Java during my
                        second semester, I wanted to apply what I had learned
                        to a problem I was experiencing myself.
                    </p>
                    <p>
                        While applying for working student positions, I needed
                        a better way to organize applications and track their
                        progress. I started building Job Tracker during the
                        semester break in 2026.
                    </p>
                    <p>
                        As the project developed, the idea grew beyond tracking:
                        I also wanted to make preparing CVs and writing cover
                        letters easier.
                    </p>
                </section>

                <section className={styles.card}>
                    <h2>What you can do</h2>
                    <ul className={styles.featureList}>
                        <li>
                            <strong>Track applications.</strong> Add applications,
                            search and filter them, update their details, and
                            view their status history.
                        </li>
                        <li>
                            <strong>Create a CV.</strong> Enter your details,
                            education, experience, and skills, preview the
                            document, and download it as a PDF.
                        </li>
                        <li>
                            <strong>Draft a cover letter.</strong> Use the
                            experimental AI feature to generate a draft from
                            CV text, a job description, and your instructions.
                            Review and edit the result before using it.
                        </li>
                    </ul>
                </section>

                <section className={styles.card}>
                    <h2>What I’m learning</h2>
                    <p>
                        I’m building the backend with Java and Spring Boot,
                        using PostgreSQL for application data. The frontend
                        uses React and TypeScript, with CSS that I write myself.
                    </p>
                    <p>
                        This project helps me practice API design, automated
                        testing, database migrations, Docker, and continuous
                        integration—as well as frontend design and accessibility.
                        I also use coding assistants to support my learning,
                        taking time to understand and test the changes.
                    </p>
                </section>

                <section className={styles.card}>
                    <h2>Where it’s going</h2>
                    <p>
                        The project is actively evolving. Next, I’m working on
                        allowing users to connect an external AI provider using
                        their own API key, alongside the existing local-model
                        integration.
                    </p>
                    <p>
                        My goal is to build a useful tool for students and job
                        seekers while improving my software engineering skills.
                        Feedback and suggestions are welcome.
                    </p>
                    <a
                        className={styles.projectLink}
                        href="https://github.com/hamzapaulpro/job-application-tracker"
                    >
                        Explore the project on GitHub →
                    </a>
                </section>
            </div>
        </div>
    )
}