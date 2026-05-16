import postgres from "postgres"
import { env } from "./env"
import * as schema from "../db/schema"
import { drizzle } from "drizzle-orm/postgres-js"

const client = postgres(env.DATABASE_URL, { ssl: "require" })
export const db = drizzle(client, { schema })
