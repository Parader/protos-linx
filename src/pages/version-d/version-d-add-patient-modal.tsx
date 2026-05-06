import { VERSION_D_USE_CLASSIC_ADD_PATIENT_MODAL } from "@/pages/version-d/version-d-add-patient-modal-config";
import { VersionDAddPatientModalClassic } from "@/pages/version-d/version-d-add-patient-modal-classic";
import { VersionDAddPatientModalWizard } from "@/pages/version-d/version-d-add-patient-modal-wizard";
import { useVersionD } from "@/pages/version-d/version-d-context";

export function VersionDAddPatientModal() {
    const { editingPatientId } = useVersionD();

    if (VERSION_D_USE_CLASSIC_ADD_PATIENT_MODAL) {
        return <VersionDAddPatientModalClassic />;
    }

    return (
        <>
            {editingPatientId ? <VersionDAddPatientModalClassic /> : null}
            <VersionDAddPatientModalWizard />
        </>
    );
}
