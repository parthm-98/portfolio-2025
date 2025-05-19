"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const [reasoningVisibility, setReasoningVisibility] = useState<{
    [id: string]: boolean;
  }>({});

  const toggleReasoning = (id: string) => {
    setReasoningVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((message) => {
        const isAI = message.role === "assistant";

        return (
          <div key={message.id} className="mb-6 whitespace-pre-wrap">
            <div className="font-bold mb-1">{isAI ? "AI:" : "You:"}</div>

            {message.parts.map((part, i) => {
              if (part.type !== "text") return null;

              if (!isAI) {
                // 👉 Just show user's text input
                return (
                  <div key={`${message.id}-${i}`} className="text-black">
                    {part.text}
                  </div>
                );
              }

              // AI message parsing logic
              const reasoningMatch = part.text.match(/Reasoning:(.*)Answer:/);
              const answerMatch = part.text.match(/Answer:(.*)/);

              const reasoning = reasoningMatch
                ? reasoningMatch[1].trim()
                : null;
              const answer = answerMatch ? answerMatch[1].trim() : null;

              const isStreamingReasoning =
                part.text.includes("Reasoning:") &&
                !part.text.includes("Answer:");

              return (
                <div key={`${message.id}-${i}`}>
                  {isStreamingReasoning && (
                    <div className="text-sm text-gray-400 italic animate-pulse mb-2">
                      Thinking through it...
                    </div>
                  )}

                  {!isStreamingReasoning && answer && (
                    <>
                      <div>{answer}</div>

                      {reasoning && (
                        <>
                          <button
                            onClick={() => toggleReasoning(message.id)}
                            className="text-blue-600 text-sm underline mb-2 mt-2 block"
                          >
                            {reasoningVisibility[message.id]
                              ? "Hide Reasoning"
                              : "Show Reasoning"}
                          </button>

                          {reasoningVisibility[message.id] && (
                            <div className="text-sm text-gray-500 italic bg-gray-100 p-2 rounded mb-2">
                              {reasoning}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl dark:bg-zinc-900"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
