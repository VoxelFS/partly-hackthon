import Image from "next/image";
import SearchBar from "@/app/components/search-bar";
import {getParts} from "@/actions/getParts";
import {getVehicle} from "@/actions/getVehicle";

export default async function Home() {
  const data = await getVehicle("KNW86");
  console.log(data);

  const parts = await getParts(data.id);
  console.log(parts);
  return (
    <div className="min-h-screen font-sans bg-gray-100 dark:bg-zinc-950 text-gray-800 dark:text-white flex flex-col items-center px-6 sm:px-12 py-12 gap-16">
      
      {/* Page Header */}
      <header className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">
          Vehicle Part Valuation
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300">
          Quickly search vehicles by license plate and identify key part data.
        </p>
      </header>

      {/* SearchBar Component */}
      <SearchBar />

      {/* Optional Info Section or Placeholder */}
      <section className="w-full max-w-2xl text-sm text-gray-600 dark:text-gray-400">
        <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
          <p className="mb-1">
            Tip: Try entering a real plate like{" "}
            <code className="bg-gray-200 dark:bg-zinc-800 px-2 py-1 rounded">
              KNW86
            </code>.
          </p>
          <p className="text-xs text-gray-500 dark:text-zinc-500">
            Your results will appear below the search bar.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-sm text-gray-500 dark:text-gray-400">
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Powered by Next.js
        </a>
      </footer>
    </div>
  );
}
