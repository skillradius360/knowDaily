import { getCookie } from "hono/cookie"
import { Next } from "hono"
import app from "./index"
import { clientThrower } from "./index"

 async function healthCheck(c) {
    return c.json({
      "msg": "this is a heathcheck"
    })
  }

export default healthCheck 

export async function jwtChecker(c, next: Next) {
  const accessToken = getCookie(c, "accessToken")
  if (!accessToken) throw new Error("no accessToken")
  c.set("accessToken", accessToken)
  await next()
}
