import { getPatientById } from "@/lib/actions";
import { notFound } from "next/navigation";
import PatientProfile from "@/components/patients/PatientProfile";

export default async function PatientPage(
  { params }: { params: Promise<{ id: string }> }
) {
  // ✅ In Next.js 16, params is a Promise
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  return <PatientProfile patient={patient as any} />;
}