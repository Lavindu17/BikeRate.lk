import Hero from "@/components/Hero";
import BikeCard from "@/components/BikeCard";
import { supabase } from "@/lib/supaabaseClient";

// Force fresh data every time (No caching)
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; budget?: string }>;
}) {
  const { q, budget } = await searchParams;

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
    <main className="min-h-screen bg-slate-900 pb-20">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto text-white sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="text-2xl font-bold tracking-tighter cursor-pointer">
          BikeRate<span className="text-emerald-400">.lk</span>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero suggestions={uniqueNames} />

      {/* Inventory Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Latest Inventory</h2>
            <p className="text-slate-400 mt-2">
              Live rates from our partner banks
            </p>
          </div>
          <button className="text-emerald-400 text-sm font-medium hover:text-emerald-300">
            View All &rarr;
          </button>
        </div>

        {/* The Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="col-span-3 text-center py-20 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-slate-400">No bikes found.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
