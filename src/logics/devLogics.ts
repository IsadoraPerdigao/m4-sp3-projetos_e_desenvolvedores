import { Request, Response } from "express";
import format from "pg-format";
import { DeveloperRequest, DeveloperResult } from "../interfaces/devInterfaces";
import { client } from "../database"

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

export {
    createNewDeveloper
}