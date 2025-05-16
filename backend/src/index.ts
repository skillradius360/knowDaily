import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from "hono/jwt"
import healthCheck from './auth.middleware'
import { z } from "zod";
import auth from "./user.controller"

const app = new Hono()

export function clientThrower() {
  return new PrismaClient({
    datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiODA4OGViYzktNjBhOC00YWMxLWJhYmQtZWRiMzRiYTc3NDM5IiwidGVuYW50X2lkIjoiZTBhOTk0MzlhNzA3MTgxNjI2NjlhMjQxYjZhYjQ3ZjA5MGUxZmQ0N2MwMjc1ZDFmMmJkMGYwN2FiZWJhMDM2MSIsImludGVybmFsX3NlY3JldCI6IjQyODYyZDMyLTA0NmYtNGJjNy05OWFlLTk5ODljZThlNWJlMSJ9.Y1-r9fZ6LN0j2swXe2GH8ka5K_NXqsQLjFIxWCtBO7A"
  }).$extends(withAccelerate())
}







    app.route("/users",auth)


export default app
export {
  userSchemaInterface,userReturnType,loginInterface
}