import Hero from "@/components/Hero";
import BikeCard from "@/components/BikeCard";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supaabaseClient";
import Link from "next/link";
import { Bike, XCircle } from "lucide-react";

// Force fresh data every time (No caching)
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; budget?: string }>;
}) {
  const { q, budget } = await searchParams;
  const isFiltered = !!(q || budget);

  // 1. Start building the query
  let query = supabase
    .from("bikes")
    .select("*")
    .order("id", { ascending: false });

  // 2. Apply filters if present
  if (q) {
    // Filter by name (case-insensitive partial match)
    query = query.ilike("name", `%${q}%`);
  }
  if (budget) {
    // Filter by price (less than or equal to budget)
    query = query.lte("price", parseInt(budget));
  }

  // 3. Execute the query
  const { data: bikes, error } = await query;

  // 4. Fetch all bike names for autocomplete (separate query to get all options)
  const { data: allBikes } = await supabase.from("bikes").select("name");
  // Extract unique names
  const uniqueNames = Array.from(new Set(allBikes?.map((b) => b.name) || []));

  if (error) {
    console.error("Error fetching bikes:", error);
  }

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2"
          >
            <Bike className="text-emerald-400" />
            <span>
              BikeRate<span className="text-emerald-400">.lk</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link
              href="#inventory"
              className="hover:text-white transition-colors"
            >
              Inventory
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          <button className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all border border-slate-700 hover:border-slate-600">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero suggestions={uniqueNames} />

      {/* Inventory Section */}
      <section
        id="inventory"
        className="flex-grow max-w-7xl mx-auto px-4 py-16 w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Latest Inventory
            </h2>
            <p className="text-slate-400 mt-2 text-lg">
              {isFiltered
                ? `Showing results for ${q ? `"${q}"` : ""} ${
                    q && budget ? "and" : ""
                  } ${
                    budget
                      ? `budget ≤ LKR ${parseInt(budget).toLocaleString()}`
                      : ""
                  }`
                : "Live rates from our partner banks"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {isFiltered && (
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-800"
              >
                <XCircle size={18} />
                <span>Clear Filters</span>
              </Link>
            )}
            <button className="text-emerald-400 text-sm font-medium hover:text-emerald-300 flex items-center gap-1">
              View All <span className="text-lg">→</span>
            </button>
          </div>
        </div>

        {/* The Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bikes && bikes.length > 0 ? (
            bikes.map((bike) => (
              <BikeCard
                key={bike.id}
                id={bike.id}
                name={bike.name}
                brand={bike.brand}
                price={bike.price}
                imageUrl={bike.image_url}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 bg-slate-800/50 rounded-3xl border border-slate-700/50 border-dashed">
              <Bike size={64} className="text-slate-600 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No bikes found
              </h3>
              <p className="text-slate-400 mb-8 text-center max-w-md">
                We couldn't find any bikes matching your criteria. Try adjusting
                your search or budget.
              </p>
              <Link
                href="/"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-medium transition-colors"
              >
                View All Bikes
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
