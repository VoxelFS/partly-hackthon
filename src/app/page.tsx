import Image from "next/image";
import SearchBar from "@/app/components/search-bar";
import { getParts } from "@/actions/getParts";
import Link from "next/link";
import { getVehicle } from "@/actions/getVehicle";

export default async function Home() {
  const data = await getVehicle("KNW86");
  console.log(data);

  const parts = await getParts(data.id);
  console.log(parts);

  return (
    <div className="flex flex-col items-center gap-16 bg-gradient-to-br from-indigo-700 to-indigo-350 px-6 sm:px-12 py-12 min-h-screen font-sans text-white">
      {/* Page Header */}
      <header className="w-full max-w-2xl text-center">
        <h1 className="mb-2 font-bold text-4xl tracking-tight">
          Vehicle Part Valuation
        </h1>
        <p className="text-base text-white/80">
          Quickly search vehicles by license plate and identify key part data.
        </p>
      </header>

      {/* SearchBar Component */}
      <div className="w-full max-w-2xl">
        <SearchBar />
      </div>

      {/* Info Section */}
      <section className="w-full max-w-2xl text-sm text-white/80">
        <div className="pt-6 border-t border-white/30">
          <p className="mb-1">
            Tip: Try entering a real plate like {" "}
            <code className="bg-white/20 px-2 py-1 rounded font-mono text-white">
              KNW86
            </code>
            .
          </p>
          <p className="text-xs text-white/60">
            Your results will appear below the search bar.
          </p>
        </div>
      </section>
    </div>
  );
}
