import CreatableSelect from "@/components/forms/CreatableSelect";

export default function Step5({ data, update, refs }: any) {
    return (
        <div className="animate-fade-in">
            <h3 style={{ marginBottom: "1.5rem", color: "var(--primary)" }}>Opportunité Commerciale & Actions</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
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

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={data.decideur_identifie || false}
                        onChange={(e) => update({ decideur_identifie: e.target.checked })}
                    />
                    Décideur identifié ?
                </label>
            </div>

            {data.decideur_identifie && (
                <div className="form-group">
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

            <hr style={{ margin: '2rem 0', borderColor: 'var(--input-border)' }} />
            <h4 style={{ marginBottom: "1rem" }}>Actions à prévoir et Synthèse</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

            <CreatableSelect
                label="Type d'action à mener"
                options={refs.typesAction}
                value={data.type_action_id || ""}
                customValue={data.type_action_autre}
                onSelectId={(id) => update({ type_action_id: id, type_action_autre: "" })}
                onCreateNew={(val) => update({ type_action_id: null, type_action_autre: val })}
            />

            <div className="form-group">
                <label className="form-label">Observations générales (Renseignement Indirect)</label>
                <textarea
                    className="form-textarea"
                    placeholder="Résumé de l'opportunité, contexte, remarques concurrentielles..."
                    value={data.observations || ""}
                    onChange={(e) => update({ observations: e.target.value })}
                />
            </div>

        </div>
    );
}
