import { Document, Page, StyleSheet, Text, Link, View } from '@react-pdf/renderer'
import type {PersonalDetails, EducationEntry, ExperienceEntry, ProjectEntry, LanguageEntry} from './types'

type CvDocumentProps = {
    personalDetails: PersonalDetails
    summary: string
    education: EducationEntry[]
    experience: ExperienceEntry[]
    projects: ProjectEntry[]
    skills: string
    languages: LanguageEntry[]
}

const styles = StyleSheet.create({
    projectLink: {
        fontSize: 9,
        lineHeight: 1.4,
        color: '#444444',
        textDecoration: 'underline',
        marginTop: 3,
    },
    technologies: {
        fontFamily: 'Times-Italic',
        fontSize: 10,
        lineHeight: 1.4,
        marginTop: 2,
        color: '#4b4b4b',
    },
    page: {
        padding: 40,
        fontFamily: 'Times-Roman',
        fontSize: 11,
        color: '#111111',
        backgroundColor: '#ffffff',
    },
    name: {
        fontFamily: 'Times-Bold',
        fontSize: 24,
        marginBottom: 8,
    },
    contact: {
        fontSize: 10,
        lineHeight: 1.4,
        marginBottom: 16,
    },
    links: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },
    link: {
        fontSize: 10,
        color: '#111111',
        textDecoration: 'underline',
    },
    section: {
        marginTop: 14,
    },
    sectionHeading: {
        fontFamily: 'Times-Bold',
        fontSize: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#777777',
        paddingBottom: 4,
        marginBottom: 6,
    },
    body: {
        fontSize: 11,
        lineHeight: 1.4,
    },
    entry: {
        marginBottom: 10,
    },
    entryTitle: {
        fontFamily: 'Times-Bold',
        fontSize: 11,
        lineHeight: 1.4,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },
    entryHeading: {
        flex: 1,
    },
    entryDate: {
        fontSize: 10,
        lineHeight: 1.4,
        textAlign: 'right',
    },
    bulletRow: {
        flexDirection: 'row',
        marginTop: 3,
    },
    bulletMarker: {
        width: 12,
        fontSize: 11,
        lineHeight: 1.4,
    },
    bulletText: {
        flex: 1,
        fontSize: 11,
        lineHeight: 1.4,
    },
})

function formatDateRange(startDate: string, endDate: string) {
    function formatMonth(value: string) {
        const [year, month] = value.split('-')
        return `${month}/${year}`
    }

    if (!startDate && !endDate) return ''

    if (!startDate) {
        return `Until ${formatMonth(endDate)}`
    }

    if (!endDate) {
        return `${formatMonth(startDate)} – Present`
    }

    return `${formatMonth(startDate)} – ${formatMonth(endDate)}`
}

function toBulletPoints(description: string) {
    return description
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line !== '')
}

export default function CvDocument({personalDetails, summary, education,
                                       experience, projects, skills, languages}: CvDocumentProps) {
    const contactDetails = [
        personalDetails.city,
        personalDetails.email,
        personalDetails.phone,
    ].map((value) => value.trim())
        .filter((value) => value !== '')
        .join('  |  ')
    const linkedin = personalDetails.linkedin.trim()
    const portfolio = personalDetails.portfolio.trim()
    const educationEntries = education.filter((entry) =>
        [
            entry.institution,
            entry.degree,
            entry.startDate,
            entry.endDate,
            entry.description,
        ].some((value) => value.trim() !== '')
    )
    const experienceEntries = experience.filter((entry) =>
        [
            entry.employer,
            entry.jobTitle,
            entry.startDate,
            entry.endDate,
            entry.description,
        ].some((value) => value.trim() !== '')
    )
    const projectEntries = projects.filter((entry) =>
        [
            entry.name,
            entry.link,
            entry.description,
            entry.technologies,
        ].some((value) => value.trim() !== ''),
    )
    const skillItems = skills
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill !== '')
    const languageItems = languages
        .filter((entry) => entry.name.trim() !== '')
        .map((entry) => {
            const name = entry.name.trim()
            const level = entry.level === 'NATIVE' ? 'Native' : entry.level

            return level ? `${name} (${level})` : name
        })


    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.name}>
                    {personalDetails.fullName.trim() || 'Your name'}
                </Text>
                {contactDetails && (
                    <Text style={styles.contact}>
                        {contactDetails}
                    </Text>
                )}
                {(linkedin || portfolio) && (
                    <View style={styles.links}>
                        {linkedin && (
                            <Link src={linkedin} style={styles.link}>
                                LinkedIn
                            </Link>
                        )}

                        {portfolio && (
                            <Link src={portfolio} style={styles.link}>
                                Portfolio / GitHub
                            </Link>
                        )}
                    </View>
                )}
                {summary.trim() && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeading} minPresenceAhead={30}>
                            SUMMARY
                        </Text>
                        <Text style={styles.body}>{summary.trim()}</Text>
                    </View>
                )}
                {educationEntries.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeading} minPresenceAhead={40}>
                            EDUCATION
                        </Text>

                        {educationEntries.map((entry) => {
                            const points = toBulletPoints(entry.description)

                            return (
                                <View key={entry.id} style={styles.entry}>
                                    <View
                                        wrap={false}
                                        minPresenceAhead={points.length > 0 ? 28 : 0}
                                    >
                                        <View style={styles.entryHeader}>
                                            <Text
                                                style={[styles.entryTitle, styles.entryHeading]}
                                            >
                                                {entry.degree.trim()}
                                            </Text>

                                            <Text style={styles.entryDate}>
                                                {formatDateRange(
                                                    entry.startDate,
                                                    entry.endDate,
                                                )}
                                            </Text>
                                        </View>

                                        {entry.institution.trim() && (
                                            <Text style={styles.body}>
                                                {entry.institution.trim()}
                                            </Text>
                                        )}
                                    </View>

                                    {points.map((point, index) => (
                                        <View key={index} style={styles.bulletRow}>
                                            <Text style={styles.bulletMarker}>•</Text>
                                            <Text style={styles.bulletText}>{point}</Text>
                                        </View>
                                    ))}
                                </View>
                            )
                        })}
                    </View>
                )}
                {experienceEntries.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeading} minPresenceAhead={30}>
                            EXPERIENCE
                        </Text>

                        {experienceEntries.map((entry) => (
                            <View key={entry.id} style={styles.entry}>
                                <View wrap={false}>
                                    <View style={styles.entryHeader}>
                                        <Text
                                            style={[styles.entryTitle, styles.entryHeading]}
                                        >
                                            {entry.jobTitle.trim()}
                                        </Text>

                                        <Text style={styles.entryDate}>
                                            {formatDateRange(entry.startDate, entry.endDate)}
                                        </Text>
                                    </View>

                                    {entry.employer.trim() && (
                                        <Text style={styles.body}>
                                            {entry.employer.trim()}
                                        </Text>
                                    )}
                                </View>
                                {toBulletPoints(entry.description).map((point, index) => (
                                    <View key={index} style={styles.bulletRow} wrap={false}>
                                        <Text style={styles.bulletMarker}>•</Text>
                                        <Text style={styles.bulletText}>{point}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}
                {projectEntries.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeading} minPresenceAhead={40}>
                            PROJECTS
                        </Text>

                        {projectEntries.map((entry) => (
                            <View key={entry.id} style={styles.entry}>
                                <View wrap={false}>
                                    {entry.name.trim() && (
                                        <Text style={styles.entryTitle}>
                                            {entry.name.trim()}
                                        </Text>
                                    )}

                                    {entry.technologies.trim() && (
                                        <Text style={styles.technologies}>
                                            {entry.technologies.trim()}
                                        </Text>
                                    )}
                                    {entry.link.trim() && (
                                        <Link src={entry.link.trim()} style={styles.projectLink}>
                                            {entry.link.trim()}
                                        </Link>
                                    )}
                                </View>
                                {toBulletPoints(entry.description).map((point, index) => (
                                    <View key={index} style={styles.bulletRow}>
                                        <Text style={styles.bulletMarker}>•</Text>
                                        <Text style={styles.bulletText}>{point}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}
                {skillItems.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeading} minPresenceAhead={30}>
                            SKILLS
                        </Text>

                        <Text style={styles.body}>
                            {skillItems.join(' • ')}
                        </Text>
                    </View>
                )}
                {languageItems.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeading} minPresenceAhead={30}>
                            LANGUAGES
                        </Text>

                        <Text style={styles.body}>
                            {languageItems.join(' • ')}
                        </Text>
                    </View>
                )}
            </Page>
        </Document>
    )
}