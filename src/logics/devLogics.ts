import { Request, Response } from "express";
import format from "pg-format";
import { DeveloperInfoRequest, DeveloperInfosResult, DeveloperRequest, DeveloperResult } from "../interfaces/devInterfaces";
import { client } from "../database"
import { QueryConfig } from "pg";

const createNewDeveloper = async (request: Request, response: Response) : Promise<Response> => {
    const developerData : DeveloperRequest = request.body;
    const query: string = format(`
        INSERT INTO
            developers (%I)
        VALUES 
            (%L)
        RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
    )
    const queryResult: DeveloperResult = await client.query(query)

    return response.status(201).json(queryResult.rows)
}

const createDeveloperInfo =async (request: Request, response: Response): Promise<Response> => {
    const developerData : DeveloperInfoRequest = request.body;
    const query: string = `
        INSERT INTO
            developer_infos ("developerSince", "preferredOS")
        VALUES 
            ($1, $2)
        RETURNING *;
    `
    const queryConfig: QueryConfig = {
        text: query,
        values: [developerData.developerSince, developerData.preferredOS.toUpperCase()]
    }
    const queryResult: DeveloperInfosResult = await client.query(queryConfig)

    return response.status(201).json(queryResult.rows)
}

export {
    createNewDeveloper,
    createDeveloperInfo
}