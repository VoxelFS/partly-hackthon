import SearchBar from "@/app/components/search-bar";
import { getParts } from "@/actions/getParts";
import { getVehicle } from "@/actions/getVehicle";

export default async function Home() {
  const data = await getVehicle("KNW86");
  console.log(data);

  const parts = await getParts(data.id);
  console.log(parts);

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative flex flex-col justify-center items-center px-6 sm:px-12 py-12 min-h-screen">
        {/* Hero Section */}
        <div className="mb-16 w-full max-w-4xl text-center">

          {/* Main Heading */}
          <h1 className="mb-6 font-bold text-white text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight">
            <span className="block bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent">
              Apart.ly
            </span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-3xl text-blue-100 text-xl sm:text-2xl leading-relaxed">
            AI-powered vehicle parts assessment platform. 
            Instantly analyze vehicle conditions and generate professional salvage reports.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <span className="bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/20 rounded-full text-white text-sm">
              ⚡ Instant Analysis
            </span>
            <span className="bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/20 rounded-full text-white text-sm">
              🔍 AI-Powered Detection
            </span>
            <span className="bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/20 rounded-full text-white text-sm">
              📋 Detailed Reports
            </span>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-16 w-full max-w-2xl">
          <div className="bg-white/10 shadow-2xl backdrop-blur-lg p-8 border border-white/20 rounded-2xl">
            <h2 className="mb-4 font-semibold text-white text-2xl text-center">
              Start Your Vehicle Assessment
            </h2>
            <SearchBar />
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16 w-full max-w-6xl">
          <h3 className="mb-12 font-bold text-white text-3xl text-center">
            How It Works
          </h3>
          <div className="gap-8 grid md:grid-cols-3">
            <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-xl text-center">
              <div className="flex justify-center items-center bg-blue-500/20 mx-auto mb-4 rounded-full w-16 h-16">
                <span className="text-2xl">🔍</span>
              </div>
              <h4 className="mb-3 font-semibold text-white text-xl">1. Search Vehicle</h4>
              <p className="text-blue-100">Enter any license plate to instantly access vehicle data and history.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-xl text-center">
              <div className="flex justify-center items-center bg-green-500/20 mx-auto mb-4 rounded-full w-16 h-16">
                <span className="text-2xl">📸</span>
              </div>
              <h4 className="mb-3 font-semibold text-white text-xl">2. Upload Images</h4>
              <p className="text-blue-100">Our AI analyzes vehicle photos to identify parts and assess conditions.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-xl text-center">
              <div className="flex justify-center items-center bg-purple-500/20 mx-auto mb-4 rounded-full w-16 h-16">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="mb-3 font-semibold text-white text-xl">3. Get Report</h4>
              <p className="text-blue-100">Receive detailed assessment reports with quality grades and condition analysis.</p>
            </div>
          </div>
        </div>

        {/* Example Section */}
        <section className="w-full max-w-2xl">
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm p-6 border border-white/20 rounded-xl">
            <div className="text-center">
              <h3 className="mb-3 font-semibold text-white text-lg">
                💡 Try a Sample Search
              </h3>
              <p className="mb-4 text-blue-100">
                Test the system with this example license plate:
              </p>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-3 border border-white/30 rounded-lg">
                <code className="font-mono font-bold text-white text-xl tracking-wider">
                  KNW86
                </code>
                <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="mt-3 text-blue-200 text-sm">
                Results will appear instantly below the search bar
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
