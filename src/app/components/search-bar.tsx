"use client";

import { useState } from "react";
import { getVehicle } from "@/actions/getVehicle";
import { motion } from "framer-motion";

interface Property {
  key: string;
  value: string;
}

export default function SearchBar() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Property[]>([]);
  const [showCard, setShowCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allowedKeys: Record<string, string> = {
    make: "Make",
    model: "Model",
    production_year: "Production Year"
  };

  const isAllowedKey = (key: string): key is keyof typeof allowedKeys =>
    key in allowedKeys;

  const handleSearch = async () => {
    const cleaned = input.trim().toUpperCase();
    if (!cleaned) return;

    setLoading(true);
    setError("");
    setShowCard(false);

    try {
      const data = await getVehicle(cleaned);
      const props = data?.variants?.[0]?.properties || [];

      const formatted = props
        .map((obj: Record<string, any>) => {
          const [key, value] = Object.entries(obj)[0];
          return { key, value };
        })
        .filter((item) => isAllowedKey(item.key))
        .map((item) => ({
          key: allowedKeys[item.key],
          value: String(item.value)
        }));

      setResults(formatted);
      setShowCard(true);
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
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-12 bg-gray-100 dark:bg-zinc-950">
      {/* Search Card */}
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 mb-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Search vehicle by license plate
        </h1>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter Number Plate..."
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white dark:border-gray-600"
        />

        {loading && <p className="text-sm text-gray-500 mt-3">Loading...</p>}
        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      </div>

      {/* Results Card (conditionally shown) */}
      {showCard && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl"
        >
          <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md px-6 py-5 space-y-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Vehicle Details
            </h2>
            {results.map((item, index) => (
              <p
                key={index}
                className="text-sm text-gray-800 dark:text-gray-200"
              >
                <span className="font-semibold">{item.key}:</span> {item.value}
              </p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
