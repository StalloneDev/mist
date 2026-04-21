import { getSectorDetails } from "@/app/actions/dashboard";
import Link from "next/link";
import ExportButton from "./ExportButton";

type Props = {
    params: Promise<{ sectorName: string }> | { sectorName: string }
};

export default async function SecteurPage(props: Props) {
    const resolvedParams = await Promise.resolve(props.params);
    const sectorName = decodeURIComponent(resolvedParams.sectorName);
    const res = await getSectorDetails(sectorName);
    const details = res.success ? (res.data || []) : [];

    return (
        <main className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 text-muted text-xs font-black uppercase tracking-widest mb-4">
                        <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6" /></svg>
                            Retour au Dashboard
                        </Link>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight uppercase">
                        Détails <span className="text-primary prose-glow">{sectorName}</span>
                    </h1>
                    <p className="text-muted font-bold tracking-widest uppercase text-xs mt-2 bg-white/5 inline-flex px-3 py-1.5 rounded-lg border border-white/10">
                        {details.length} entreprise{details.length > 1 ? 's' : ''} identifiée{details.length > 1 ? 's' : ''}
                    </p>
                </div>
                
                <div className="shrink-0">
                    <ExportButton sectorName={sectorName} details={details} />
                </div>
            </div>

            {/* Table */}
            <div className="premium-panel overflow-hidden border border-white/5 shadow-2xl">
                {details.length === 0 ? (
                    <div className="py-32 text-center opacity-60">
                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 text-muted">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="M12 8v4l3 3"/></svg>
                        </div>
                        <p className="text-muted font-black tracking-[0.2em] uppercase text-sm">Aucune donnée trouvée</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="bg-surface-2 border-b-2 border-primary/20">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-muted tracking-widest border-r border-border">Raison Sociale</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase text-muted tracking-widest border-r border-border">Localisation</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase text-muted tracking-widest border-r border-border">Commercial</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase text-muted tracking-widest border-r border-border">Opportunité</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase text-muted tracking-widest border-r border-border text-right">Vol. Potentiel</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase text-muted tracking-widest border-r border-border text-right">Vol. DIR</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-muted tracking-widest text-right">Conso. Est.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {details.map((d: any, i: number) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-5 font-black text-foreground truncate max-w-[250px] border-r border-border" title={d.raison_sociale}>{d.raison_sociale}</td>
                                        <td className="px-6 py-5 font-medium text-muted border-r border-border">{d.localisation || "—"}</td>
                                        <td className="px-6 py-5 font-bold text-slate-300 border-r border-border">{d.commercial || "—"}</td>
                                        <td className="px-6 py-5 border-r border-border">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest border shadow-sm ${d.opportunite_niveau?.toLowerCase() === 'forte' ? 'text-green-400 border-green-400/20 bg-green-400/10' : 'text-slate-400 border-white/10 bg-white/5'}`}>
                                                {d.opportunite_niveau || "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-blue-400 border-r border-border">{d.volume_potentiel ? d.volume_potentiel.toLocaleString() + " L" : "—"}</td>
                                        <td className="px-6 py-5 text-right font-bold text-muted border-r border-border group-hover:text-foreground transition-colors">{d.volume_potentiel_dir ? d.volume_potentiel_dir.toLocaleString() + " L" : "—"}</td>
                                        <td className="px-8 py-5 text-right font-black text-slate-400">{d.conso_mensuelle_estime ? d.conso_mensuelle_estime.toLocaleString() + " L" : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}
