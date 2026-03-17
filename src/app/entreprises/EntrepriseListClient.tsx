"use client";

import { useState, useEffect } from "react";
import { updateEntrepriseStatut } from "@/app/actions/crm";
import Link from "next/link";
import EditEntrepriseModal from "./EditEntrepriseModal";

export default function EntrepriseListClient({ 
    initialEntreprises, 
    statuts,
    secteurs 
}: { 
    initialEntreprises: any[], 
    statuts: string[],
    secteurs: any[]
}) {
    const [entreprises, setEntreprises] = useState(initialEntreprises);
    const [filterStatut, setFilterStatut] = useState("Tous");
    const [filterSecteur, setFilterSecteur] = useState("Tous");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEntreprise, setSelectedEntreprise] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        setEntreprises(initialEntreprises);
    }, [initialEntreprises]);

    const handleUpdateSuccess = (updated: any) => {
        setEntreprises(prev => prev.map(e => e.id === updated.id ? { ...e, ...updated } : e));
    };

    const handleStatutChange = async (id: number, newStatut: string) => {
        const res = await updateEntrepriseStatut(id, newStatut);
        if (res.success) {
            setEntreprises(prev => prev.map(e => e.id === id ? { ...e, statut: newStatut } : e));
        } else {
            alert("Erreur lors de la mise à jour du statut");
        }
    };

    const filtered = entreprises.filter(e => {
        const isClient = e.statut?.startsWith('Client') || e.statut?.includes('Gagné');
        const isProspect = !isClient;

        const matchesQuickFilter = 
            filterStatut === "Tous" ? true :
            filterStatut === "Prospects" ? isProspect :
            filterStatut === "Clients" ? isClient :
            e.statut === filterStatut;

        const matchesSecteur = filterSecteur === "Tous" || e.secteur_id?.toString() === filterSecteur;
        const matchesSearch = e.raison_sociale.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            e.ville?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesQuickFilter && matchesSecteur && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex gap-2 mb-2 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
                {["Tous", "Prospects", "Clients"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilterStatut(f)}
                        className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                            filterStatut === f 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-group">
                    <label className="form-label">Statut Précis</label>
                    <select 
                        className="form-select" 
                        value={statuts.includes(filterStatut) ? filterStatut : "Tous"}
                        onChange={(e) => setFilterStatut(e.target.value)}
                    >
                        <option>Tous</option>
                        {statuts.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Filtrer par secteur</label>
                    <select 
                        className="form-select" 
                        value={filterSecteur}
                        onChange={(e) => setFilterSecteur(e.target.value)}
                    >
                        <option value="Tous">Tous les secteurs</option>
                        {secteurs.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Rechercher</label>
                    <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Raison sociale, ville..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="premium-panel overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Entreprise</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Ville</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Statut CRM</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.map((e) => (
                            <tr key={e.id} className="hover:bg-white/[0.02] transition-all group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white group-hover:text-primary transition-colors">{e.raison_sociale}</div>
                                    <div className="text-[10px] text-slate-500">{e.secteur?.nom}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-tight">{e.ville || "N/A"}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border-0 focus:ring-1 focus:ring-primary cursor-pointer transition-all ${
                                            e.statut?.startsWith('Client') ? 'bg-success/10 text-success' : 
                                            e.statut?.includes('Gagné') ? 'bg-primary/20 text-primary' :
                                            'bg-orange-500/10 text-orange-400'
                                        }`}
                                        value={e.statut || "Prospect brut"}
                                        onChange={(event) => handleStatutChange(e.id, event.target.value)}
                                    >
                                        {statuts.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => {
                                                setSelectedEntreprise(e);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                            title="Modifier l'entreprise"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" /></svg>
                                        </button>
                                        <Link 
                                            href={`/actions/nouvelle?entreprise_id=${e.id}`}
                                            className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-primary transition-all"
                                            title="Nouveau suivi d'action"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>
                                        </Link>
                                        <Link 
                                            href={`/entreprises/${e.id}`}
                                            className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all font-bold text-[10px] px-3 uppercase tracking-widest"
                                        >
                                            Fiche Detaillee
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs opacity-50">
                        Aucune entreprise trouvée
                    </div>
                )}
            </div>

            <EditEntrepriseModal 
                entreprise={selectedEntreprise}
                secteurs={secteurs}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={handleUpdateSuccess}
            />
        </div>
    );
}
