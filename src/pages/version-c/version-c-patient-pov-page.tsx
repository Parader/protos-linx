import { Mail01, MessageCircle01, Phone01 } from "@untitledui/icons";
import { useEffect, useMemo, useState } from "react";
import type { Key } from "react-aria-components";
import { Link } from "react-router";
import { Tabs } from "@/components/application/tabs/tabs";
import { BRAND_POWERED_BY_AKINOX, BRAND_QUEBEC_LOGO } from "@/constants/brand-assets";
import { cx } from "@/utils/cx";
import { useVersionC } from "@/pages/version-c/version-c-context";
import { fullName, statusToColumn, type NotificationChannel, type NotificationEntry } from "@/pages/version-c/version-c-shared";

function toAppPath(absoluteOrRelative: string) {
    try {
        const u = new URL(absoluteOrRelative, typeof window !== "undefined" ? window.location.origin : "http://localhost");
        return `${u.pathname}${u.search}`;
    } catch {
        return absoluteOrRelative;
    }
}

function isConfirmReturnLink(url?: string) {
    if (!url) return false;
    try {
        const u = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
        return u.pathname.includes("confirm-return");
    } catch {
        return false;
    }
}

function MessageBody({
    entry,
    channel,
    smsRole,
}: {
    entry: NotificationEntry;
    channel: NotificationChannel;
    /** Reçu (gauche, gris) vs envoyé (droite, bleu) — style Messages iOS */
    smsRole?: "incoming" | "outgoing";
}) {
    if (channel === "email") {
        return <div className="whitespace-pre-wrap text-[16px] leading-6 text-[#344054]">{entry.body}</div>;
    }
    const outgoing = smsRole === "outgoing";
    return (
        <div
            className={cx(
                "whitespace-pre-wrap text-[15px] leading-snug",
                outgoing ? "text-white" : "text-[#101828]",
            )}
        >
            {entry.body}
        </div>
    );
}

function PhoneStatusBar() {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(id);
    }, []);
    const time = now.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit", hour12: false });

    return (
        <div className="flex items-center justify-between bg-white px-4 pb-1.5 pt-2.5 text-[13px] font-semibold tabular-nums tracking-tight text-black">
            <span>{time}</span>
            <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-0.5 pb-0.5" aria-hidden>
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="w-[3px] rounded-[0.5px] bg-black"
                            style={{ height: `${3 + i * 2}px` }}
                        />
                    ))}
                </div>
                <span className="text-[12px] font-bold leading-none text-black" aria-hidden>
                    5G
                </span>
                <svg className="size-[14px] shrink-0 text-black" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 21 8.4 16.2c1-.75 2.25-1.2 3.6-1.2s2.6.45 3.6 1.2L12 21M12 3C7.95 3 4.21 4.34 1.2 6.6L3 9c2.5-1.88 5.62-3 9-3s6.5 1.12 9 3l1.8-2.4C19.79 4.34 16.05 3 12 3m0 6c-2.7 0-5.19.89-7.2 2.4l1.8 2.4c1.5-1.13 3.37-1.8 5.4-1.8s3.9.67 5.4 1.8l1.8-2.4C17.19 9.89 14.7 9 12 9z" />
                </svg>
                <div className="relative h-[11px] w-[24px] shrink-0" aria-hidden>
                    <div className="absolute inset-0 rounded-[2.5px] border border-black/25" />
                    <div className="absolute inset-y-[2px] left-[2px] right-[6px] rounded-[1px] bg-[#34C759]" />
                    <div className="absolute right-0 top-1/2 h-[4px] w-[1px] -translate-y-1/2 rounded-full bg-black/30" />
                </div>
            </div>
        </div>
    );
}

function IosSmsComposerMock() {
    return (
        <div className="flex items-end gap-1.5 border-t border-[#C6C6C8] bg-[#F6F6F8] px-2 pb-6 pt-2">
            <button
                type="button"
                tabIndex={-1}
                className="mb-1 flex size-8 shrink-0 items-center justify-center rounded-full text-[#1982FC]"
                aria-hidden
            >
                <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
            </button>
            <div className="mb-1 min-h-[36px] flex-1 rounded-[19px] border border-[#C6C6C8] bg-white px-3 py-2 text-[17px] leading-snug text-[#C7C7CC]">
                Texto
            </div>
            <button
                type="button"
                tabIndex={-1}
                className="mb-1 flex size-8 shrink-0 items-center justify-center text-[#8E8E93]"
                aria-hidden
            >
                <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.42 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                </svg>
            </button>
        </div>
    );
}

function formatInviteExpiry(ts: number) {
    try {
        return new Intl.DateTimeFormat("fr-CA", { dateStyle: "long", timeStyle: "short" }).format(
            new Date(ts + 7 * 24 * 60 * 60 * 1000),
        );
    } catch {
        return "dans les 7 jours";
    }
}

function EmailTemplateCard({
    entry,
    patientEmail,
    patientCreatedAt,
}: {
    entry: NotificationEntry;
    patientEmail?: string;
    patientCreatedAt: number;
}) {
    return (
        <div
            className="w-full max-w-[800px] rounded-lg bg-white p-8 shadow-[0px_4px_8px_0px_rgba(16,24,40,0.1),0px_2px_4px_0px_rgba(16,24,40,0.06)] ring-1 ring-[#101828]/5"
            data-name="Email template"
        >
            <div className="px-6 pt-6">
                <img
                    src={BRAND_QUEBEC_LOGO}
                    alt="Gouvernement du Québec"
                    className="h-8 w-auto max-w-[min(100%,220px)] object-contain object-left sm:h-9"
                />
            </div>

            <div className="px-6 pt-6">
                <h2 className="text-xl font-bold leading-7 text-[#344054]">Attente à distance — File d’attente à l’urgence</h2>
                <p className="mt-1 text-sm text-[#667085]">
                    De : Urgence — attente à distance
                    {patientEmail ? (
                        <>
                            {" "}
                            · À : <span className="text-[#344054]">{patientEmail}</span>
                        </>
                    ) : null}
                </p>
            </div>

            <div className="px-6 py-8">
                <MessageBody entry={entry} channel="email" />
            </div>

            <div className="h-px w-full bg-[#E4E7EC]" aria-hidden />

            <div className="flex flex-col gap-8 px-6 py-8">
                {entry.consentUrl ? (
                    <>
                        <div className="text-sm italic leading-5 text-[#082244]">
                            <p>
                                En accédant au lien ci-dessous, vous poursuivez le processus de consentement pour l’attente à distance à l’urgence. Pour
                                plus d’information sur la protection des renseignements,{" "}
                                <a href="#" className="font-medium underline decoration-solid underline-offset-2">
                                    consultez la politique de l’établissement
                                </a>
                                .
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className="text-sm leading-5 text-[#082244]">
                                Cette invitation expirera le <span className="font-medium">{formatInviteExpiry(patientCreatedAt)}</span>.
                            </p>
                            <div>
                                <Link
                                    to={toAppPath(entry.consentUrl)}
                                    className="inline-flex items-center justify-center rounded-lg border border-[#0573d8] bg-[#0573d8] px-[18px] py-2.5 text-base font-medium text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.03)] transition-colors hover:bg-[#0460b8]"
                                >
                                    Ouvrir la page de consentement
                                </Link>
                            </div>
                        </div>
                    </>
                ) : null}

                {entry.actionUrl && isConfirmReturnLink(entry.actionUrl) ? (
                    <div className="flex flex-col gap-4">
                        <p className="text-sm leading-6 text-[#082244]">
                            Utilisez le bouton ci-dessous pour ouvrir la page sécurisée : vous pourrez confirmer votre retour à l’urgence (visible pour
                            l’équipe) ou annuler complètement votre inscription au service d’attente à distance.
                        </p>
                        <div>
                            <Link
                                to={toAppPath(entry.actionUrl)}
                                className="inline-flex items-center justify-center rounded-lg border border-[#0573d8] bg-[#0573d8] px-[18px] py-2.5 text-base font-medium text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.03)] transition-colors hover:bg-[#0460b8]"
                            >
                                Ouvrir la page de confirmation
                            </Link>
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="flex flex-col items-end border-t border-[#F2F4F7] px-4 py-4">
                <Link to="/version-c" className="inline-flex">
                    <img
                        src={BRAND_POWERED_BY_AKINOX}
                        alt="Propulsé par Akinox"
                        className="h-[34px] w-auto max-w-full object-contain object-right"
                    />
                </Link>
            </div>
        </div>
    );
}

export function VersionCPatientPovPage() {
    const { patients, selectedPatientId, setSelectedPatientId, notificationsByPatient } = useVersionC();

    const selected = useMemo(
        () => (selectedPatientId ? patients.find((p) => p.id === selectedPatientId) : patients[0]),
        [patients, selectedPatientId],
    );

    const entries = (selected ? notificationsByPatient[selected.id] ?? [] : []).slice().sort((a, b) => a.sentAt - b.sentAt);

    const [tab, setTab] = useState<NotificationChannel>("sms");

    const filtered = entries.filter((e) => e.channel === tab);

    const emailEntries = useMemo(() => entries.filter((e) => e.channel === "email"), [entries]);
    const [activeEmailId, setActiveEmailId] = useState<string | null>(null);

    useEffect(() => {
        if (emailEntries.length === 0) {
            setActiveEmailId(null);
            return;
        }
        setActiveEmailId((prev) => {
            if (prev && emailEntries.some((e) => e.id === prev)) return prev;
            return emailEntries[emailEntries.length - 1]!.id;
        });
    }, [emailEntries]);

    const activeEmailEntry = activeEmailId ? emailEntries.find((e) => e.id === activeEmailId) ?? null : null;

    const smsDisabled = !selected?.phone?.trim();
    const emailDisabled = !selected?.email?.trim();

    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#F2F4F7]">
            <div className="shrink-0 border-b border-[#E2E5EB] bg-white px-6 py-5">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-medium text-[#101828]">Vue patient</h1>
                        <p className="mt-1 text-sm text-[#667085]">
                            Simulation de l’expérience usager pour l’<strong className="font-medium text-[#475467]">attente à distance</strong> à la file
                            d’attente de l’urgence : SMS ou courriel, puis consentement.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-[#344054]">
                                <MessageCircle01 className="size-5 text-[#667085]" strokeWidth={1.75} aria-hidden />
                                Patient
                            </div>
                            <select
                                className="w-full min-w-[240px] max-w-xl rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-sm text-[#344054] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.03)]"
                                value={selected?.id ?? ""}
                                onChange={(e) => setSelectedPatientId(e.target.value || null)}
                            >
                                {patients.length === 0 ? <option value="">Aucun patient</option> : null}
                                {patients.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {fullName(p)} — {p.fileNumber}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Tabs
                                selectedKey={tab}
                                onSelectionChange={(k: Key) => {
                                    const next = k as NotificationChannel;
                                    setTab(next);
                                }}
                            >
                                <Tabs.List type="button-border" size="sm">
                                    <Tabs.Item id="sms" isDisabled={smsDisabled}>
                                        <span className="flex items-center gap-2">
                                            <Phone01 className="size-4" strokeWidth={1.75} aria-hidden /> SMS
                                        </span>
                                    </Tabs.Item>
                                    <Tabs.Item id="email" isDisabled={emailDisabled}>
                                        <span className="flex items-center gap-2">
                                            <Mail01 className="size-4" strokeWidth={1.75} aria-hidden /> Courriel
                                        </span>
                                    </Tabs.Item>
                                </Tabs.List>
                            </Tabs>

                            {selected ? (
                                <span className="rounded-full bg-[#F2F4F7] px-2 py-1 text-xs font-medium text-[#344054] ring-1 ring-[#E4E7EC]">
                                    Colonne : {statusToColumn(selected.status)}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    {smsDisabled && tab === "sms" ? (
                        <p className="text-xs text-[#B54708]">Ce patient n’a pas de numéro — le fil SMS est désactivé pour cette démo.</p>
                    ) : null}
                    {emailDisabled && tab === "email" ? (
                        <p className="text-xs text-[#B54708]">Ce patient n’a pas de courriel — la boîte de réception est désactivée pour cette démo.</p>
                    ) : null}
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-6">
                <div className="min-w-0 w-full">
                    {tab === "sms" ? (
                        <div className="mx-auto w-full max-w-[420px]">
                            <div className="rounded-[44px] border border-[#101828]/15 bg-[#101828] p-3.5 shadow-[0px_24px_60px_rgba(16,24,40,0.35)]">
                                <div className="rounded-[36px] bg-black px-1 pt-3 pb-2">
                                    <div className="mx-auto h-5 w-28 rounded-full bg-black" aria-hidden />
                                    <div className="mt-3 flex min-h-[620px] flex-col overflow-hidden rounded-[28px] bg-white">
                                        <PhoneStatusBar />

                                        <div className="flex items-center justify-center border-b border-black/[0.06] bg-[#F9F9F9] py-2.5">
                                            <div className="text-center">
                                                <p className="text-[15px] font-semibold text-black">Urgence</p>
                                                <p className="text-[11px] text-[#8E8E93]">Messages texte</p>
                                            </div>
                                        </div>

                                        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#E5E5EA] px-2.5 py-3">
                                            {selected ? (
                                                filtered.length > 0 ? (
                                                    filtered.map((e) => {
                                                        const incoming = e.direction === "outbound";
                                                        const timeStr = new Date(e.sentAt).toLocaleTimeString("fr-CA", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false,
                                                        });
                                                        return (
                                                            <div
                                                                key={e.id}
                                                                className={cx("flex w-full flex-col gap-1", incoming ? "items-start" : "items-end")}
                                                            >
                                                                <div
                                                                    className={cx(
                                                                        "max-w-[85%] rounded-[18px] px-3 py-2 shadow-[0px_1px_0.5px_rgba(0,0,0,0.12)]",
                                                                        incoming ? "bg-[#E9E9EB] text-[#101828]" : "bg-[#1982FC] text-white",
                                                                    )}
                                                                >
                                                                    <MessageBody
                                                                        entry={e}
                                                                        channel="sms"
                                                                        smsRole={incoming ? "incoming" : "outgoing"}
                                                                    />
                                                                </div>
                                                                <span className="max-w-[85%] px-1 text-[10px] text-[#8E8E93]">{timeStr}</span>

                                                                {e.consentUrl && incoming ? (
                                                                    <Link
                                                                        to={toAppPath(e.consentUrl)}
                                                                        className="mt-1 inline-flex max-w-[85%] items-center rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#1982FC] shadow-sm ring-1 ring-black/8"
                                                                    >
                                                                        Ouvrir le consentement
                                                                    </Link>
                                                                ) : null}
                                                                {e.actionUrl && incoming && isConfirmReturnLink(e.actionUrl) ? (
                                                                    <Link
                                                                        to={toAppPath(e.actionUrl)}
                                                                        className="mt-1 inline-flex max-w-[85%] items-center rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#1982FC] shadow-sm ring-1 ring-black/8"
                                                                    >
                                                                        Confirmer mon retour (page sécurisée)
                                                                    </Link>
                                                                ) : null}
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="rounded-xl border border-dashed border-black/10 bg-white/50 p-4 text-center text-xs text-[#475467]">
                                                        Aucun SMS pour l’instant. Ajoutez un patient sans consentement manuel pour voir l’invitation
                                                        automatique.
                                                    </div>
                                                )
                                            ) : (
                                                <div className="rounded-xl border border-dashed border-black/10 bg-white/50 p-4 text-center text-xs text-[#475467]">
                                                    Sélectionnez un patient pour afficher les messages.
                                                </div>
                                            )}
                                        </div>

                                        <IosSmsComposerMock />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto w-full max-w-[1100px] rounded-lg bg-[#F9FAFB] py-12 shadow-[0px_4px_8px_0px_rgba(16,24,40,0.1),0px_2px_4px_0px_rgba(16,24,40,0.06)] ring-1 ring-[#101828]/6">
                            <div className="flex flex-col gap-6 px-4 sm:px-8 lg:flex-row lg:items-start lg:gap-8">
                                <div className="w-full shrink-0 lg:w-[280px]">
                                    <div className="rounded-lg border border-[#E4E7EC] bg-white p-4 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
                                        <div className="text-xs font-semibold uppercase tracking-wide text-[#667085]">Boîte de réception</div>
                                        <div className="mt-3 space-y-2">
                                            {selected ? (
                                                emailEntries.length > 0 ? (
                                                    emailEntries.map((e) => {
                                                        const isActive = e.id === activeEmailId;
                                                        return (
                                                            <button
                                                                key={e.id}
                                                                type="button"
                                                                onClick={() => setActiveEmailId(e.id)}
                                                                className={cx(
                                                                    "w-full rounded-lg border px-3 py-2.5 text-left text-xs transition-colors",
                                                                    isActive
                                                                        ? "border-[#0573d8] bg-[#F2FAFF] shadow-sm"
                                                                        : "border-[#E4E7EC] bg-[#FCFCFD] hover:border-[#D0D5DD]",
                                                                )}
                                                            >
                                                                <div className="font-semibold text-[#344054]">
                                                                    {e.actionUrl && isConfirmReturnLink(e.actionUrl)
                                                                        ? "Rappel — confirmer le retour"
                                                                        : "Invitation — consentement"}
                                                                </div>
                                                                <div className="mt-1 text-[11px] text-[#667085]">
                                                                    {new Date(e.sentAt).toLocaleString("fr-CA", {
                                                                        dateStyle: "medium",
                                                                        timeStyle: "short",
                                                                    })}
                                                                </div>
                                                            </button>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="rounded-lg border border-dashed border-[#D0D5DD] bg-[#F9FAFB] p-3 text-xs text-[#667085]">
                                                        Aucun courriel.
                                                    </div>
                                                )
                                            ) : (
                                                <div className="rounded-lg border border-dashed border-[#D0D5DD] bg-[#F9FAFB] p-3 text-xs text-[#667085]">
                                                    Sélectionnez un patient.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex min-h-[520px] flex-1 items-start justify-center lg:min-h-[560px]">
                                    {selected && activeEmailEntry ? (
                                        <EmailTemplateCard
                                            entry={activeEmailEntry}
                                            patientEmail={selected.email}
                                            patientCreatedAt={selected.createdAt}
                                        />
                                    ) : (
                                        <div className="flex h-full min-h-[320px] w-full max-w-[800px] items-center justify-center rounded-lg border border-dashed border-[#D0D5DD] bg-white/80 p-8 text-center text-sm text-[#667085]">
                                            {selected
                                                ? "Aucun courriel à afficher pour ce patient."
                                                : "Sélectionnez un patient pour prévisualiser le courriel."}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
