"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { LoaderIcon } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { registerSchema } from "~/schemas/auth-schema"
import { createAccount, userExists } from "~/server-actions/auth"
import { Button } from "~/shared/ui-kit/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/shared/ui-kit/form"
import { Input } from "~/shared/ui-kit/input"
import { Separator } from "~/shared/ui-kit/separator"
import { AuthProviders } from "~/shared/ui/AuthProviders"

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isEmailValidating, setIsEmailValidating] = useState(false)
  const router = useRouter()
  const form = useForm<z.output<typeof registerSchema>>({
    resolver: zodResolver(
      registerSchema.superRefine(async (data, context) => {
        if (!data.email || currentStep !== 0) return

        setIsEmailValidating(true)
        const exists = await userExists(data.email)
        setIsEmailValidating(false)

        if (exists)
          context.addIssue({
            message: "E-mail is already taken",
            path: ["email"],
            code: z.ZodIssueCode.custom,
          })
      }),
    ),
    defaultValues: {
      email: "",
      first: "",
      last: "",
      password: "",
      confirmPassword: "",
    },
  })

  const submitHandler: SubmitHandler<z.output<typeof registerSchema>> = async (data) => {
    try {
      await createAccount(data)
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (!response) return

      if (response.ok && !response.error) {
        router.push("/")
      }

      if (response.error) {
        throw new Error("Unexpected error")
      }
    } catch (error) {
      toast.error((error as Error).message, { position: "top-right" })
    }
  }

  const switchCurrentStep = async (type: "prev" | "next") => {
    if (type === "next") {
      const isValid = await form.trigger(
        currentStep === 0 ? ["email", "password", "confirmPassword"] : ["first", "last"],
      )
      if (!isValid) return
    }
    setCurrentStep((step) => step + (type === "prev" ? -1 : 1))
  }

  return (
    <div className="w-full max-w-[22rem] rounded-xl bg-white p-4 pt-6 shadow-md">
      <Form {...form}>
        <form className="grid gap-3" onSubmit={form.handleSubmit(submitHandler)}>
          {currentStep === 0 && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type="email" className="!mt-1" placeholder="Enter your e-mail" {...field} />
                      </FormControl>
                      {isEmailValidating ? (
                        <div className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2">
                          <LoaderIcon className="h-full w-full animate-spin" />
                        </div>
                      ) : null}
                    </div>
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
                    <FormControl className="relative">
                      <Input type="password" className="!mt-1" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="!mt-1" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                className="mt-2"
                disabled={form.formState.isSubmitting}
                onClick={() => {
                  void switchCurrentStep("next")
                }}>
                Next
              </Button>
            </>
          )}
          {currentStep === 1 && (
            <>
              <button
                type="button"
                className="group mb-2 ml-1.5 inline-flex max-w-fit items-center gap-1.5 text-sm font-medium text-gray-500"
                onClick={() => {
                  void switchCurrentStep("prev")
                }}>
                <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Prev
              </button>
              <FormField
                control={form.control}
                name="first"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input type="text" className="!mt-1" placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input type="text" className="!mt-1" placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-2" disabled={form.formState.isSubmitting}>
                Submit
              </Button>
            </>
          )}
        </form>
      </Form>
      <p className="mt-3 text-center text-sm font-medium">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500">
          Login
        </Link>
      </p>
      <Separator className="my-5" />
      <AuthProviders strategy="register" />
    </div>
  )
}
