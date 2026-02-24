import NewPatientForm from "@/components/forms/NewPatientForm";
export default function NewPatientPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="anim-1">
        <h1 className="page-title">Register New Patient</h1>
        <p className="text-slate-500 text-sm mt-1">Complete all required fields to create a patient record</p>
      </div>
      <NewPatientForm />
    </div>
  );
}
