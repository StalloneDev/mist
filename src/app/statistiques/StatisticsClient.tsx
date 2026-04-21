"use client";

import { useMemo } from "react";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

export default function StatisticsClient({ data }: { data: any }) {
    
    // Insights extraction
    const { totalVolume, totalConso, totalOpportunites, activeSectors, totalRecords } = data.summary;
    const { topSector, topSectorVolume, topSectorPct, topCommercial, topCommercialVolume, topCommercialVisites } = data.insights;

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        if (percent < 0.05) return null; // Don't show labels for tiny slices
        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* -- 1. SUMMARY CARDS -- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Volume Potentiel Global", value: Number(totalVolume).toLocaleString("fr-FR") + " L", bg: "bg-primary", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"/><path d="m17 7-5-5-5 5"/><path d="m17 17-5 5-5-5"/></svg> },
                    { title: "Conso. Mensuelle Estimée", value: Number(totalConso).toLocaleString("fr-FR") + " L", bg: "bg-emerald-600", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg> },
                    { title: "Opportunités Fortes", value: totalOpportunites, bg: "bg-blue-600", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
                    { title: "Secteurs Actifs", value: activeSectors, bg: "bg-purple-600", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
                ].map((card, i) => (
                    <div key={i} className={`premium-card relative overflow-hidden group p-6 shadow-xl ${card.bg}`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/20 transition-all duration-500" />
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 text-white">
                                {card.icon}
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-black text-white truncate">{card.value}</div>
                                <div className="text-[10px] font-black text-white/70 uppercase tracking-widest">{card.title}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* -- 2. SMART INSIGHTS -- */}
            <div className="premium-panel p-6 border-l-4 border-l-primary flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </div>
                <div>
                    <h3 className="font-black text-foreground text-sm uppercase tracking-widest mb-2">Interprétation Automatique</h3>
                    <p className="text-muted text-sm leading-relaxed">
                        Le secteur <strong className="text-foreground">{topSector}</strong> domine le marché avec <strong className="text-primary">{topSectorPct}%</strong> du volume total potentiel,
                        représentant <strong className="text-primary">{Number(topSectorVolume).toLocaleString("fr-FR")} L</strong>.
                        Côté commercial, c'est <strong className="text-foreground">{topCommercial}</strong> qui affiche les meilleures performances
                        (visites liées à {Number(topCommercialVolume).toLocaleString("fr-FR")} L sur {topCommercialVisites} prospects).
                        Sur un total de <strong className="text-foreground">{totalRecords}</strong> relevés,
                        on identifie <strong className="text-emerald-500">{totalOpportunites} opportunités fortes ou hautes</strong> à convertir en priorité.
                    </p>
                </div>
            </div>

            {/* -- 3. VIZ GRIDS -- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Evolution Mensuelle */}
                <div className="premium-panel p-6 shadow-lg flex flex-col h-[400px]">
                    <div className="mb-6">
                        <h2 className="text-base font-black text-foreground uppercase tracking-widest">Tendance Mensuelle</h2>
                        <p className="text-[10px] text-muted uppercase tracking-widest mt-1">Volume potentiel (L) détecté par mois</p>
                    </div>
                    <div className="flex-1 w-full text-xs font-bold">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b'}} />
                                <YAxis stroke="#64748b" tick={{fill: '#64748b'}} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                                <Tooltip formatter={(value) => [Number(value).toLocaleString("fr-FR") + " L", "Volume"]} labelStyle={{color: '#0f172a'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Répartition Sectorielle */}
                <div className="premium-panel p-6 shadow-lg flex flex-col h-[400px]">
                    <div className="mb-2">
                        <h2 className="text-base font-black text-foreground uppercase tracking-widest">Répartition Sectorielle</h2>
                        <p className="text-[10px] text-muted uppercase tracking-widest mt-1">Parts de marché par volume potentiel</p>
                    </div>
                    <div className="flex-1 w-full text-xs font-bold flex">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={data.sectorDistribution.slice(0, 10)} 
                                    dataKey="volume" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={100} 
                                    fill="#8884d8"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                >
                                    {data.sectorDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [Number(value).toLocaleString("fr-FR") + " L", "Volume"]} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '11px', lineHeight: '24px'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Performance Commerciale */}
                <div className="premium-panel p-6 shadow-lg flex flex-col h-[400px] lg:col-span-2">
                    <div className="mb-6">
                        <h2 className="text-base font-black text-foreground uppercase tracking-widest">Performance par Commercial</h2>
                        <p className="text-[10px] text-muted uppercase tracking-widest mt-1">Volume potentiel ramené par agent</p>
                    </div>
                    <div className="flex-1 w-full text-xs font-bold">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.commercialPerf} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} />
                                <YAxis yAxisId="left" stroke="#64748b" tick={{fill: '#64748b'}} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                                <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{fill: '#10b981'}} />
                                <Tooltip formatter={(value, name) => [
                                    name === "volume" ? Number(value).toLocaleString("fr-FR") + " L" : value,
                                    name === "volume" ? "Volume" : "Opportunités Fortes"
                                ]} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Legend wrapperStyle={{ fontSize: '11px' }} />
                                <Bar yAxisId="left" dataKey="volume" name="Volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="right" dataKey="opportunites" name="Opportunités Fortes (Qté)" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
            
            {/* -- 4. TOP CLIENTS TABLE -- */}
            <div className="premium-panel overflow-hidden border border-white/5 shadow-2xl">
                <div className="px-6 py-5 border-b border-border bg-surface-2 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-black text-foreground uppercase tracking-widest">Top 10 Comptes Stratégiques</h2>
                        <p className="text-[10px] text-muted uppercase tracking-widest mt-1">Classés par volume potentiel</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                    </div>
                </div>
                {data.topClients.length === 0 ? (
                    <div className="py-20 text-center opacity-60">
                        <p className="text-muted font-bold tracking-widest uppercase text-xs">Aucune donnée trouvée</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="bg-surface-2 border-b border-border">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest w-16">Rank</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Raison Sociale</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Secteur</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest">Commercial</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted tracking-widest text-right">Volume Potentiel</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {data.topClients.map((client: any, i: number) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-black text-muted group-hover:text-primary transition-colors">#{i + 1}</td>
                                        <td className="px-6 py-4 font-bold text-foreground truncate max-w-[300px]">{client.name}</td>
                                        <td className="px-6 py-4 font-bold text-muted">
                                            <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] uppercase tracking-widest">{client.secteur || "N/A"}</span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-muted">{client.commercial}</td>
                                        <td className="px-6 py-4 text-right font-black text-primary">{Number(client.volume).toLocaleString("fr-FR")} L</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}
