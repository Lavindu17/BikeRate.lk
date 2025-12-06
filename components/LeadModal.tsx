"use client";

import { useState } from "react";
import { supabase } from "@/lib/supaabaseClient";
import { X, Check, Loader2 } from "lucide-react";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  bikeName: string; // We need to know which bike they want
  planDetails: string; // e.g. "4 Years @ Rs. 16,500"
}

export default function LeadModal({
  isOpen,
  onClose,
  bikeName,
  planDetails,
}: LeadModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // 1. SEND TO SUPABASE
    const { error } = await supabase.from("leads").insert([
      {
        customer_name: formData.name,
        phone: formData.phone,
        status: "new",
        // We can store extra JSON data if we didn't make specific columns for plan details
        // But for now, let's just save the core info.
        // (Ensure your 'leads' table exists from the first SQL script!)
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error saving lead: " + error.message);
    } else {
      setSuccess(true);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white"
        >
          <X size={24} />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <Check size={32} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Request Sent!
            </h3>
            <p className="text-slate-400">
              A bank agent will call you within 30 minutes to confirm your
              eligibility for the{" "}
              <span className="text-emerald-400">{bikeName}</span>.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-1">
              Get Pre-Approved
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              You are applying for:{" "}
              <span className="text-emerald-400 font-bold">{bikeName}</span>
              <br />
              <span className="text-xs text-slate-500">{planDetails}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Your Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Kasun Perera"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Mobile Number
                </label>
                <input
                  required
                  type="tel"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. 077 123 4567"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Submit Application"
                )}
              </button>

              <p className="text-center text-xs text-slate-600 mt-4">
                By submitting, you agree to share your contact details with our
                partner banks (LB Finance / LOLC).
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
