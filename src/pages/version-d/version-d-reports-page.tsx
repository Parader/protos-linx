import { Activity, BarChart01, Clock, Mail01, MessageCircle01, Phone01, SearchLg, Users01 } from "@untitledui/icons";
import { useMemo, useState } from "react";
import type { Key } from "react-aria-components";
import { InputBase } from "@/components/base/input/input";
import { Tabs } from "@/components/application/tabs/tabs";
import { cx } from "@/utils/cx";
import { useVersionD } from "@/pages/version-d/version-d-context";
import {
    statusToColumn,
    type ActivityLogKind,
    type BoardColumnId,
    type NotificationChannel,
    type Patient,
    type PatientCompletionCause,
} from "@/pages/version-d/version-d-shared";

type ReportTab = "stats" | "journal";
type JournalScopeFilter = "all" | "messages" | "worklist";
type CompletedPatientFilter = "all" | "completed_only";

function isMessageKind(kind: ActivityLogKind): boolean {
    return kind === "message_outbound" || kind === "message_inbound";
}

function activityKindLabelFr(kind: ActivityLogKind): string {
    switch (kind) {
        case "message_outbound":
            return "Message sortant";
        case "message_inbound":
            return "Message entrant";
        case "patient_added":
            return "Ajout patient";
        case "demo_patients_added":
            return "Ajout démo";
        case "patient_edited":
            return "Fiche modifiée";
        case "status_menu":
            return "Statut (menu)";
        case "status_drag":
            return "Statut (glisser)";
        case "consent_accepted":
            return "Consentement accepté";
        case "consent_refused":
            return "Consentement refusé";
        case "consent_withdrawn":
            return "Retrait consentement";
        case "return_confirmed":
            return "Retour confirmé";
        case "patient_left_queue_via_link":
            return "Annul. patient (lien)";
        case "staff_cancelled":
            return "Annul. équipe";
        case "board_cleared":
            return "Liste effacée";
        default:
            return kind;
    }
}

function activityKindSearchExtras(kind: ActivityLogKind): string {
    switch (kind) {
        case "message_outbound":
            return "sms courriel email sortant envoi";
        case "message_inbound":
            return "sms courriel email entrant réponse";
        case "patient_added":
            return "nouveau inscription file";
        case "demo_patients_added":
            return "démonstration lot paramètres";
        case "patient_edited":
            return "modification dossier coordonnées";
        case "status_menu":
        case "status_drag":
            return "colonne attente rappel terminé déplacement carte";
        case "consent_accepted":
            return "accord plateforme";
        case "consent_refused":
        case "consent_withdrawn":
            return "fermeture annulation service distance";
        case "return_confirmed":
            return "arrivée urgence";
        case "patient_left_queue_via_link":
            return "public confirmation";
        case "staff_cancelled":
            return "motif équipe soignant";
        case "board_cleared":
            return "reset effacer vider";
        default:
            return "";
    }
}

function causeLabelFr(cause: PatientCompletionCause | undefined): string {
    switch (cause) {
        case "no_show":
            return "Absence";
        case "consent_withdrawn":
            return "Retrait consentement";
        case "consent_refused":
            return "Refus consentement";
        case "patient_cancelled_queue":
            return "Annul. patient (lien)";
        case "staff_cancelled":
            return "Annul. équipe";
        default:
            return "Autre";
    }
}

function columnLabelFr(c: BoardColumnId | "—") {
    if (c === "—") return "—";
    if (c === "waiting") return "Attente";
    if (c === "recall") return "Rappel";
    return "Terminé";
}

function formatDateTime(ts: number) {
    try {
        return new Intl.DateTimeFormat("fr-CA", {
            dateStyle: "short",
            timeStyle: "short",
        }).format(new Date(ts));
    } catch {
        return "—";
    }
}

function StatCard({
    title,
    value,
    hint,
    icon,
    accent = "blue",
}: {
    title: string;
    value: string | number;
    hint?: string;
    icon: React.ReactNode;
    accent?: "blue" | "purple" | "green" | "gray" | "amber";
}) {
    const ring =
        accent === "blue"
            ? "ring-[#8ED1FE]/40 bg-[#F2FAFF]"
            : accent === "purple"
              ? "ring-[#E9D5F5]/60 bg-[#FEFBFE]"
              : accent === "green"
                ? "ring-[#ABEFC6]/50 bg-[#ECFDF3]"
                : accent === "amber"
                  ? "ring-[#FDE68A]/60 bg-[#FFFAEB]"
                  : "ring-[#E4E7EC] bg-[#F9FAFB]";
    return (
        <div className={cx("rounded-xl border border-[#E4E7EC] p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] ring-1 ring-inset", ring)}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-[#667085]">{title}</p>
                    <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-[#101828]">{value}</p>
                    {hint ? <p className="mt-1 text-xs text-[#667085]">{hint}</p> : null}
                </div>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/80 text-[#475467] ring-1 ring-[#E4E7EC]">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function kindBadgeClass(kind: ActivityLogKind): string {
    if (isMessageKind(kind)) {
        return kind === "message_outbound"
            ? "bg-[#EFF8FF] text-[#175CD3] ring-[#B2DDFF]"
            : "bg-[#F9FAFB] text-[#475467] ring-[#E4E7EC]";
    }
    if (
        kind === "board_cleared" ||
        kind === "staff_cancelled" ||
        kind === "consent_refused" ||
        kind === "consent_withdrawn"
    ) {
        return "bg-[#FFF1F3] text-[#C01048] ring-[#FFE4E8]";
    }
    if (kind === "demo_patients_added") return "bg-[#FFFAEB] text-[#B54708] ring-[#FEF0C7]";
    return "bg-[#ECFDF3] text-[#027A48] ring-[#D1FADF]";
}

export function VersionDReportsPage() {
    const { patients, patientsByColumn, notificationsByPatient, activityLog } = useVersionD();
    const [tab, setTab] = useState<ReportTab>("stats");
    const [journalQuery, setJournalQuery] = useState("");
    const [channelFilter, setChannelFilter] = useState<"all" | NotificationChannel>("all");
    const [scopeFilter, setScopeFilter] = useState<JournalScopeFilter>("all");
    const [completedPatientFilter, setCompletedPatientFilter] = useState<CompletedPatientFilter>("all");

    const stats = useMemo(() => {
        const total = patients.length;
        const colW = patientsByColumn.waiting.length;
        const colR = patientsByColumn.recall.length;
        const colC = patientsByColumn.completed.length;
        const consentPending = patients.filter((p) => p.status === "consentPending").length;
        const waitingOnly = patients.filter((p) => p.status === "waiting").length;
        const inRecall = patients.filter((p) => p.status === "recall").length;
        const arrived = patients.filter((p) => p.status === "arrived").length;
        const completedCancelled = patients.filter((p) => p.status === "completed" && p.cancelled).length;
        const completedOk = patients.filter((p) => p.status === "completed" && !p.cancelled).length;
        const manualConsent = patients.filter((p) => p.consentManagedManually).length;
        const withSms = patients.filter((p) => p.phone?.trim()).length;
        const withEmail = patients.filter((p) => p.email?.trim()).length;

        const causeBuckets: Partial<Record<PatientCompletionCause, number>> = {};
        for (const p of patients) {
            if (p.status === "completed" && p.cancelled && p.completionCause) {
                causeBuckets[p.completionCause] = (causeBuckets[p.completionCause] ?? 0) + 1;
            }
        }

        let outbound = 0;
        let inbound = 0;
        for (const p of patients) {
            for (const e of notificationsByPatient[p.id] ?? []) {
                if (e.direction === "outbound") outbound += 1;
                else inbound += 1;
            }
        }

        const p3 = patients.filter((p) => p.priority === "P3").length;
        const p4 = patients.filter((p) => p.priority === "P4").length;
        const p5 = patients.filter((p) => p.priority === "P5").length;

        return {
            total,
            colW,
            colR,
            colC,
            consentPending,
            waitingOnly,
            inRecall,
            arrived,
            completedCancelled,
            completedOk,
            manualConsent,
            withSms,
            withEmail,
            causeBuckets,
            outbound,
            inbound,
            p3,
            p4,
            p5,
        };
    }, [patients, patientsByColumn, notificationsByPatient]);

    const sortedActivity = useMemo(() => [...activityLog].sort((a, b) => b.at - a.at), [activityLog]);

    const patientById = useMemo(() => {
        const m = new Map<string, Patient>();
        for (const p of patients) m.set(p.id, p);
        return m;
    }, [patients]);

    const filteredJournal = useMemo(() => {
        const q = journalQuery.trim().toLowerCase();
        return sortedActivity.filter((row) => {
            if (scopeFilter === "messages" && !isMessageKind(row.kind)) return false;
            if (scopeFilter === "worklist" && isMessageKind(row.kind)) return false;

            if (channelFilter !== "all" && isMessageKind(row.kind) && row.channel !== channelFilter) return false;

            if (completedPatientFilter === "completed_only") {
                if (!row.patientId) return false;
                const p = patientById.get(row.patientId);
                if (!p || p.status !== "completed") return false;
            }

            if (!q) return true;
            const hay = [
                row.patientLabel,
                row.summary,
                row.detail ?? "",
                activityKindLabelFr(row.kind),
                activityKindSearchExtras(row.kind),
                row.channel ?? "",
                row.direction ?? "",
            ]
                .join(" ")
                .toLowerCase();
            return hay.includes(q);
        });
    }, [sortedActivity, scopeFilter, channelFilter, completedPatientFilter, patientById, journalQuery]);

    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#F2F4F7]">
            <div className="shrink-0 border-b border-[#E2E5EB] bg-white px-6 py-8 shadow-sm">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
                    <div>
                        <h1 className="text-2xl font-medium tracking-tight text-[#101828]">Rapports et statistiques</h1>
                        <p className="mt-1 max-w-3xl text-sm text-[#667085]">
                            Tableau de bord démo : agrégats sur la file d’attente Version C. Le journal d’activité regroupe les communications (SMS /
                            courriel) et les changements sur la liste (statuts, consentements, annulations, etc.) pour la session courante.
                        </p>
                    </div>
                    <Tabs
                        selectedKey={tab}
                        onSelectionChange={(k: Key) => setTab(k as ReportTab)}
                        className="w-full max-w-xl"
                    >
                        <Tabs.List type="button-border" size="sm">
                            <Tabs.Item id="stats">
                                <span className="flex items-center gap-2">
                                    <BarChart01 className="size-4" strokeWidth={1.75} aria-hidden />
                                    Statistiques
                                </span>
                            </Tabs.Item>
                            <Tabs.Item id="journal">
                                <span className="flex items-center gap-2">
                                    <Activity className="size-4" strokeWidth={1.75} aria-hidden />
                                    Journal d’activité
                                    {activityLog.length > 0 ? (
                                        <span className="rounded-full bg-[#F2F4F7] px-1.5 py-0.5 text-[11px] font-medium text-[#475467] ring-1 ring-[#E4E7EC]">
                                            {activityLog.length}
                                        </span>
                                    ) : null}
                                </span>
                            </Tabs.Item>
                        </Tabs.List>
                    </Tabs>
                </div>
            </div>

            <div className="mx-auto flex w-full min-h-0 max-w-6xl flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
                {tab === "stats" ? (
                    <>
                        <section>
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#667085]">Vue d’ensemble</h2>
                            <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <StatCard
                                    title="Patients (total)"
                                    value={stats.total}
                                    hint="Tous statuts confondus"
                                    icon={<Users01 className="size-5" strokeWidth={1.75} aria-hidden />}
                                    accent="blue"
                                />
                                <StatCard
                                    title="Colonne Attente"
                                    value={stats.colW}
                                    hint={`Dont ${stats.consentPending} en attente de consentement`}
                                    icon={<Clock className="size-5" strokeWidth={1.75} aria-hidden />}
                                    accent="amber"
                                />
                                <StatCard
                                    title="Colonne Rappel"
                                    value={stats.colR}
                                    hint={`${stats.inRecall} en rappel · ${stats.arrived} retour confirmé`}
                                    icon={<MessageCircle01 className="size-5" strokeWidth={1.75} aria-hidden />}
                                    accent="purple"
                                />
                                <StatCard
                                    title="Colonne Terminé"
                                    value={stats.colC}
                                    hint={`${stats.completedCancelled} clôturés / annulés · ${stats.completedOk} autres`}
                                    icon={<BarChart01 className="size-5" strokeWidth={1.75} aria-hidden />}
                                    accent="gray"
                                />
                            </div>
                        </section>

                        <section className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-xl border border-[#E4E7EC] bg-white p-6 shadow-sm">
                                <h3 className="text-base font-semibold text-[#101828]">Priorités</h3>
                                <p className="mt-1 text-sm text-[#667085]">Répartition des dossiers actifs et terminés.</p>
                                <dl className="mt-4 space-y-3">
                                    {(
                                        [
                                            { k: "P3" as const, n: stats.p3, color: "bg-[#FFF1F3] text-[#C01048] ring-[#FFE4E8]" },
                                            { k: "P4" as const, n: stats.p4, color: "bg-[#FFFAEB] text-[#B54708] ring-[#FEF0C7]" },
                                            { k: "P5" as const, n: stats.p5, color: "bg-[#ECFDF3] text-[#027A48] ring-[#D1FADF]" },
                                        ] as const
                                    ).map((row) => (
                                        <div key={row.k} className="flex items-center justify-between gap-3">
                                            <span className={cx("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ring-1", row.color)}>
                                                {row.k}
                                            </span>
                                            <span className="text-sm font-medium tabular-nums text-[#344054]">{row.n}</span>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <div className="rounded-xl border border-[#E4E7EC] bg-white p-6 shadow-sm">
                                <h3 className="text-base font-semibold text-[#101828]">Canaux & consentement</h3>
                                <p className="mt-1 text-sm text-[#667085]">Coordonnées et consentement géré hors plateforme.</p>
                                <dl className="mt-4 space-y-3 text-sm">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="flex items-center gap-2 text-[#475467]">
                                            <Phone01 className="size-4 text-[#667085]" strokeWidth={1.75} aria-hidden />
                                            Avec téléphone (SMS)
                                        </span>
                                        <span className="font-semibold tabular-nums text-[#101828]">{stats.withSms}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="flex items-center gap-2 text-[#475467]">
                                            <Mail01 className="size-4 text-[#667085]" strokeWidth={1.75} aria-hidden />
                                            Avec courriel
                                        </span>
                                        <span className="font-semibold tabular-nums text-[#101828]">{stats.withEmail}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 border-t border-[#F2F4F7] pt-3">
                                        <span className="text-[#475467]">Consentement manuel</span>
                                        <span className="font-semibold tabular-nums text-[#101828]">{stats.manualConsent}</span>
                                    </div>
                                </dl>
                            </div>
                        </section>

                        <section className="rounded-xl border border-[#E4E7EC] bg-white p-6 shadow-sm">
                            <h3 className="text-base font-semibold text-[#101828]">Messages (session)</h3>
                            <p className="mt-1 text-sm text-[#667085]">Comptage des entrées du journal de notifications simulées.</p>
                            <div className="mt-4 flex flex-wrap gap-6">
                                <div>
                                    <p className="text-xs font-medium uppercase text-[#667085]">Sortants</p>
                                    <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0573D8]">{stats.outbound}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium uppercase text-[#667085]">Entrants</p>
                                    <p className="mt-1 text-2xl font-semibold tabular-nums text-[#475467]">{stats.inbound}</p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-xl border border-[#E4E7EC] bg-white p-6 shadow-sm">
                            <h3 className="text-base font-semibold text-[#101828]">Motifs de fermeture (terminés annulés)</h3>
                            <p className="mt-1 text-sm text-[#667085]">Répartition des causes enregistrées sur les dossiers annulés.</p>
                            {stats.completedCancelled === 0 ? (
                                <p className="mt-4 text-sm text-[#667085]">Aucun dossier annulé pour l’instant.</p>
                            ) : (
                                <ul className="mt-4 divide-y divide-[#F2F4F7]">
                                    {(Object.entries(stats.causeBuckets) as [PatientCompletionCause, number][])
                                        .filter(([, n]) => n > 0)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([cause, n]) => (
                                            <li key={cause} className="flex items-center justify-between py-2 text-sm">
                                                <span className="text-[#344054]">{causeLabelFr(cause)}</span>
                                                <span className="font-medium tabular-nums text-[#101828]">{n}</span>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </section>
                    </>
                ) : (
                    <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-[#F2F4F7] p-4 sm:p-5">
                            <div>
                                <h2 className="text-base font-semibold text-[#101828]">Journal d’activité</h2>
                                <p className="mt-0.5 text-sm text-[#667085]">
                                    Communications et événements de la liste — tri du plus récent au plus ancien (session courante).
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
                                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                    <label htmlFor="vc-journal-search" className="text-xs font-medium text-[#667085]">
                                        Recherche
                                    </label>
                                    <InputBase
                                        id="vc-journal-search"
                                        icon={SearchLg}
                                        placeholder="Patient, type d’événement, texte du message…"
                                        value={journalQuery}
                                        onChange={(e) => setJournalQuery(e.target.value)}
                                        wrapperClassName="bg-white w-full min-w-0"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 sm:min-w-[11rem]">
                                    <label htmlFor="vc-journal-scope" className="text-xs font-medium text-[#667085]">
                                        Type d’entrée
                                    </label>
                                    <select
                                        id="vc-journal-scope"
                                        className="rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-sm text-[#344054] shadow-xs"
                                        value={scopeFilter}
                                        onChange={(e) => setScopeFilter(e.target.value as JournalScopeFilter)}
                                    >
                                        <option value="all">Toutes les entrées</option>
                                        <option value="messages">Communications seulement</option>
                                        <option value="worklist">Liste (sans messages)</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5 sm:min-w-[11rem]">
                                    <label htmlFor="vc-journal-channel" className="text-xs font-medium text-[#667085]">
                                        Canal (messages)
                                    </label>
                                    <select
                                        id="vc-journal-channel"
                                        className="rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-sm text-[#344054] shadow-xs disabled:opacity-50"
                                        value={channelFilter}
                                        disabled={scopeFilter === "worklist"}
                                        onChange={(e) => setChannelFilter(e.target.value as "all" | NotificationChannel)}
                                    >
                                        <option value="all">Tous canaux</option>
                                        <option value="sms">SMS</option>
                                        <option value="email">Courriel</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5 sm:min-w-[12.5rem]">
                                    <label htmlFor="vc-journal-completed" className="text-xs font-medium text-[#667085]">
                                        Dossiers
                                    </label>
                                    <select
                                        id="vc-journal-completed"
                                        className="rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-sm text-[#344054] shadow-xs"
                                        value={completedPatientFilter}
                                        onChange={(e) => setCompletedPatientFilter(e.target.value as CompletedPatientFilter)}
                                    >
                                        <option value="all">Tous les dossiers</option>
                                        <option value="completed_only">Terminés uniquement</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="min-h-0 flex-1 overflow-auto">
                            <table className="w-full min-w-[720px] text-left text-sm">
                                <thead className="sticky top-0 z-10 bg-[#F9FAFB] text-xs font-semibold uppercase tracking-wide text-[#667085] ring-1 ring-[#E4E7EC]">
                                    <tr>
                                        <th className="whitespace-nowrap px-4 py-3">Date / heure</th>
                                        <th className="whitespace-nowrap px-4 py-3">Type</th>
                                        <th className="whitespace-nowrap px-4 py-3">Patient</th>
                                        <th className="px-4 py-3">Résumé</th>
                                        <th className="whitespace-nowrap px-4 py-3">Canal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F2F4F7]">
                                    {filteredJournal.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-12 text-center text-sm text-[#667085]">
                                                {sortedActivity.length === 0
                                                    ? "Aucune activité enregistrée. Utilisez la liste de travail pour ajouter des patients, déplacer des cartes ou envoyer des messages."
                                                    : "Aucun résultat pour ces filtres ou cette recherche."}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredJournal.map((r) => {
                                            const pRow = r.patientId ? patientById.get(r.patientId) : undefined;
                                            const colNow: BoardColumnId | "—" = pRow ? statusToColumn(pRow.status) : "—";
                                            return (
                                                <tr key={r.id} className="align-top hover:bg-[#FAFBFC]">
                                                    <td className="whitespace-nowrap px-4 py-3 text-[#475467]">{formatDateTime(r.at)}</td>
                                                    <td className="whitespace-nowrap px-4 py-3">
                                                        <span
                                                            className={cx(
                                                                "inline-flex max-w-[12rem] truncate rounded-full px-2 py-0.5 text-xs font-medium ring-1",
                                                                kindBadgeClass(r.kind),
                                                            )}
                                                            title={activityKindLabelFr(r.kind)}
                                                        >
                                                            {activityKindLabelFr(r.kind)}
                                                        </span>
                                                    </td>
                                                    <td className="max-w-[220px] px-4 py-3">
                                                        <span className="line-clamp-2 font-medium text-[#101828]" title={r.patientLabel}>
                                                            {r.patientLabel}
                                                        </span>
                                                        {pRow ? (
                                                            <span className="mt-0.5 block text-xs text-[#98A2B3]">
                                                                Colonne {columnLabelFr(colNow)}
                                                            </span>
                                                        ) : null}
                                                    </td>
                                                    <td className="max-w-md px-4 py-3">
                                                        <p className="font-medium text-[#101828]">{r.summary}</p>
                                                        {r.detail ? (
                                                            <p className="mt-1 line-clamp-4 whitespace-pre-wrap text-[#475467]" title={r.detail}>
                                                                {r.detail}
                                                            </p>
                                                        ) : null}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-[#667085]">
                                                        {isMessageKind(r.kind) && r.channel ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#F2F4F7] px-2 py-0.5 text-xs font-medium text-[#344054] ring-1 ring-[#E4E7EC]">
                                                                {r.channel === "sms" ? (
                                                                    <Phone01 className="size-3.5" strokeWidth={1.75} aria-hidden />
                                                                ) : (
                                                                    <Mail01 className="size-3.5" strokeWidth={1.75} aria-hidden />
                                                                )}
                                                                {r.channel === "sms" ? "SMS" : "Courriel"}
                                                            </span>
                                                        ) : (
                                                            "—"
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
