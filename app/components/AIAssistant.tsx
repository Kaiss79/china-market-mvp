"use client";

import { useState, useRef, useEffect } from "react";
import { aiSearchProducts, type SearchProduct } from "@/app/actions/search";
import { generateAIResponse } from "@/lib/ai";
import Link from "next/link";

type Message = { role: "user" | "ai"; text: string; products?: SearchProduct[] };

export default function AIAssistant() {
  const [msgs, setMsgs] = useState<Message[]>([
    { role: "ai", text: "🤖 Привет! Опишите что ищете и я подберу товары. Например: «дешёвые наушники» или «подарок до 1000 грн»." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function handleSend() {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMsgs((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    const products = await aiSearchProducts(q);
    const text = products.length > 0
      ? `Нашёл ${products.length} товаров по запросу «${q}»:`
      : generateAIResponse(q);

    setMsgs((prev) => [...prev, { role: "ai", text, products: products.length > 0 ? products : undefined }]);
    setLoading(false);
  }

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <span className="ai-avatar-icon">🤖</span>
        <div><strong>AI-ассистент</strong><span className="ai-online">● Online</span></div>
      </div>

      <div className="ai-messages">
        {msgs.map((m, i) => (
          <div key={i} className={`ai-msg ${m.role}`}>
            {m.role === "ai" && <span>🤖</span>}
            <div className="ai-bubble">
              <p>{m.text}</p>
              {m.products && (
                <div className="ai-results">
                  {m.products.map((p) => (
                    <Link href={`/product/${p.id}`} key={p.id} className="ai-result-card">
                      <img src={p.imageUrl || "https://picsum.photos/seed/product/60/60"} alt={p.title} />
                      <div>
                        <span className="ai-result-title">{p.title}</span>
                        <span className="ai-result-price">{(p.price / 100).toFixed(2)} грн</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {m.role === "user" && <span>👤</span>}
          </div>
        ))}
        {loading && (
          <div className="ai-msg ai"><span>🤖</span><div className="ai-bubble"><div className="ai-typing"><span/><span/><span/></div></div></div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="ai-chips">
        {["наушники", "powerbank", "смартфон", "гаджет", "авто"].map((s) => (
          <button key={s} onClick={() => setInput(s)} className="ai-chip-btn">{s}</button>
        ))}
      </div>

      <div className="ai-input-bar">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Что ищете? Например: наушники до 2000 грн..."
          disabled={loading} />
        <button onClick={handleSend} disabled={loading || !input.trim()} className="ai-send">➤</button>
      </div>
    </div>
  );
}
