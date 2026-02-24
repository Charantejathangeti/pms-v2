"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Loader2, CheckCircle2, Clock, Pill, Activity, AlertTriangle } from "lucide-react";
import { createRecord } from "@/lib/actions";
import { DEPARTMENTS, VISIT_TYPES } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props { open: boolean; onClose: () => void; patientId: string; isHistorical: boolean; }
const emptyMed = { name: "", dose: "", frequency: "", duration: "" };

export default function AddRecordModal({ open, onClose, patientId, isHistorical }: Props) {
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [meds,   setMeds]   = useState<typeof emptyMed[]>([]);
  const [form,   setForm]   = useState({
    visitDate: isHistorical ? "" : new Date().toISOString().split("T")[0],
    visitType: isHistorical ? "OPD" : "OPD",
    consultantDoctor: "", department: "",
    chiefComplaint: "", diagnosis: "",
    vitalBP: "", vitalPulse: "", vitalTemp: "", vitalSPO2: "", vitalWeight: "",
    labOrders: "", billingAmount: "", billingStatus: "PENDING", followUpDate: "", notes: "",
  });

  const set = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const setMed = (i: number, f: string, v: string) =>
    setMeds(p => { const n = [...p]; n[i] = { ...n[i], [f]: v }; return n; });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const vitals: Record<string,string> = {};
    if (form.vitalBP)     vitals.BP      = form.vitalBP;
    if (form.vitalPulse)  vitals.Pulse   = form.vitalPulse;
    if (form.vitalTemp)   vitals.Temp    = form.vitalTemp;
    if (form.vitalSPO2)   vitals.SpO2    = form.vitalSPO2;
    if (form.vitalWeight) vitals.Weight  = form.vitalWeight;

    try {
      await createRecord({
        patientId, visitDate: form.visitDate, visitType: form.visitType,
        consultantDoctor: form.consultantDoctor, department: form.department,
        chiefComplaint: form.chiefComplaint, diagnosis: form.diagnosis,
        prescriptionDetails: meds.filter(m => m.name).length > 0
          ? JSON.stringify({ medications: meds.filter(m => m.name) }) : null,
        vitalSigns: Object.keys(vitals).length > 0 ? JSON.stringify(vitals) : null,
        labOrders: form.labOrders || null,
        billingAmount: parseFloat(form.billingAmount) || 0,
        billingStatus: form.billingStatus,
        isHistorical, followUpDate: form.followUpDate || null,
        notes: form.notes || null,
      });
      router.refresh(); onClose();
      setForm({ visitDate: new Date().toISOString().split("T")[0], visitType: "OPD",
        consultantDoctor: "", department: "", chiefComplaint: "", diagnosis: "",
        vitalBP:"", vitalPulse:"", vitalTemp:"", vitalSPO2:"", vitalWeight:"",
        labOrders:"", billingAmount:"", billingStatus:"PENDING", followUpDate:"", notes:"" });
      setMeds([]);
    } finally { setSaving(false); }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-auto card shadow-[0_32px_80px_rgba(0,0,0,0.7)]">

            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#0a1628]/90 backdrop-blur-xl border-b border-white/6">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isHistorical ? "bg-amber-500/15" : "bg-brand-500/15"}`}>
                  {isHistorical ? <Clock size={16} className="text-amber-400" /> : <Plus size={16} className="text-brand-400" />}
                </div>
                <div>
                  <p className="font-semibold text-white">{isHistorical ? "Historical Back-Entry" : "Add New Visit"}</p>
                  <p className="text-[11px] text-slate-600">{isHistorical ? "Records sort by visit date — not entry date" : "Record today's patient visit"}</p>
                </div>
              </div>
              <button onClick={onClose} className="btn-icon"><X size={15} /></button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-5">

              {/* Visit info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">{isHistorical ? "Actual Visit Date *" : "Visit Date *"}</label>
                  <input type="date" name="visitDate" value={form.visitDate} onChange={set} required
                    max={new Date().toISOString().split("T")[0]} className="field" />
                </div>
                <div>
                  <label className="label">Visit Type</label>
                  <select name="visitType" value={form.visitType} onChange={set} className="field">
                    {VISIT_TYPES.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Consultant Doctor *</label>
                  <input name="consultantDoctor" value={form.consultantDoctor} onChange={set} required
                    placeholder="Dr. Name" className="field" />
                </div>
                <div>
                  <label className="label">Department</label>
                  <select name="department" value={form.department} onChange={set} className="field">
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Clinical */}
              <div className="space-y-3">
                <div>
                  <label className="label">Chief Complaint / Reason for Visit</label>
                  <textarea name="chiefComplaint" value={form.chiefComplaint} onChange={set} rows={2}
                    className="field resize-none" placeholder="Patient's main complaints..." />
                </div>
                <div>
                  <label className="label">Diagnosis</label>
                  <textarea name="diagnosis" value={form.diagnosis} onChange={set} rows={2}
                    className="field resize-none" placeholder="Clinical diagnosis..." />
                </div>
              </div>

              {/* Vitals */}
              <div>
                <label className="label mb-2 flex items-center gap-1.5"><Activity size={10} />Vital Signs</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    ["vitalBP",     "BP",       "120/80"],
                    ["vitalPulse",  "Pulse",    "72 bpm"],
                    ["vitalTemp",   "Temp",     "98.6°F"],
                    ["vitalSPO2",   "SpO2",     "99%"],
                    ["vitalWeight", "Weight",   "70 kg"],
                  ].map(([name, label, ph]) => (
                    <div key={name} className="text-center">
                      <p className="text-[10px] text-slate-600 mb-1 uppercase tracking-wider font-semibold">{label}</p>
                      <input name={name} value={(form as any)[name]} onChange={set}
                        placeholder={ph} className="field text-center text-xs py-2 px-1 font-mono" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0 flex items-center gap-1.5"><Pill size={10} />Prescriptions</label>
                  <button type="button" onClick={() => setMeds(p => [...p, { ...emptyMed }])}
                    className="text-[11px] text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold">
                    <Plus size={11} /> Add Medication
                  </button>
                </div>

                {meds.length === 0 ? (
                  <button type="button" onClick={() => setMeds([{ ...emptyMed }])}
                    className="w-full border border-dashed border-white/10 rounded-xl p-3.5 text-slate-600 hover:text-slate-400 hover:border-white/20 transition-all text-xs flex items-center justify-center gap-2">
                    <Pill size={13} /> Click to add prescription
                  </button>
                ) : (
                  <div className="space-y-2">
                    {meds.map((m, i) => (
                      <div key={i} className="bg-brand-500/4 border border-brand-500/10 rounded-xl p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">Medication {i+1}</span>
                          <button type="button" onClick={() => setMeds(p => p.filter((_,j) => j !== i))} className="btn-icon p-1">
                            <Trash2 size={11} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {[["name","Drug name *"],["dose","Dose"],["frequency","Frequency"],["duration","Duration"]].map(([f,ph]) => (
                            <input key={f} placeholder={ph} value={(m as any)[f]}
                              onChange={e => setMed(i, f, e.target.value)} className="field text-xs py-2" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lab + Billing */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="label">Lab Orders / Investigations</label>
                  <input name="labOrders" value={form.labOrders} onChange={set} className="field"
                    placeholder="CBC, LFT, ECG, X-Ray..." />
                </div>
                <div>
                  <label className="label">Billing Amount (₹)</label>
                  <input type="number" name="billingAmount" value={form.billingAmount} onChange={set}
                    placeholder="0" min="0" step="1" className="field" />
                </div>
                <div>
                  <label className="label">Billing Status</label>
                  <select name="billingStatus" value={form.billingStatus} onChange={set} className="field">
                    {["PENDING","PAID","PARTIAL","WAIVED"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Follow-up Date</label>
                  <input type="date" name="followUpDate" value={form.followUpDate} onChange={set}
                    min={new Date().toISOString().split("T")[0]} className="field" />
                </div>
                <div>
                  <label className="label">Notes</label>
                  <input name="notes" value={form.notes} onChange={set} className="field" placeholder="Additional notes..." />
                </div>
              </div>

              {/* Historical banner */}
              {isHistorical && (
                <div className="flex items-start gap-3 bg-amber-500/6 border border-amber-500/15 rounded-xl p-4">
                  <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-300 leading-relaxed">
                    <strong>Historical Record:</strong> This entry will be marked as historical and automatically sorted in the correct chronological position in the patient&apos;s visit timeline, regardless of today&apos;s entry date.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving} className="btn btn-primary flex-1 py-3">
                  {saving ? <><Loader2 size={15} className="spin" /> Saving...</> : <><CheckCircle2 size={15} /> Save Record</>}
                </button>
                <button type="button" onClick={onClose} className="btn btn-secondary px-6">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
