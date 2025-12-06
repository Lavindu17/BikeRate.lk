import { supabase } from "@/lib/supaabaseClient";
import Link from "next/link";
import { Phone, User, Calendar } from "lucide-react";

// Force fresh data
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch all leads, newest first
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return (
      <div className="p-10 text-white">
        Error loading leads: {error.message}
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Lead Dashboard{" "}
            <span className="text-emerald-500">({leads?.length || 0})</span>
          </h1>
          <Link href="/" className="text-slate-400 hover:text-white text-sm">
            Back to Site
          </Link>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-sm">
              {leads?.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-700/50 transition-colors"
                >
                  <td className="p-4 text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 text-white font-medium">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-emerald-500" />
                      {lead.customer_name}
                    </div>
                  </td>
                  <td className="p-4">
                    <a
                      href={`tel:${lead.phone}`}
                      className="flex items-center gap-2 text-emerald-400 hover:underline"
                    >
                      <Phone size={14} />
                      {lead.phone}
                    </a>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 uppercase">
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!leads || leads.length === 0) && (
            <div className="p-8 text-center text-slate-500">
              No leads found yet. Go submit one on the site!
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
