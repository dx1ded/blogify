import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().trim().email("E-mail is required"),
  password: z.string().trim().min(4, "Password is required"),
})

export const signupSchema = z
  .object({
    email: z.string().email("E-mail is required"),
    first: z.string().min(1, "First name is required"),
    last: z.string().min(1, "Last name is required"),
    password: z.string().min(4, "Password is required"),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword
    },
    {
      message: "Passwords must match",
      path: ["confirmPassword"],
    },
  )
