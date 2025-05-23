import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from "hono/jwt"
import healthCheck from './auth.middleware'
import { z } from "zod";
import auth from "./user.controller"
import { clientThrower } from '.'
import { jwtChecker } from './auth.middleware'
import { privateKey } from './constants'


const app = new Hono()
// const privateKey = 'abcde'


app.use("/blog/*", jwtChecker) // middleware for JWT

app.post("/add", jwtChecker, async (c) => {
    const { title, content }: { title: string, content: string } = await c.req.json()
    if (!title && content) throw new Error("no data to post")

    const client = await clientThrower()
    const userId = c.get("accessToken")
    if (!userId) throw new Error("not logged in for posts")
    const authorId = await verify(userId, privateKey)

    const postMade = await client.post.create({
        data: {
            title, content, authorId: Number(authorId.id)
        }
    })

    return c.json({ "msg": postMade })
})

// app.get("/",healthCheck)

app.get("/fetchPost/:title", async (c) => {
    const { title } = c.req.param

    const data = await clientThrower().post.findMany({
        where: {
            title
        },
        orderBy: {
            updatedAt: "desc"
        },
        take: 10
    })

    return c.json({
        "posts": data
    })
})



export default app
