"use client";

import { useState, useEffect } from "react";
import { updateEntreprise } from "@/app/actions/crm";

interface EditEntrepriseModalProps {
    entreprise: any;
    secteurs: any[];
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (updated: any) => void;
}

export default function EditEntrepriseModal({ entreprise, secteurs, isOpen, onClose, onSuccess }: EditEntrepriseModalProps) {
    const [formData, setFormData] = useState({
        raison_sociale: "",
        secteur_id: "",
        ville: "",
        adresse: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (entreprise) {
            setFormData({
                raison_sociale: entreprise.raison_sociale || "",
                secteur_id: entreprise.secteur_id?.toString() || "",
                ville: entreprise.ville || "",
                adresse: entreprise.adresse || ""
            });
        }
    }, [entreprise]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await updateEntreprise(entreprise.id, formData);
        setLoading(false);
        if (res.success) {
            onSuccess(res.data);
            onClose();
        } else {
            alert("Erreur: " + res.error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Modifier l&apos;Entreprise</h2>
                            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-1 opacity-70">Mise à jour des informations CRM</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="form-group">
                        <label className="form-label text-[10px]">Raison Sociale</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            required
                            value={formData.raison_sociale}
                            onChange={(e) => setFormData({...formData, raison_sociale: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="form-group">
                            <label className="form-label text-[10px]">Secteur d&apos;activité</label>
                            <select 
                                className="form-select"
                                value={formData.secteur_id}
                                onChange={(e) => setFormData({...formData, secteur_id: e.target.value})}
                            >
                                <option value="">Non défini</option>
                                {secteurs.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label text-[10px]">Ville</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={formData.ville}
                                onChange={(e) => setFormData({...formData, ville: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label text-[10px]">Adresse</label>
                        <textarea 
                            className="form-input h-24 pt-3 resize-none" 
                            value={formData.adresse}
                            onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl border border-white/5 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 px-6 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
