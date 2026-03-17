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
            <h3 style={{ marginBottom: "1.5rem", color: "var(--primary)" }}>
                Consommation &amp; Approvisionnement
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
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

            {/* Produits - Checkboxes carrées */}
            <div className="form-group">
                <label className="form-label">Produits concernés</label>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                    {refs.produits.map((p: any) => {
                        const checked = selectedProduits.includes(p.id);
                        return (
                            <label
                                key={p.id}
                                onClick={() => toggleProduit(p.id)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.6rem",
                                    cursor: "pointer",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "8px",
                                    border: `2px solid ${checked ? "var(--primary)" : "var(--input-border)"}`,
                                    background: checked ? "rgba(37,99,235,0.08)" : "var(--surface)",
                                    color: checked ? "var(--primary)" : "var(--foreground)",
                                    fontWeight: checked ? 600 : 400,
                                    transition: "all 0.2s ease",
                                    userSelect: "none",
                                }}
                            >
                                <span style={{
                                    width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0,
                                    border: `2px solid ${checked ? "var(--primary)" : "var(--input-border)"}`,
                                    background: checked ? "var(--primary)" : "transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.2s ease",
                                }}>
                                    {checked && (
                                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </span>
                                {p.nom}
                            </label>
                        );
                    })}
                </div>
            </div>

            <hr style={{ margin: "2rem 0", borderColor: "var(--input-border)" }} />
            <h4 style={{ marginBottom: "1rem" }}>Fournisseurs Actuels</h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
    );
}
