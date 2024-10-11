"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { loginSchema } from "~/schemas/auth-schema"
import { Button } from "~/shared/ui-kit/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/shared/ui-kit/form"
import { Input } from "~/shared/ui-kit/input"
import { Separator } from "~/shared/ui-kit/separator"
import { AuthProviders } from "~/shared/ui/AuthProviders"

export default function Login() {
  const form = useForm<z.output<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <div className="w-full max-w-[22rem] rounded-xl bg-white p-4 pt-6 shadow-md">
      <Form {...form}>
        <form className="grid gap-3">
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
          <Button type="submit" className="mt-2">
            Login
          </Button>
        </form>
      </Form>
      <Separator className="my-5" />
      <AuthProviders strategy="login" />
    </div>
  )
}
