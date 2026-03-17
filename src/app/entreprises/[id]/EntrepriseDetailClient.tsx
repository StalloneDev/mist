"use client";

import { useState } from "react";
import Link from "next/link";
import EditEntrepriseModal from "../EditEntrepriseModal";
import EditContactModal from "../EditContactModal";

interface EntrepriseDetailClientProps {
    entreprise: any;
    secteurs: any[];
}

export default function EntrepriseDetailClient({ entreprise: initialEntreprise, secteurs }: EntrepriseDetailClientProps) {
    const [entreprise, setEntreprise] = useState(initialEntreprise);
    const [isEditEntrepriseOpen, setIsEditEntrepriseOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<any>(null);
    const [isEditContactOpen, setIsEditContactOpen] = useState(false);

    const handleUpdateEntreprise = (updated: any) => {
        setEntreprise({ ...entreprise, ...updated });
    };

    const handleUpdateContact = (updated: any) => {
        setEntreprise({
            ...entreprise,
            contacts: entreprise.contacts.map((c: any) => c.id === updated.id ? updated : c)
        });
    };

    return (
        <main className="p-8 max-w-7xl mx-auto space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
                <div className="flex items-start gap-6">
                    <Link href="/entreprises" className="mt-1 w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border flex items-center justify-center text-slate-400 hover:text-white transition-all">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black text-white tracking-tight">{entreprise.raison_sociale}</h1>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                                {entreprise.secteur?.nom}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                <span className="text-sm font-bold">{entreprise.ville || "Ville non précisée"}</span>
                            </div>
                            <span className="text-slate-700">|</span>
                            <span className="text-sm font-medium">ID: #{entreprise.id}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsEditEntrepriseOpen(true)}
                        className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border text-sm font-black text-white transition-all"
                    >
                        Modifier
                    </button>
                    <Link href="/visites/nouvelle" className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-sm font-black text-white transition-all shadow-lg shadow-primary/20">
                        + Nouvelle Visite
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Side Column: Info & Contacts */}
                <div className="space-y-10">
                    <section className="premium-panel p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3 text-primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                                <h2 className="text-sm font-black uppercase tracking-widest">Contacts ({entreprise.contacts.length})</h2>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {entreprise.contacts.map((c: any) => (
                                <div key={c.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all group relative">
                                    <button 
                                        onClick={() => {
                                            setSelectedContact(c);
                                            setIsEditContactOpen(true);
                                        }}
                                        className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" /></svg>
                                    </button>
                                    <div className="font-black text-white mb-0.5 group-hover:text-primary transition-colors">{c.nom}</div>
                                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-4">{c.fonction}</div>
                                    <div className="space-y-2">
                                        {c.email && (
                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                                <svg className="text-slate-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.53 5.33a2 2 0 0 1-2.14 0L2 7" /></svg>
                                                <span className="truncate">{c.email}</span>
                                            </div>
                                        )}
                                        {c.telephone && (
                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                                <svg className="text-slate-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                                <span>{c.telephone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {entreprise.contacts.length === 0 && (
                                <div className="text-center py-8 rounded-2xl border border-dashed text-slate-500 text-xs font-bold uppercase tracking-widest bg-white/[0.01]">
                                    Aucun contact
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="premium-panel p-8">
                        <div className="flex items-center gap-3 mb-8 text-primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /></svg>
                            <h2 className="text-sm font-black uppercase tracking-widest">Informations Siège</h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Adresse Principale</div>
                                <p className="text-sm font-medium text-slate-300 leading-relaxed">{entreprise.adresse || "Non renseignée"}</p>
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Membre depuis</div>
                                <p className="text-sm font-black text-white">{new Date(entreprise.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Main Column: Timeline & Opportunités */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="premium-panel p-8">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-3 text-primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
                                <h2 className="text-sm font-black uppercase tracking-widest">Historique des Visites</h2>
                            </div>
                            <Link href="/visites/nouvelle" className="text-xs font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
                                + Ajouter une visite
                            </Link>
                        </div>

                        <div className="relative space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
                            {entreprise.visites.map((v: any) => (
                                <div key={v.id} className="relative pl-10">
                                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-primary shadow-[0_0_10px_rgba(59,130,246,0.3)] z-10 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <div className="text-lg font-black text-white tracking-tight">
                                                Visite du {new Date(v.date_visite).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                                Par {v.commercial?.prenom} {v.commercial?.nom}
                                            </div>
                                        </div>
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black text-primary">
                                                {v.commercial?.prenom[0]}{v.commercial?.nom[0]}
                                            </div>
                                        </div>
                                    </div>

                                    {v.observations && (
                                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-sm text-slate-400 italic mb-6 leading-relaxed">
                                            "{v.observations}"
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {v.projets.map((p: any) => (
                                            <div key={p.id} className="p-5 rounded-2xl bg-[#111827] border border-white/5 hover:border-primary/20 transition-all shadow-sm">
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.15em] bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                                                        {p.activite || "PROJET"}
                                                    </span>
                                                    <span className="text-[10px] text-slate-600 font-bold">PROJET #{p.id}</span>
                                                </div>
                                                <p className="text-sm font-bold text-white line-clamp-2 mb-4 leading-relaxed">{p.description}</p>

                                                <div className="flex flex-wrap gap-2">
                                                    {p.opportunites?.map((o: any) => (
                                                        <div key={o.id} className="flex gap-2">
                                                            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                <span className="text-[9px] font-black uppercase tracking-widest">{o.niveau?.nom}</span>
                                                            </div>
                                                            {o.volume_potentiel && (
                                                                <div className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                                    {Number(o.volume_potentiel).toLocaleString()} L/MOIS
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {entreprise.visites.length === 0 && (
                                <div className="text-center py-16 rounded-3xl bg-white/[0.01] border border-dashed border-white/5">
                                    <p className="text-slate-600 text-xs font-black uppercase tracking-[0.2em]">Historique vierge</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            <EditEntrepriseModal 
                entreprise={entreprise}
                secteurs={secteurs}
                isOpen={isEditEntrepriseOpen}
                onClose={() => setIsEditEntrepriseOpen(false)}
                onSuccess={handleUpdateEntreprise}
            />

            <EditContactModal 
                contact={selectedContact}
                isOpen={isEditContactOpen}
                onClose={() => setIsEditContactOpen(false)}
                onSuccess={handleUpdateContact}
            />
        </main>
    );
}
