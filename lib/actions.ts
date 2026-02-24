"use server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/* =========================================
   GENERATE MRN
========================================= */
export async function generateMRN() {
  const year = new Date().getFullYear()

  const count = await prisma.patient.count({
    where: {
      mrn: {
        startsWith: `MRN-${year}-`,
      },
    },
  })

  return `MRN-${year}-${String(count + 1).padStart(4, "0")}`
}

/* =========================================
   CREATE PATIENT
========================================= */
export async function createPatient(data: any) {
  const mrn = await generateMRN()

  const patient = await prisma.patient.create({
    data: {
      mrn,
      ...data,
    },
  })

  revalidatePath("/patients")
  revalidatePath("/dashboard")

  return patient
}

/* =========================================
   GET ALL PATIENTS
========================================= */
export async function getAllPatients() {
  return prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      records: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

/* =========================================
   GET PATIENT BY ID
========================================= */
export async function getPatientById(id: string) {
  return prisma.patient.findUnique({
    where: { id },
    include: {
      records: {
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

/* =========================================
   CREATE RECORD
========================================= */
export async function createRecord(data: any) {
  const record = await prisma.medicalRecord.create({
    data: {
      ...data,
      visitDate: data.visitDate || "",
    },
  })

  revalidatePath("/patients")
  revalidatePath("/dashboard")

  return record
}

/* =========================================
   DELETE RECORD
========================================= */
export async function deleteRecord(id: string) {
  const record = await prisma.medicalRecord.delete({
    where: { id },
  })

  revalidatePath("/patients")
  revalidatePath("/dashboard")

  return record
}

/* =========================================
   SEARCH PATIENTS
========================================= */
export async function searchPatients(query: string) {
  if (!query) return []

  return prisma.patient.findMany({
    where: {
      OR: [
        { firstName: { contains: query, mode: "insensitive" } },
        { lastName: { contains: query, mode: "insensitive" } },
        { mrn: { contains: query, mode: "insensitive" } },
        { phone: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  })
}

/* =========================================
   DASHBOARD STATS
========================================= */
export async function getDashboardStats() {
  const total = await prisma.patient.count()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayVisits = await prisma.medicalRecord.count({
    where: {
      createdAt: { gte: todayStart },
    },
  })

  const firstDayOfMonth = new Date(
    todayStart.getFullYear(),
    todayStart.getMonth(),
    1
  )

  const revenueAgg = await prisma.medicalRecord.aggregate({
    _sum: { billingAmount: true },
    where: {
      createdAt: { gte: firstDayOfMonth },
      billingStatus: "PAID",
    },
  })

  const monthRevenue = revenueAgg._sum.billingAmount ?? 0

  const pending = await prisma.medicalRecord.count({
    where: { billingStatus: "PENDING" },
  })

  const recent = await prisma.patient.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      records: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
  })

  // ✅ FIXED GROUP BY (Prisma Safe)
  const deptCounts = await prisma.patient.groupBy({
    by: ["department"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 5,
  })

  return {
    total,
    todayVisits,
    monthRevenue,
    pending,
    recent,
    deptCounts,
  }
}