import express, { Application } from "express";
import { startDataBase } from "./database"
import { createDeveloperInfo, createNewDeveloper, deleteDeveloper, getSpecificDeveloper, listAllDevelopers, updateDeveloper, updateDeveloperInfo } from "./logics/devLogics"
import { checkIfDeveloperExists, checkIfDeveloperInfosExists, checkIfEmailExists, checkPosibleKeysUpdateDeveloper, checkPosibleKeysUpdateDeveloperInfo, checkRequiredKeysDeveloper, checkRequiredKeysDeveloperInfos, checkValidOS, removeExtraKeysDeveloper, removeExtraKeysDeveloperInfos, removeExtraKeysDeveloperInfosUpdate } from "./middlewares/devValidations"
import { createProject } from "./logics/projectsLogics"
import { checkIfProjectDeveloperExists, checkRequiredKeysProjects, removeExtraKeysProject } from "./middlewares/projectsMiddlewares"

const app: Application = express()
app.use(express.json())

app.post("/developers", checkIfEmailExists, checkRequiredKeysDeveloper, removeExtraKeysDeveloper, createNewDeveloper)
app.post("/developers/:id/infos", checkIfDeveloperExists, checkIfDeveloperInfosExists, checkRequiredKeysDeveloperInfos, checkValidOS, removeExtraKeysDeveloperInfos, createDeveloperInfo)
app.get("/developers", listAllDevelopers)
app.get("/developers/:id",checkIfDeveloperExists, getSpecificDeveloper)
app.patch("/developers/:id", checkIfDeveloperExists, checkPosibleKeysUpdateDeveloper, removeExtraKeysDeveloper, updateDeveloper)
app.patch("/developers/:id/infos", checkPosibleKeysUpdateDeveloperInfo, checkIfDeveloperExists, removeExtraKeysDeveloperInfosUpdate, updateDeveloperInfo)
app.delete("/developers/:id", checkIfDeveloperExists, deleteDeveloper)

app.post("/projects", checkRequiredKeysProjects, checkIfProjectDeveloperExists, removeExtraKeysProject, createProject)

app.listen(3000, async () => {
    await startDataBase()
    console.log("Server is running!")
})