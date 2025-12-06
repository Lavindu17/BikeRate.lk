"use client";

import { X, Building2, ChevronRight, CheckCircle2 } from "lucide-react";

interface BankComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: any[]; // The list of rates for the selected duration
  loanAmount: number;
  duration: number;
  bikeName: string;
  onSelectBank: (bankName: string, monthly: number) => void; // Callback when user picks a bank
}

export default function BankComparisonModal({
  isOpen,
  onClose,
  rates = [],
  loanAmount,
  duration,
  bikeName,
  onSelectBank,
}: BankComparisonModalProps) {
  if (!isOpen) return null;

  // 1. Helper to Calculate Monthly & Total for a specific rate
  const calculateRow = (factor: number) => {
    const monthly = Math.ceil((loanAmount / 100000) * factor);
    const total = monthly * duration;
    return { monthly, total };
  };

  // 2. Sort rates: Partner banks first, then by lowest factor
  const sortedRates = [...rates].sort((a, b) => {
    if (a.banks.is_partner && !b.banks.is_partner) return -1;
    if (!a.banks.is_partner && b.banks.is_partner) return 1;
    return a.factor_per_100k - b.factor_per_100k;
  });

  // Formatter
  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl flex flex-col max-h-[90vh] shadow-2xl relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-800/50 rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-white">
              Select a Leasing Partner
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Comparing rates for{" "}
              <span className="text-emerald-400 font-bold">{bikeName}</span>
            </p>
            <div className="flex gap-4 mt-3 text-xs font-mono text-slate-500">
              <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">
                Loan: {formatLKR(loanAmount)}
              </span>
              <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">
                Duration: {duration / 12} Years
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* List of Banks */}
        <div className="overflow-y-auto p-4 space-y-3">
          {sortedRates.length === 0 ? (
            <div className="text-center p-8 text-slate-500">
              No rates available for this duration.
            </div>
          ) : (
            sortedRates.map((rate, idx) => {
              const { monthly, total } = calculateRow(rate.factor_per_100k);
              const isBestRate = idx === 0; // Assuming first one is best after sort

              return (
                <div
                  key={idx}
                  className={`group relative p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                    rate.banks.is_partner
                      ? "bg-slate-800/80 border-emerald-500/30 hover:border-emerald-500"
                      : "bg-slate-800/30 border-slate-700 hover:border-slate-600"
                  }`}
                >
                  {isBestRate && (
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                      BEST RATE
                    </span>
                  )}

                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Bank Info */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div
                        className={`p-3 rounded-lg ${
                          rate.banks.is_partner
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white flex items-center gap-2">
                          {rate.banks.name}
                          {rate.banks.is_partner && (
                            <CheckCircle2
                              size={14}
                              className="text-emerald-500"
                            />
                          )}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Partner Verified
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-[10px] uppercase text-slate-500 font-bold">
                          Monthly
                        </p>
                        <p className="text-lg font-bold text-white">
                          {formatLKR(monthly)}
                        </p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] uppercase text-slate-500 font-bold">
                          Total Pay
                        </p>
                        <p className="text-sm font-mono text-slate-400">
                          {formatLKR(total)}
                        </p>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => onSelectBank(rate.banks.name, monthly)}
                        className="bg-slate-700 hover:bg-emerald-500 hover:text-black text-white p-2 rounded-lg transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
