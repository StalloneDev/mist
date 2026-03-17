"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSuiviAction } from "@/app/actions/crm";
import CreatableSelect from "@/components/forms/CreatableSelect";

interface FormSuiviActionProps {
    entreprises: any[];
}

import { useSearchParams } from "next/navigation";

export default function FormSuiviAction({ entreprises }: FormSuiviActionProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Initialisation avec l'ID de l'URL si présent
    const initialEntrepriseId = searchParams.get("entreprise_id");

    const [formData, setFormData] = useState<any>({
        entreprise_id: initialEntrepriseId ? parseInt(initialEntrepriseId) : "",
        date_action: new Date().toISOString().split("T")[0],
        type_action: "Appel",
        but_intervention: "Relance",
        priorite: "Moyenne",
        niveau_interet: "5",
        prochaine_etape: "Rappel",
        statut_obtenu: [],
    });

    const updateField = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (val: string) => {
        const current = formData.statut_obtenu || [];
        if (current.includes(val)) {
            updateField("statut_obtenu", current.filter((v: string) => v !== val));
        } else {
            updateField("statut_obtenu", [...current, val]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.entreprise_id) {
            alert("Veuillez sélectionner une entreprise");
            return;
        }

        setIsSubmitting(true);
        try {
            // Convert statut_obtenu array to string for DB
            const dataToSubmit = {
                ...formData,
                statut_obtenu: formData.statut_obtenu.join(", ")
            };
            const res = await createSuiviAction(dataToSubmit);
            if (res.success) {
                router.push("/actions");
            } else {
                alert("Erreur: " + res.error);
            }
        } catch (error) {
            console.error(error);
            alert("Une erreur inattendue est survenue");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in pb-20">
            {/* Section 1: Identification & Timing */}
            <div className="premium-panel p-8 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="19" cy="11" r="2" /></svg>
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">Identification & Timing</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CreatableSelect
                        label="Choix du client ou prospect *"
                        options={entreprises.map(e => ({ id: e.id, nom: e.raison_sociale }))}
                        value={formData.entreprise_id || ""}
                        onSelectId={(id) => updateField("entreprise_id", id)}
                        onCreateNew={(val) => console.log("Create new entreprise not supported here")}
                        placeholder="Rechercher une entreprise..."
                    />
                    <div className="form-group">
                        <label className="form-label">Date de l&apos;action</label>
                        <input type="date" className="form-input" 
                            value={formData.date_action}
                            onChange={(e) => updateField("date_action", e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="form-label">Heure de début</label>
                        <input type="time" className="form-input" 
                            value={formData.heure_debut || ""}
                            onChange={(e) => updateField("heure_debut", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Heure de fin</label>
                        <input type="time" className="form-input" 
                            value={formData.heure_fin || ""}
                            onChange={(e) => updateField("heure_fin", e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Section 2: Détails de l'intervention */}
            <div className="premium-panel p-8 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">Détails de l&apos;intervention</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="form-label">Type d&apos;action</label>
                        <select className="form-select" value={formData.type_action} onChange={(e) => updateField("type_action", e.target.value)}>
                            <option>Appel</option>
                            <option>Visite</option>
                            <option>E-mail</option>
                            <option>Réunion</option>
                            <option>Présentation</option>
                            <option>Autre</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">But de l&apos;intervention</label>
                        <select className="form-select" value={formData.but_intervention} onChange={(e) => updateField("but_intervention", e.target.value)}>
                            <option>Prise de contact</option>
                            <option>Relance</option>
                            <option>Proposition</option>
                            <option>Résolution d&apos;un problème</option>
                            <option>Recouvrement</option>
                            <option>Autre</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Sujet principal traité</label>
                    <input type="text" className="form-input" placeholder="Ex: Devis lubrifiants S2 2024"
                        value={formData.sujet_principal || ""}
                        onChange={(e) => updateField("sujet_principal", e.target.value)} />
                </div>

                <div className="form-group">
                    <label className="form-label">Personne rencontrée ou contactée (nom, fonction)</label>
                    <input type="text" className="form-input" placeholder="Ex: M. Diallo, Responsable Logistique"
                        value={formData.personne_contactee || ""}
                        onChange={(e) => updateField("personne_contactee", e.target.value)} />
                </div>

                <div className="form-group">
                    <label className="form-label">Résumé de la discussion / éléments clés abordés</label>
                    <textarea className="form-textarea min-h-[100px]" 
                        value={formData.resume_discussion || ""}
                        onChange={(e) => updateField("resume_discussion", e.target.value)} />
                </div>
            </div>

            {/* Section 3: Analyse & Echanges */}
            <div className="premium-panel p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="form-label">Questions ou préoccupations du client</label>
                        <textarea className="form-textarea min-h-[80px]" 
                            value={formData.questions_client || ""}
                            onChange={(e) => updateField("questions_client", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Réponses apportées / argumentaire commercial</label>
                        <textarea className="form-textarea min-h-[80px]" 
                            value={formData.reponses_apportees || ""}
                            onChange={(e) => updateField("reponses_apportees", e.target.value)} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Documents remis ou envoyés</label>
                    <input type="text" className="form-input" placeholder="Ex: Brochure, devis, contrat..."
                        value={formData.documents_remis || ""}
                        onChange={(e) => updateField("documents_remis", e.target.value)} />
                </div>
            </div>

            {/* Section 4: Résultats & Suite */}
            <div className="premium-panel p-8 space-y-8">
                <div className="form-group">
                    <label className="form-label mb-4">Statut obtenu</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {["Intéressé", "En attente de décision", "À relancer", "Refusé", "Contrat signé"].map((status) => (
                            <label key={status} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={formData.statut_obtenu.includes(status)}
                                    onChange={() => handleCheckboxChange(status)}
                                />
                                <span className="text-xs font-bold text-white/80">{status}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="form-group">
                        <label className="form-label">Évaluation du niveau d&apos;intérêt (1 à 10)</label>
                        <select className="form-select" value={formData.niveau_interet} onChange={(e) => updateField("niveau_interet", e.target.value)}>
                            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Priorité</label>
                        <select className="form-select" value={formData.priorite} onChange={(e) => updateField("priorite", e.target.value)}>
                            <option>Basse</option>
                            <option>Moyenne</option>
                            <option>Haute</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                    <div className="form-group">
                        <label className="form-label">Prochaine étape prévue</label>
                        <select className="form-select" value={formData.prochaine_etape} onChange={(e) => updateField("prochaine_etape", e.target.value)}>
                            <option>Rappel</option>
                            <option>Devis</option>
                            <option>Visite</option>
                            <option>Envoi de contrat</option>
                            <option>Autre</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Date prévue</label>
                        <input type="date" className="form-input" 
                            value={formData.date_prochaine_action || ""}
                            onChange={(e) => updateField("date_prochaine_action", e.target.value)} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Commentaires / Observations finales</label>
                    <textarea className="form-textarea min-h-[80px]" 
                        value={formData.commentaires || ""}
                        onChange={(e) => updateField("commentaires", e.target.value)} />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                    {isSubmitting ? "Enregistrement..." : "✓ Enregistrer l'Action"}
                </button>
            </div>
        </form>
    );
}
