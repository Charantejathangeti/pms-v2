import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MedCore HMS database...");

  // ── Users ─────────────────────────────────────────
  await prisma.user.upsert({ where: { email: "admin@medcore.com" }, update: {}, create: {
    name: "Dr. Arjun Sharma", email: "admin@medcore.com",
    password: await bcrypt.hash("admin123", 10), role: "ADMIN",
  }});
  await prisma.user.upsert({ where: { email: "doctor@medcore.com" }, update: {}, create: {
    name: "Dr. Priya Mehta", email: "doctor@medcore.com",
    password: await bcrypt.hash("doctor123", 10), role: "DOCTOR",
  }});
  await prisma.user.upsert({ where: { email: "staff@medcore.com" }, update: {}, create: {
    name: "Nurse Kavita Singh", email: "staff@medcore.com",
    password: await bcrypt.hash("staff123", 10), role: "STAFF",
  }});

  // ── Patients ───────────────────────────────────────
  const p1 = await prisma.patient.upsert({ where: { mrn: "MRN-2024-0001" }, update: {}, create: {
    mrn: "MRN-2024-0001", fullName: "Rajesh Kumar Verma",
    dob: "1972-05-14", gender: "Male", phone: "+91-98765-43210",
    email: "rajesh.verma@gmail.com", bloodGroup: "B+",
    department: "Cardiology", referralSource: "Walk-in",
    address: "42, MG Road, Bangalore - 560001",
    allergies: "Penicillin", chronicConditions: "Hypertension, Type 2 Diabetes",
    emergencyContact: "Sunita Verma", emergencyPhone: "+91-98765-43211",
    insuranceProvider: "Star Health", insuranceNumber: "SH-2024-789456",
  }});

  await prisma.medicalRecord.createMany({ data: [
    { patientId: p1.id, visitDate: "2023-03-10", visitType: "OPD",
      consultantDoctor: "Dr. Arjun Sharma", department: "Cardiology",
      chiefComplaint: "Chest tightness and breathlessness on exertion",
      diagnosis: "Hypertensive Heart Disease - Stage 1",
      prescriptionDetails: JSON.stringify({ medications: [
        { name: "Amlodipine", dose: "5mg", frequency: "Once daily", duration: "90 days" },
        { name: "Metformin", dose: "500mg", frequency: "Twice daily", duration: "90 days" },
      ]}),
      vitalSigns: JSON.stringify({ bp: "148/92", pulse: "82", temp: "98.6°F", spo2: "97%", weight: "84kg" }),
      billingAmount: 1500, billingStatus: "PAID", isHistorical: true,
    },
    { patientId: p1.id, visitDate: "2024-01-20", visitType: "Follow-up",
      consultantDoctor: "Dr. Arjun Sharma", department: "Cardiology",
      chiefComplaint: "Routine follow-up, occasional dizziness",
      diagnosis: "Hypertension - Partially Controlled",
      prescriptionDetails: JSON.stringify({ medications: [
        { name: "Amlodipine", dose: "10mg", frequency: "Once daily", duration: "90 days" },
        { name: "Metformin", dose: "1000mg", frequency: "Twice daily", duration: "90 days" },
        { name: "Aspirin", dose: "75mg", frequency: "Once daily", duration: "Ongoing" },
      ]}),
      vitalSigns: JSON.stringify({ bp: "138/86", pulse: "78", temp: "98.4°F", spo2: "98%", weight: "82kg" }),
      billingAmount: 1200, billingStatus: "PAID", isHistorical: false,
    },
    { patientId: p1.id, visitDate: "2024-08-15", visitType: "OPD",
      consultantDoctor: "Dr. Priya Mehta", department: "Cardiology",
      chiefComplaint: "HbA1c review, fatigue",
      diagnosis: "Type 2 DM - Well Controlled, Hypertension Stable",
      prescriptionDetails: JSON.stringify({ medications: [
        { name: "Amlodipine", dose: "10mg", frequency: "Once daily", duration: "180 days" },
        { name: "Metformin", dose: "1000mg", frequency: "Twice daily", duration: "180 days" },
        { name: "Jardiance", dose: "10mg", frequency: "Once daily", duration: "90 days" },
      ]}),
      vitalSigns: JSON.stringify({ bp: "130/82", pulse: "74", temp: "98.2°F", spo2: "99%", weight: "80kg" }),
      billingAmount: 2800, billingStatus: "PAID", isHistorical: false,
      followUpDate: "2025-02-15",
    },
    { patientId: p1.id, visitDate: "2025-02-10", visitType: "Follow-up",
      consultantDoctor: "Dr. Arjun Sharma", department: "Cardiology",
      chiefComplaint: "Annual cardiac review",
      diagnosis: "Stable - BP and Sugar well controlled",
      prescriptionDetails: JSON.stringify({ medications: [
        { name: "Amlodipine", dose: "10mg", frequency: "Once daily", duration: "180 days" },
        { name: "Metformin", dose: "1000mg", frequency: "Twice daily", duration: "180 days" },
      ]}),
      vitalSigns: JSON.stringify({ bp: "126/80", pulse: "72", temp: "98.2°F", spo2: "99%", weight: "79kg" }),
      billingAmount: 1800, billingStatus: "PAID", isHistorical: false,
    },
  ]});

  const p2 = await prisma.patient.upsert({ where: { mrn: "MRN-2025-0001" }, update: {}, create: {
    mrn: "MRN-2025-0001", fullName: "Ananya Krishnamurthy",
    dob: "1995-11-28", gender: "Female", phone: "+91-87654-32109",
    email: "ananya.k@outlook.com", bloodGroup: "O+",
    department: "Neurology", referralSource: "Referral",
    address: "15, Koramangala 5th Block, Bangalore - 560095",
    allergies: "Sulfa drugs", insuranceProvider: "HDFC Ergo",
    insuranceNumber: "HE-2025-123789",
  }});

  await prisma.medicalRecord.createMany({ data: [
    { patientId: p2.id, visitDate: "2025-01-08", visitType: "OPD",
      consultantDoctor: "Dr. Priya Mehta", department: "Neurology",
      chiefComplaint: "Severe migraines, 3-4 episodes per week, photophobia",
      diagnosis: "Chronic Migraine with Aura",
      prescriptionDetails: JSON.stringify({ medications: [
        { name: "Sumatriptan", dose: "50mg", frequency: "At onset", duration: "As needed" },
        { name: "Topiramate", dose: "25mg", frequency: "Once daily at night", duration: "60 days" },
        { name: "Vitamin B2", dose: "400mg", frequency: "Once daily", duration: "90 days" },
      ]}),
      vitalSigns: JSON.stringify({ bp: "110/70", pulse: "68", temp: "98.0°F", spo2: "99%", weight: "58kg" }),
      billingAmount: 3200, billingStatus: "PAID", isHistorical: false,
      followUpDate: "2025-04-08",
    },
    { patientId: p2.id, visitDate: "2025-06-12", visitType: "Follow-up",
      consultantDoctor: "Dr. Priya Mehta", department: "Neurology",
      chiefComplaint: "Migraine frequency reduced, sleep issues",
      diagnosis: "Improving - Migraine frequency down to 1/week",
      prescriptionDetails: JSON.stringify({ medications: [
        { name: "Topiramate", dose: "50mg", frequency: "Once daily at night", duration: "90 days" },
        { name: "Melatonin", dose: "3mg", frequency: "Once at bedtime", duration: "30 days" },
      ]}),
      vitalSigns: JSON.stringify({ bp: "112/72", pulse: "70", temp: "98.2°F", spo2: "99%", weight: "59kg" }),
      billingAmount: 1500, billingStatus: "PENDING", isHistorical: false,
    },
  ]});

  const p3 = await prisma.patient.upsert({ where: { mrn: "MRN-2025-0002" }, update: {}, create: {
    mrn: "MRN-2025-0002", fullName: "Mohammed Imran Khan",
    dob: "1958-03-22", gender: "Male", phone: "+91-76543-21098",
    bloodGroup: "A+", department: "Orthopedics",
    referralSource: "Emergency", address: "88, Whitefield Main Road, Bangalore - 560066",
    allergies: "NSAIDs (mild sensitivity)", chronicConditions: "Osteoarthritis, Mild Anemia",
    emergencyContact: "Fatima Khan", emergencyPhone: "+91-76543-21099",
  }});

  await prisma.medicalRecord.createMany({ data: [
    { patientId: p3.id, visitDate: "2025-04-03", visitType: "Emergency",
      consultantDoctor: "Dr. Arjun Sharma", department: "Orthopedics",
      chiefComplaint: "Fall from stairs, severe right knee pain, unable to bear weight",
      diagnosis: "Medial Meniscus Tear Grade III + Osteoarthritis Knee",
      prescriptionDetails: JSON.stringify({ medications: [
        { name: "Tramadol", dose: "50mg", frequency: "Every 8 hours", duration: "5 days" },
        { name: "Pantoprazole", dose: "40mg", frequency: "Once daily", duration: "14 days" },
        { name: "Calcium + Vit D3", dose: "1 tablet", frequency: "Twice daily", duration: "90 days" },
      ]}),
      vitalSigns: JSON.stringify({ bp: "136/88", pulse: "92", temp: "99.1°F", spo2: "96%", weight: "88kg" }),
      billingAmount: 12500, billingStatus: "PARTIAL", isHistorical: false,
      followUpDate: "2025-05-03",
    },
    { patientId: p3.id, visitDate: "2025-05-05", visitType: "Follow-up",
      consultantDoctor: "Dr. Arjun Sharma", department: "Orthopedics",
      chiefComplaint: "Post-surgery review, physiotherapy assessment",
      diagnosis: "Post-op recovery satisfactory, ROM improving",
      prescriptionDetails: JSON.stringify({ medications: [
        { name: "Calcium + Vit D3", dose: "1 tablet", frequency: "Twice daily", duration: "180 days" },
        { name: "Glucosamine", dose: "750mg", frequency: "Twice daily", duration: "90 days" },
      ]}),
      vitalSigns: JSON.stringify({ bp: "130/84", pulse: "80", temp: "98.4°F", spo2: "97%", weight: "87kg" }),
      billingAmount: 2000, billingStatus: "PAID", isHistorical: false,
    },
  ]});

  const p4 = await prisma.patient.upsert({ where: { mrn: "MRN-2026-0001" }, update: {}, create: {
    mrn: "MRN-2026-0001", fullName: "Sneha Patel",
    dob: "1990-07-04", gender: "Female", phone: "+91-65432-10987",
    email: "sneha.patel@gmail.com", bloodGroup: "AB+",
    department: "Dermatology", referralSource: "Online Booking",
    address: "22, Indiranagar 12th Main, Bangalore - 560038",
    insuranceProvider: "Bajaj Allianz", insuranceNumber: "BA-2026-456123",
  }});

  await prisma.medicalRecord.createMany({ data: [
    { patientId: p4.id, visitDate: "2026-01-15", visitType: "OPD",
      consultantDoctor: "Dr. Priya Mehta", department: "Dermatology",
      chiefComplaint: "Persistent acne, oily skin, occasional cysts",
      diagnosis: "Acne Vulgaris Grade III - Hormonal",
      prescriptionDetails: JSON.stringify({ medications: [
        { name: "Doxycycline", dose: "100mg", frequency: "Once daily", duration: "60 days" },
        { name: "Adapalene 0.1% gel", dose: "Apply pea size", frequency: "Once at night", duration: "90 days" },
        { name: "Clindamycin lotion", dose: "Apply thin layer", frequency: "Twice daily", duration: "60 days" },
      ]}),
      vitalSigns: JSON.stringify({ bp: "114/72", pulse: "72", temp: "98.0°F", spo2: "99%", weight: "62kg" }),
      billingAmount: 2200, billingStatus: "PAID", isHistorical: false,
      followUpDate: "2026-04-15",
    },
  ]});

  const p5 = await prisma.patient.upsert({ where: { mrn: "MRN-2026-0002" }, update: {}, create: {
    mrn: "MRN-2026-0002", fullName: "Vikram Singh Rathore",
    dob: "1985-09-18", gender: "Male", phone: "+91-54321-09876",
    email: "vikram.rathore@yahoo.com", bloodGroup: "O-",
    department: "General Medicine", referralSource: "Walk-in",
    address: "5, HSR Layout Sector 2, Bangalore - 560102",
    chronicConditions: "Asthma (mild intermittent)",
    allergies: "Aspirin, Pollen",
    emergencyContact: "Meera Rathore", emergencyPhone: "+91-54321-09875",
  }});

  await prisma.medicalRecord.createMany({ data: [
    { patientId: p5.id, visitDate: "2026-02-01", visitType: "OPD",
      consultantDoctor: "Dr. Arjun Sharma", department: "General Medicine",
      chiefComplaint: "Annual health checkup, mild cough, fatigue",
      diagnosis: "Mild URI, Asthma well-controlled",
      prescriptionDetails: JSON.stringify({ medications: [
        { name: "Salbutamol inhaler", dose: "2 puffs", frequency: "When required", duration: "Ongoing" },
        { name: "Vitamin C", dose: "500mg", frequency: "Once daily", duration: "30 days" },
        { name: "Zinc", dose: "50mg", frequency: "Once daily", duration: "30 days" },
      ]}),
      vitalSigns: JSON.stringify({ bp: "118/76", pulse: "76", temp: "99.0°F", spo2: "97%", weight: "75kg" }),
      billingAmount: 1800, billingStatus: "PAID", isHistorical: false,
    },
  ]});

  console.log("\n✅ Database seeded successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔑  Admin:  admin@medcore.com   / admin123");
  console.log("👨‍⚕️  Doctor: doctor@medcore.com  / doctor123");
  console.log("👩‍⚕️  Staff:  staff@medcore.com   / staff123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
