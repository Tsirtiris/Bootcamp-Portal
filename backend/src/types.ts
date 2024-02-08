export type Tuser = {
    id: string,
    name: string,
    email: string,
    password: string,
    lastName: string,
    city: string,
    workExperience: string,
    education: string,
    profilePhoto: string,
    createdAt: string,
    bio: string
}

export type Tjob = {
    id: string,
    company: string,
    bootcamp: string,
    companyDescription: string,
    bootcampDescription: string,
    createdAt: string,
}

export type TApplication = {
    id: string,
    userId: string,
    jobId: string,
    cv: string,
    status: string,
    appliedAt: string,
}