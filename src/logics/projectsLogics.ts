import { Request, Response } from "express";
import format from "pg-format";
import { client } from "../database";
import { ProjectRequest, ProjectResult } from "../interfaces/projectsInterfaces"

const createProject = async (request: Request, response: Response): Promise<Response> => {
    const projectData: ProjectRequest = request.body;
    const query: string = format(`
        INSERT INTO
            projects (%I)
        VALUES 
            (%L)
        RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
    )
    const queryResult: ProjectResult = await client.query(query)

    return response.status(201).json(queryResult.rows[0])
}

export {
    createProject
}