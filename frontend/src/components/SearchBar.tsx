"use client";

import { useState } from "react";
import Image from "next/image";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, placeholder = "Search iTunes...", isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as React.FormEvent);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 px-4 py-2 rounded-lg border"
        />
        <button
          type="button"
          onClick={() => {
            if (query.trim()) {
              onSearch(query.trim());
            }
          }}
          disabled={!query.trim() || isLoading}
          className="px-6 py-2 bg-black text-white rounded-lg"
        >
          {isLoading ? (
            <Image 
              src="/gifs/dots-loading.gif" 
              alt="Loading..." 
              width={20}
              height={20}
              className="w-5 h-5 invert"
            />
          ) : (
            "Search"
          )}
        </button>
      </div>
    </div>
  );
}
