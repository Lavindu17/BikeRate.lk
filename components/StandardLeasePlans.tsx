"use client";

import { useState } from "react";
import { calculateLeasing } from "@/lib/finance";
import LeadModal from "./LeadModal";
import BankComparisonModal from "./BankComparisonModal";
import { Building2, Store, TrendingDown, Check, Info } from "lucide-react";

interface StandardPlansProps {
  price: number;
  bikeName?: string;
  rates?: any[];
}

export default function StandardLeasePlans({
  price,
  bikeName = "Unknown",
  rates = [],
}: StandardPlansProps) {
  const safePrice = Number(price);
  const FIXED_DOWN_PAYMENT_PERCENT = 0.4; // 40% Fixed

  const [selectedDuration, setSelectedDuration] = useState(48);

  // Modal States
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [selectedBankDetails, setSelectedBankDetails] = useState("");

  if (!safePrice || isNaN(safePrice)) return null;

  const cashInHand = safePrice * FIXED_DOWN_PAYMENT_PERCENT;

  // Formatter
  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // 1. Filter Rates
  const yearRates =
    rates?.filter((r) => r.duration_months === selectedDuration) || [];

  // 2. Find Best vs Worst
  const bestRate = yearRates.find((r) => r.banks?.is_partner) ||
    yearRates[0] || { factor_per_100k: 0 };
  const dealerRate = yearRates.find((r) => !r.banks?.is_partner) || {
    factor_per_100k: bestRate.factor_per_100k
      ? bestRate.factor_per_100k * 1.15
      : 0,
  };

  // 3. Calculate Math
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
  const isEligible = bestMath.isEligible;
  const gap = bestMath.gap;

  // Handlers
  const handleOpenComparison = () => {
    setIsCompareOpen(true);
  };

  const handleSelectBank = (bankName: string, monthly: number) => {
    setSelectedBankDetails(
      `${bankName} Offer: ${formatLKR(monthly)}/mo for ${
        selectedDuration / 12
      } Years`
    );
    setIsCompareOpen(false); // Close comparison
    setIsLeadOpen(true); // Open contact form
  };

  return (
    <>
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Standard Plan</h3>
            <p className="text-slate-400 text-xs">
              Fixed rate with {FIXED_DOWN_PAYMENT_PERCENT * 100}% down payment
            </p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold uppercase">
            Recommended
          </span>
        </div>

        {/* Down Payment Block */}
        <div className="bg-slate-800/50 rounded-2xl p-5 mb-6 border border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-slate-700 p-2 rounded-lg text-slate-300">
              <Info size={20} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Down Payment
              </p>
              <p className="text-white font-bold text-lg">
                {formatLKR(cashInHand)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Loan Amount
            </p>
            <p className="text-slate-300 font-mono text-lg">
              {formatLKR(bestMath.loanAmount)}
            </p>
          </div>
        </div>

        {/* Duration Tabs */}
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

        {/* Comparison Card */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden relative">
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

        <button
          onClick={handleOpenComparison}
          className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/40 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>Select This Plan</span>
          <Check size={20} strokeWidth={3} />
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
