"use client";

import { useState, useRef, useEffect } from "react";

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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const userMsg = text ?? input;
    if (!userMsg.trim() || loading) return;
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-6 shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl shrink-0">
            🤖
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI College Advisor</h1>
            <p className="text-slate-500 text-sm">Powered by Llama 3.3 · Expert in Tamil Nadu admissions</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <>
              {/* Welcome */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm shrink-0">
                  AI
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-800 leading-relaxed shadow-sm max-w-lg">
                  Hi! I&apos;m your AI college advisor for Tamil Nadu. Tell me your marks, budget, preferred course, and location — I&apos;ll recommend the best colleges for you. 🎓
                </div>
              </div>

              {/* Prompts */}
              <div className="ml-11">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Try asking</p>
                <div className="grid gap-2">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => send(ex)}
                      className="text-left text-sm px-4 py-3 bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-all text-slate-700 shadow-sm"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  AI
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-sm"
                  : "bg-white border border-slate-100 text-slate-800 rounded-tl-sm"
              }`}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                AI
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center h-5">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-100 px-6 py-4 shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-300 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Describe your marks, course, location preference..."
              className="flex-1 px-4 py-2.5 text-sm bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              Ask →
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center mt-2">AI can make mistakes. Verify details with official college websites.</p>
        </div>
      </div>
    </div>
  );
}
