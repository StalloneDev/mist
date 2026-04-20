"use client";

import { useState, useEffect } from "react";
import { updateEntrepriseStatut } from "@/app/actions/crm";
import Link from "next/link";
import toast from "react-hot-toast";
import EditEntrepriseModal from "./EditEntrepriseModal";

const STATUT_COLORS: Record<string, string> = {
    "Prospect brut": "bg-slate-500/10 text-slate-600 border border-slate-500/20",
    "Prospect contacté": "bg-blue-500/10 text-blue-600 border border-blue-500/20",
    "Prospect qualifié": "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20",
    "En négociation": "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    "À valider / en décision": "bg-orange-500/10 text-orange-600 border border-orange-500/20",
    "Gagné – nouveau client": "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    "Client actif régulier": "bg-green-500/10 text-green-600 border border-green-500/20",
    "Client actif occasionnel": "bg-lime-500/10 text-lime-600 border border-lime-500/20",
    "Client stratégique": "bg-purple-500/10 text-purple-600 border border-purple-500/20",
    "Client à relancer": "bg-pink-500/10 text-pink-600 border border-pink-500/20",
    "Client inactif": "bg-slate-700/10 text-slate-600 border border-slate-700/20",
    "Client perdu": "bg-red-500/10 text-red-600 border border-red-500/20",
};

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
            toast.success("Statut mis à jour");
        } else {
            toast.error("Erreur lors de la mise à jour du statut");
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
            <div className="flex flex-wrap gap-2 mb-2 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">

                {["Tous", "Prospects", "Clients"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilterStatut(f)}
                        className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                            filterStatut === f 
                            ? "bg-primary text-foreground shadow-lg shadow-primary/20" 
                            : "text-muted hover:text-foreground hover:bg-white/5"
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

            <div className="table-scroll-wrapper">
            <div className="premium-panel overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">Entreprise</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">Ville</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">Statut CRM</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.map((e) => (
                            <tr key={e.id} className="hover:bg-white/[0.02] transition-all group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">{e.raison_sociale}</div>
                                    <div className="text-[10px] text-muted">{e.secteur?.nom}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-tight">{e.ville || "N/A"}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg focus:ring-1 focus:ring-primary cursor-pointer transition-all ${
                                            STATUT_COLORS[e.statut || "Prospect brut"] || STATUT_COLORS["Prospect brut"]
                                        }`}
                                        value={e.statut || "Prospect brut"}
                                        onChange={(event) => handleStatutChange(e.id, event.target.value)}
                                    >
                                        {statuts.map(s => <option key={s} value={s} className="bg-surface text-foreground">{s}</option>)}
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => {
                                                setSelectedEntreprise(e);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="p-2 rounded-xl bg-white/5 border border-white/5 text-muted hover:text-foreground hover:bg-white/10 transition-all"
                                            title="Modifier l'entreprise"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" /></svg>
                                        </button>
                                        <Link 
                                            href={`/actions/nouvelle?entreprise_id=${e.id}`}
                                            className="p-2 rounded-xl bg-white/5 border border-white/5 text-muted hover:text-foreground hover:bg-primary transition-all"
                                            title="Nouveau suivi d'action"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>
                                        </Link>
                                        <Link 
                                            href={`/entreprises/${e.id}`}
                                            className="p-2 rounded-xl bg-white/5 border border-white/5 text-muted hover:text-foreground hover:bg-white/10 transition-all font-bold text-[10px] px-3 uppercase tracking-widest"
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
                    <div className="p-12 text-center text-muted font-bold uppercase tracking-widest text-xs opacity-50">
                        Aucune entreprise trouvée
                    </div>
                )}
            </div>
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
