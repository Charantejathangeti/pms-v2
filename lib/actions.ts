"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function generateMRN() {
  const yr = new Date().getFullYear();
  const n = await prisma.patient.count({ where: { mrn: { startsWith: `MRN-${yr}-` } } });
  return `MRN-${yr}-${String(n+1).padStart(4,"0")}`;
}

export async function createPatient(data: Record<string,string>) {
  const mrn = await generateMRN();
  const patient = await prisma.patient.create({ data: { mrn, ...data } as any });
  revalidatePath("/patients");
  return { success: true, patient };
}

export async function getAllPatients() {
  return prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
    include: { records: { orderBy: { visitDate: "desc" }, take: 1 } },
  });
}

export async function searchPatients(q: string) {
  if (!q || q.length < 2) return [];
  return prisma.patient.findMany({
    where: { OR: [
      { fullName: { contains: q } },
      { mrn: { contains: q } },
      { phone: { contains: q } },
    ]},
    take: 20, orderBy: { fullName: "asc" },
  });
}

export async function getPatientById(id: string) {
  return prisma.patient.findUnique({
    where: { id },
    include: { records: { orderBy: { visitDate: "desc" } } },
  });
}

export async function createRecord(data: Record<string,any>) {
  const record = await prisma.medicalRecord.create({ data });
  revalidatePath(`/patients/${data.patientId}`);
  return { success: true, record };
}

export async function deleteRecord(id: string, patientId: string) {
  await prisma.medicalRecord.delete({ where: { id } });
  revalidatePath(`/patients/${patientId}`);
  return { success: true };
}

export async function getDashboardStats() {
  const today = new Date().toISOString().split("T")[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];

  const [total, records, recent, deptCounts] = await Promise.all([
    prisma.patient.count(),
    prisma.medicalRecord.findMany({ select: { visitDate:true, billingAmount:true, billingStatus:true, department:true } }),
    prisma.patient.findMany({ take: 6, orderBy: { createdAt: "desc" },
      include: { records: { take: 1, orderBy: { visitDate: "desc" } } } }),
    prisma.patient.groupBy({ by: ["department"], _count: { id: true }, orderBy: { _count: { id: "desc" } }, take: 5 }),
  ]);

  const todayVisits = records.filter(r => r.visitDate === today).length;
  const monthRevenue = records.filter(r => r.billingStatus === "PAID" && r.visitDate >= monthStart).reduce((s,r) => s + r.billingAmount, 0);
  const pending = records.filter(r => r.billingStatus === "PENDING").length;

  return { total, todayVisits, monthRevenue, pending, recent, deptCounts };
}
