"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, Loader2, ChevronRight, Heart, Shield, Activity, Stethoscope } from "lucide-react";

const FEATURES = [
  { icon: Activity,    title: "Live Patient Monitoring",    sub: "Real-time vital signs & alerts"  },
  { icon: Stethoscope, title: "Complete Visit History",     sub: "Chronological medical timeline"  },
  { icon: Shield,      title: "HIPAA Compliant Security",   sub: "End-to-end encrypted records"    },
  { icon: Heart,       title: "Integrated Billing",         sub: "Seamless payment management"     },
];

const ECG_PATH = "M0,50 L30,50 L40,20 L50,80 L60,10 L70,70 L80,50 L200,50";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [pass,  setPass]      = useState("");
  const [show,  setShow]      = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,  setError]    = useState("");
  const [tick,   setTick]     = useState(0);

  useEffect(() => { const t = setInterval(() => setTick(p => p + 1), 3000); return () => clearInterval(t); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      if (res.ok) { router.push("/dashboard"); router.refresh(); }
      else { const d = await res.json(); setError(d.error || "Login failed"); }
    } catch { setError("Connection error. Please try again."); }
    finally { setLoading(false); }
  }

  function fillDemo(role: "admin" | "doctor" | "staff") {
    const creds = {
      admin:  { e: "admin@medcore.com",  p: "admin123"  },
      doctor: { e: "doctor@medcore.com", p: "doctor123" },
      staff:  { e: "staff@medcore.com",  p: "staff123"  },
    };
    setEmail(creds[role].e); setPass(creds[role].p); setError("");
  }

  return (
    <div className="min-h-screen flex bg-surface overflow-hidden">

      {/* ── Left panel ─────────────────────────────────── */}
      <div className="hidden lg:flex flex-col w-[55%] relative bg-s800 bg-mesh">
        {/* Grid */}
        <div className="absolute inset-0 bg-grid-subtle" />

        {/* Decorative circles */}
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] rounded-full bg-brand-500/5 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-80px]  w-[300px] h-[300px] rounded-full bg-brand-700/8 blur-3xl" />

        <div className="relative z-10 flex flex-col h-full px-14 py-12">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <p className="font-display text-white font-bold text-xl leading-none">MedCore HMS</p>
              <p className="text-[11px] text-brand-400 mt-0.5 font-medium tracking-widest uppercase">Hospital Management</p>
            </div>
          </motion.div>

          {/* Hero text */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
            <h1 className="font-display text-5xl font-bold text-white leading-tight mb-4">
              Smarter Care,<br />
              <span className="text-brand-grad">Better Outcomes.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              A complete patient management platform built for modern hospitals — from registration to discharge.
            </p>
          </motion.div>

          {/* ECG animation */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-12">
            <svg viewBox="0 0 200 100" className="w-full max-w-xs h-12 overflow-visible">
              <motion.path
                d={ECG_PATH} fill="none" stroke="#0e7fe1" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              />
              <motion.circle r="4" fill="#0e7fe1"
                animate={{ offsetDistance: ["0%", "100%"] } as any}
                style={{ offsetPath: `path("${ECG_PATH}")` } as any}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "linear" }}
              />
            </svg>
          </motion.div>

          {/* Features */}
          <div className="space-y-4 flex-1">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/5">
                  <div className="w-9 h-9 rounded-lg bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-brand-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{f.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stats strip */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="mt-10 flex gap-8 pt-8 border-t border-white/5">
            {[["5,000+","Patients Served"],["99.9%","Uptime SLA"],["ISO 27001","Certified"]].map(([v, l]) => (
              <div key={l}>
                <p className="font-display text-xl font-bold text-white">{v}</p>
                <p className="text-xs text-slate-500 mt-0.5">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Right panel — Login ─────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-mesh" />

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8 relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Activity size={18} className="text-white" />
          </div>
          <p className="font-display font-bold text-white text-lg">MedCore HMS</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className="w-full max-w-md relative">

          {/* Card */}
          <div className="card p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)] glow-sm">

            {/* Header */}
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-white">Welcome back</h2>
              <p className="text-slate-500 text-sm mt-1">Sign in to your HMS account</p>
            </div>

            {/* Quick fill buttons */}
            <div className="mb-6">
              <p className="label mb-2">Quick Login (Demo)</p>
              <div className="flex gap-2">
                {(["admin","doctor","staff"] as const).map(role => (
                  <button key={role} type="button" onClick={() => fillDemo(role)}
                    className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all duration-150
                      bg-white/4 border-white/8 text-slate-400 hover:bg-brand-500/10 hover:border-brand-500/30 hover:text-brand-400 capitalize">
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/6" />
              <p className="text-xs text-slate-600 font-medium">or enter credentials</p>
              <div className="flex-1 h-px bg-white/6" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <div className="input-group">
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@medcore.com" required className="field" />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="input-group">
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input type={show ? "text" : "password"} value={pass}
                    onChange={e => setPass(e.target.value)}
                    placeholder="••••••••" required className="field pr-11" />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors p-1">
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
                    <AlertCircle size={15} className="flex-shrink-0" />{error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
                className="btn btn-primary w-full py-3.5 text-[15px] mt-2">
                {loading
                  ? <><Loader2 size={17} className="spin" /> Authenticating...</>
                  : <><Shield size={17} /> Sign In to HMS <ChevronRight size={15} /></>}
              </motion.button>
            </form>

            {/* Credentials reference */}
            <div className="mt-6 p-4 rounded-xl bg-navy-900/60 border border-white/5">
              <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-3 text-center">Demo Credentials</p>
              <div className="space-y-2">
                {[
                  { role: "Admin",  email: "admin@medcore.com",  pass: "admin123",  color: "text-violet-400" },
                  { role: "Doctor", email: "doctor@medcore.com", pass: "doctor123", color: "text-brand-400"   },
                  { role: "Staff",  email: "staff@medcore.com",  pass: "staff123",  color: "text-emerald-400" },
                ].map(c => (
                  <div key={c.role} className="flex items-center justify-between text-xs">
                    <span className={`font-semibold ${c.color} w-14`}>{c.role}</span>
                    <span className="font-mono text-slate-400">{c.email}</span>
                    <span className="font-mono text-slate-600">{c.pass}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-700 mt-5">
            © 2026 MedCore HMS · HIPAA Compliant · v2.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
