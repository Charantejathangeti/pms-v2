"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Phone, Mail, MapPin, Droplets, AlertTriangle, Shield, CreditCard,
  Plus, History, ChevronDown, ChevronUp, Trash2, Clock, DollarSign, Pill,
  Stethoscope, Activity, Heart, FileText, User, Calendar,
} from "lucide-react";
import { fmtDate, fmtDateShort, fmtCurrency, calcAge, BILLING_META } from "@/lib/utils";
import AddRecordModal from "./AddRecordModal";
import { deleteRecord } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function PatientProfile({ patient }: { patient: any }) {
  const router = useRouter();
  const [showModal, setShowModal]   = useState(false);
  const [isHist,    setIsHist]      = useState(false);
  const [expanded,  setExpanded]    = useState<Set<string>>(new Set([patient.records[0]?.id]));

  const records = [...patient.records].sort(
    (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
  );

  const toggle = (id: string) =>
    setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  async function handleDelete(id: string) {
    if (!confirm("Permanently delete this record?")) return;
    await deleteRecord(id, patient.id);
    router.refresh();
  }

  const totalPaid   = records.filter(r => r.billingStatus === "PAID").reduce((s,r) => s + r.billingAmount, 0);
  const totalBilled = records.reduce((s,r) => s + r.billingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/patients"
        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-200 text-sm transition-colors anim-1">
        <ArrowLeft size={14} /> Back to Patients
      </Link>

      {/* Header card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="avatar w-20 h-20 text-3xl flex-shrink-0">{patient.fullName[0]}</div>

          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-white">{patient.fullName}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="mrn text-sm">{patient.mrn}</span>
                  {patient.bloodGroup && (
                    <span className="badge bg-red-500/10 text-red-400 border-red-500/15">
                      <Droplets size={9} />{patient.bloodGroup}
                    </span>
                  )}
                  {patient.department && (
                    <span className="badge bg-brand-500/10 text-brand-400 border-brand-500/15">{patient.department}</span>
                  )}
                  {!patient.isActive && (
                    <span className="badge bg-slate-500/10 text-slate-400 border-slate-500/15">Inactive</span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => { setIsHist(false); setShowModal(true); }}
                  className="btn btn-primary text-sm py-2.5 px-4">
                  <Plus size={15} /> Add Visit
                </button>
                <button onClick={() => { setIsHist(true); setShowModal(true); }}
                  className="btn btn-secondary text-sm py-2.5 px-4">
                  <History size={15} /> Back-Entry
                </button>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6 pt-5 border-t border-white/5">
              <InfoItem label="Age & DOB" value={`${calcAge(patient.dob)} years`} sub={fmtDateShort(patient.dob)} icon={Calendar} />
              <InfoItem label="Gender"    value={patient.gender} icon={User} />
              <InfoItem label="Phone"     value={patient.phone}  icon={Phone} />
              {patient.email && <InfoItem label="Email" value={patient.email} icon={Mail} />}
              {patient.address && <InfoItem label="Address" value={patient.address} icon={MapPin} span />}
              {patient.allergies && <InfoItem label="Allergies" value={patient.allergies} icon={AlertTriangle} cls="text-amber-400" />}
              {patient.chronicConditions && <InfoItem label="Chronic Conditions" value={patient.chronicConditions} icon={Heart} cls="text-red-400" span />}
              {patient.emergencyContact && <InfoItem label="Emergency Contact" value={patient.emergencyContact} sub={patient.emergencyPhone || ""} icon={Phone} />}
              {patient.insuranceProvider && <InfoItem label="Insurance" value={patient.insuranceProvider} sub={patient.insuranceNumber || ""} icon={CreditCard} />}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 anim-2">
        {[
          { label: "Total Visits",    val: records.length,                 icon: Activity,  color: "text-brand-400"   },
          { label: "Total Billed",    val: fmtCurrency(totalBilled),       icon: FileText,  color: "text-amber-400"   },
          { label: "Total Paid",      val: fmtCurrency(totalPaid),         icon: Shield,    color: "text-emerald-400" },
          { label: "Last Visit",      val: records[0] ? fmtDateShort(records[0].visitDate) : "—", icon: Calendar, color: "text-slate-400" },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <s.icon size={18} className={`${s.color} mx-auto mb-2`} />
            <p className={`font-display text-lg font-bold ${s.color}`}>{s.val}</p>
            <p className="text-xs text-slate-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="anim-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Visit Timeline</h2>
          <p className="text-xs text-slate-600">{records.length} records · sorted by visit date</p>
        </div>

        {records.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No visit records yet</p>
            <button onClick={() => { setIsHist(false); setShowModal(true); }}
              className="btn btn-primary inline-flex mt-4">
              <Plus size={15} /> Add First Visit
            </button>
          </div>
        ) : (
          <div className="relative space-y-3 pl-5">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-3 bottom-3 w-px bg-gradient-to-b from-brand-500/50 via-brand-500/20 to-transparent" />

            <AnimatePresence>
              {records.map((r, i) => {
                const isOpen = expanded.has(r.id);
                const presc  = r.prescriptionDetails
                  ? (() => { try { return JSON.parse(r.prescriptionDetails); } catch { return null; } })()
                  : null;
                const vitals = r.vitalSigns
                  ? (() => { try { return JSON.parse(r.vitalSigns); } catch { return null; } })()
                  : null;
                const bm = BILLING_META[r.billingStatus] || BILLING_META.PENDING;

                return (
                  <motion.div key={r.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative">

                    {/* Timeline dot */}
                    <div className={`absolute -left-3.5 timeline-dot ${r.isHistorical ? "bg-amber-400 text-amber-400" : "bg-brand-500 text-brand-500"}`} />

                    <div className="card-hover overflow-hidden">
                      {/* Summary row (always visible) */}
                      <button onClick={() => toggle(r.id)}
                        className="w-full flex items-start gap-4 p-5 text-left">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-white">{fmtDate(r.visitDate)}</span>
                            {r.isHistorical && (
                              <span className="badge bg-amber-500/8 text-amber-400 border-amber-500/15 text-[10px]">
                                <Clock size={9} /> Historical
                              </span>
                            )}
                            <span className={`badge text-[10px] ${bm.cls}`}>{bm.label}</span>
                            {r.visitType && r.visitType !== "OPD" && (
                              <span className="badge bg-white/5 text-slate-400 border-white/8 text-[10px]">{r.visitType}</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            <span className="font-medium text-slate-400">{r.consultantDoctor}</span>
                            {r.department && ` · ${r.department}`}
                          </p>
                          {r.diagnosis && (
                            <p className="text-sm text-slate-300 mt-1.5 font-medium">
                              <span className="text-slate-600 text-xs font-normal">Dx: </span>{r.diagnosis}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-emerald-400 font-bold text-sm">{fmtCurrency(r.billingAmount)}</p>
                            {r.followUpDate && (
                              <p className="text-[10px] text-slate-600 mt-0.5">Follow-up: {fmtDateShort(r.followUpDate)}</p>
                            )}
                          </div>
                          {isOpen
                            ? <ChevronUp size={15} className="text-slate-500" />
                            : <ChevronDown size={15} className="text-slate-500" />}
                        </div>
                      </button>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden">
                            <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">

                              {/* Vitals strip */}
                              {vitals && (
                                <div>
                                  <p className="label mb-2">Vital Signs</p>
                                  <div className="flex flex-wrap gap-2">
                                    {Object.entries(vitals).map(([k,v]) => (
                                      <div key={k} className="bg-white/4 border border-white/6 rounded-lg px-3 py-1.5 text-center">
                                        <p className="text-[10px] text-slate-600 uppercase tracking-wider">{k.replace(/([A-Z])/g," $1").trim()}</p>
                                        <p className="text-sm font-semibold text-white font-mono">{v as string}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {r.chiefComplaint && <DetailRow label="Chief Complaint" value={r.chiefComplaint} />}
                              {r.diagnosis      && <DetailRow label="Diagnosis"       value={r.diagnosis}      />}

                              {/* Prescriptions */}
                              {presc?.medications?.length > 0 && (
                                <div>
                                  <p className="label mb-2">Prescriptions</p>
                                  <div className="space-y-1.5">
                                    {presc.medications.map((m: any, mi: number) => (
                                      <div key={mi} className="flex items-center gap-3 bg-brand-500/4 border border-brand-500/10 rounded-xl px-4 py-2.5 text-sm">
                                        <Pill size={13} className="text-brand-400 flex-shrink-0" />
                                        <span className="font-semibold text-white">{m.name}</span>
                                        <span className="text-slate-500 text-xs bg-white/5 px-2 py-0.5 rounded-md">{m.dose}</span>
                                        <span className="text-slate-400 text-xs">{m.frequency}</span>
                                        <span className="text-slate-600 text-xs ml-auto">{m.duration}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {r.labOrders && <DetailRow label="Lab Orders" value={r.labOrders} />}
                              {r.notes      && <DetailRow label="Notes"      value={r.notes}     />}

                              {/* Footer */}
                              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-slate-500">
                                    Bill: <span className="text-white font-semibold">{fmtCurrency(r.billingAmount)}</span>
                                  </span>
                                  <span className={`badge ${bm.cls} text-[10px]`}>{bm.label}</span>
                                </div>
                                <button onClick={() => handleDelete(r.id)} className="btn btn-danger text-xs py-1.5 px-3">
                                  <Trash2 size={12} /> Delete
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AddRecordModal open={showModal} onClose={() => setShowModal(false)}
        patientId={patient.id} isHistorical={isHist} />
    </div>
  );
}

function InfoItem({ label, value, sub, icon: Icon, span, cls }: {
  label: string; value: string; sub?: string; icon: any; span?: boolean; cls?: string;
}) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="label mb-1 flex items-center gap-1"><Icon size={9} />{label}</p>
      <p className={`text-sm font-medium text-slate-200 ${cls || ""}`}>{value}</p>
      {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label mb-1">{label}</p>
      <p className="text-sm text-slate-300 leading-relaxed">{value}</p>
    </div>
  );
}
