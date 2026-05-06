import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { HomeScreen } from "@/pages/home-screen";
import { MockupTrajectoryCarePage } from "@/pages/mockup-trajectory-care-page";
import { NotFound } from "@/pages/not-found";
import { VersionALayout } from "@/pages/version-a/version-a-layout";
import { VersionAPatientConsentNextPage } from "@/pages/version-a/version-a-patient-consent-next-page";
import { VersionAPatientConsentPage } from "@/pages/version-a/version-a-patient-consent-page";
import { VersionAWorklistPage } from "@/pages/version-a/version-a-worklist-page";
import { VersionBLayout } from "@/pages/version-b/version-b-layout";
import { VersionBPatientConsentNextPage } from "@/pages/version-b/version-b-patient-consent-next-page";
import { VersionBPatientConsentPage } from "@/pages/version-b/version-b-patient-consent-page";
import { VersionBWorklistPage } from "@/pages/version-b/version-b-worklist-page";
import { VersionCLayout } from "@/pages/version-c/version-c-layout";
import { VersionCReportsPage } from "@/pages/version-c/version-c-reports-page";
import { VersionCWorklistPage } from "@/pages/version-c/version-c-worklist-page";
import { VersionCPatientPovPage } from "@/pages/version-c/version-c-patient-pov-page";
import { VersionCPatientConsentNextPage } from "@/pages/version-c/version-c-patient-consent-next-page";
import { VersionCPatientConsentPage } from "@/pages/version-c/version-c-patient-consent-page";
import { VersionCConfirmReturnPage } from "@/pages/version-c/version-c-confirm-return-page";
import { VersionDLayout } from "@/pages/version-d/version-d-layout";
import { VersionDReportsPage } from "@/pages/version-d/version-d-reports-page";
import { VersionDWorklistPage } from "@/pages/version-d/version-d-worklist-page";
import { VersionDPatientPovPage } from "@/pages/version-d/version-d-patient-pov-page";
import { VersionDPatientConsentNextPage } from "@/pages/version-d/version-d-patient-consent-next-page";
import { VersionDPatientConsentPage } from "@/pages/version-d/version-d-patient-consent-page";
import { VersionDConfirmReturnPage } from "@/pages/version-d/version-d-confirm-return-page";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="light">
            <BrowserRouter>
                <RouteProvider>
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/mockup/trajectory-care" element={<MockupTrajectoryCarePage />} />
                        <Route path="/version-a" element={<VersionALayout />}>
                            <Route index element={<VersionAWorklistPage />} />
                            <Route path="patient-consent" element={<VersionAPatientConsentPage />} />
                            <Route path="patient-consent/next" element={<VersionAPatientConsentNextPage />} />
                        </Route>
                        <Route path="/version-b" element={<VersionBLayout />}>
                            <Route index element={<VersionBWorklistPage />} />
                            <Route path="patient-consent" element={<VersionBPatientConsentPage />} />
                            <Route path="patient-consent/next" element={<VersionBPatientConsentNextPage />} />
                        </Route>
                        <Route path="/version-c" element={<VersionCLayout />}>
                            <Route index element={<VersionCWorklistPage />} />
                            <Route path="reports" element={<VersionCReportsPage />} />
                            <Route path="patient" element={<VersionCPatientPovPage />} />
                            <Route path="patient-consent" element={<VersionCPatientConsentPage />} />
                            <Route path="patient-consent/next" element={<VersionCPatientConsentNextPage />} />
                            <Route path="confirm-return" element={<VersionCConfirmReturnPage />} />
                        </Route>
                        <Route path="/version-d" element={<VersionDLayout />}>
                            <Route index element={<VersionDWorklistPage />} />
                            <Route path="reports" element={<VersionDReportsPage />} />
                            <Route path="patient" element={<VersionDPatientPovPage />} />
                            <Route path="patient-consent" element={<VersionDPatientConsentPage />} />
                            <Route path="patient-consent/next" element={<VersionDPatientConsentNextPage />} />
                            <Route path="confirm-return" element={<VersionDConfirmReturnPage />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </RouteProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
);
