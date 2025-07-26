"use client";

import { useState, useEffect } from "react";
import { getVehicle } from "@/actions/getVehicle";

interface Property {
  key: string;
  value: string;
}

export default function SearchBar() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Property[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const cleaned = input.trim().toUpperCase();
    if (!cleaned) return;

    setLoading(true);
    setError("");
    setShowDropdown(false);

    try {
      const data = await getVehicle(cleaned);
      const props = data?.variants?.[0]?.properties || [];

      const formatted = props.map((obj: Record<string, string>) => {
        const [key, value] = Object.entries(obj)[0];
        return { key, value };
      });

      setResults(formatted);
      setShowDropdown(true);
    } catch (err) {
      setError("Vehicle lookup failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full relative max-w-xl">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter Number Plate..."
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white dark:border-gray-600"
      />

      {loading && <p className="text-sm text-gray-500 mt-2">Loading...</p>}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-600 mt-1 rounded shadow max-h-80 overflow-auto">
          {results.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm cursor-default"
            >
              <strong>{item.key}</strong>: {item.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
