"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import { loginSchema } from "~/schemas/auth-schema"
import { Button } from "~/shared/ui-kit/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/shared/ui-kit/form"
import { Input } from "~/shared/ui-kit/input"
import { Separator } from "~/shared/ui-kit/separator"
import { AuthProviders } from "~/shared/ui/AuthProviders"

export default function Login() {
  const router = useRouter()
  const form = useForm<z.output<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const submitHandler: SubmitHandler<z.output<typeof loginSchema>> = async (data) => {
    const response = await signIn("credentials", { ...data, redirect: false })
    if (!response) return

    // Redirecting to main page if signing in was successful
    if (!response.error && response.ok) {
      router.push("/")
      return
    }

    // User credentials are incorrect
    if (response.status === 401) {
      form.setError("email", { message: "Incorrect credentials" })
      form.setError("password", { message: "Incorrect credentials" })
    }

    // Creating an error toast
    toast.error(response.error, { position: "top-right" })
  }

  return (
    <div className="w-full max-w-[22rem] rounded-xl bg-white p-4 pt-6 shadow-md">
      <Form {...form}>
        <form className="grid gap-3" onSubmit={form.handleSubmit(submitHandler)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" className="!mt-1" placeholder="Enter your e-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="!mt-1" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-2" disabled={form.formState.isSubmitting}>
            Login
          </Button>
        </form>
      </Form>
      <p className="mt-3 text-center text-sm font-medium">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-500">
          Register
        </Link>
      </p>
      <Separator className="my-5" />
      <AuthProviders strategy="login" />
    </div>
  )
}
