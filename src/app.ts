import express, { Application } from "express";
import { startDataBase } from "./database"
import { createDeveloperInfo, createNewDeveloper, listAllDevelopers } from "./logics/devLogics"
import { checkIfDeveloperExists, checkIfEmailExists, checkRequiredKeysCreateDeveloper, checkRequiredKeysDeveloperInfos, removeExtraKeysCreateDeveloper, removeExtraKeysDeveloperInfos } from "./middlewares/devValidations"

const app: Application = express()
app.use(express.json())

app.post("/developers", checkIfEmailExists, checkRequiredKeysCreateDeveloper, removeExtraKeysCreateDeveloper, createNewDeveloper)
app.post("/developers/:id/infos", checkIfDeveloperExists, checkRequiredKeysDeveloperInfos, removeExtraKeysDeveloperInfos, createDeveloperInfo)
app.get("/developers", listAllDevelopers)

app.listen(3000, async () => {
    await startDataBase()
    console.log("Server is running!")
})