import Image from "next/image";
import SearchBar from "@/app/components/search-bar";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        {/* 🔍 Custom SearchBar for chassis/plate lookup */}
        <SearchBar />

        {/* Remove below if not needed, or keep as placeholder info */}
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-600 dark:text-gray-400">
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
