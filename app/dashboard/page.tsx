import { getDashboardStats } from "@/lib/actions";
import { ChevronRight } from "lucide-react";
import { getSession } from "@/lib/auth";
import { Users, Calendar, IndianRupee, Clock, ArrowRight, UserPlus, Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import { fmtCurrency, fmtDateShort, calcAge } from "@/lib/utils";

export default async function DashboardPage() {
  const [session, stats] = await Promise.all([getSession(), getDashboardStats()]);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="anim-1 flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">
            {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
          </p>
          <h1 className="page-title">
            {greeting}, <span className="text-brand-grad">{session?.name?.split(" ").slice(0,2).join(" ")}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Here&apos;s your hospital overview for today</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse" />
            <span className="text-xs text-emerald-400 font-semibold">System Online</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 anim-2">
        <StatCard icon={Users}       label="Total Patients"  value={stats.total.toLocaleString("en-IN")} sub="All time records"       color="blue"    />
        <StatCard icon={Calendar}    label="Today's Visits"  value={stats.todayVisits.toString()}        sub="Appointments today"     color="green"   />
        <StatCard icon={IndianRupee} label="Monthly Revenue" value={fmtCurrency(stats.monthRevenue as number)} sub="This month (paid)"  color="purple"  />
        <StatCard icon={Clock}       label="Pending Bills"   value={stats.pending.toString()}            sub="Awaiting payment"       color="amber"   />
      </div>

      {/* Quick Actions */}
      <div className="anim-3">
        <p className="section-title mb-4">Quick Actions</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/patients/new" className="card-hover p-5 group flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/12 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
              <UserPlus size={24} className="text-brand-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-[15px]">Register New Patient</p>
              <p className="text-slate-500 text-sm mt-0.5">Create a complete patient record with MRN</p>
            </div>
            <ArrowRight size={16} className="text-slate-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link href="/patients" className="card-hover p-5 group flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/18 transition-colors">
              <Search size={24} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-[15px]">Search Patient Records</p>
              <p className="text-slate-500 text-sm mt-0.5">Find by name, MRN or phone number</p>
            </div>
            <ArrowRight size={16} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 anim-4">

        {/* Recent patients */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">Recent Patients</p>
            <Link href="/patients" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="card overflow-hidden">
            {stats.recent.length === 0
              ? <div className="p-10 text-center text-slate-600">No patients yet</div>
              : stats.recent.map((p: any) => (
                <Link key={p.id} href={`/patients/${p.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-500/4 transition-colors border-b border-white/4 last:border-0 group">
                  <div className="avatar w-10 h-10 text-sm">{p.fullName[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors truncate">{p.fullName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="mrn">{p.mrn}</span>
                      <span className="text-xs text-slate-600">{calcAge(p.dob)} yrs · {p.gender}</span>
                    </div>
                  </div>
                  <div className="hidden md:block text-right flex-shrink-0">
                    {p.records[0] && <p className="text-xs text-slate-500">{fmtDateShort(p.records[0].visitDate)}</p>}
                    <p className="text-xs text-slate-600 mt-0.5">{p.department || "—"}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-700 group-hover:text-brand-400 transition-colors flex-shrink-0" />
                </Link>
              ))}
          </div>
        </div>

        {/* Top departments */}
        <div>
          <p className="section-title mb-4">Top Departments</p>
          <div className="card p-5 space-y-4">
            {stats.deptCounts.length === 0
              ? <p className="text-slate-600 text-sm">No data yet</p>
              : stats.deptCounts.map((d: any, i: number) => {
                  const pct = Math.round((d._count.id / stats.total) * 100);
                  return (
                    <div key={d.department || "Other"}>
                      <div className="flex justify-between items-center mb-1.5">
                        <p className="text-sm text-slate-300 font-medium">{d.department || "General"}</p>
                        <p className="text-xs text-slate-500">{d._count.id} patients</p>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all"
                          style={{ width: `${Math.max(pct, 5)}%` }} />
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: any) {
  const colors: Record<string, { bg: string; icon: string; bar: string }> = {
    blue:   { bg: "bg-brand-500/10   border-brand-500/15",  icon: "text-brand-400",   bar: "from-brand-600 to-brand-400"   },
    green:  { bg: "bg-emerald-500/10 border-emerald-500/15",icon: "text-emerald-400", bar: "from-emerald-600 to-emerald-400" },
    purple: { bg: "bg-violet-500/10  border-violet-500/15", icon: "text-violet-400",  bar: "from-violet-600 to-violet-400"  },
    amber:  { bg: "bg-amber-500/10   border-amber-500/15",  icon: "text-amber-400",   bar: "from-amber-600 to-amber-400"    },
  };
  const c = colors[color];
  return (
    <div className={`stat-card card ${c.bg}`}>
      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-4`}>
        <Icon size={18} className={c.icon} />
      </div>
      <p className="font-display text-2xl font-bold text-white">{value}</p>
      <p className="text-sm font-semibold text-white/80 mt-0.5">{label}</p>
      <p className="text-xs text-slate-600 mt-0.5">{sub}</p>
    </div>
  );
}
