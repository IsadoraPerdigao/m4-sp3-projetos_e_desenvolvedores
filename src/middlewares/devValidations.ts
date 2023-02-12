import { Request, Response, NextFunction } from "express"
import { QueryConfig } from "pg"
import { client } from "../database"
import { DeveloperInfoPatchBody, DeveloperResult, IDeveloper } from "../interfaces/devInterfaces"

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

const checkRequiredKeysDeveloper = (request: Request, response: Response, next: NextFunction): Response | void => {
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

const removeExtraKeysDeveloper = async (request: Request, response: Response, next: NextFunction) => {
    const developerInfoId = request.params.id
    const query = `
        SELECT 
            d."developerInfoId" 
        FROM 
            developers d
        WHERE 
            id = $1;
    `
    const queryConfig: QueryConfig = {
        text: query,
        values: [developerInfoId]
    }
    const queryResult: DeveloperResult = await client.query(queryConfig)  
    
    request.body = {
        name: request.body.name,
        email: request.body.email,
        developerInfoId: request.method === "POST" ? null : queryResult.rows[0].developerInfoId
    }

    return next()
}

const removeExtraKeysDeveloperUpdate = (request: Request, resopnse: Response, next: NextFunction) => {
    const posibleKeys = [
        "name",
        "email",
        "developerInfoId"
    ]

    let newBody : IDeveloper = {}
    
    Object.keys(request.body).forEach(key => {
        if (posibleKeys.includes(key as string)) {
            newBody[key as keyof IDeveloper] = request.body[key];
        }
    })

    request.body = newBody

    next()
}

const checkIfDeveloperExists = async (request: Request, response: Response, next: NextFunction)  => {
    const developerId = request.params.id ? request.params.id : request.body.developerId
    
    if(parseInt(developerId) != developerId) {
        return response.status(404).json({
            message: "Invalid developer id"
        })
    }

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

const checkIfDeveloperInfosExists = async (request: Request, response: Response, next: NextFunction) => {
    const developerId = request.params.id
    const checkDeveloperInfosQuery = `
        SELECT
            "developerInfoId"  
        FROM 
            developers 
        WHERE id = $1;
    `
    const checkDeveloperInfosQueryConfig: QueryConfig = {
        text: checkDeveloperInfosQuery,
        values: [developerId]
    }
    const checkDeveloperInfosQueryResult = await client.query(checkDeveloperInfosQueryConfig)

    if(checkDeveloperInfosQueryResult.rowCount > 0) {
        return response.status(400).json({
            message: "Developer infos already exists."
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

const checkValidOS = async (request: Request, response: Response, next: NextFunction) => {
    const requestOS = request.body.preferredOS
    const validOSQuery = `
        SELECT  UNNEST (enum_range(NULL::OS));
    `
    const validOSResult = await client.query(validOSQuery)
    const validOS = validOSResult.rows.map(os => {
        return os.unnest
    })

    if(!validOS.includes(requestOS)) {
        return response.status(400).json({
            message: "Invalid OS option.",
            options: [ "Windows", "Linux", "MacOS" ]
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

const removeExtraKeysDeveloperInfosUpdate = (request: Request, response: Response, next: NextFunction) => {
    let newBody : DeveloperInfoPatchBody = {}

    if (request.body.developerSince != undefined) {
        newBody.developerSince = request.body.developerSince
    }

    if (request.body.preferredOS != undefined) {
        newBody.preferredOS = request.body.preferredOS.toUpperCase()
    }

    request.body = newBody

    next()
}

const checkPosibleKeysUpdateDeveloper = (request: Request, response: Response, next: NextFunction) => {
    const requestKeys = Object.keys(request.body)

    if(!requestKeys.includes("name") && !requestKeys.includes("email")) {
        return response.status(400).json({
            "message": "At least one of those keys must be send.",
            "keys": [ "name", "email" ]
        })
    }

    return next()
}

const checkPosibleKeysUpdateDeveloperInfo = (request: Request, response: Response, next: NextFunction) => {
    const requestKeys = Object.keys(request.body)

    if(!requestKeys.includes("developerSince") && !requestKeys.includes("preferredOS")) {
        return response.status(400).json({
            "message": "At least one of those keys must be send.",
            "keys": [ "developerSince", "preferredOS" ]
        })
    }

    return next()
}

export { 
    checkRequiredKeysDeveloper,
    removeExtraKeysDeveloper,
    checkIfEmailExists,
    checkIfDeveloperExists,
    checkRequiredKeysDeveloperInfos,
    removeExtraKeysDeveloperInfos,
    checkPosibleKeysUpdateDeveloper,
    removeExtraKeysDeveloperInfosUpdate,
    checkPosibleKeysUpdateDeveloperInfo,
    checkValidOS,
    checkIfDeveloperInfosExists,
    removeExtraKeysDeveloperUpdate
}