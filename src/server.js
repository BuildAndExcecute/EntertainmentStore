import express from 'express'
import dotenv from 'dotenv'
dotenv.config()


import { db } from './config/db.config.js'
import {sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import { toNodeHandler } from "better-auth/node"
import { auth } from "./config/auth.config.js"


const app = express()

dotenv.config()

async function startServer() {
    try {
        app.all("/api/v1/auth/*splat", toNodeHandler(auth))

        app.use(express.json())
        console.log("DataBase Connected Successfully")
        app.listen(process.env.PORT, ()=>{
            console.log('Server is Listening on PORT :', process.env.PORT)
        })

    } catch (error) {
        console.log(error.message)
        
    }
}

startServer()