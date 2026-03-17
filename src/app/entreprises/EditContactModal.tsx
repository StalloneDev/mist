"use client";

import { useState, useEffect } from "react";
import { updateContact } from "@/app/actions/crm";

interface EditContactModalProps {
    contact: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (updated: any) => void;
}

export default function EditContactModal({ contact, isOpen, onClose, onSuccess }: EditContactModalProps) {
    const [formData, setFormData] = useState({
        nom: "",
        fonction: "",
        email: "",
        telephone: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (contact) {
            setFormData({
                nom: contact.nom || "",
                fonction: contact.fonction || "",
                email: contact.email || "",
                telephone: contact.telephone || ""
            });
        }
    }, [contact]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await updateContact(contact.id, formData);
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
            
            <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Modifier le Contact</h2>
                            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-1 opacity-70">Mise à jour des coordonnées</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="form-group">
                        <label className="form-label text-[10px]">Nom Complet</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            required
                            value={formData.nom}
                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label text-[10px]">Fonction</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            value={formData.fonction}
                            onChange={(e) => setFormData({...formData, fonction: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="form-group">
                            <label className="form-label text-[10px]">Email</label>
                            <input 
                                type="email" 
                                className="form-input" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label text-[10px]">Téléphone</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={formData.telephone}
                                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                            />
                        </div>
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
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
