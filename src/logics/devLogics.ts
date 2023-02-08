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
    const developerId = request.params.id
    const insertQuery: string = `
        INSERT INTO
            developer_infos ("developerSince", "preferredOS")
        VALUES 
            ($1, $2)
        RETURNING *;
    `
    const insertQueryConfig: QueryConfig = {
        text: insertQuery,
        values: [developerData.developerSince, developerData.preferredOS.toUpperCase()]
    }
    const queryResult: DeveloperInfosResult = await client.query(insertQueryConfig)
    const updateQuery: string = `
        UPDATE 
            developers
        SET 
            "developerInfoId" = $1
        WHERE 
            "id" = $2
    `
    const updateQueryConfig: QueryConfig = {
        text: updateQuery,
        values: [queryResult.rows[0].id, developerId]
    }

    await client.query(updateQueryConfig)

    return response.status(201).json(queryResult.rows[0])
}

const listAllDevelopers = async (request: Request, response: Response): Promise<Response> => {
    const query = `
        SELECT 
            d.*,
            di."developerSince",
            di."preferredOS" 
        FROM
            developers d
        JOIN
            developer_infos di 
        ON
            d."developerInfoId" = di.id;
    `
    const queryResult = await client.query(query)

    return response.status(200).json(queryResult.rows)
}

export {
    createNewDeveloper,
    createDeveloperInfo,
    listAllDevelopers
}