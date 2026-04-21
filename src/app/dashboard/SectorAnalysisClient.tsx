"use client";

import { useRouter } from "next/navigation";

export default function SectorAnalysisClient({ stats }: { stats: any }) {
    const router = useRouter();

    const handleSectorClick = (sectorName: string) => {
        router.push('/dashboard/secteur/' + encodeURIComponent(sectorName));
    };

    return (
        <div className="premium-panel p-8 flex flex-col shadow-xl">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-xl font-black text-foreground tracking-tight">Analyse Sectorielle</h2>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
                    </div>
                </div>

                <div className="flex-1 space-y-8">
                    {stats?.sectorDistribution?.map((item: any, idx: number) => {
                        const maxVal = Math.max(...(stats?.sectorDistribution?.map((s: any) => s.value) || [0]), 1);
                        const percentage = (item.value / maxVal) * 100;
                        return (
                            <div 
                                key={idx} 
                                className="group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-white/5 transition-all outline-none focus:bg-white/10"
                                onClick={() => handleSectorClick(item.name)}
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSectorClick(item.name) }}
                            >
                                <div className="flex justify-between items-end mb-3 px-2">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-muted uppercase tracking-widest">{item.name}</span>
                                        <span className="text-sm font-bold text-foreground mt-0.5 group-hover:text-primary transition-all">{item.value.toLocaleString()} L</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 bg-white/5 px-2 py-0.5 rounded uppercase">
                                        {Math.round((item.value / (stats?.totals?.volumeTotal || 1)) * 100)}%
                                    </span>
                                </div>
                                <div className="progress-bar-bg mx-2">
                                    <div
                                        className="progress-bar-fill shadow-lg"
                                        style={{ width: `${Math.max(percentage, 5)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    {(!stats?.sectorDistribution || stats.sectorDistribution.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-20 opacity-60 italic text-sm text-muted gap-4">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M2 20h20" /><path d="M7 20v-5" /><path d="M11 20v-9" /><path d="M15 20v-13" /><path d="M19 20v-17" /></svg>
                            Aucune donnée sectorielle
                        </div>
                    )}
                </div>

                <div className="mt-10 pt-6 border-t border-white/5">
                    <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-muted hover:text-foreground transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 pointer-events-none opacity-50">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        Cliquez sur un secteur pour les détails
                    </button>
                </div>
            </div>
    );
}
