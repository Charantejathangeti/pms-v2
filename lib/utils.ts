export const cn = (...c: (string|undefined|null|false)[]) => c.filter(Boolean).join(" ");

export const fmtDate = (d: string|Date) =>
  new Intl.DateTimeFormat("en-IN",{year:"numeric",month:"long",day:"numeric"}).format(new Date(d));

export const fmtDateShort = (d: string|Date) =>
  new Intl.DateTimeFormat("en-IN",{year:"numeric",month:"short",day:"numeric"}).format(new Date(d));

export const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);

export const calcAge = (dob: string) => {
  const t = new Date(), b = new Date(dob);
  let a = t.getFullYear() - b.getFullYear();
  if (t.getMonth() < b.getMonth() || (t.getMonth()===b.getMonth() && t.getDate()<b.getDate())) a--;
  return a;
};

export const DEPARTMENTS = [
  "General Medicine","Cardiology","Neurology","Orthopedics","Pediatrics",
  "Gynecology & Obstetrics","Dermatology","Ophthalmology","ENT","Psychiatry",
  "Oncology","Urology","Endocrinology","Nephrology","Pulmonology",
  "Gastroenterology","Emergency Medicine","Radiology","Pathology","Dental",
];

export const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
export const REFERRAL_SOURCES = ["Walk-in","Doctor Referral","Emergency","Online Booking","Insurance","Camp/Drive","Other"];
export const VISIT_TYPES = ["OPD","IPD","Emergency","Follow-up","Teleconsult","Day Care"];

export const BILLING_META: Record<string, { label: string; cls: string }> = {
  PAID:    { label: "Paid",    cls: "text-emerald-400 bg-emerald-400/10 border-emerald-500/20" },
  PENDING: { label: "Pending", cls: "text-amber-400  bg-amber-400/10  border-amber-500/20"  },
  PARTIAL: { label: "Partial", cls: "text-blue-400   bg-blue-400/10   border-blue-500/20"   },
  WAIVED:  { label: "Waived",  cls: "text-slate-400  bg-slate-400/10  border-slate-500/20"  },
};
