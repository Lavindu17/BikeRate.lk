import Image from "next/image";
import { calculateLeasing } from "@/lib/finance"; // Connecting the brain
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface BikeCardProps {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string;
}

export default function BikeCard({
  id,
  name,
  brand,
  price,
  imageUrl,
}: BikeCardProps) {
  // 1. THE LOGIC: Calculate the best possible rate (4 years, Partner Bank)
  // We use a "default" factor of 3450 (approx LB Finance rate) just for the preview card.
  // When they click "Details", we will do the real comparison.
  const bestPlan = calculateLeasing(price, 48, 3450, 0, "new");

  return (
    <div className="group relative bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/20">
      {/* Image Section */}
      <div className="relative h-48 w-full bg-slate-700/50">
        {/* Placeholder for now - later we link real images */}
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-medium">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{brand} Image</span>
          )}
        </div>

        {/* Badge */}
        <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          Best Rate
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="mb-4">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            {brand}
          </p>
          <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
            {name}
          </h3>
        </div>

        {/* The "Financial Truth" Hook */}
        <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
          <p className="text-slate-500 text-xs mb-1">
            Estimated Monthly Rental
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-400">
              Rs. {bestPlan.monthlyRental.toLocaleString()}
            </span>
            <span className="text-slate-500 text-sm">/mo</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Full Price: Rs. {(price / 100000).toFixed(1)} Lakhs
          </p>
        </div>

        {/* Action Button */}
        <Link href={`/bike/${id}`} className="block w-full mt-4">
          <button className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-700 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-all text-sm group-hover:shadow-lg">
            Check Eligibility <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    </div>
  );
}
