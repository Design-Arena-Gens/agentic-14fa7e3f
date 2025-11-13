"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ConversationRole = "user" | "assistant";

type ConversationMessage = {
  role: ConversationRole;
  content: string;
};

const starterPrompts = [
  "What internships can CS majors get?",
  "Tell me about campus housing.",
  "How do scholarships work?",
  "What’s special about the Business Analytics program?"
];

const Page = () => {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      role: "assistant",
      content: "Hi! I am your college guide. Ask me about majors, campus life, or admissions."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const submitMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) {
      return;
    }
    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: nextMessages })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch agent response");
      }

      const data = (await response.json()) as { reply: string };
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I ran into an issue generating a response. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitMessage(input);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const disabled = loading || !input.trim();

  const heroText = useMemo(
    () =>
      ({
        heading: "Explore Your Future Campus",
        subheading:
          "Get tailored answers about programs, campus life, and admissions with an AI-powered advisor designed for prospective students."
      }),
    []
  );

  return (
    <main className="page">
      <section className="hero">
        <div className="hero__copy">
          <h1>{heroText.heading}</h1>
          <p>{heroText.subheading}</p>
          <div className="hero__actions">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="chip"
                onClick={() => {
                  setInput(prompt);
                  setTimeout(() => submitMessage(prompt), 0);
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="chat">
        <div className="chat__window">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`bubble bubble--${message.role}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: message.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br />")
                }}
              />
            </div>
          ))}
          {loading ? <div className="typing">Thinking about the best answer…</div> : null}
          <div ref={messageEndRef} />
        </div>

        <form className="chat__composer" onSubmit={handleSubmit}>
          <textarea
            aria-label="Ask the college agent"
            placeholder="Ask about majors, clubs, deadlines…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            autoComplete="off"
            rows={3}
          />
          <div className="composer__actions">
            <button type="submit" disabled={disabled}>
              {loading ? "Sending…" : "Send"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Page;
