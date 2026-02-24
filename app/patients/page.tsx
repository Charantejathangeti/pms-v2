import { getAllPatients } from "@/lib/actions";
import PatientList from "@/components/patients/PatientList";
export default async function PatientsPage() {
  const patients = await getAllPatients();
  return <PatientList initialPatients={patients as any} />;
}
