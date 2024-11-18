"use server"

import bcrypt from "bcryptjs"
import type { z } from "zod"
import prisma from "~/prisma"
import { registerSchema } from "~/schemas/auth-schema"

export async function userExists(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function createAccount(data: z.output<typeof registerSchema>) {
  const isValid = registerSchema.safeParse(data)

  if (!isValid) {
    throw new Error("Provided data is not valid")
  }

  const userExists = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (userExists) {
    throw new Error("User already exists")
  }

  await prisma.user.create({
    data: {
      name: `${data.first} ${data.last}`,
      email: data.email,
      password: await bcrypt.hash(data.password, Number(process.env.SALT_ROUNDS)),
    },
  })
}
