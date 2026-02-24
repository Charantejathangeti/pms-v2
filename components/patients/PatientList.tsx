"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, Users, ChevronRight, X, Phone, Droplets, Filter } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { calcAge, fmtDateShort } from "@/lib/utils";

export default function PatientList({ initialPatients }: { initialPatients: any[] }) {
  const [query,    setQuery]    = useState("");
  const [patients, setPatients] = useState(initialPatients);
  const [loading,  setLoading]  = useState(false);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    if (!debounced) { setPatients(initialPatients); return; }
    setLoading(true);
    fetch(`/api/patients?q=${encodeURIComponent(debounced)}`)
      .then(r => r.json()).then(d => { setPatients(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [debounced, initialPatients]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="anim-1 flex items-start justify-between">
        <div>
          <h1 className="page-title">Patient Registry</h1>
          <p className="text-slate-500 text-sm mt-1">{initialPatients.length} patients registered in the system</p>
        </div>
        <Link href="/patients/new" className="btn btn-primary">
          <UserPlus size={16} /> New Patient
        </Link>
      </div>

      {/* Search bar */}
      <div className="anim-2 flex gap-3">
        <div className="input-group flex-1">
          <Search size={16} className="input-icon" />
          <input type="text" placeholder="Search by patient name, MRN or phone number..."
            value={query} onChange={e => setQuery(e.target.value)}
            className="field py-3" />
          {query && (
            <button onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 p-1">
              <X size={14} />
            </button>
          )}
          {loading && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full spin" />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="anim-3">
        {patients.length === 0 ? (
          <div className="card p-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-slate-600" />
            </div>
            <p className="font-semibold text-slate-400">{query ? "No results found" : "No patients registered yet"}</p>
            <p className="text-slate-600 text-sm mt-1">{query ? "Try a different search term" : "Register your first patient to get started"}</p>
            {!query && (
              <Link href="/patients/new" className="btn btn-primary inline-flex mt-5">
                <UserPlus size={15} /> Register First Patient
              </Link>
            )}
          </div>
        ) : (
          <div className="card overflow-hidden">
            {/* Table header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <p className="text-xs text-slate-600 font-semibold">
                {patients.length} {query ? "search results" : "patients"}
              </p>
              {query && (
                <button onClick={() => setQuery("")} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                  <X size={11} /> Clear search
                </button>
              )}
            </div>

            <AnimatePresence>
              {patients.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}>
                  <Link href={`/patients/${p.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-brand-500/4 border-b border-white/4 last:border-0 transition-colors group">

                    {/* Avatar */}
                    <div className="avatar w-11 h-11 text-sm">{p.fullName[0]}</div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white group-hover:text-brand-300 transition-colors text-sm">{p.fullName}</p>
                        {p.bloodGroup && (
                          <span className="badge bg-red-500/10 text-red-400 border-red-500/15 text-[10px]">
                            <Droplets size={8} />{p.bloodGroup}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="mrn">{p.mrn}</span>
                        <span className="text-xs text-slate-600">·</span>
                        <span className="text-xs text-slate-500">{calcAge(p.dob)} yrs · {p.gender}</span>
                        {p.department && (
                          <><span className="text-xs text-slate-600">·</span>
                          <span className="text-xs text-slate-500">{p.department}</span></>
                        )}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="hidden md:flex items-center gap-5 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><Phone size={11} />{p.phone}</span>
                      {p.records[0] && (
                        <div className="text-right">
                          <p className="text-slate-500">Last visit</p>
                          <p className="text-slate-400 font-medium">{fmtDateShort(p.records[0].visitDate)}</p>
                        </div>
                      )}
                    </div>

                    <ChevronRight size={15} className="text-slate-700 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
