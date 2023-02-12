import express, { Application } from "express";
import { startDataBase } from "./database"
import { createDeveloperInfo, createNewDeveloper, deleteDeveloper, getDeveloperProjects, getSpecificDeveloper, listAllDevelopers, updateDeveloper, updateDeveloperInfo } from "./logics/devLogics"
import { checkIfDeveloperExists, checkIfDeveloperInfosExists, checkIfEmailExists, checkPosibleKeysUpdateDeveloper, checkPosibleKeysUpdateDeveloperInfo, checkRequiredKeysDeveloper, checkRequiredKeysDeveloperInfos, checkValidOS, removeExtraKeysDeveloper, removeExtraKeysDeveloperInfos, removeExtraKeysDeveloperInfosUpdate, removeExtraKeysDeveloperUpdate } from "./middlewares/devValidations"
import { createProject, createTechnologyToProject, deleteProject, deleteTechnologyFromProject, getSpecificProject, listAllProjects, updateProject } from "./logics/projectsLogics"
import {  checkIfProjectExists, checkIfTechIsInProject, checkPosibleKeysUpdateProject, checkPosibleValuesTechnologies, checkRequiredKeysProjects, removeExtraKeysProject, removeExtraKeysProjectUpdate, removeExtraKeysTechnology } from "./middlewares/projectsValidations"

const app: Application = express()
app.use(express.json())

app.post("/developers", checkIfEmailExists, checkRequiredKeysDeveloper, removeExtraKeysDeveloper, createNewDeveloper)
app.post("/developers/:id/infos", checkIfDeveloperExists, checkIfDeveloperInfosExists, checkRequiredKeysDeveloperInfos, checkValidOS, removeExtraKeysDeveloperInfos, createDeveloperInfo)
app.get("/developers", listAllDevelopers)
app.get("/developers/:id",checkIfDeveloperExists, getSpecificDeveloper)
app.get("/developers/:id/projects", checkIfDeveloperExists, getDeveloperProjects)
app.patch("/developers/:id", checkIfDeveloperExists, checkPosibleKeysUpdateDeveloper, removeExtraKeysDeveloperUpdate, updateDeveloper)
app.patch("/developers/:id/infos", checkPosibleKeysUpdateDeveloperInfo, checkIfDeveloperExists, removeExtraKeysDeveloperInfosUpdate, updateDeveloperInfo)
app.delete("/developers/:id", checkIfDeveloperExists, deleteDeveloper)

app.post("/projects", checkRequiredKeysProjects, checkIfDeveloperExists, removeExtraKeysProject, createProject)
app.post("/projects/:id/technologies", checkIfProjectExists, removeExtraKeysTechnology, checkPosibleValuesTechnologies, createTechnologyToProject)
app.get("/projects", listAllProjects)
app.get("/projects/:id", checkIfProjectExists, getSpecificProject)
app.patch("/projects/:id", checkIfProjectExists, checkIfDeveloperExists, removeExtraKeysProjectUpdate, checkPosibleKeysUpdateProject, updateProject)
app.delete("/projects/:id", checkIfProjectExists, deleteProject)
app.delete("/projects/:id/technologies/:name", checkIfProjectExists, checkPosibleValuesTechnologies, checkIfTechIsInProject, deleteTechnologyFromProject)



app.listen(3000, async () => {
    await startDataBase()
    console.log("Server is running!")
})