import CreatableSelect from "@/components/forms/CreatableSelect";

export default function Step5({ data, update, refs }: any) {
    return (
        <div className="animate-fade-in">
            <h3 className="text-xl font-black text-foreground tracking-tight uppercase flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
                </div>
                Opportunité Commerciale & Actions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <CreatableSelect
                    label="Niveau d'opportunité"
                    options={refs.niveauxOpportunite}
                    value={data.niveau_id || ""}
                    customValue={data.niveau_autre}
                    onSelectId={(id) => update({ niveau_id: id, niveau_autre: "" })}
                    onCreateNew={(val) => update({ niveau_id: null, niveau_autre: val })}
                />

                <CreatableSelect
                    label="Fenêtre d'entrée"
                    options={refs.fenetresEntree}
                    value={data.fenetre_entree_id || ""}
                    customValue={data.fenetre_entree_autre}
                    onSelectId={(id) => update({ fenetre_entree_id: id, fenetre_entree_autre: "" })}
                    onCreateNew={(val) => update({ fenetre_entree_id: null, fenetre_entree_autre: val })}
                />
            </div>

            <div className="form-group mb-10">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        data.decideur_identifie ? "border-primary bg-primary" : "border-border bg-surface-2 group-hover:border-primary/50"
                    }`}>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={data.decideur_identifie || false}
                            onChange={(e) => update({ decideur_identifie: e.target.checked })}
                        />
                        {data.decideur_identifie && (
                            <svg width="12" height="10" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </div>
                    <span className="text-sm font-bold text-foreground">Décideur identifié ?</span>
                </label>
            </div>

            {data.decideur_identifie && (
                <div className="form-group mb-10 animate-slide-down">
                    <label className="form-label">Nom et fonction du décideur</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Ex: M. HOUNKPATIN / Co-gérant"
                        value={data.decideur_nom || ""}
                        onChange={(e) => update({ decideur_nom: e.target.value })}
                    />
                </div>
            )}

            <div className="pt-10 border-t border-border">
                <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                    Synthèse & Actions à prévoir
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="form-group">
                        <label className="form-label">Volume potentiel (L/Mois)</label>
                        <input
                            type="number" min="0" step="0.01"
                            className="form-input"
                            value={data.volume_potentiel || ""}
                            onChange={(e) => update({ volume_potentiel: parseFloat(e.target.value) })}
                        />
                    </div>

                    <CreatableSelect
                        label="Priorité (Direction)"
                        options={refs.priorites}
                        value={data.priorite_id || ""}
                        customValue={data.priorite_autre}
                        onSelectId={(id) => update({ priorite_id: id, priorite_autre: "" })}
                        onCreateNew={(val) => update({ priorite_id: null, priorite_autre: val })}
                    />
                </div>

                <div className="mb-8">
                    <CreatableSelect
                        label="Type d'action à mener"
                        options={refs.typesAction}
                        value={data.type_action_id || ""}
                        customValue={data.type_action_autre}
                        onSelectId={(id) => update({ type_action_id: id, type_action_autre: "" })}
                        onCreateNew={(val) => update({ type_action_id: null, type_action_autre: val })}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Observations générales (Renseignement Indirect)</label>
                    <textarea
                        className="form-textarea min-h-[120px]"
                        placeholder="Résumé de l'opportunité, contexte, remarques concurrentielles..."
                        value={data.observations || ""}
                        onChange={(e) => update({ observations: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}
