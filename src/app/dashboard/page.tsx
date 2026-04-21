export const dynamic = "force-dynamic";
import { getDashboardStats, getRecentActivities } from "@/app/actions/dashboard";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SectorAnalysisClient from "./SectorAnalysisClient";

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const [statsRes, activitiesRes] = await Promise.all([
        getDashboardStats(),
        getRecentActivities(8)
    ]);

    const stats = (statsRes as any).success ? (statsRes as any).data : null;
    const activities: any[] = (activitiesRes as any).success ? (activitiesRes as any).data : [];

    return (
        <main className="page-wrapper min-h-screen space-y-6 sm:space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight mb-2">Intelligence Marché</h1>
                    <div className="flex items-center gap-2 text-muted font-medium text-xs sm:text-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Données synchronisées en temps réel
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <button className="flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 text-foreground px-4 py-3 sm:py-2.5 rounded-xl border border-white/10 transition-all font-bold text-sm w-full sm:w-auto">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                        Exporter PDF
                    </button>
                    <Link href="/visites/nouvelle" className="flex justify-center items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-3 sm:py-2.5 rounded-xl transition-all font-black text-sm shadow-lg shadow-primary/20 w-full sm:w-auto">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Nouvelle Visite
                    </Link>
                </div>

            </div>
            {/* Hero Scorecards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Card 1: Volume */}
                <div className="relative overflow-hidden group premium-card p-0 bg-primary border-none shadow-xl shadow-primary/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all duration-500" />
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <div className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Volume Potentiel Global</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white truncate">
                                        {Number(stats?.totals?.volumeTotal || 0).toLocaleString()}
                                    </span>
                                    <span className="text-xs sm:text-sm font-bold text-white/80">L/m</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-primary transition-all duration-300 shadow-lg shadow-black/5">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20" /><path d="m17 7-5-5-5 5" /><path d="m17 17-5 5-5-5" /></svg>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${Number(stats?.growth || 0) >= 0 ? 'bg-white/20 text-white border-white/30' : 'bg-rose-500/20 text-rose-100 border-rose-500/30'}`}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={Number(stats?.growth || 0) < 0 ? 'rotate-180' : ''}><path d="m5 15 7-7 7 7" /></svg>
                                {Number(stats?.growth || 0) >= 0 ? '+' : ''}{stats?.growth || '0'}%
                            </div>
                            <span className="text-xs font-medium text-white/70">vs mois dernier</span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-black/10 overflow-hidden rounded-full">
                        <div className="h-full bg-white transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]" style={{ width: `${Math.min(Math.max(Number(stats?.growth || 0) + 50, 10), 100)}%` }} />
                    </div>
                </div>

                {/* Card 2: Entreprises */}
                <div className="relative overflow-hidden group premium-card p-0 bg-blue-600 border-none shadow-xl shadow-blue-600/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all duration-500" />
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <div className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Portefeuille Clients</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl md:text-5xl font-black text-white">
                                        {stats?.totals?.entreprises || 0}
                                    </span>
                                    <span className="text-xs sm:text-sm font-bold text-white/80">Comptes</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-blue-600 transition-all duration-300 shadow-lg shadow-black/5">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /></svg>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs font-bold text-white ml-2">{stats?.activeSectors || 0} secteurs clés actifs</span>
                        </div>
                    </div>
                </div>

                {/* Card 3: Visites */}
                <div className="relative overflow-hidden group premium-card p-0 bg-emerald-600 border-none shadow-xl shadow-emerald-600/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all duration-500" />
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <div className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Engagement Terrain</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl md:text-5xl font-black text-white">
                                        {stats?.totals?.visites || 0}
                                    </span>
                                    <span className="text-xs sm:text-sm font-bold text-white/80">Visites</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-emerald-600 transition-all duration-300 shadow-lg shadow-black/5">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19 21 21 12 3 3 21 12 19Z" /></svg>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white transition-all duration-700 shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${stats?.engagement || 0}%` }} />
                            </div>
                            <span className="text-[10px] font-black text-white whitespace-nowrap uppercase">OBJ. {stats?.engagement || 0}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                {/* Left Column: Side Widgets */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <SectorAnalysisClient stats={stats} />

                    {/* Prochains RDV */}
                    <div className="premium-panel p-8 flex flex-col shadow-xl border-primary/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-foreground tracking-tight">Prochains RDV</h2>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {(stats as any)?.upcomingRDVs?.length > 0 ? (
                                (stats as any).upcomingRDVs.map((rdv: any, idx: number) => (
                                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                                {new Date(rdv.date_rdv).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} • {new Date(rdv.date_rdv).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{rdv.objet}</h4>
                                        <p className="text-[11px] text-muted font-medium truncate">{rdv.entreprise?.raison_sociale}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 opacity-40">
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Aucun rendez-vous prévu</p>
                                </div>
                            )}
                        </div>

                        <Link href="/actions" className="mt-6 w-full py-3 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-foreground transition-all text-[10px] font-black uppercase tracking-[0.2em] text-center">
                            Voir Mes Actions
                        </Link>
                    </div>
                </div>

                {/* Right Column: Sector Contribution Histogram */}
                <div className="lg:col-span-2 premium-panel flex flex-col shadow-xl min-h-[500px]">
                    <div className="p-8 border-b flex justify-between items-center bg-white/[0.02]">
                        <div>
                            <h2 className="text-xl font-black text-foreground tracking-tight">Opportunités par Secteur</h2>
                            <p className="text-xs font-medium text-muted mt-1 uppercase tracking-wider">Analyse comparative des volumes potentiels (L/m)</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                Live Data
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-4 sm:p-8 flex flex-col relative overflow-hidden">
                        <div className="overflow-x-auto custom-scrollbar pb-4">
                            <div className="flex justify-between items-stretch gap-4 lg:gap-8 h-graph px-2 sm:px-4 relative min-w-[600px]">
                            {stats?.sectorDistribution?.map((item: any, idx: number) => {
                                const maxVal = Math.max(...(stats?.sectorDistribution?.map((s: any) => s.value) || [0]), 1);
                                const heightPercent = (item.value / maxVal) * 100;
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center h-full group">
                                        <div className="flex-1 w-full flex flex-col justify-end items-center relative pb-2">
                                            {/* Tooltip on hover */}
                                            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-30 pointer-events-none">
                                                <div className="bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md">
                                                    <span className="text-xs font-black text-foreground whitespace-nowrap">{item.value.toLocaleString()} L</span>
                                                </div>
                                                <div className="w-2 h-2 bg-slate-900 border-r border-b border-white/10 rotate-45 mx-auto -mt-1"></div>
                                            </div>

                                            {/* Bar */}
                                            <div
                                                className="histogram-bar max-w-bar z-10"
                                                style={{ height: `${Math.max(heightPercent, 8)}%` }}
                                            >
                                            </div>
                                        </div>

                                        {/* Sector Label Zone */}
                                        <div className="h-10 w-full flex items-center justify-center border-t border-white/5 bg-white/[0.01]">
                                            <span className="text-[10px] font-bold text-muted group-hover:text-foreground transition-colors uppercase tracking-widest truncate block px-1">
                                                {item.name}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {(!stats?.sectorDistribution || stats.sectorDistribution.length === 0) && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
                                    </div>
                                    <p className="text-muted font-bold uppercase tracking-widest text-[10px] mb-2">Aucune donnée d'opportunité</p>
                                    <p className="text-slate-600 text-xs italic max-w-[200px]">Les opportunités s'afficheront ici une fois les fiches terrain ou imports Excel complétés.</p>
                                </div>
                            )}
                        </div>
                        </div>

                        {/* Baseline */}
                        <div className="h-px w-full bg-white/5 relative mt-4">
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        </div>

                        {/* Summary Legend */}
                        <div className="mt-6 flex flex-wrap gap-6 justify-center lg:justify-start">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,1)]"></div>
                                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Volume Potentiel Estimé</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Secteurs Identifiés</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
