"use server"

import { getSession } from "next-auth/react"
import { loginSchema } from "~/schemas/auth-schema"

export async function login(formData: FormData) {
  const session = await getSession()

  if (session) {
    return { message: "User is already authorized" }
  }

  const data = Object.fromEntries(formData)
  const validated = loginSchema.safeParse(data)

  if (!validated.success) {
    return validated.error
  }


}
