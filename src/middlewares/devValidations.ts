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

export { 
    checkRequiredKeysCreateDeveloper,
    removeExtraKeysCreateDeveloper,
    checkIfEmailExists
}