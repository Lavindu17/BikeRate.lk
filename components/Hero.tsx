"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Wallet, Bike, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeroProps {
  suggestions?: string[];
}

export default function Hero({ suggestions = [] }: HeroProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"model" | "budget">("model");

  // Default monthly budget: 25,000 LKR
  const [monthlyBudget, setMonthlyBudget] = useState<number>(25000);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Suggestions state
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (val.length > 0) {
      const filtered = suggestions.filter((name) =>
        name.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setSearchTerm(name);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    // 1. Construct the URL parameters
    const params = new URLSearchParams();

    if (activeTab === "model" && searchTerm) {
      params.set("q", searchTerm);
    } else if (activeTab === "budget") {
      // 2. SMART CONVERSION: Monthly -> Total Price
      // We convert the user's "Monthly Budget" into an "Approximate Total Bike Price"
      // to filter the database correctly.
      // Math: Assumes 4-year lease (Factor ~2900) & 40% Down Payment.
      // Multiplier ~56 converts Rental to Price. (e.g. 20k rental -> ~1.1M bike)
      const approxTotalPrice = Math.round(monthlyBudget * 56);
      params.set("budget", approxTotalPrice.toString());
    }

    // 3. Navigate to the main page with params + scroll to inventory
    router.push(`/?${params.toString()}#inventory`);
  };

  // Helper to format currency
  const formatLKR = (val: number) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="relative w-full min-h-[600px] flex items-center justify-center bg-slate-900 overflow-hidden py-20">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-20">
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
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-3 md:p-4 shadow-2xl max-w-2xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-slate-900/50 rounded-xl">
            <button
              onClick={() => setActiveTab("model")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 text-sm md:text-base ${
                activeTab === "model"
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Bike size={20} className="shrink-0" />
              <span>I know the Bike</span>
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 text-sm md:text-base ${
                activeTab === "budget"
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Wallet size={20} className="shrink-0" />
              <span>I know my Budget</span>
            </button>
          </div>

          {/* Input Area */}
          <div className="px-2 md:px-4 pb-4">
            {activeTab === "model" ? (
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1" ref={wrapperRef}>
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="e.g. Honda Dio..."
                    className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => {
                      if (searchTerm.length > 0) setShowSuggestions(true);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />

                  {/* Suggestions Dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                      {filteredSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
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
                      {formatLKR(monthlyBudget)}
                    </span>
                    <span className="text-slate-500 mb-1">/ month</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="1000"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
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
