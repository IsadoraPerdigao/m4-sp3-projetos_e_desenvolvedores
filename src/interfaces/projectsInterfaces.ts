import { QueryResult } from "pg"

interface IProject {
    id: number
    name: string
    description: string
    estimatedTime: string
    repository: string
    startDate: Date
    endDate?: Date
    developerId: number
}

type ProjectRequest = Omit<IProject, "id">
type ProjectResult = QueryResult<IProject>

export {
    ProjectRequest,
    ProjectResult
}
