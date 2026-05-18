"use client";

import { useRouter } from "next/navigation";

export default function AISuggestions() {
  const router = useRouter();

  const suggestions = [
    "AirPods",
    "наушники",
    "гаджеты",
    "товары для авто",
    "дешевые товары",
  ];

  return (
    <div className="ai-suggestions">
      {suggestions.map((text) => (
        <button
          key={text}
          type="button"
          onClick={() => router.push(`/?search=${encodeURIComponent(text)}`)}
        >
          {text}
        </button>
      ))}
    </div>
  );
}