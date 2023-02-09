import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";
import { DeveloperResult } from "../interfaces/devInterfaces"

const checkIfProjectDeveloperExists = async (request: Request, response: Response, next: NextFunction) => {
    const developerId = request.body.developerId
    const query = `
        SELECT 
            *
        FROM
            developers
        WHERE
            id = $1
    `
    const queryConfig: QueryConfig = {
        text: query,
        values: [developerId]
    }
    const queryResult: DeveloperResult = await client.query(queryConfig)

    if(queryResult.rowCount === 0) {
        return response.status(404).json({
            message: "Developer not found"
        })
    }
    
    return next()
}

const removeExtraKeysProject = (request: Request, response: Response, next: NextFunction) => {
    let requestBody = request.body
    
    if(request.body.endDate) {
        request.body = {
            name: requestBody.name,
            description: requestBody.description,
            estimatedTime: requestBody.estimatedTime,
            repository: requestBody.repository,
            startDate: requestBody.startDate,
            endDate: requestBody.endDate,
            developerId: requestBody.developerId
        }
    } else {
        request.body = {
            name: requestBody.name,
            description: requestBody.description,
            estimatedTime: requestBody.estimatedTime,
            repository: requestBody.repository,
            startDate: requestBody.startDate,
            developerId: requestBody.developerId
        }
    }   
    
    return next()
}

const checkRequiredKeysProjects = (request: Request, response: Response, next: NextFunction) => {
    const requiredKeys = ["name", "description", "estimatedTime", "repository", "startDate", "developerId"]
    const requestKeys = Object.keys(request.body)

    let hasRequiredKeys = true

    requiredKeys.forEach(key => {
        if(!requestKeys.includes(key)){
            hasRequiredKeys = false;
        }
    })

    if(!hasRequiredKeys) {
        return response.status(400).json({
            message: `Missing required keys: ${requiredKeys}.`
        })
    }

    return next()
}

export {
    checkIfProjectDeveloperExists,
    removeExtraKeysProject,
    checkRequiredKeysProjects
}