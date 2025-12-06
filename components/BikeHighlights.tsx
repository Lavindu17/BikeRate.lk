"use client";

import { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

interface BikeSpecs {
  engine_capacity?: string;
  mileage?: string;
  transmission?: string;
  kerb_weight?: string;
  fuel_tank_capacity?: string;
  seat_height?: string;
}

interface BikeHighlightsProps {
  bikeName: string;
  // In a real app, these would come from your DB.
  // We make them optional and provide defaults for the preview.
  specs?: BikeSpecs;
}

export default function BikeHighlights({
  bikeName,
  specs = {
    engine_capacity: "109.51 cc",
    mileage: "65 kmpl",
    transmission: "4 Speed Manual",
    kerb_weight: "112 kg",
    fuel_tank_capacity: "9.1 litres",
    seat_height: "790 mm",
  },
}: BikeHighlightsProps) {
  const [isWeightOpen, setIsWeightOpen] = useState(true);

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-white mb-4">
        {bikeName} Key Highlights
      </h3>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Row 1: Engine */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
          <span className="text-slate-400 font-medium text-sm">
            Engine Capacity
          </span>
          <span className="text-white font-bold">{specs.engine_capacity}</span>
        </div>

        {/* Row 2: Mileage (with Icon) */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium text-sm">Mileage</span>
            <Info size={14} className="text-slate-500" />
          </div>
          <span className="text-white font-bold">{specs.mileage}</span>
        </div>

        {/* Row 3: Transmission */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
          <span className="text-slate-400 font-medium text-sm">
            Transmission
          </span>
          <span className="text-white font-bold">{specs.transmission}</span>
        </div>

        {/* Row 4: Kerb Weight (Interactive/Expandable) */}
        <div className="border-b border-slate-800 bg-slate-800/20">
          <button
            onClick={() => setIsWeightOpen(!isWeightOpen)}
            className="w-full flex justify-between items-center p-4 hover:bg-slate-800/50 transition-colors"
          >
            <span className="text-slate-400 font-medium text-sm">
              Kerb Weight
            </span>
            <div className="flex items-center gap-3">
              <span className="text-white font-bold">{specs.kerb_weight}</span>
              {isWeightOpen ? (
                <ChevronUp size={16} className="text-slate-500" />
              ) : (
                <ChevronDown size={16} className="text-slate-500" />
              )}
            </div>
          </button>

          {/* Expanded Insight Content */}
          {isWeightOpen && (
            <div className="px-4 pb-4 pt-0">
              <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400 border border-slate-700/50">
                Lower kerb weight than{" "}
                <span className="text-emerald-400 font-bold">93%</span> of
                commuter bikes.
              </div>
            </div>
          )}
        </div>

        {/* Row 5: Fuel Tank */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
          <span className="text-slate-400 font-medium text-sm">
            Fuel Tank Capacity
          </span>
          <span className="text-white font-bold">
            {specs.fuel_tank_capacity}
          </span>
        </div>

        {/* Row 6: Seat Height */}
        <div className="flex justify-between items-center p-4 hover:bg-slate-800/50 transition-colors">
          <span className="text-slate-400 font-medium text-sm">
            Seat Height
          </span>
          <span className="text-white font-bold">{specs.seat_height}</span>
        </div>
      </div>
    </div>
  );
}
