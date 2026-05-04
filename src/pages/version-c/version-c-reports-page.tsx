import { Activity, BarChart01, Clock, Mail01, MessageCircle01, Phone01, SearchLg, Users01 } from "@untitledui/icons";
import { useMemo, useState } from "react";
import type { Key } from "react-aria-components";
import { InputBase } from "@/components/base/input/input";
import { Tabs } from "@/components/application/tabs/tabs";
import { cx } from "@/utils/cx";
import { useVersionC } from "@/pages/version-c/version-c-context";
import {
    fullName,
    statusToColumn,
    type BoardColumnId,
    type NotificationChannel,
    type NotificationDirection,
    type NotificationEntry,
    type Patient,
    type PatientCompletionCause,
} from "@/pages/version-c/version-c-shared";

type ReportTab = "stats" | "journal";

type HistoryRow = {
    key: string;
    sentAt: number;
    patientId: string;
    patientLabel: string;
    channel: NotificationChannel;
    direction: NotificationDirection;
    bodyPreview: string;
    tags: string[];
};

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

function buildHistoryRows(patients: Patient[], notificationsByPatient: Record<string, NotificationEntry[]>): HistoryRow[] {
    const rows: HistoryRow[] = [];
    for (const p of patients) {
        const list = notificationsByPatient[p.id] ?? [];
        const label = `${fullName(p)} — ${p.fileNumber}`;
        for (const e of list) {
            const tags: string[] = [];
            if (e.consentUrl) tags.push("consentement");
            if (e.actionUrl) tags.push("action");
            rows.push({
                key: `${p.id}:${e.id}`,
                sentAt: e.sentAt,
                patientId: p.id,
                patientLabel: label,
                channel: e.channel,
                direction: e.direction,
                bodyPreview: e.body.length > 120 ? `${e.body.slice(0, 120)}…` : e.body,
                tags,
            });
        }
    }
    rows.sort((a, b) => b.sentAt - a.sentAt);
    return rows;
}

export function VersionCReportsPage() {
    const { patients, patientsByColumn, notificationsByPatient } = useVersionC();
    const [tab, setTab] = useState<ReportTab>("stats");
    const [journalQuery, setJournalQuery] = useState("");
    const [channelFilter, setChannelFilter] = useState<"all" | NotificationChannel>("all");

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

    const historyRows = useMemo(() => buildHistoryRows(patients, notificationsByPatient), [patients, notificationsByPatient]);

    const filteredJournal = useMemo(() => {
        const q = journalQuery.trim().toLowerCase();
        return historyRows.filter((r) => {
            if (channelFilter !== "all" && r.channel !== channelFilter) return false;
            if (!q) return true;
            return (
                r.patientLabel.toLowerCase().includes(q) ||
                r.bodyPreview.toLowerCase().includes(q) ||
                r.channel.toLowerCase().includes(q) ||
                (r.direction === "outbound" ? "sortant" : "entrant").includes(q)
            );
        });
    }, [historyRows, journalQuery, channelFilter]);

    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#F2F4F7]">
            <div className="shrink-0 border-b border-[#E2E5EB] bg-white px-6 py-8 shadow-sm">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
                    <div>
                        <h1 className="text-2xl font-medium tracking-tight text-[#101828]">Rapports et statistiques</h1>
                        <p className="mt-1 max-w-3xl text-sm text-[#667085]">
                            Tableau de bord démo : agrégats sur la file d’attente Version C et journal des communications enregistrées dans la session
                            (SMS / courriel).
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
                                    {historyRows.length > 0 ? (
                                        <span className="rounded-full bg-[#F2F4F7] px-1.5 py-0.5 text-[11px] font-medium text-[#475467] ring-1 ring-[#E4E7EC]">
                                            {historyRows.length}
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
                        <div className="flex flex-col gap-4 border-b border-[#F2F4F7] p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-[#101828]">Historique des communications</h2>
                                <p className="mt-0.5 text-sm text-[#667085]">
                                    Tous les patients — tri du plus récent au plus ancien. Données de la session courante.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <select
                                    className="rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-sm text-[#344054] shadow-xs"
                                    value={channelFilter}
                                    onChange={(e) => setChannelFilter(e.target.value as "all" | NotificationChannel)}
                                >
                                    <option value="all">Tous canaux</option>
                                    <option value="sms">SMS</option>
                                    <option value="email">Courriel</option>
                                </select>
                                <InputBase
                                    icon={SearchLg}
                                    placeholder="Filtrer (patient, texte…)"
                                    value={journalQuery}
                                    onChange={(e) => setJournalQuery(e.target.value)}
                                    wrapperClassName="bg-white min-w-[220px]"
                                />
                            </div>
                        </div>
                        <div className="min-h-0 flex-1 overflow-auto">
                            <table className="w-full min-w-[720px] text-left text-sm">
                                <thead className="sticky top-0 z-10 bg-[#F9FAFB] text-xs font-semibold uppercase tracking-wide text-[#667085] ring-1 ring-[#E4E7EC]">
                                    <tr>
                                        <th className="whitespace-nowrap px-4 py-3">Date / heure</th>
                                        <th className="whitespace-nowrap px-4 py-3">Patient</th>
                                        <th className="whitespace-nowrap px-4 py-3">Canal</th>
                                        <th className="whitespace-nowrap px-4 py-3">Sens</th>
                                        <th className="px-4 py-3">Aperçu</th>
                                        <th className="whitespace-nowrap px-4 py-3">Liens</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F2F4F7]">
                                    {filteredJournal.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#667085]">
                                                {historyRows.length === 0
                                                    ? "Aucun message enregistré. Ajoutez des patients ou envoyez des messages depuis la liste."
                                                    : "Aucun résultat pour ce filtre."}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredJournal.map((r) => {
                                            const pRow = patients.find((p) => p.id === r.patientId);
                                            const colNow = pRow ? statusToColumn(pRow.status) : "—";
                                            return (
                                            <tr key={r.key} className="align-top hover:bg-[#FAFBFC]">
                                                <td className="whitespace-nowrap px-4 py-3 text-[#475467]">{formatDateTime(r.sentAt)}</td>
                                                <td className="max-w-[200px] px-4 py-3">
                                                    <span className="line-clamp-2 font-medium text-[#101828]" title={r.patientLabel}>
                                                        {r.patientLabel}
                                                    </span>
                                                    <span className="mt-0.5 block text-xs text-[#98A2B3]">
                                                        Colonne {columnLabelFr(colNow)}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F2F4F7] px-2 py-0.5 text-xs font-medium text-[#344054] ring-1 ring-[#E4E7EC]">
                                                        {r.channel === "sms" ? (
                                                            <Phone01 className="size-3.5" strokeWidth={1.75} aria-hidden />
                                                        ) : (
                                                            <Mail01 className="size-3.5" strokeWidth={1.75} aria-hidden />
                                                        )}
                                                        {r.channel === "sms" ? "SMS" : "Courriel"}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <span
                                                        className={cx(
                                                            "inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1",
                                                            r.direction === "outbound"
                                                                ? "bg-[#EFF8FF] text-[#175CD3] ring-[#B2DDFF]"
                                                                : "bg-[#F9FAFB] text-[#475467] ring-[#E4E7EC]",
                                                        )}
                                                    >
                                                        {r.direction === "outbound" ? "Sortant" : "Entrant"}
                                                    </span>
                                                </td>
                                                <td className="max-w-md px-4 py-3">
                                                    <p className="line-clamp-3 whitespace-pre-wrap text-[#475467]" title={r.bodyPreview}>
                                                        {r.bodyPreview}
                                                    </p>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-xs text-[#667085]">
                                                    {r.tags.length ? r.tags.join(", ") : "—"}
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
