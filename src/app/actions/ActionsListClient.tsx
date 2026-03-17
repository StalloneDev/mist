"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ActionsListClient({ 
    initialActions, 
    commerciaux,
    currentUserId
}: { 
    initialActions: any[], 
    commerciaux: any[],
    currentUserId?: number
}) {
    const [actions, setActions] = useState(initialActions);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCommercial, setFilterCommercial] = useState("Tous");
    const [filterType, setFilterType] = useState("Tous");
    const [filterPriorite, setFilterPriorite] = useState("Toutes");
    const [selectedAction, setSelectedAction] = useState<any>(null);

    const typesAction = ["Appel", "Visite", "E-mail", "Réunion", "Présentation", "Autre"];
    const priorites = ["Basse", "Moyenne", "Haute"];

    useEffect(() => {
        setActions(initialActions);
    }, [initialActions]);

    const filtered = actions.filter(a => {
        const matchesSearch = a.entreprise?.raison_sociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             a.sujet_principal?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCommercial = filterCommercial === "Tous" || a.user_id.toString() === filterCommercial;
        const matchesType = filterType === "Tous" || a.type_action === filterType;
        const matchesPriorite = filterPriorite === "Toutes" || a.priorite === filterPriorite;
        
        return matchesSearch && matchesCommercial && matchesType && matchesPriorite;
    });

    return (
        <div className="space-y-8">
            {/* Filtres */}
            <div className="premium-panel p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="form-group">
                        <label className="form-label text-[10px] uppercase tracking-widest opacity-50">Rechercher</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Entreprise, sujet..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label text-[10px] uppercase tracking-widest opacity-50">Commercial</label>
                        <select 
                            className="form-select" 
                            value={filterCommercial}
                            onChange={(e) => setFilterCommercial(e.target.value)}
                        >
                            <option value="Tous">Tous les commerciaux</option>
                            {commerciaux.map(c => (
                                <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label text-[10px] uppercase tracking-widest opacity-50">Type d'Action</label>
                        <select 
                            className="form-select" 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option>Tous</option>
                            {typesAction.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label text-[10px] uppercase tracking-widest opacity-50">Priorité</label>
                        <select 
                            className="form-select" 
                            value={filterPriorite}
                            onChange={(e) => setFilterPriorite(e.target.value)}
                        >
                            <option>Toutes</option>
                            {priorites.map(p => <option key={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Liste Timeline */}
            <div className="space-y-6">
                {filtered.length === 0 ? (
                    <div className="premium-panel p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs opacity-50">
                        Aucune action ne correspond à vos filtres
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filtered.map((action) => (
                            <div 
                                key={action.id} 
                                className="premium-panel p-6 group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden"
                                onClick={() => setSelectedAction(action)}
                            >
                                <div className="absolute top-0 right-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-all" />
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${
                                            action.type_action === 'Appel' ? 'bg-blue-500' :
                                            action.type_action === 'Visite' ? 'bg-emerald-500' :
                                            action.type_action === 'E-mail' ? 'bg-amber-500' :
                                            'bg-slate-500'
                                        }`}>
                                            {action.type_action === 'Appel' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}
                                            {action.type_action === 'Visite' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>}
                                            {action.type_action === 'E-mail' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>}
                                            {(action.type_action !== 'Appel' && action.type_action !== 'Visite' && action.type_action !== 'E-mail') && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{action.type_action}</div>
                                            <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{action.entreprise?.raison_sociale}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-slate-400">{new Date(action.date_action).toLocaleDateString('fr-FR')}</div>
                                        <div className={`text-[9px] font-black uppercase tracking-tight mt-1 ${
                                            action.priorite === 'Haute' ? 'text-red-500' :
                                            action.priorite === 'Moyenne' ? 'text-orange-500' :
                                            'text-blue-500'
                                        }`}>
                                            Priorité {action.priorite}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-4 group-hover:bg-white/[0.05] transition-all">
                                    <div className="text-xs font-bold text-white/90 mb-1">{action.sujet_principal}</div>
                                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed italic">
                                        "{action.resume_discussion || 'Aucun résumé disponible'}"
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                                            {action.user?.prenom?.[0]}{action.user?.nom?.[0]}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            {action.user?.prenom} {action.user?.nom}
                                        </span>
                                    </div>
                                    {action.prochaine_etape && (
                                        <div className="flex items-center gap-2 text-primary">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{action.prochaine_etape}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Liste en format table pour plus de densité si nécessaire (Optionnel) */}

            {/* Modal de Détails */}
            {selectedAction && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedAction(null)} />
                    <div className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 space-y-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${
                                        selectedAction.type_action === 'Appel' ? 'bg-blue-500' :
                                        selectedAction.type_action === 'Visite' ? 'bg-emerald-500' :
                                        selectedAction.type_action === 'E-mail' ? 'bg-amber-500' :
                                        'bg-slate-500'
                                    }`}>
                                        {/* Same Icons as above */}
                                        {selectedAction.type_action === 'Appel' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}
                                        {selectedAction.type_action === 'Visite' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>}
                                        {selectedAction.type_action === 'E-mail' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-black text-white">{selectedAction.entreprise?.raison_sociale}</h2>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                selectedAction.priorite === 'Haute' ? 'bg-red-500/10 text-red-500' :
                                                selectedAction.priorite === 'Moyenne' ? 'bg-orange-500/10 text-orange-500' :
                                                'bg-blue-500/10 text-blue-500'
                                            }`}>
                                                {selectedAction.priorite}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                                            {selectedAction.type_action} • {new Date(selectedAction.date_action).toLocaleDateString('fr-FR')} {selectedAction.heure_debut && `à ${selectedAction.heure_debut}`}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedAction(null)} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <section>
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Sujet Principal</h4>
                                        <div className="text-sm text-white font-bold bg-white/5 p-4 rounded-2xl border border-white/5">
                                            {selectedAction.sujet_principal}
                                        </div>
                                    </section>
                                    <section>
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Résumé des échanges</h4>
                                        <div className="text-sm text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/5 leading-relaxed min-h-[100px]">
                                            {selectedAction.resume_discussion || "Aucun détail saisi."}
                                        </div>
                                    </section>
                                    <section>
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Contacté</h4>
                                        <div className="text-sm text-white font-bold bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                            {selectedAction.personne_contactee || "Non précisé"}
                                        </div>
                                    </section>
                                </div>

                                <div className="space-y-6">
                                    <section className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Prochaine Étape</h4>
                                        <div className="space-y-4">
                                            <div className="text-lg font-black text-white">{selectedAction.prochaine_etape || "Non définie"}</div>
                                            {selectedAction.date_prochaine_action && (
                                                <div className="flex items-center gap-2 text-slate-400 text-xs">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                                    Prévue le {new Date(selectedAction.date_prochaine_action).toLocaleDateString('fr-FR')}
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Statuts Obtenus</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedAction.statut_obtenu ? (
                                                selectedAction.statut_obtenu.split(", ").map((s: string) => (
                                                    <span key={s} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white/70">
                                                        {s}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-slate-500 italic">Aucun statut majeur</span>
                                            )}
                                        </div>
                                    </section>

                                    <section className="pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-black text-primary border border-primary/20">
                                                {selectedAction.user?.prenom?.[0]}{selectedAction.user?.nom?.[0]}
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Commercial Référent</div>
                                                <div className="text-sm font-bold text-white">{selectedAction.user?.prenom} {selectedAction.user?.nom}</div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 gap-4">
                                <Link 
                                    href={`/entreprises/${selectedAction.entreprise_id}`}
                                    className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-slate-300 font-bold text-xs hover:bg-white/10 transition-all uppercase tracking-widest"
                                >
                                    Fiche Entreprise
                                </Link>
                                <button 
                                    onClick={() => setSelectedAction(null)}
                                    className="px-8 py-3 rounded-2xl bg-primary text-white font-black text-xs hover:bg-primary/90 transition-all uppercase tracking-widest"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
