"use client";

import { useState } from "react";
import { calculateLeasing } from "@/lib/finance";
import LeadModal from "./LeadModal";
import BankComparisonModal from "./BankComparisonModal";
import {
  Building2,
  Store,
  TrendingDown,
  Check,
  Info,
  Lock,
} from "lucide-react";

interface CalculatorProps {
  price: number;
  bikeName?: string;
  rates?: any[];
}

export default function LeaseCalculator({
  price,
  bikeName = "Unknown",
  rates = [],
}: CalculatorProps) {
  const safePrice = Number(price);
  if (!safePrice || isNaN(safePrice))
    return <div className="text-red-500 p-4">Error: Invalid Price</div>;

  // Default to 100k or 0, but logic will handle the warning if it's too low
  const [cashInHand, setCashInHand] = useState(100000);
  const [selectedDuration, setSelectedDuration] = useState(48);

  // Modal States
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [selectedBankDetails, setSelectedBankDetails] = useState("");

  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const yearRates =
    rates?.filter((r) => r.duration_months === selectedDuration) || [];
  const bestRate = yearRates.find((r) => r.banks?.is_partner) ||
    yearRates[0] || { factor_per_100k: 0 };
  const dealerRate = yearRates.find((r) => !r.banks?.is_partner) || {
    factor_per_100k: bestRate.factor_per_100k
      ? bestRate.factor_per_100k * 1.15
      : 0,
  };

  const bestMath = calculateLeasing(
    safePrice,
    selectedDuration,
    bestRate.factor_per_100k,
    cashInHand,
    "new"
  );
  const dealerMath = calculateLeasing(
    safePrice,
    selectedDuration,
    dealerRate.factor_per_100k,
    cashInHand,
    "new"
  );

  const savings = dealerMath.totalCost - bestMath.totalCost;
  const savingsPercent =
    dealerMath.totalCost > 0
      ? ((dealerMath.totalCost - bestMath.totalCost) / dealerMath.totalCost) *
        100
      : 0;

  // Strict Enforcement Variables
  const isEligible = bestMath.isEligible;
  const gap = bestMath.gap;

  // Handlers
  const handleOpenComparison = () => {
    if (isEligible) {
      setIsCompareOpen(true);
    }
  };

  const handleSelectBank = (bankName: string, monthly: number) => {
    setSelectedBankDetails(
      `${bankName} Custom Plan: ${formatLKR(monthly)}/mo for ${
        selectedDuration / 12
      } Years`
    );
    setIsCompareOpen(false);
    setIsLeadOpen(true);
  };

  return (
    <>
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Customize Plan</h3>
        </div>

        {/* Slider */}
        <div
          className={`rounded-2xl p-5 mb-6 border transition-colors duration-300 ${
            isEligible
              ? "bg-slate-800/50 border-slate-700"
              : "bg-rose-900/10 border-rose-500/30"
          }`}
        >
          <div className="flex justify-between items-end mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg ${
                  isEligible
                    ? "bg-slate-700 text-slate-300"
                    : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {isEligible ? <Info size={16} /> : <TrendingDown size={16} />}
              </div>
              <label
                className={`text-xs font-bold uppercase tracking-wider ${
                  isEligible ? "text-slate-400" : "text-rose-400"
                }`}
              >
                {isEligible ? "Cash in Hand" : "Low Down Payment"}
              </label>
            </div>
            <div className="text-right">
              <span
                className={`font-mono font-bold text-2xl block leading-none ${
                  isEligible ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {formatLKR(cashInHand)}
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max={safePrice}
            step="5000"
            value={cashInHand}
            onChange={(e) => setCashInHand(Number(e.target.value))}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all ${
              isEligible
                ? "bg-slate-700 accent-emerald-500 hover:accent-emerald-400"
                : "bg-rose-900/30 accent-rose-500 hover:accent-rose-400"
            }`}
          />

          <div className="flex justify-between text-[10px] text-slate-500 mt-3 font-medium uppercase tracking-wider">
            <span>0</span>
            <span>{formatLKR(safePrice / 2)}</span>
            <span>Full Price</span>
          </div>
        </div>

        {/* Duration */}
        <div className="flex bg-slate-800 p-1 rounded-xl mb-6 border border-slate-700 overflow-x-auto">
          {[12, 24, 36, 48, 60].map((months) => (
            <button
              key={months}
              onClick={() => setSelectedDuration(months)}
              className={`flex-1 min-w-[50px] py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                selectedDuration === months
                  ? "bg-emerald-500 text-black shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {months / 12} Yr
            </button>
          ))}
        </div>

        {/* --- ERROR MESSAGE (Visible only if Down Payment is < 40%) --- */}
        {!isEligible && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl mb-6 flex items-start gap-3 animate-pulse">
            <div className="bg-rose-500/20 p-2 rounded-full text-rose-500 shrink-0">
              <Lock size={16} />
            </div>
            <div>
              <p className="text-rose-400 font-bold text-sm">
                Strict 40% Minimum Required
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Please add{" "}
                <span className="text-rose-300 font-mono font-bold underline">
                  {formatLKR(gap)}
                </span>{" "}
                more to your down payment to qualify.
              </p>
            </div>
          </div>
        )}

        {/* Comparison Card (Dimmed if not eligible) */}
        <div
          className={`bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden relative transition-opacity duration-300 ${
            !isEligible ? "opacity-50 grayscale" : ""
          }`}
        >
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-black px-6 py-2 flex justify-between items-center">
            <span className="font-bold text-xs uppercase tracking-wider">
              Total Savings
            </span>
            <span className="font-bold text-sm bg-black/20 px-2 py-0.5 rounded text-white">
              {formatLKR(savings)} ({savingsPercent.toFixed(0)}% Off)
            </span>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-700 rounded-xl shrink-0">
                  <Store size={24} className="text-rose-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">
                    Dealer Normal
                  </p>
                  <div className="mt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Total Cost
                    </span>
                    <p className="text-white font-bold">
                      {formatLKR(dealerMath.totalCost)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl md:text-2xl font-bold text-rose-400 line-through decoration-rose-500/60 decoration-2">
                  {formatLKR(dealerMath.monthlyRental)}
                </p>
              </div>
            </div>

            <div className="relative h-px bg-slate-700">
              <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-slate-800 px-2 text-xs text-slate-500 font-bold">
                VS
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500 text-black rounded-xl shadow-lg shadow-emerald-500/20 shrink-0">
                  <Building2 size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-400">
                    Direct Bank
                  </p>
                  <div className="mt-1">
                    <span className="text-[10px] text-emerald-500/70 uppercase font-bold tracking-wider">
                      Total Cost
                    </span>
                    <p className="text-white font-bold">
                      {formatLKR(bestMath.totalCost)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl md:text-4xl font-bold text-white tracking-tighter">
                  {formatLKR(bestMath.monthlyRental)}
                </p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                  Per Month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button - DISABLED if not eligible */}
        <button
          onClick={handleOpenComparison}
          disabled={!isEligible}
          className={`w-full mt-6 font-bold py-4 rounded-xl shadow-lg transition-all transform flex items-center justify-center gap-2 ${
            isEligible
              ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-900/40 active:scale-[0.98]"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          {isEligible ? (
            <>
              <span>Apply for this Rate</span>
              <Check size={20} strokeWidth={3} />
            </>
          ) : (
            <>
              <span>Increase Down Payment</span>
              <Lock size={20} />
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-slate-600 mt-4">
          *Rates subject to Central Bank verification.
        </p>
      </div>

      <BankComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        rates={yearRates}
        loanAmount={bestMath.loanAmount}
        duration={selectedDuration}
        bikeName={bikeName}
        onSelectBank={handleSelectBank}
      />

      <LeadModal
        isOpen={isLeadOpen}
        onClose={() => setIsLeadOpen(false)}
        bikeName={bikeName}
        planDetails={selectedBankDetails}
      />
    </>
  );
}
