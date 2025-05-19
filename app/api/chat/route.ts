import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST (req: Request) {
    const body = await req.json();

    const messages = [
    {
      role: "system",
      content:
        "You are an assistant who always breaks down your reasoning before giving an answer. Output two parts: reasoning and answer.",
    },
    ...body.messages,
  ];

    const result = streamText(
        {
            model: openai('gpt-4o-mini'),
            messages,

        }
    );

    return result.toDataStreamResponse();
}