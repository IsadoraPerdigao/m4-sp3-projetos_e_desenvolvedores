import { QueryResult } from "pg"

interface IDeveloper {
    id: number,
    name: string
    email: string
    developerInfoId: number | null
}

type DeveloperResult = QueryResult<IDeveloper>
type DeveloperRequest = Omit<IDeveloper, "id" | "developerInfoId">

export {
    DeveloperRequest,
    IDeveloper,
    DeveloperResult
}