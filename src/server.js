import express from 'express'
import "dotenv/config";

import { db } from './config/db.config.js'
import {sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import { toNodeHandler } from "better-auth/node"
import { auth } from "./config/auth.config.js"

import movieRouter from "./routes/movies.routes.js"
import userRouter from "./routes/user.routes.js"
import feedbackRouter from "./routes/feedback.routes.js"


const app = express()


async function startServer() {
    try {
        await db.execute(sql`SELECT 1`);

        app.all("/api/v1/auth/*splat", toNodeHandler(auth))

        app.use(express.json())

        app.use("/api/v1/movies", movieRouter)
        app.use("api/v1/user", userRouter)
        app.use("/api/v1/feedback", feedbackRouter)

        console.log("DataBase Connected Successfully")
        app.listen(process.env.PORT, ()=>{
            console.log('Server is Listening on PORT :', process.env.PORT)
        })

    } catch (error) {
        console.log(error.message)
        
    }
}

startServer()