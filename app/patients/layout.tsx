import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

export default async function PatientsLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  return (
    <div className="min-h-screen bg-surface bg-grid-subtle flex">
      <Sidebar userName={session.name} userRole={session.role} />
      <main className="flex-1 overflow-auto min-h-screen">
        <div className="p-7 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
