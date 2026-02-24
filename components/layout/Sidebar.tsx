"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, LayoutDashboard, Users, UserPlus, LogOut, ChevronRight, Stethoscope, Settings } from "lucide-react";

const NAV = [
  { label: "Dashboard",    href: "/dashboard",    icon: LayoutDashboard },
  { label: "All Patients", href: "/patients",     icon: Users            },
  { label: "New Patient",  href: "/patients/new", icon: UserPlus         },
];

interface Props { userName: string; userRole: string; }

export default function Sidebar({ userName, userRole }: Props) {
  const pathname = usePathname();
  const router   = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login"); router.refresh();
  }

  const roleColors: Record<string, string> = {
    ADMIN:  "text-violet-400 bg-violet-400/10 border-violet-400/20",
    DOCTOR: "text-brand-400  bg-brand-400/10  border-brand-400/20",
    STAFF:  "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  };

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col border-r border-white/5 bg-s800/60">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/25">
            <Activity size={17} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-[15px] leading-none">MedCore</p>
            <p className="text-[10px] text-slate-600 mt-0.5 tracking-widest uppercase font-medium">HMS v2.0</p>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
          <div className="avatar w-9 h-9 text-sm">{userName?.[0]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <span className={`badge text-[10px] mt-0.5 ${roleColors[userRole] || roleColors.STAFF}`}>
              {userRole}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-semibold text-slate-700 uppercase tracking-widest">Main Menu</p>
        {NAV.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/dashboard" ? pathname === "/dashboard"
            : href === "/patients" ? pathname === "/patients"
            : pathname === href;
          return (
            <Link key={href} href={href} className={`nav-item ${active ? "active" : ""}`}>
              <Icon size={16} />
              <span className="flex-1 text-[13px]">{label}</span>
              {active && <ChevronRight size={12} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 space-y-0.5">
        <div className="px-3 pt-3 pb-2 border-t border-white/5">
          <p className="text-[10px] font-semibold text-slate-700 uppercase tracking-widest">System</p>
        </div>
        <button onClick={logout}
          className="nav-item w-full text-left hover:!text-red-400 hover:!bg-red-500/8 transition-colors">
          <LogOut size={15} />
          <span className="text-[13px]">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
