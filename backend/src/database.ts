import { TApplication, Tuser, Tjob } from "./types"

export const users: Tuser[] = []
export const jobs: Tjob[] = []
export const applications: TApplication[] = []

export function createJob(id: string, company: string, bootcamp: string, companyDescription: string, bootcampDescription: string) {
    const newJob: Tjob = {
        id,
        company,
        bootcamp,
        companyDescription,
        bootcampDescription,
        createdAt: new Date().toISOString()
    };
    jobs.push(newJob);
    console.log("Job created!");
}

export function createApplication(id: string, userId: string, jobId: string, status: string, cv: string) {
    const newApplication: TApplication = {
        id,
        userId,
        jobId,
        cv,
        status,
        appliedAt: new Date().toISOString()
    };
    applications.push(newApplication);
    console.log("Application created!");
}

export function updateUser(userId: string, updatedUser: Partial<Tuser>) {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
    }
}