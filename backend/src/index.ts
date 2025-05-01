import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from "hono/jwt"
import { setCookie, getCookie } from 'hono/cookie'

import { Next } from 'hono/types'


const app = new Hono()
const privateKey = 'abcde'

function clientThrower() {
  return new PrismaClient({
    datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiODA4OGViYzktNjBhOC00YWMxLWJhYmQtZWRiMzRiYTc3NDM5IiwidGVuYW50X2lkIjoiZTBhOTk0MzlhNzA3MTgxNjI2NjlhMjQxYjZhYjQ3ZjA5MGUxZmQ0N2MwMjc1ZDFmMmJkMGYwN2FiZWJhMDM2MSIsImludGVybmFsX3NlY3JldCI6IjQyODYyZDMyLTA0NmYtNGJjNy05OWFlLTk5ODljZThlNWJlMSJ9.Y1-r9fZ6LN0j2swXe2GH8ka5K_NXqsQLjFIxWCtBO7A"
  }).$extends(withAccelerate())
}
interface userSchemaInterface {
  email: string, name: string, password?: string
}

type userReturnType = {
  id: number,
  email: string,
  name: string
}

type loginInterface = Pick<userSchemaInterface, "email" | "password">

app.get('/', async (c) => {
  const client = clientThrower()
  const xx = await client.user.findUnique({
    where: {
      id: 1
    }
  })
  return c.json(xx)
})

app.post("/auth/signUp", async (c) => {
  c
  const client = clientThrower()
  const { name, email }: userSchemaInterface = await c.req.json()

  const creationRes = await client.user.create({
    data: {
      email,
      name
    }
  })
  return c.json({ "data": creationRes })
})


async function jwtChecker(c, next: Next) {
  const accessToken = getCookie(c, "accessToken")
  if (!accessToken) throw new Error("no accessToken")
  console.log(accessToken)
  c.set("accessToken", accessToken)
  await next()
}


app.use("/blog/*", jwtChecker) // middleware for JWT

app.post("/auth/login", async (c) => {
  const { email, password }: loginInterface = await c.req.json()
  const client = clientThrower()


  const userData = await client.user.findUnique({
    where: {
      email
    }
  })

  if (!userData) throw new Error("no user found!")
  const signedStr = await sign(userData, privateKey)
  if (!signedStr) throw new Error("jwt sign failure")
  setCookie(c, "accessToken", signedStr, {
    secure: true,
    httpOnly: true
  })

  return c.json({ "msg": userData })

})


app.post("/post/add", jwtChecker, async (c) => {
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

app.get("/health", async (c) => {
  return c.json({
    "msg": "this is a heathcheck"
  })
})

app.get("/blog/fetchPost/:title",async(c)=>{
const {title} = c.req.param

const data = await clientThrower().post.findMany({
  where:{
    title
  },
  orderBy:{
    updatedAt:"desc"
  },
  take:10
})

return c.json({
"posts":data
})
})


export default app
