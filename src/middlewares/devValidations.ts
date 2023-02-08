import { Request, Response, NextFunction } from "express"
import { QueryConfig } from "pg"
import { client } from "../database"

const checkIfEmailExists = async (request: Request, response: Response, next: NextFunction) => {
    const requestEmail = request.body.email
    const query = `
        SELECT 
            email
        FROM
            developers
        WHERE email = $1;
    `
    const queryConfig: QueryConfig = {
        text: query,
        values: [requestEmail]
    }
    const queryResult = await client.query(queryConfig)

    if(queryResult.rowCount > 0) {
        return response.status(409).json({
            message: "Email already exists!"
        })
    }    

    return next()
}

const checkRequiredKeysCreateDeveloper = (request: Request, response: Response, next: NextFunction): Response | void => {
    const requestKeys = Object.keys(request.body)
    
    if(!requestKeys.includes("name")) {
        return response.status(400).json({
            message: "Missing required key: name."
        })
    }

    if(!requestKeys.includes("email")) {
        return response.status(400).json({
            message: "Missing required key: email."
        })
    }

    return next()
}

const removeExtraKeysCreateDeveloper = (request: Request, response: Response, next: NextFunction) : void => {

    request.body = {
        name: request.body.name,
        email: request.body.email,
        developerInfoId: null
    }

    return next()
}

const checkIfDeveloperExists = async (request: Request, response: Response, next: NextFunction)  => {
    const developerId = request.params.id
    const query = `
        SELECT 
            * 
        FROM
            developers 
        WHERE id = $1;
    `
    const queryConfig: QueryConfig = {
        text: query,
        values: [developerId]
    }
    const queryResult = await client.query(queryConfig)
    
    if(queryResult.rowCount === 0) {
        return response.status(404).json({
            message: "Developer not found"
        })
    }

    return next()
}

const checkRequiredKeysDeveloperInfos = (request: Request, response: Response, next: NextFunction) => {
    const requestKeys = Object.keys(request.body)
    
    if(!requestKeys.includes("developerSince")) {
        return response.status(400).json({
            message: "Missing required key: developerSince."
        })
    }

    if(!requestKeys.includes("preferredOS")) {
        return response.status(400).json({
            message: "Missing required key: preferredOS."
        })
    }

    return next()
}

const removeExtraKeysDeveloperInfos = (request: Request, response: Response, next: NextFunction) => {
    
    request.body = {
        developerSince: request.body.developerSince,
        preferredOS: request.body.preferredOS
    }
    
    return next()
}

export { 
    checkRequiredKeysCreateDeveloper,
    removeExtraKeysCreateDeveloper,
    checkIfEmailExists,
    checkIfDeveloperExists,
    checkRequiredKeysDeveloperInfos,
    removeExtraKeysDeveloperInfos
}