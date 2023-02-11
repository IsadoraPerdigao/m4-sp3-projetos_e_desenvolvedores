import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";
import { DeveloperResult } from "../interfaces/devInterfaces"
import { IProject } from "../interfaces/projectsInterfaces";

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

    if(developerId) {
        const queryResult: DeveloperResult = await client.query(queryConfig)
    
        if(queryResult.rowCount === 0) {
            return response.status(404).json({
                message: "Developer not found"
            })
        }
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

const checkIfProjectExists = async (request: Request, response: Response, next: NextFunction) => {
    const projectId = request.params.id
    const query = `
        SELECT 
            *
        FROM
            projects
        WHERE
            id = $1
    `
    const queryConfig: QueryConfig = {
        text: query,
        values: [projectId]
    }
    const queryResult = await client.query(queryConfig)

    if(queryResult.rowCount === 0) {
        return response.status(404).json({
            message: "Project not found."
        })
    }
    
    return next()
}

const checkPosibleKeysUpdateProject = (request: Request, response: Response, next: NextFunction) => {
    const requestKeys = Object.keys(request.body)
    const posibleKeys = [
        "name",
        "description",
        "estimatedTime",
        "repository",
        "startDate",
        "endDate",
        "developerId"
    ]
    let hasPosibleKeys = posibleKeys.some( pK => {
        return requestKeys.includes(pK)
    })
    
    if(!hasPosibleKeys) {
        return response.status(400).json({
            message: "At least one of those keys must be send.",
            keys: `${posibleKeys}`
        })
    }

    return next()
}

const removeExtraKeysProjectUpdate = (request: Request, response: Response, next: NextFunction) => {

    const posibleKeys = [
        "name",
        "description",
        "estimatedTime",
        "repository",
        "startDate",
        "endDate",
        "developerId"
    ]

    let newBody : IProject = {}
    
    Object.keys(request.body).forEach(key => {
        if (posibleKeys.includes(key as string)) {
            newBody[key as keyof IProject] = request.body[key];
        }
    })

    request.body = newBody

    next()
}

export {
    checkIfProjectDeveloperExists,
    removeExtraKeysProject,
    checkRequiredKeysProjects,
    checkIfProjectExists,
    checkPosibleKeysUpdateProject,
    removeExtraKeysProjectUpdate
}