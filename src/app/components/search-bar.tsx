// SearchBar.tsx (with gradient background and Partly-inspired light indigo theme)
"use client";

import { useState } from "react";
import { getVehicle } from "@/actions/getVehicle";
import { motion } from "framer-motion";
import Link from "next/link";

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
  const [shake, setShake] = useState(false);

  const allowedKeys: Record<string, string> = {
    make: "Make",
    model: "Model",
    production_year: "Production Year",
  };

  const isAllowedKey = (key: string): key is keyof typeof allowedKeys =>
    key in allowedKeys;

  const handleSearch = async () => {
    const cleaned = input.trim().toUpperCase();
    if (!cleaned) {
      setError("Please enter a license plate.");
      triggerShake();
      return;
    }

    const isValidPlate = /^[A-Z0-9]{1,6}$/.test(cleaned);
    if (!isValidPlate) {
      setError("Invalid format. Use letters/numbers only (max 6 chars).");
      triggerShake();
      return;
    }

    setLoading(true);
    setError("");
    setShowCard(false);
    setResults([]);

    try {
      const data = await getVehicle(cleaned);
      const props = data?.variants?.[0]?.properties || [];

      const formatted: Property[] = [];

      props.forEach((obj: Record<string, any>) => {
        const [key, value] = Object.entries(obj)[0];
        if (isAllowedKey(key)) {
          formatted.push({
            key: allowedKeys[key],
            value:
              key === "make"
                ? String(value).charAt(0).toUpperCase() + String(value).slice(1)
                : String(value),
          });
        }
      });

      if (formatted.length === 0) {
        setError("No relevant vehicle details found.");
        triggerShake();
        return;
      }

      setResults(formatted);
      setShowCard(true);
    } catch (err) {
      setError("Vehicle lookup failed. Please try again.");
      console.error(err);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center bg-gradient-to-br from-indigo-100 to-indigo-400 p-6 rounded-2xl shadow-lg">
      <div className="bg-white shadow-md border border-indigo-200 rounded-2xl p-8 w-full">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          Search Vehicle by Plate
        </h2>

        <motion.div
          key={shake.toString()}
          animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex gap-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Enter License Plate..."
            className="flex-1 px-5 py-3 text-base rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-indigo-900 placeholder-indigo-300"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 text-base rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </motion.div>

        {error && (
          <p className="mt-5 text-sm text-red-500 text-center font-medium">{error}</p>
        )}
      </div>

      {showCard && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full mt-8"
        >
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl shadow-md px-6 py-6 pb-2">
            <h3 className="text-xl font-bold text-indigo-700 mb-4">
              Vehicle Details for {input}
            </h3>
            {results.map((item, index) => (
              <p key={index} className="text-indigo-800 text-base">
                <strong>{item.key}:</strong> {item.value}
              </p>
            ))}
            <div className="flex justify-end pt-5">
              <Link href={`/${input}`} passHref>
                <button className="text-sm bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
                  Go to Checklist
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
