import express, { Application } from "express";
import { startDataBase } from "./database"
import { createNewDeveloper } from "./logics/devLogics"
import { checkIfEmailExists, checkRequiredKeysCreateDeveloper, removeExtraKeysCreateDeveloper } from "./middlewares/devValidations"

const app: Application = express()
app.use(express.json())

app.post("/developers", checkIfEmailExists, checkRequiredKeysCreateDeveloper, removeExtraKeysCreateDeveloper, createNewDeveloper)

app.listen(3000, async () => {
    await startDataBase()
    console.log("Server is running!")
})