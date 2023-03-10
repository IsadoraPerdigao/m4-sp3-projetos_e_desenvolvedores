import { Request, Response } from "express";
import format from "pg-format";
import { DeveloperCompleteResult, DeveloperInfoRequest, DeveloperInfosResult, DeveloperRequest, DeveloperResult } from "../interfaces/devInterfaces";
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

    return response.status(201).json(queryResult.rows[0])
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
        LEFT JOIN
            developer_infos di 
        ON
            d."developerInfoId" = di.id;
    `
    const queryResult = await client.query(query)

    return response.status(200).json(queryResult.rows)
}

const getSpecificDeveloper = async (request: Request, response: Response): Promise<Response> => {
    const developerId = request.params.id
    const query = `
        SELECT 
            d.*,
            di."developerSince",
            di."preferredOS" 
        FROM
            developers d
        LEFT JOIN
            developer_infos di 
        ON
            d."developerInfoId" = di.id
        WHERE 
            d.id = $1;
`
const queryConfig: QueryConfig = {
    text: query,
    values: [developerId]
}
const queryResult: DeveloperCompleteResult = await client.query(queryConfig)

return response.status(200).json(queryResult.rows[0])
}

const getDeveloperProjects = async (request: Request, response: Response): Promise<Response> => {
    const developerId = request.params.id
    const query = `
        SELECT 
            p.id AS "projectId", 
            p.name AS "projectName",
            p.description AS "projectDescription",
            p."estimatedTime" ,
            p.repository ,
            p."startDate" ,
            p."endDate", 
            d.id AS "developerId",
            d."name" AS "developerName",
            d.email,
            d."developerInfoId",
            t.id AS "technologyId",
            t.name AS "technologyName"
        FROM 
            projects p 
        LEFT JOIN  
            developers d ON p."developerId" = d.id 
        LEFT JOIN  
            projects_technologies pt  ON  pt."projectId" = p.id 
        LEFT JOIN 
            technologies t ON pt."technologyId" = t.id 
        WHERE d.id = $1;
    `
    const queryConfig: QueryConfig = {
        text: query,
        values: [developerId]
    }
    const queryResult = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows)
}

const updateDeveloper = async (request: Request, response: Response): Promise<Response> => {
    const developerId = request.params.id
    const updateData = Object.values(request.body)
    const updateKeys = Object.keys(request.body)

    const query: string = format(
        `
        UPDATE  
            developers
        SET(%I) = ROW(%L)
        WHERE id = $1
        RETURNING *;
    `,
    updateKeys,
    updateData)

    const queryConfig: QueryConfig = {
        text: query,
        values: [developerId]
    }
    const queryResult : DeveloperResult = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows[0])
}

const updateDeveloperInfo = async (request: Request, response: Response): Promise<Response> => {
    const developerId = request.params.id
    const updateKeys = Object.keys(request.body)
    const updateData = Object.values(request.body)

    const getDeveloperInfoIdQuery = `
        SELECT 
            d."developerInfoId" 
        FROM 
            developers d 
        WHERE 
            id = $1;
    ` 
    const getDeveloperInfoIdQueryConfig: QueryConfig = {
        text: getDeveloperInfoIdQuery,
        values: [developerId]
    }

    const getDeveloperInfoIdQueryResult = await client.query(getDeveloperInfoIdQueryConfig)
    const developerInfoId = getDeveloperInfoIdQueryResult.rows[0].developerInfoId
    
    const updateQuery: string = format(
        `
        UPDATE  
            developer_infos
        SET(%I) = ROW(%L)
        WHERE id = $1
        RETURNING *;
    `,
    updateKeys,
    updateData)

    const queryConfig: QueryConfig = {
        text: updateQuery,
        values: [developerInfoId]
    }
    const queryResult : DeveloperInfosResult = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows[0])
}

const deleteDeveloper = async (request: Request, response: Response): Promise<Response> => {
    const developerId = request.params.id
    const selectDeveloperInfoQuery = `
        SELECT 
            "developerInfoId"
        FROM 
            developers d
        WHERE 
            id = $1;
    `
    const selectDeveloperInfoQueryConfig: QueryConfig = {
        text: selectDeveloperInfoQuery,
        values: [developerId]
    }
    const selectDeveloperInfoQueryResult = await client.query(selectDeveloperInfoQueryConfig)

    const developerInfoId: number = selectDeveloperInfoQueryResult.rows[0].developerInfoId
    const deleteDeveloperIfoQuery = `
        DELETE FROM
            developer_infos
        WHERE
            id = $1
    `
    const deleteDeveloperIfoQueryConfig: QueryConfig = {
        text: deleteDeveloperIfoQuery,
        values: [developerInfoId]
    } 
    
    if(developerInfoId) {
        await client.query(deleteDeveloperIfoQueryConfig)
    }
    
    const deleteDeveloperQuery = `
        DELETE FROM
            developers
        WHERE
            id = $1
    `
    const deleteDeveloperQueryConfig: QueryConfig = {
        text: deleteDeveloperQuery,
        values: [developerId]
    }
    
    await client.query(deleteDeveloperQueryConfig)

    return response.status(204).send()
}

export {
    createNewDeveloper,
    createDeveloperInfo,
    listAllDevelopers,
    getSpecificDeveloper,
    getDeveloperProjects,
    updateDeveloper,
    updateDeveloperInfo,
    deleteDeveloper
}