"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ placeholder = "Поиск товаров..." }: { placeholder?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/?search=${encodeURIComponent(query.trim())}` : "/");
  }

  return (
    <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      <button type="submit" className="search-btn">🔍 Найти</button>
    </form>
  );
}
