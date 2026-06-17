"use client";

import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const EXAMPLES = [
  "I scored 85% in PCM and want CSE near Chennai within ₹1L/year budget",
  "Best medical colleges in Tamil Nadu for NEET score 580",
  "Top MBA colleges in Coimbatore with good placements",
  "I want to study AI & Data Science — which colleges should I consider?",
];

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text?: string) {
    const userMsg = text ?? input;
    if (!userMsg.trim()) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI College Advisor</h1>
        <p className="text-gray-500 text-sm mt-1">
          Tell me your marks, budget, preferred course, and location — I will recommend the best
          colleges for you.
        </p>
      </div>

      {messages.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Try asking:</p>
          <div className="grid gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => send(ex)}
                className="text-left text-sm px-4 py-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors text-gray-700 border border-gray-100"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="space-y-4 mb-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-100 text-gray-800"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-400">
                Thinking...
              </div>
            </div>
          )}
        </div>
      )}

      <div className="sticky bottom-4">
        <div className="bg-white border border-gray-200 rounded-xl flex gap-2 p-2 shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Describe your marks, course, location preference..."
            className="flex-1 px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
