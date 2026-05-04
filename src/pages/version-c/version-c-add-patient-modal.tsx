import { VERSION_C_USE_CLASSIC_ADD_PATIENT_MODAL } from "@/pages/version-c/version-c-add-patient-modal-config";
import { VersionCAddPatientModalClassic } from "@/pages/version-c/version-c-add-patient-modal-classic";
import { VersionCAddPatientModalWizard } from "@/pages/version-c/version-c-add-patient-modal-wizard";
import { useVersionC } from "@/pages/version-c/version-c-context";

export function VersionCAddPatientModal() {
    const { editingPatientId } = useVersionC();

    if (VERSION_C_USE_CLASSIC_ADD_PATIENT_MODAL) {
        return <VersionCAddPatientModalClassic />;
    }

    return (
        <>
            {editingPatientId ? <VersionCAddPatientModalClassic /> : null}
            <VersionCAddPatientModalWizard />
        </>
    );
}
