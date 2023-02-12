import { QueryResult } from "pg"

interface IDeveloper {
    id?: number
    name?: string
    email?: string
    developerInfoId?: number | null
}

interface IDeveloperInfos {
    id: number
    developerSince: Date
    preferredOS: string
}

interface IDeveloperComplete extends IDeveloper {
    developerSince: Date
    preferredOS: string
}

type DeveloperResult = QueryResult<IDeveloper>
type DeveloperRequest = Omit<IDeveloper, "id" | "developerInfoId">
type DeveloperInfoRequest = Omit<IDeveloperInfos, "id">
type DeveloperInfosResult = QueryResult<IDeveloperInfos>
type DeveloperCompleteResult = QueryResult<IDeveloperComplete>
type DeveloperInfoPatchBody = {
    developerSince?: string
    preferredOS?: string
}

export {
    DeveloperRequest,
    IDeveloper,
    DeveloperResult,
    DeveloperInfoRequest,
    DeveloperInfosResult,
    DeveloperCompleteResult,
    DeveloperInfoPatchBody
}