import { NextRequest } from "next/server"
import { openai } from "@ai-sdk/openai"
import { convertToCoreMessages, type Message, streamText } from "ai"
import { generateQuery } from "./generateQuery"

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable")
}

export async function POST(req: NextRequest) {
  try {
    const { messages, data } = (await req.json()) as { messages?: Message[]; data?: { context: string } }

    if (!messages || !data?.context) {
      return new Response("Request body is invalid", { status: 400 })
    }

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: convertToCoreMessages(
        messages.map((message, i) =>
          i === messages.length - 1 ? { ...message, content: generateQuery(message.content, data.context) } : message,
        ),
      ),
      maxTokens: 128,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat route:", error)
    return new Response("An error occurred while processing your request", { status: 500 })
  }
}
