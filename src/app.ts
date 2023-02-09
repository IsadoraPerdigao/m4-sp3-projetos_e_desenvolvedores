import express, { Application } from "express";
import { startDataBase } from "./database"
import { createDeveloperInfo, createNewDeveloper, getSpecificDeveloper, listAllDevelopers, updateDeveloper, updateDeveloperInfo } from "./logics/devLogics"
import { checkIfDeveloperExists, checkIfEmailExists, checkPosibleKeysUpdateDeveloper, checkPosibleKeysUpdateDeveloperInfo, checkRequiredKeysDeveloper, checkRequiredKeysDeveloperInfos, removeExtraKeysDeveloper, removeExtraKeysDeveloperInfos, removeExtraKeysDeveloperInfosUpdate } from "./middlewares/devValidations"

const app: Application = express()
app.use(express.json())

app.post("/developers", checkIfEmailExists, checkRequiredKeysDeveloper, removeExtraKeysDeveloper, createNewDeveloper)
app.post("/developers/:id/infos", checkIfDeveloperExists, checkRequiredKeysDeveloperInfos, removeExtraKeysDeveloperInfos, createDeveloperInfo)
app.get("/developers", listAllDevelopers)
app.get("/developers/:id",checkIfDeveloperExists, getSpecificDeveloper)
app.patch("/developers/:id", checkIfDeveloperExists, checkPosibleKeysUpdateDeveloper, removeExtraKeysDeveloper, updateDeveloper)
app.patch("/developers/:id/infos", checkPosibleKeysUpdateDeveloperInfo, checkIfDeveloperExists, removeExtraKeysDeveloperInfosUpdate, updateDeveloperInfo)

app.listen(3000, async () => {
    await startDataBase()
    console.log("Server is running!")
})