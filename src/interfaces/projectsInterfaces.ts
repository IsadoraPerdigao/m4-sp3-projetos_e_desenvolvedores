import { QueryResult } from "pg"

interface IProject {
    id?: number
    name?: string
    description?: string
    estimatedTime?: string
    repository?: string
    startDate?: Date
    endDate?: Date
    developerId?: number
}

interface IProjectTechnologies extends IProject {
    technologyId: number
    technologyName: string
}

type ProjectRequest = Omit<IProject, "id">
type ProjectResult = QueryResult<IProject>
type ProjectTechnologiesResult = QueryResult<IProjectTechnologies>

export {
    ProjectRequest,
    ProjectResult,
    ProjectTechnologiesResult,
    IProject
}
