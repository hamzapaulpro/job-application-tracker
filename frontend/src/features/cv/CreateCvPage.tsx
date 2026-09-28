import styles from './CreateCvPage.module.css'
import { useEffect, useMemo, useState } from 'react'
import type {
    PersonalDetails,
    EducationEntry,
    ExperienceEntry,
    ProjectEntry,
    LanguageEntry,
    LanguageLevel
} from './types'
import { BlobProvider } from '@react-pdf/renderer'
import CvPreview from './CvPreview'
import CvDocument from './CvDocument'

function hasEducationContent(entry: EducationEntry) {
    return [
        entry.institution,
        entry.degree,
        entry.startDate,
        entry.endDate,
        entry.description
    ].some((value) => value.trim() !== '')
}

function hasExperienceContent(entry: ExperienceEntry) {
    return [
        entry.employer,
        entry.jobTitle,
        entry.startDate,
        entry.endDate,
        entry.description,
    ].some((value) => value.trim() !== '')
}

function hasProjectContent(entry: ProjectEntry) {
    return [
        entry.name,
        entry.link,
        entry.description,
        entry.technologies,
    ].some((value) => value.trim() !== '')
}

function isLanguageLevel(value: string): value is LanguageLevel {
    return (
        value === '' ||
        value === 'A1' ||
        value === 'A2' ||
        value === 'B1' ||
        value === 'B2' ||
        value === 'C1' ||
        value === 'C2' ||
        value === 'NATIVE'
    )
}

function hasLanguageContent(entry: LanguageEntry) {
    return entry.name.trim() !== '' || entry.level !== ''
}

export default function CreateCvPage() {
    const [activeSection, setActiveSection] = useState('personal-details')
    const [saveError, setSaveError] = useState('')
    const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(() => {
        const details: PersonalDetails = {
            fullName: '',
            email: '',
            phone: '',
            city: '',
            linkedin: '',
            portfolio: '',
        }

        try {
            const saved = localStorage.getItem('jobtracker.cv.personalDetails')

            if (!saved) return details

            const parsed: unknown = JSON.parse(saved)

            if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
                return details
            }

            for (const key of Object.keys(details) as Array<keyof PersonalDetails>) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                if (key in parsed && typeof parsed[key] === 'string') {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    details[key] = parsed[key]
                }
            }

        } catch {
            // Keep the form usable when browser storage is unavailable.
        }

        return details
    })
    const [summary, setSummary] = useState(() => {
        try {
            return localStorage.getItem('jobtracker.cv.summary') ?? ''
        } catch {
            return ''
        }
    })
    const [education, setEducation] = useState<EducationEntry[]>(() => {
        try {
            const saved = localStorage.getItem('jobtracker.cv.education')

            if (saved) {
                const parsed: unknown = JSON.parse(saved)

                if (
                    Array.isArray(parsed) &&
                    parsed.every(
                        (entry) =>
                            typeof entry === 'object' &&
                            entry !== null &&
                            typeof entry.id === 'string' &&
                            typeof entry.institution === 'string' &&
                            typeof entry.degree === 'string' &&
                            typeof entry.startDate === 'string' &&
                            typeof entry.endDate === 'string'
                    )
                ) {
                    const entries: EducationEntry[] = parsed
                        .map((entry) => ({
                            id: entry.id,
                            institution: entry.institution,
                            degree: entry.degree,
                            startDate: entry.startDate,
                            endDate: entry.endDate,
                            description:
                                typeof entry.description === 'string'
                                    ? entry.description
                                    : '',
                        }))
                        .filter(hasEducationContent)

                    if (entries.length > 0) {
                        return entries
                    }
                }
            }
        } catch {
            // Use an empty entry if saved data cannot be read.
        }

        return [
            {
                id: crypto.randomUUID(),
                institution: '',
                degree: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ]
    })
    const [experience, setExperience] = useState<ExperienceEntry[]>(() => {
        try {
            const saved = localStorage.getItem('jobtracker.cv.experience')

            if (saved) {
                const parsed: unknown = JSON.parse(saved)

                if (
                    Array.isArray(parsed) &&
                    parsed.every(
                        (entry) =>
                            typeof entry === 'object' &&
                            entry !== null &&
                            typeof entry.id === 'string' &&
                            typeof entry.employer === 'string' &&
                            typeof entry.jobTitle === 'string' &&
                            typeof entry.startDate === 'string' &&
                            typeof entry.endDate === 'string' &&
                            typeof entry.description === 'string'
                    )
                ) {
                    const entries = parsed.filter(hasExperienceContent)

                    if (entries.length > 0) {
                        return entries
                    }
                }
            }
        } catch {
            // Use an empty entry if saved data cannot be read.
        }

        return [
            {
                id: crypto.randomUUID(),
                employer: '',
                jobTitle: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ]
    })
    const [projects, setProjects] = useState<ProjectEntry[]>(() => {
        try {
            const saved = localStorage.getItem('jobtracker.cv.projects')

            if (saved) {
                const parsed: unknown = JSON.parse(saved)

                if (
                    Array.isArray(parsed) &&
                    parsed.every(
                        (entry) =>
                            typeof entry === 'object' &&
                            entry !== null &&
                            typeof entry.id === 'string' &&
                            typeof entry.name === 'string' &&
                            typeof entry.link === 'string' &&
                            typeof entry.description === 'string' &&
                            typeof entry.technologies === 'string'
                    )
                ) {
                    const entries = parsed.filter(hasProjectContent)

                    if (entries.length > 0) {
                        return entries
                    }
                }
            }
        } catch {
            // Use an empty entry if saved data cannot be read.
        }

        return [
            {
                id: crypto.randomUUID(),
                name: '',
                link: '',
                description: '',
                technologies: '',
            },
        ]
    })
    const [skills, setSkills] = useState(() => {
        try {
            return localStorage.getItem('jobtracker.cv.skills') ?? ''
        } catch {
            return ''
        }
    })
    const [languages, setLanguages] = useState<LanguageEntry[]>(() => {
        try {
            const saved = localStorage.getItem('jobtracker.cv.languages')

            if (saved) {
                const parsed: unknown = JSON.parse(saved)

                if (
                    Array.isArray(parsed) &&
                    parsed.every(
                        (entry) =>
                            typeof entry === 'object' &&
                            entry !== null &&
                            typeof entry.id === 'string' &&
                            typeof entry.name === 'string' &&
                            typeof entry.level === 'string' &&
                            isLanguageLevel(entry.level)
                    )
                ) {
                    const entries = parsed.filter(hasLanguageContent)

                    if (entries.length > 0) {
                        return entries
                    }
                }
            }
        } catch {
            // Use an empty entry if saved data cannot be read.
        }

        return [
            {
                id: crypto.randomUUID(),
                name: '',
                level: '',
            },
        ]
    })
    const cvData = useMemo(
        () => ({
            personalDetails,
            summary,
            education,
            experience,
            projects,
            skills,
            languages,
        }),
        [
            personalDetails,
            summary,
            education,
            experience,
            projects,
            skills,
            languages,
        ],
    )
    const [previewData, setPreviewData] = useState(cvData)
    const previewDocument = useMemo(
        () => <CvDocument {...previewData} />,
        [previewData],
    )

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setPreviewData(cvData)
        }, 500)

        return () => window.clearTimeout(timeoutId)
    }, [cvData])


    function updatePersonalDetails(field: keyof PersonalDetails, value: string) {
        const updated = {...personalDetails, [field]: value}

        setPersonalDetails(updated)

        try {
            localStorage.setItem(
                'jobtracker.cv.personalDetails',
                JSON.stringify(updated)
            )
            setSaveError('')
        } catch {
            setSaveError('Your changes could not be saved in this browser.')
        }
    }
    function updateSummary(value: string) {
        setSummary(value)

        try {
            localStorage.setItem('jobtracker.cv.summary', value)
            setSaveError('')
        } catch {
            setSaveError('Your changes could not be saved in this browser.')
        }
    }
    function updateEducation(id: string, field: keyof Omit<EducationEntry, 'id'>, value: string) {
        const updated = education.map((entry) =>
            entry.id === id
                ? { ...entry, [field]: value }
                : entry
        )

        setEducation(updated)

        try {
            localStorage.setItem('jobtracker.cv.education', JSON.stringify(updated.filter(hasEducationContent)))
            setSaveError('')
        } catch {
            setSaveError('Your changes could not be saved in this browser.')
        }
    }
    function addEducation() {
        const updated = [
            ...education,
            {
                id: crypto.randomUUID(),
                institution: '',
                degree: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ]

        setEducation(updated)

        try {
            localStorage.setItem(
                'jobtracker.cv.education',
                JSON.stringify(updated.filter(hasEducationContent))
            )
            setSaveError('')
        } catch {
            setSaveError('Your changes could not be saved in this browser.')
        }
    }
    function removeEducation(id: string) {
        const updated = education.filter((entry) => entry.id !== id)

        setEducation(updated)

        try {
            localStorage.setItem(
                'jobtracker.cv.education',
                JSON.stringify(updated.filter(hasEducationContent))
            )
            setSaveError('')
        } catch {
            setSaveError('Your changes could not be saved in this browser.')
        }
    }

    function updateExperience(id: string, field: keyof Omit<ExperienceEntry, 'id'>, value: string) {
        const updated = experience.map((entry) =>
            entry.id === id
                ? { ...entry, [field]: value }
                : entry
        )

        setExperience(updated)

        try {
            localStorage.setItem(
                'jobtracker.cv.experience',
                JSON.stringify(updated.filter(hasExperienceContent))
            )
            setSaveError('')
        } catch {
            setSaveError('Your changes could not be saved in this browser.')
        }
    }

    function addExperience() {
        const updated = [
            ...experience,
            {
                id: crypto.randomUUID(),
                employer: '',
                jobTitle: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ]

        setExperience(updated)

        try {
            localStorage.setItem(
                'jobtracker.cv.experience',
                JSON.stringify(updated.filter(hasExperienceContent))
            )
            setSaveError('')
        } catch {
            setSaveError('Your changes could not be saved in this browser.')
        }
    }

    function removeExperience(id: string) {
        const updated = experience.filter((entry) => entry.id !== id)

        setExperience(updated)

        try {
            localStorage.setItem(
                'jobtracker.cv.experience',
                JSON.stringify(updated.filter(hasExperienceContent))
            )
            setSaveError('')
        } catch {
            setSaveError('Your changes could not be saved in this browser.')
        }
    }

    function updateProject(id: string, field: keyof Omit<ProjectEntry, 'id'>, value: string) {
        const updated = projects.map((entry) =>
            entry.id === id
                ? { ...entry, [field]: value }
                : entry
        )

        setProjects(updated)

        try {
            localStorage.setItem(
                'jobtracker.cv.projects',
                JSON.stringify(updated.filter(hasProjectContent))
            )
            setSaveError('')
        } catch {
            setSaveError('Your changes could not be saved in this browser.')
        }
    }

    function removeProject(id: string) {
        const updated = projects.filter((entry) => entry.id !== id)

        setProjects(updated)

        try {
            localStorage.setItem(
                'jobtracker.cv.projects',
                JSON.stringify(updated.filter(hasProjectContent))
            )
            setSaveError('')
        } catch {
            setSaveError('Your changes could not be saved in this browser.')
        }
    }

    function updateSkills(value: string) {
        setSkills(value)

        try {
            localStorage.setItem('jobtracker.cv.skills', value)
            setSaveError('')
        } catch {
            setSaveError('Your changes could not be saved in this browser.')
        }
    }

    function updateLanguage(id: string, changes: Partial<Omit<LanguageEntry, 'id'>>) {
        const updated = languages.map((entry) =>
            entry.id === id
                ? { ...entry, ...changes }
                : entry
        )

        setLanguages(updated)

        try {
            localStorage.setItem(
                'jobtracker.cv.languages',
                JSON.stringify(updated.filter(hasLanguageContent))
            )
            setSaveError('')
        } catch {
            setSaveError('Your changes could not be saved in this browser.')
        }
    }

    function addLanguage() {
        const updated: LanguageEntry[] = [
            ...languages,
            {
                id: crypto.randomUUID(),
                name: '',
                level: '',
            },
        ]

        setLanguages(updated)

        try {
            localStorage.setItem(
                'jobtracker.cv.languages',
                JSON.stringify(updated.filter(hasLanguageContent))
            )
            setSaveError('')
        } catch {
            setSaveError('Your changes could not be saved in this browser.')
        }
    }

    function removeLanguage(id: string) {
        const updated = languages.filter((entry) => entry.id !== id)

        setLanguages(updated)

        try {
            localStorage.setItem(
                'jobtracker.cv.languages',
                JSON.stringify(updated.filter(hasLanguageContent))
            )
            setSaveError('')
        } catch {
            setSaveError('Your changes could not be saved in this browser.')
        }
    }

    return (
        <div className={styles.page}>

            <h1 className={styles.title}>
                Create your CV
            </h1>

            <p className={styles.description}>
                Add your details, preview your CV, and download a PDF.
            </p>

            <div className={styles.builder}>
                <aside className={styles.sectionSidebar}>
                    <nav aria-label="CV sections" className={styles.sectionNav}>
                        <h2 className={styles.sectionNavTitle}>Sections</h2>

                        <button
                            type="button"
                            className={
                                activeSection === 'personal-details'
                                    ? styles.activeSection
                                    : undefined
                            }
                            aria-pressed={activeSection === 'personal-details'}
                            onClick={() => setActiveSection('personal-details')}
                        >
                            Personal details
                        </button>

                        <button
                            type="button"
                            className={
                                activeSection === 'summary'
                                    ? styles.activeSection
                                    : undefined
                            }
                            aria-pressed={activeSection === 'summary'}
                            onClick={() => setActiveSection('summary')}
                        >
                            Summary
                        </button>

                        <button
                            type="button"
                            className={
                                activeSection === 'education'
                                    ? styles.activeSection
                                    : undefined
                            }
                            aria-pressed={activeSection === 'education'}
                            onClick={() => setActiveSection('education')}
                        >
                            Education
                        </button>

                        <button
                            type="button"
                            className={
                                activeSection === 'experience'
                                    ? styles.activeSection
                                    : undefined
                            }
                            aria-pressed={activeSection === 'experience'}
                            onClick={() => setActiveSection('experience')}
                        >
                            Experience
                        </button>

                        <button
                            type="button"
                            className={
                                activeSection === 'projects'
                                    ? styles.activeSection
                                    : undefined
                            }
                            aria-pressed={activeSection === 'projects'}
                            onClick={() => setActiveSection('projects')}
                        >
                            Projects
                        </button>

                        <button
                            type="button"
                            className={
                                activeSection === 'skills'
                                    ? styles.activeSection
                                    : undefined
                            }
                            aria-pressed={activeSection === 'skills'}
                            onClick={() => setActiveSection('skills')}
                        >
                            Skills
                        </button>

                        <button
                            type="button"
                            className={
                                activeSection === 'languages'
                                    ? styles.activeSection
                                    : undefined
                            }
                            aria-pressed={activeSection === 'languages'}
                            onClick={() => setActiveSection('languages')}
                        >
                            Languages
                        </button>
                    </nav>
                </aside>

                <div className={styles.formSections}>
                    {saveError && <p role="alert">{saveError}</p>}
                    <section
                        id="personal-details"
                        className={styles.section}
                        aria-labelledby="personal-details-heading"
                        hidden={activeSection !== 'personal-details'}
                    >
                        <h2
                            id="personal-details-heading"
                            className={styles.sectionTitle}
                        >
                            Personal details
                        </h2>

                        <div className={styles.fields}>
                            <div className={styles.field}>
                                <label htmlFor="full-name">Full name</label>
                                <input
                                    id="full-name"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="e.g. Alex Morgan"
                                    value={personalDetails.fullName}
                                    onChange={(event) =>
                                        updatePersonalDetails('fullName', event.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="e.g. alex@example.com"
                                    required
                                    value={personalDetails.email}
                                    onChange={(event) =>
                                        updatePersonalDetails('email', event.target.value)}
                                />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="phone">Phone (optional)</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    placeholder="e.g. +49 170 1234567"
                                    value={personalDetails.phone}
                                    onChange={(event) =>
                                        updatePersonalDetails('phone', event.target.value)
                                    }
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="city">City (optional)</label>
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    autoComplete="address-level2"
                                    placeholder="e.g. Augsburg"
                                    value={personalDetails.city}
                                    onChange={(event) =>
                                        updatePersonalDetails('city', event.target.value)
                                    }
                                />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="linkedin">LinkedIn (optional)</label>
                                <input
                                    id="linkedin"
                                    name="linkedin"
                                    type="url"
                                    placeholder="https://www.linkedin.com/in/yourname"
                                    value={personalDetails.linkedin}
                                    onChange={(event) =>
                                        updatePersonalDetails('linkedin', event.target.value)
                                    }
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="portfolio">Portfolio / GitHub (optional)</label>
                                <input
                                    id="portfolio"
                                    name="portfolio"
                                    type="url"
                                    placeholder="https://github.com/yourname"
                                    value={personalDetails.portfolio}
                                    onChange={(event) =>
                                        updatePersonalDetails('portfolio', event.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    <section
                        id="summary"
                        className={styles.section}
                        aria-labelledby="summary-heading"
                        hidden={activeSection !== 'summary'}
                    >
                        <h2 id="summary-heading" className={styles.sectionTitle}>
                            Summary
                        </h2>

                        <div className={styles.field}>
                            <textarea
                                id="summary-text"
                                name="summary"
                                rows={5}
                                placeholder="Briefly describe your skills, experience, and career goals."
                                value={summary}
                                onChange={(event) => updateSummary(event.target.value)}
                            />
                        </div>
                    </section>

                    <section
                        id="education"
                        className={styles.section}
                        aria-labelledby="education-heading"
                        hidden={activeSection !== 'education'}
                    >
                        <h2 id="education-heading" className={styles.sectionTitle}>
                            Education
                        </h2>

                        {education.map((entry) => (
                            <div key={entry.id} className={styles.entryCard}>

                                <div className={styles.entryActions}>
                                    <button
                                        type="button"
                                        className={styles.removeEntryButton}
                                        onClick={() => removeEducation(entry.id)}
                                        aria-label={`Remove education${entry.institution ? ` at ${entry.institution}` : ''}`}
                                        title="Remove education"
                                    >
                                        <svg
                                            width="18"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M9 6V4h6v2" />
                                            <path d="M5 6l1 14h12l1-14" />
                                            <path d="M10 10v6M14 10v6" />
                                        </svg>
                                    </button>
                                </div>

                                <div className={styles.fields}>
                                    <div className={styles.field}>
                                        <label htmlFor={`institution-${entry.id}`}>Institution</label>
                                        <input
                                            id={`institution-${entry.id}`}
                                            name="institution"
                                            type="text"
                                            placeholder="e.g. University of Augsburg"
                                            value={entry.institution}
                                            onChange={(event) =>
                                                updateEducation(entry.id, 'institution', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor={`degree-${entry.id}`}>Degree</label>
                                        <input
                                            id={`degree-${entry.id}`}
                                            name="degree"
                                            type="text"
                                            placeholder="e.g. B.Sc. Computer Science"
                                            value={entry.degree}
                                            onChange={(event) =>
                                                updateEducation(entry.id, 'degree', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor={`education-start-${entry.id}`}>Start date</label>
                                        <input
                                            id={`education-start-${entry.id}`}
                                            name="educationStart"
                                            type="month"
                                            value={entry.startDate}
                                            onChange={(event) =>
                                                updateEducation(entry.id, 'startDate', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor={`education-end-${entry.id}`}>End date (optional)</label>
                                        <input
                                            id={`education-end-${entry.id}`}
                                            name="educationEnd"
                                            type="month"
                                            value={entry.endDate}
                                            onChange={(event) =>
                                                updateEducation(entry.id, 'endDate', event.target.value)
                                            }
                                            aria-describedby="education-end-hint"
                                        />
                                        <span id={`education-end-hint-${entry.id}`} className={styles.fieldHint}>
                                    Leave empty if you are currently studying here.
                                </span>
                                    </div>
                                </div>

                                <div className={`${styles.field} ${styles.descriptionField}`}>
                                    <label htmlFor={`education-description-${entry.id}`}>
                                        Description (optional)
                                    </label>
                                    <textarea
                                        id={`education-description-${entry.id}`}
                                        name="educationDescription"
                                        rows={4}
                                        placeholder="Add relevant coursework, achievements, or your thesis."
                                        value={entry.description}
                                        onChange={(event) =>
                                            updateEducation(entry.id, 'description', event.target.value)
                                        }
                                        aria-describedby={`education-description-hint-${entry.id}`}
                                    />
                                    <span
                                        id={`education-description-hint-${entry.id}`}
                                        className={styles.fieldHint}
                                    >
        Write one point per line.
    </span>
                                </div>
                            </div>

                        ))}
                        <button
                            type="button"
                            className={`${styles.secondaryButton} ${styles.addEntryButton}`}
                            onClick={addEducation}
                        >
                            + Add education
                        </button>
                    </section>

                    <section
                        id="experience"
                        className={styles.section}
                        aria-labelledby="experience-heading"
                        hidden={activeSection !== 'experience'}
                    >
                        <h2 id="experience-heading" className={styles.sectionTitle}>
                            Experience
                        </h2>
                        {experience.map((entry) => (
                            <div key={entry.id} className={styles.entryCard}>
                                <div className={styles.entryActions}>
                                    <button
                                        type="button"
                                        className={styles.removeEntryButton}
                                        onClick={() => removeExperience(entry.id)}
                                        aria-label={`Remove experience${entry.employer ? ` at ${entry.employer}` : ''}`}
                                        title="Remove experience"
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M9 6V4h6v2" />
                                            <path d="M5 6l1 14h12l1-14" />
                                            <path d="M10 10v6M14 10v6" />
                                        </svg>
                                    </button>
                                </div>
                                <div className={styles.fields}>
                                    <div className={styles.field}>
                                        <label htmlFor={`employer-${entry.id}`}>Employer</label>
                                        <input
                                            id={`employer-${entry.id}`}
                                            name="employer"
                                            type="text"
                                            placeholder="e.g. Example Company"
                                            value={entry.employer}
                                            onChange={(event) =>
                                                updateExperience(entry.id, 'employer', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor={`job-title-${entry.id}`}>Job title</label>
                                        <input
                                            id={`job-title-${entry.id}`}
                                            name="jobTitle"
                                            type="text"
                                            placeholder="e.g. Working Student Developer"
                                            value={entry.jobTitle}
                                            onChange={(event) =>
                                                updateExperience(entry.id, 'jobTitle', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor={`experience-start-${entry.id}`}>Start date</label>
                                        <input
                                            id={`experience-start-${entry.id}`}
                                            name="experienceStart"
                                            type="month"
                                            value={entry.startDate}
                                            onChange={(event) =>
                                                updateExperience(entry.id, 'startDate', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor={`experience-end-${entry.id}`}>End date (optional)</label>
                                        <input
                                            id={`experience-end-${entry.id}`}
                                            name="experienceEnd"
                                            type="month"
                                            value={entry.endDate}
                                            onChange={(event) =>
                                                updateExperience(entry.id, 'endDate', event.target.value)
                                            }
                                            aria-describedby={`experience-end-hint-${entry.id}`}
                                        />
                                        <span id={`experience-end-hint-${entry.id}`} className={styles.fieldHint}>
                                    Leave empty if you currently work here.
                                </span>
                                    </div>
                                </div>
                                <div className={`${styles.field} ${styles.descriptionField}`}>
                                    <label htmlFor={`experience-description-${entry.id}`}>
                                        Responsibilities and achievements
                                    </label>
                                    <textarea
                                        id={`experience-description-${entry.id}`}
                                        name="experienceDescription"
                                        rows={4}
                                        placeholder="Describe your responsibilities and contributions."
                                        value={entry.description}
                                        onChange={(event) =>
                                            updateExperience(entry.id, 'description', event.target.value)
                                        }
                                        aria-describedby={`experience-description-hint-${entry.id}`}
                                    />
                                    <span
                                        id={`experience-description-hint-${entry.id}`}
                                        className={styles.fieldHint}
                                    >
                                Write one point per line.
                            </span>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className={`${styles.secondaryButton} ${styles.addEntryButton}`}
                            onClick={addExperience}
                        >
                            + Add experience
                        </button>
                    </section>

                    <section
                        id="projects"
                        className={styles.section}
                        aria-labelledby="projects-heading"
                        hidden={activeSection !== 'projects'}
                    >
                        <h2 id="projects-heading" className={styles.sectionTitle}>
                            Projects
                        </h2>

                        <p className={styles.sectionDescription}>
                            Showcase personal, academic, or professional projects.
                        </p>

                        {projects.map((entry) => (
                            <div key={entry.id} className={styles.entryCard}>
                                <div className={styles.entryActions}>
                                    <button
                                        type="button"
                                        className={styles.removeEntryButton}
                                        onClick={() => removeProject(entry.id)}
                                        aria-label={`Remove project${entry.name ? `: ${entry.name}` : ''}`}
                                        title="Remove project"
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M9 6V4h6v2" />
                                            <path d="M5 6l1 14h12l1-14" />
                                            <path d="M10 10v6M14 10v6" />
                                        </svg>
                                    </button>
                                </div>
                                <div className={styles.fields}>
                                    <div className={styles.field}>
                                        <label htmlFor={`project-name-${entry.id}`}>Project name</label>
                                        <input
                                            id={`project-name-${entry.id}`}
                                            name="projectName"
                                            type="text"
                                            placeholder="e.g. Job Application Tracker"
                                            value={entry.name}
                                            onChange={(event) =>
                                                updateProject(entry.id, 'name', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor={`project-link-${entry.id}`}>Project link (optional)</label>
                                        <input
                                            id={`project-link-${entry.id}`}
                                            name="projectLink"
                                            type="url"
                                            placeholder="https://github.com/yourname/project"
                                            value={entry.link}
                                            onChange={(event) =>
                                                updateProject(entry.id, 'link', event.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className={`${styles.field} ${styles.descriptionField}`}>
                                    <label htmlFor={`project-description-${entry.id}`}>
                                        Description
                                    </label>
                                    <textarea
                                        id={`project-description-${entry.id}`}
                                        name="projectDescription"
                                        rows={4}
                                        placeholder="Describe what you built, your contribution, and the result."
                                        value={entry.description}
                                        onChange={(event) =>
                                            updateProject(entry.id, 'description', event.target.value)
                                        }
                                        aria-describedby={`project-description-hint-${entry.id}`}
                                    />
                                    <span
                                        id={`project-description-hint-${entry.id}`}
                                        className={styles.fieldHint}
                                    >
                                Write one point per line.
                            </span>
                                </div>
                                <div className={`${styles.field} ${styles.descriptionField}`}>
                                    <label htmlFor={`project-technologies-${entry.id}`}>
                                        Technologies
                                    </label>
                                    <input
                                        id={`project-technologies-${entry.id}`}
                                        name="projectTechnologies"
                                        type="text"
                                        placeholder="e.g. Java, Spring Boot, React, PostgreSQL"
                                        value={entry.technologies}
                                        onChange={(event) =>
                                            updateProject(entry.id, 'technologies', event.target.value)
                                        }
                                        aria-describedby={`project-technologies-hint-${entry.id}`}
                                    />
                                    <span
                                        id={`project-technologies-hint-${entry.id}`}
                                        className={styles.fieldHint}
                                    >
                                Separate technologies with commas.
                            </span>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section
                        id="skills"
                        className={styles.section}
                        aria-labelledby="skills-heading"
                        hidden={activeSection !== 'skills'}
                    >
                        <h2 id="skills-heading" className={styles.sectionTitle}>
                            Skills
                        </h2>

                        <p className={styles.sectionDescription}>
                            Include skills relevant to the roles you are applying for.
                        </p>

                        <div className={`${styles.field} ${styles.descriptionField}`}>
                            <label htmlFor="skills-list">Your skills</label>
                            <textarea
                                id="skills-list"
                                name="skills"
                                rows={3}
                                placeholder="e.g. Java, SQL, Git, Communication"
                                aria-describedby="skills-hint"
                                value={skills}
                                onChange={(event) => updateSkills(event.target.value)}
                            />
                            <span id="skills-hint" className={styles.fieldHint}>
                                Separate skills with commas.
                            </span>
                        </div>
                    </section>

                    <section
                        id="languages"
                        className={styles.section}
                        aria-labelledby="languages-heading"
                        hidden={activeSection !== 'languages'}
                    >
                        <h2 id="languages-heading" className={styles.sectionTitle}>
                            Languages
                        </h2>

                        <p className={styles.sectionDescription}>
                            List the languages you speak and your proficiency.
                        </p>

                        {languages.map((entry) => (
                            <div key={entry.id} className={styles.entryCard}>
                                <div className={styles.entryActions}>
                                    <button
                                        type="button"
                                        className={styles.removeEntryButton}
                                        onClick={() => removeLanguage(entry.id)}
                                        aria-label={`Remove language${entry.name ? `: ${entry.name}` : ''}`}
                                        title="Remove language"
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M9 6V4h6v2" />
                                            <path d="M5 6l1 14h12l1-14" />
                                            <path d="M10 10v6M14 10v6" />
                                        </svg>
                                    </button>
                                </div>
                                <div className={styles.fields}>
                                    <div className={styles.field}>
                                        <label htmlFor={`language-name-${entry.id}`}>Language</label>
                                        <input
                                            id={`language-name-${entry.id}`}
                                            name="languageName"
                                            type="text"
                                            placeholder="e.g. German"
                                            value={entry.name}
                                            onChange={(event) =>
                                                updateLanguage(entry.id, { name: event.target.value })
                                            }
                                        />
                                    </div>

                                    <div className={styles.field}>
                                        <label htmlFor={`language-level-${entry.id}`}>Proficiency</label>
                                        <select
                                            id={`language-level-${entry.id}`}
                                            name="languageLevel"
                                            value={entry.level}
                                            onChange={(event) => {
                                                const value = event.target.value

                                                if (isLanguageLevel(value)) {
                                                    updateLanguage(entry.id, { level: value })
                                                }
                                            }}
                                        >
                                            <option value="">Select a level</option>
                                            <option value="A1">A1 — Beginner</option>
                                            <option value="A2">A2 — Elementary</option>
                                            <option value="B1">B1 — Intermediate</option>
                                            <option value="B2">B2 — Upper intermediate</option>
                                            <option value="C1">C1 — Advanced</option>
                                            <option value="C2">C2 — Proficient</option>
                                            <option value="NATIVE">Native</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className={`${styles.secondaryButton} ${styles.addEntryButton}`}
                            onClick={addLanguage}
                        >
                            + Add language
                        </button>
                    </section>
                </div>

                <aside className={styles.previewPanel} aria-labelledby="preview-heading">
                    <BlobProvider document={previewDocument}>
                        {({ url, loading, error }) => {
                            const isUpdating = cvData !== previewData || loading
                            const canDownload = Boolean(url) && !isUpdating && !error

                            function downloadPdf() {
                                if (!url || !canDownload) return

                                const link = document.createElement('a')
                                link.href = url
                                link.download = 'CV.pdf'

                                document.body.appendChild(link)
                                link.click()
                                link.remove()
                            }

                            return (
                                <>
                                    <div className={styles.previewHeader}>
                                        <h2
                                            id="preview-heading"
                                            className={styles.sectionTitle}
                                        >
                                            CV preview
                                        </h2>

                                        <div className={styles.previewActions}>
                                            <button
                                                type="button"
                                                className={styles.primaryButton}
                                                disabled={!canDownload}
                                                onClick={downloadPdf}
                                            >
                                                Download PDF
                                            </button>
                                        </div>
                                    </div>

                                    {error ? (
                                        <p role="alert">
                                            The CV could not be generated.
                                        </p>
                                    ) : (
                                        <>
                                            {(isUpdating || !url) && (
                                                <p role="status">Updating preview…</p>
                                            )}

                                            {!loading && url && (
                                                <CvPreview url={url} />
                                            )}
                                        </>
                                    )}
                                </>
                            )
                        }}
                    </BlobProvider>
                </aside>
            </div>
        </div>
    )
}