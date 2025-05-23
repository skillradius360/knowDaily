 import {z} from "zod"
 

const userSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
});

const userReturnSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
});

const loginSchema = userSchema.pick({
  email: true,
  password: true,
});

type userSchemaInterface = z.infer<typeof userSchema>;
type userReturnType = z.infer<typeof userReturnSchema>;
type loginInterface = z.infer<typeof loginSchema>;

export {userSchemaInterface,userReturnType,loginInterface}