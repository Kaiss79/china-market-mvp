"use client";

import { useState } from "react";
import { generateAIResponse, AI_QUICK_QUESTIONS } from "@/lib/ai";

type Msg = { role: "user" | "ai"; text: string };

export default function FloatingAI() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "👋 Привет! Я AI-ассистент China Market. Задайте вопрос или выберите тему ниже." },
  ]);
  const [input, setInput] = useState("");

  function send(text?: string) {
    const q = (text || input).trim();
    if (!q) return;
    setInput("");
    const userMsg: Msg = { role: "user", text: q };
    const aiMsg: Msg = { role: "ai", text: generateAIResponse(q) };
    setMsgs((prev) => [...prev, userMsg, aiMsg]);
  }

  return (
    <>
      <button className="floating-ai-btn" onClick={() => setOpen(!open)} title="AI-ассистент">
        {open ? "✕" : "🤖"}
      </button>

      {open && (
        <div className="floating-ai-panel">
          <div className="fai-header">
            <span>🤖 AI-ассистент</span>
            <button onClick={() => setOpen(false)} className="fai-close">✕</button>
          </div>

          <div className="fai-messages">
            {msgs.map((m, i) => (
              <div key={i} className={`fai-msg ${m.role}`}>
                {m.role === "ai" && <span className="fai-avatar">🤖</span>}
                <div className="fai-bubble">{m.text}</div>
              </div>
            ))}
          </div>

          <div className="fai-quick">
            {AI_QUICK_QUESTIONS.map((q) => (
              <button key={q} onClick={() => send(q)} className="fai-chip">{q}</button>
            ))}
          </div>

          <div className="fai-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Задайте вопрос..."
            />
            <button onClick={() => send()} className="fai-send">➤</button>
          </div>
        </div>
      )}
    </>
  );
}
