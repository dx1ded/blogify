"use client"

import { BubbleMenu } from "@tiptap/react"
import type { Message } from "ai"
import { useChat } from "ai/react"
import { AnimatePresence, motion } from "framer-motion"
import { PlusIcon, SendHorizonalIcon, SparklesIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { cn, handleEnter } from "~/shared/lib"
import { Button } from "~/shared/ui-kit/button"
import { Input } from "~/shared/ui-kit/input"
import { H3, H4 } from "~/shared/ui/Typography"
import { useEditorContext } from "../model/context"

export function AIBubbleMenu() {
  const editor = useEditorContext()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const { messages, isLoading, append } = useChat({ api: "/api/chat" })
  const inputRef = useRef<HTMLInputElement>(null)

  if (!editor || !session?.user) return null

  const toggleIsOpen = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsOpen((prev) => !prev)
  }

  const handleSendMessage = async (template?: string) => {
    const input = inputRef.current
    const value = input?.value || ""

    if (!input || (!template && !value)) return

    // Resetting input value if query is based on input value
    if (!template) {
      input.value = ""
    }

    const newMessage: Message = {
      id: nanoid(),
      content: template || value,
      role: "user",
    }

    try {
      const { from, to, empty } = editor.state.selection

      if (empty) {
        throw new Error("Nothing is selected")
      }

      const context = editor.state.doc.textBetween(from, to, " ")

      await append(newMessage, { data: { context } })
    } catch (e) {
      toast.error((e as Error).message, { position: "top-right" })
    }
  }

  const applyContentHandler = (content: string) => {
    editor.chain().focus().insertContent(content).run()
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: "bottom-start",
        onHide: () => setIsOpen(false),
      }}>
      <div className="relative">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="menu"
              className="flex h-[30rem] w-[20rem] flex-col gap-3 rounded-xl bg-white px-3 py-4 shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.1 }}>
              <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="h-6 w-6 text-primary" />
                  <H4>AI</H4>
                </div>
                <button type="button" className="flex h-5 w-5 items-center justify-center">
                  <PlusIcon className="h-full w-full rotate-45" onClick={toggleIsOpen} />
                </button>
              </header>
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
                <div className="flex flex-1 flex-col-reverse gap-4 overflow-y-auto py-2">
                  {!messages.length && (
                    <H3 className="flex flex-1 items-center justify-center">
                      Ask&nbsp;<span className="text-primary">AI</span>
                    </H3>
                  )}
                  {messages.toReversed().map((message, i) => (
                    <div className="flex flex-col items-start gap-2.5" key={i}>
                      <div className={cn("flex items-end gap-2", message.role === "user" && "self-end")}>
                        <Image
                          className={cn("h-6 w-6 rounded-full object-cover", message.role === "user" && "order-2")}
                          src={message.role === "user" ? session.user.image : "/chatgpt.png"}
                          alt={message.role === "user" ? session.user.name : "ChatGPT"}
                          width={24}
                          height={24}
                        />
                        <p className="w-full max-w-[15rem] rounded-lg border border-input p-2.5 text-sm shadow-sm">
                          {message.content}
                        </p>
                      </div>
                      {message.role === "assistant" && !isLoading && (
                        <Button
                          className="self-end"
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault()
                            applyContentHandler(message.content)
                          }}>
                          Use it
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full text-primary"
                    onClick={(e) => {
                      e.preventDefault()
                      handleSendMessage("Please expand on the following")
                    }}>
                    Expand
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full text-primary"
                    onClick={(e) => {
                      e.preventDefault()
                      handleSendMessage("Please suggest a change for the following")
                    }}>
                    Change
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full text-primary"
                    onClick={(e) => {
                      e.preventDefault()
                      handleSendMessage("Please refine the following")
                    }}>
                    Refine
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    className="flex-1 rounded-full px-4 focus-visible:ring-0"
                    placeholder="Your prompt ..."
                    onKeyDown={handleEnter(handleSendMessage)}
                  />
                  <button
                    type="button"
                    className="flex h-6 w-6 items-center justify-center"
                    disabled={isLoading}
                    onClick={() => handleSendMessage()}>
                    <SendHorizonalIcon className="h-full w-full text-primary" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}>
              <Button variant="outline" size="icon" className="px-7" onClick={toggleIsOpen}>
                <SparklesIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-primary" />
                AI
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BubbleMenu>
  )
}
