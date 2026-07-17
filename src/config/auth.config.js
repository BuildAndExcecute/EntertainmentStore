import { betterAuth } from "better-auth";
import dotenv from 'dotenv'
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db.config.js"; 

dotenv.config()



export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", 
    }),
    user: {
        additionalFields: {
            role: {
                type: ["user", "admin"],
                defaultValue: "user",
                input:false,
            },
            username: {
                type: "string",
                required: true,
            }
        }
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