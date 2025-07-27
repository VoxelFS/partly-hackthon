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
      return;
    }

    const isValidPlate = /^[A-Z0-9]{1,6}$/.test(cleaned);
    if (!isValidPlate) {
      setError("Invalid plate format. Use letters/numbers only (max 6 characters).");
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
        return;
      }

      setResults(formatted);
      setShowCard(true);
    } catch (err) {
      setError("Vehicle lookup failed. Please try again.");
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
    <div className="min-h-screen w-full flex flex-col items-center px-4 pt-10 pb-28 bg-gray-100 dark:bg-zinc-950 relative">
      {/* Search Card */}
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-10 mb-10 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          Search vehicle by license plate
        </h1>

        <div className="w-full flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Enter Number Plate..."
            className="flex-1 rounded-lg border border-gray-300 px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white dark:border-gray-600"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 text-base font-semibold bg-blue-600 text-white rounded-lg transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Enter
          </button>
        </div>

        {loading && <p className="text-base text-gray-500 mt-4">Loading...</p>}
        {error && <p className="text-base text-red-500 mt-4">{error}</p>}
      </div>

      {/* Results Card */}
      {showCard && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md px-8 py-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Vehicle Details
            </h2>
            {results.map((item, index) => (
              <p
                key={index}
                className="text-base text-gray-800 dark:text-gray-200"
              >
                <span className="font-semibold">{item.key}:</span> {item.value}
              </p>
            ))}

            {/* Checklist Button Inside Card */}
            <div className="flex justify-end pt-4">
              <Link href={`/${input}`} passHref>
                <button
                  className="bg-white text-sm text-gray-800 font-medium border border-gray-300 rounded-lg px-4 py-2 shadow-sm transition duration-150 ease-in-out hover:bg-gray-100 hover:shadow-md hover:scale-[1.02] dark:bg-white dark:text-black"
                >
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
