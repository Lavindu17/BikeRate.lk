"use client";

import { useState } from "react";
import { Search, Wallet, Bike, ChevronRight } from "lucide-react";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"model" | "budget">("model");
  const [budget, setBudget] = useState<number>(15000);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = () => {
    if (activeTab === "model") {
      console.log(`Searching for bike: ${searchTerm}`);
    } else {
      console.log(`Searching for budget: Rs. ${budget}`);
    }
  };

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Placeholder for image */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
          Find the Best <span className="text-emerald-400">Leasing Rates</span>
        </h1>
        <p className="text-slate-400 text-lg mb-8">
          Compare rates from 5+ banks instantly. Don't let the dealer trick you.
        </p>

        {/* Search Module */}
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-2 md:p-4 shadow-2xl max-w-2xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-slate-900/50 rounded-xl">
            <button
              onClick={() => setActiveTab("model")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "model"
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Bike size={20} />
              <span>I know the Bike</span>
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "budget"
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Wallet size={20} />
              <span>I know my Budget</span>
            </button>
          </div>

          {/* Input Area */}
          <div className="px-2 md:px-4 pb-4">
            {activeTab === "model" ? (
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="e.g. Honda Dio..."
                    className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Search
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="text-left">
                  <label className="text-slate-400 text-sm block mb-2">
                    Maximum Monthly Rental
                  </label>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-white">
                      Rs. {budget.toLocaleString()}
                    </span>
                    <span className="text-slate-500 mb-1">/ month</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="500"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                <button
                  onClick={handleSearch}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Find Bikes <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
