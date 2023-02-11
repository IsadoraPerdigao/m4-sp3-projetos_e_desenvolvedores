import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import { ProjectRequest, ProjectResult, ProjectTechnologiesResult } from "../interfaces/projectsInterfaces"

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

const listAllProjects = async (request: Request, response: Response): Promise<Response> => {
    const query = `
        SELECT 
            p.id AS "projectId",
            p.name AS "projectName",
            p.description AS "projectDescription",
            p."estimatedTime" AS "projectEstimatedTime",
            p.repository AS "projectRepository",
            p."startDate" AS "projectStartDate",
            p."endDate" AS "projectEndDate",
            p."developerId" AS "projectDeveloperId",
            t.id AS "technologyId",
            t.name AS "technologyName"	
        FROM 
            projects p 
        LEFT JOIN 
            projects_technologies pt 
        ON 
            pt."projectId" = p.id 
        LEFT JOIN
            technologies t 
        ON 
            pt."technologyId" = t.id;
    `
    const queryResult: ProjectTechnologiesResult = await client.query(query)
    
    return response.status(200).json(queryResult.rows)
}

const getSpecificProject = async (request: Request, response: Response): Promise<Response> => {
    const projectId = request.params.id;
    const query = `
        SELECT 
            p.id AS "projectId",
            p.name AS "projectName",
            p.description AS "projectDescription",
            p."estimatedTime" AS "projectEstimatedTime",
            p.repository AS "projectRepository",
            p."startDate" AS "projectStartDate",
            p."endDate" AS "projectEndDate",
            p."developerId" AS "projectDeveloperId",
            t.id AS "technologyId",
            t.name AS "technologyName"	
        FROM 
            projects p 
        LEFT JOIN  projects_technologies pt  ON  pt."projectId" = p.id 
        LEFT JOIN technologies t ON pt."technologyId" = t.id
        WHERE 
            p.id = $1;
    `
    const queryConfig: QueryConfig = {
        text: query,
        values: [projectId]
    }
    const queryResult: ProjectTechnologiesResult = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows)
}

const updateProject = async (request: Request, response: Response) => {
    const projectId = request.params.id
    const updateData = Object.values(request.body)
    const updateKeys = Object.keys(request.body)

    const query: string = format(
        `
        UPDATE  
            projects
        SET(%I) = ROW(%L)
        WHERE id = $1
        RETURNING *;
    `,
    updateKeys,
    updateData)

    const queryConfig: QueryConfig = {
        text: query,
        values: [projectId]
    }
    const queryResult : ProjectResult = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows[0])
}

export {
    createProject,
    listAllProjects,
    getSpecificProject,
    updateProject
}