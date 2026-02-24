"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createPatient } from "@/lib/actions";
import { DEPARTMENTS, BLOOD_GROUPS, REFERRAL_SOURCES } from "@/lib/utils";
import { Hash, CheckCircle2, Loader2, User, Phone, Stethoscope, AlertTriangle, ShieldCheck, CreditCard } from "lucide-react";

export default function NewPatientForm() {
  const router = useRouter();
  const [mrn,     setMrn]     = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");
  const [form,    setForm]    = useState({
    fullName:"", dob:"", gender:"", phone:"", email:"",
    bloodGroup:"", department:"", referralSource:"",
    address:"", emergencyContact:"", emergencyPhone:"",
    allergies:"", chronicConditions:"",
    insuranceProvider:"", insuranceNumber:"", notes:"",
  });

  useEffect(() => {
    fetch("/api/generate-mrn").then(r => r.json()).then(d => setMrn(d.mrn));
  }, []);

  const set = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.dob || !form.gender || !form.phone || !form.department) {
      setError("Please fill in all required fields marked with *"); return;
    }
    setLoading(true); setError("");
    try {
      const res = await createPatient(form);
      if (res.success) { setSuccess(true); setTimeout(() => router.push(`/patients/${res.patient.id}`), 1500); }
    } catch (err: any) { setError(err.message || "Failed to register patient"); setLoading(false); }
  }

  if (success) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="card p-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 size={40} className="text-emerald-400" />
      </div>
      <h2 className="font-display text-2xl font-bold text-white mb-2">Patient Registered!</h2>
      <p className="text-slate-400">MRN assigned: <span className="text-brand-400 font-mono font-bold text-lg">{mrn}</span></p>
      <p className="text-slate-600 text-sm mt-2">Redirecting to patient profile...</p>
    </motion.div>
  );

  return (
    <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-5 pb-10">

      {/* MRN Banner */}
      <div className="card p-4 flex items-center gap-4 border-brand-500/20 bg-brand-500/5">
        <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center flex-shrink-0">
          <Hash size={20} className="text-brand-400" />
        </div>
        <div>
          <p className="label mb-0.5">Auto-Generated Patient ID</p>
          <p className="font-mono font-bold text-brand-400 text-xl tracking-wider">{mrn || "Generating..."}</p>
        </div>
        <div className="ml-auto hidden md:block">
          <p className="text-xs text-slate-600">This ID is permanent and unique</p>
        </div>
      </div>

      {/* Personal Info */}
      <FormSection title="Personal Information" icon={User} required>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Full Name *</label>
            <input name="fullName" value={form.fullName} onChange={set} required className="field" placeholder="e.g. Rajesh Kumar Verma" />
          </div>
          <div>
            <label className="label">Date of Birth *</label>
            <input type="date" name="dob" value={form.dob} onChange={set} required
              max={new Date().toISOString().split("T")[0]} className="field" />
          </div>
          <div>
            <label className="label">Gender *</label>
            <select name="gender" value={form.gender} onChange={set} required className="field">
              <option value="">Select gender</option>
              {["Male","Female","Other","Prefer not to say"].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Blood Group</label>
            <select name="bloodGroup" value={form.bloodGroup} onChange={set} className="field">
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Allergies</label>
            <input name="allergies" value={form.allergies} onChange={set} className="field" placeholder="e.g. Penicillin, Sulfa drugs" />
          </div>
          <div className="md:col-span-2">
            <label className="label">Chronic Conditions</label>
            <input name="chronicConditions" value={form.chronicConditions} onChange={set} className="field" placeholder="e.g. Hypertension, Type 2 Diabetes" />
          </div>
        </div>
      </FormSection>

      {/* Contact */}
      <FormSection title="Contact Information" icon={Phone} required>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Phone Number *</label>
            <input name="phone" value={form.phone} onChange={set} required className="field" placeholder="+91-98765-43210" />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" name="email" value={form.email} onChange={set} className="field" placeholder="patient@email.com" />
          </div>
          <div className="md:col-span-2">
            <label className="label">Full Address</label>
            <input name="address" value={form.address} onChange={set} className="field" placeholder="House No., Street, City, Pincode" />
          </div>
        </div>
      </FormSection>

      {/* Emergency */}
      <FormSection title="Emergency Contact" icon={AlertTriangle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Contact Person Name</label>
            <input name="emergencyContact" value={form.emergencyContact} onChange={set} className="field" placeholder="Relative / Guardian name" />
          </div>
          <div>
            <label className="label">Contact Phone</label>
            <input name="emergencyPhone" value={form.emergencyPhone} onChange={set} className="field" placeholder="+91-98765-43211" />
          </div>
        </div>
      </FormSection>

      {/* Medical */}
      <FormSection title="Medical & Registration" icon={Stethoscope} required>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Department *</label>
            <select name="department" value={form.department} onChange={set} required className="field">
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Referral Source</label>
            <select name="referralSource" value={form.referralSource} onChange={set} className="field">
              <option value="">Select source</option>
              {REFERRAL_SOURCES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Notes</label>
            <textarea name="notes" value={form.notes} onChange={set} rows={2} className="field resize-none" placeholder="Any additional notes or special instructions..." />
          </div>
        </div>
      </FormSection>

      {/* Insurance */}
      <FormSection title="Insurance Details" icon={CreditCard}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Insurance Provider</label>
            <input name="insuranceProvider" value={form.insuranceProvider} onChange={set} className="field" placeholder="e.g. Star Health, HDFC Ergo" />
          </div>
          <div>
            <label className="label">Policy / Insurance Number</label>
            <input name="insuranceNumber" value={form.insuranceNumber} onChange={set} className="field" placeholder="Policy number" />
          </div>
        </div>
      </FormSection>

      {error && (
        <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
          <AlertTriangle size={15} />{error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn btn-primary flex-1 py-3.5 text-[15px]">
          {loading ? <><Loader2 size={16} className="spin" /> Registering Patient...</> : <><ShieldCheck size={16} /> Register Patient</>}
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-secondary px-6">Cancel</button>
      </div>
    </motion.form>
  );
}

function FormSection({ title, icon: Icon, children, required }: {
  title: string; icon: any; children: React.ReactNode; required?: boolean;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-brand-500/12 flex items-center justify-center">
          <Icon size={15} className="text-brand-400" />
        </div>
        <h3 className="font-semibold text-white text-[15px]">{title}</h3>
        {required && <span className="ml-auto text-[10px] text-slate-600 font-medium">* Required fields</span>}
      </div>
      {children}
    </div>
  );
}
