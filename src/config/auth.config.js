import { betterAuth } from "better-auth";
import dotenv from 'dotenv'
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db.config.js"; 
import * as schema from "../schema.js"

dotenv.config()



export const auth = betterAuth({
    baseURL: process.env.SERVER_URL, // e.g. "http://localhost:5000" or your prod URL
    basePath: "/api/v1/auth",        // <-- must match app.all("/api/v1/auth/*splat", ...)
    trustedOrigins: [process.env.CLIENT_URL],
    database: drizzleAdapter(db, {
        provider: "pg", 
        schema: schema
    }),
    user: {
        additionalFields: {
            role: {
                type: ["user", "admin"],
                defaultValue: "user",
                input: false,
            }
        }
    },
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID , 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        },
    },
});