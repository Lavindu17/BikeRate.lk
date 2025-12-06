import Link from "next/link";
import LeaseCalculator from "@/components/LeaseCalculator";
import StandardLeasePlans from "@/components/StandardLeasePlans";
import { supabase } from "@/lib/supaabaseClient";
import { ArrowLeft, CheckCircle, Tag } from "lucide-react";
import BikeHighlights from "@/components/BikeHighlights";

// Force dynamic rendering so we always get fresh data
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BikePage({ params }: PageProps) {
  const resolvedParams = await params;
  const bikeId = resolvedParams.id;

  // 1. FETCH BIKE
  const { data: bike, error } = await supabase
    .from("bikes")
    .select("*")
    .eq("id", bikeId)
    .single();

  // 2. FETCH RATES
  const { data: rates, error: ratesError } = await supabase
    .from("leasing_factors")
    .select(
      `
      factor_per_100k,
      duration_months,
      banks ( id, name, is_partner )
    `
    )
    .order("duration_months", { ascending: true })
    .order("factor_per_100k", { ascending: true });

  // Debug Logs
  if (ratesError) console.log("RATES ERROR:", ratesError);

  if (error || !bike) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">Bike Not Found 😔</h1>
        <Link
          href="/"
          className="bg-emerald-500 px-6 py-3 rounded-xl font-bold text-black hover:bg-emerald-400 transition-colors"
        >
          Back to Inventory
        </Link>
      </div>
    );
  }

  // Formatting Helper
  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="min-h-screen bg-slate-900 pb-20">
      <nav className="p-6 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to Inventory
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* --- LEFT COLUMN: Bike Info & Specs --- */}
        <div className="space-y-8">
          <div className="aspect-video bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden relative shadow-2xl">
            {bike.image_url ? (
              <img
                src={bike.image_url}
                alt={bike.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                No Image Available
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{bike.name}</h1>
            <p className="text-emerald-400 font-bold text-xl mb-6 uppercase tracking-wider">
              {bike.brand}
            </p>

            {/* Bike Highlights */}
            <div className="mb-8">
              <BikeHighlights
                bikeName={bike.name}
                specs={bike.specifications || undefined}
              />
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-4">Why this bike?</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-slate-300 text-sm items-center">
                  <CheckCircle
                    className="text-emerald-500 shrink-0"
                    size={20}
                  />
                  Fuel Efficient & Low Maintenance
                </li>
                <li className="flex gap-3 text-slate-300 text-sm items-center">
                  <CheckCircle
                    className="text-emerald-500 shrink-0"
                    size={20}
                  />
                  Valid for {bike.condition === "new" ? "New" : "Registered"}{" "}
                  Bike Rates
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Financials --- */}
        <div className="space-y-8">
          {/* 1. Showroom Total Price Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg relative overflow-hidden group">
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex justify-between items-center relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={16} className="text-slate-400" />
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Showroom Cash Price
                  </p>
                </div>
                <h2 className="text-4xl font-bold text-white tracking-tight">
                  {formatLKR(bike.price)}
                </h2>
              </div>
              <div className="text-right">
                <span className="bg-slate-700/50 text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-full border border-slate-600 uppercase">
                  Full Payment
                </span>
              </div>
            </div>
            <p className="text-slate-500 text-[10px] mt-3">
              *Price includes registration fees & standard taxes.
            </p>
          </div>

          {/* 2. Standard Plans */}
          <StandardLeasePlans
            price={bike.price}
            bikeName={bike.name}
            rates={rates || []}
          />

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-slate-600 text-xs font-bold uppercase">
              Or Customize
            </span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          {/* 3. Custom Calculator */}
          <LeaseCalculator
            price={bike.price}
            bikeName={bike.name}
            rates={rates || []}
          />
        </div>
      </div>
    </main>
  );
}
