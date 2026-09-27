export type PersonalDetails = {
    fullName: string
    email: string
    phone: string
    city: string
    linkedin: string
    portfolio: string
}

export type EducationEntry = {
    id: string
    institution: string
    degree: string
    startDate: string
    endDate: string
}

export type ExperienceEntry = {
    id: string
    employer: string
    jobTitle: string
    startDate: string
    endDate: string
    description: string
}

export type ProjectEntry = {
    id: string
    name: string
    link: string
    description: string
    technologies: string
}

export type LanguageLevel =
    | ''
    | 'A1'
    | 'A2'
    | 'B1'
    | 'B2'
    | 'C1'
    | 'C2'
    | 'NATIVE'

export type LanguageEntry = {
    id: string
    name: string
    level: LanguageLevel
}