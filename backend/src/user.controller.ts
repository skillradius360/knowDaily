import { Hono } from 'hono'
import { decode, sign, verify } from "hono/jwt"
import { setCookie, getCookie } from 'hono/cookie'
import { Next } from 'hono/types'
import  {userSchemaInterface,userReturnType,loginInterface} from "./index"
import { clientThrower } from './index'
import { privateKey } from './constants'

 const app = new Hono()


app.get('/', async (c) => {
  const client = clientThrower()
  const xx = await client.user.findUnique({
    where: {
      id: 1
    }
  })
  return c.json(xx)
})


app.post("/signUp", async (c) => {
  
  const  client = clientThrower()
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
  c.set("accessToken", accessToken)
  await next()
}


app.use("/blog/*", jwtChecker) // middleware for JWT

app.post("/login", async (c) => {
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


export default app
