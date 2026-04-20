import CreatableSelect from "@/components/forms/CreatableSelect";

export default function Step4({ data, update, refs }: any) {
    const selectedProduits: number[] = data.produit_ids || [];

    const toggleProduit = (id: number) => {
        if (selectedProduits.includes(id)) {
            update({ produit_ids: selectedProduits.filter((p) => p !== id) });
        } else {
            update({ produit_ids: [...selectedProduits, id] });
        }
    };

    return (
        <div className="animate-fade-in">
            <h3 className="text-xl font-black text-foreground tracking-tight uppercase flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9s10.2-3.9 14.1 0 3.9 10.2 0 14.1-10.2 3.9-14.1 0z" /><path d="m14 8 3 3-3 3" /><path d="M7 11h10" /></svg>
                </div>
                Consommation & Approvisionnement
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="form-group">
                    <label className="form-label">Consommation / Jour (L)</label>
                    <input type="number" min="0" step="0.01" className="form-input"
                        value={data.conso_jour || ""}
                        onChange={(e) => update({ conso_jour: parseFloat(e.target.value) })} />
                </div>
                <div className="form-group">
                    <label className="form-label">Consommation / Semaine (L)</label>
                    <input type="number" min="0" step="0.01" className="form-input"
                        value={data.conso_semaine || ""}
                        onChange={(e) => update({ conso_semaine: parseFloat(e.target.value) })} />
                </div>
                <div className="form-group">
                    <label className="form-label">Consommation / Mois (L)</label>
                    <input type="number" min="0" step="0.01" className="form-input"
                        value={data.conso_mois || ""}
                        onChange={(e) => update({ conso_mois: parseFloat(e.target.value) })} />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label mb-4">Produits concernés</label>
                <div className="flex flex-wrap gap-3">
                    {refs.produits.map((p: any) => {
                        const checked = selectedProduits.includes(p.id);
                        return (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => toggleProduit(p.id)}
                                className={`px-4 py-2 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 ${
                                    checked 
                                    ? "border-primary bg-primary/5 text-primary shadow-sm" 
                                    : "border-border bg-surface-2 text-muted hover:border-primary/50"
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                    checked ? "border-primary bg-primary" : "border-border bg-white"
                                }`}>
                                    {checked && (
                                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                                {p.nom}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="pt-10 border-t border-border mt-10">
                <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                    Fournisseurs Actuels & Relation
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <CreatableSelect
                        label="Fournisseur Principal"
                        options={refs.fournisseurs}
                        value={data.fournisseur_principal_id || ""}
                        customValue={data.fournisseur_principal_nom}
                        onSelectId={(id) => update({ fournisseur_principal_id: id, fournisseur_principal_nom: "" })}
                        onCreateNew={(val) => update({ fournisseur_principal_nom: val, fournisseur_principal_id: null })}
                    />
                    <CreatableSelect
                        label="Fournisseur Secondaire"
                        options={refs.fournisseurs}
                        value={data.fournisseur_secondaire_id || ""}
                        customValue={data.fournisseur_secondaire_nom}
                        onSelectId={(id) => update({ fournisseur_secondaire_id: id, fournisseur_secondaire_nom: "" })}
                        onCreateNew={(val) => update({ fournisseur_secondaire_nom: val, fournisseur_secondaire_id: null })}
                        placeholder="Aucun ou saisir..."
                    />

                    <CreatableSelect
                        label="Type de Relation"
                        options={refs.typesRelation}
                        value={data.type_relation_id || ""}
                        customValue={data.type_relation_autre}
                        onSelectId={(id) => update({ type_relation_id: id, type_relation_autre: "" })}
                        onCreateNew={(val) => update({ type_relation_id: null, type_relation_autre: val })}
                    />

                    <CreatableSelect
                        label="Niveau de Satisfaction"
                        options={refs.satisfactions}
                        value={data.satisfaction_id || ""}
                        customValue={data.satisfaction_autre}
                        onSelectId={(id) => update({ satisfaction_id: id, satisfaction_autre: "" })}
                        onCreateNew={(val) => update({ satisfaction_id: null, satisfaction_autre: val })}
                    />
                </div>
            </div>
        </div>
    );
}
