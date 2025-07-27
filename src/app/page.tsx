import Image from "next/image";
import SearchBar from "@/app/components/search-bar";
import {getParts} from "@/actions/getParts";
import Link from "next/link";
import {getVehicle} from "@/actions/getVehicle";

export default async function Home() {
  const data = await getVehicle("KNW86");
  console.log(data);

  const parts = await getParts(data.id);
  console.log(parts);


  return (
    <div className="flex flex-col items-center gap-16 bg-gray-100 dark:bg-zinc-950 px-6 sm:px-12 py-12 min-h-screen font-sans text-gray-800 dark:text-white">
      
      {/* Page Header */}
      <header className="w-full max-w-2xl text-center">
        <h1 className="mb-2 font-bold text-4xl tracking-tight">
          Vehicle Part Valuation
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-base">
          Quickly search vehicles by license plate and identify key part data.
        </p>
      </header>

      {/* SearchBar Component */}
      <SearchBar />

      {/* Optional Info Section or Placeholder */}
      <section className="w-full max-w-2xl text-gray-600 dark:text-gray-400 text-sm">
        <div className="pt-6 border-gray-200 dark:border-zinc-700 border-t">
          <p className="mb-1">
            Tip: Try entering a real plate like{" "}
            <code className="bg-gray-200 dark:bg-zinc-800 px-2 py-1 rounded">
              KNW86
            </code>.
          </p>
          <p className="text-gray-500 dark:text-zinc-500 text-xs">
            Your results will appear below the search bar.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-gray-500 dark:text-gray-400 text-sm">
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
