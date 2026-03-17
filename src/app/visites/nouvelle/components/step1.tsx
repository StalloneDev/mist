import CreatableSelect from "@/components/forms/CreatableSelect";

export default function Step1({ data, update, refs }: any) {
    return (
        <div className="premium-panel p-8 space-y-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Informations Générales</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="form-group">
                    <label className="form-label">Date de la visite</label>
                    <input
                        type="date"
                        className="form-input"
                        value={data.date_visite || ""}
                        onChange={(e) => update({ date_visite: e.target.value })}
                    />
                </div>

                <div className="flex flex-col">
                    <CreatableSelect
                        label="Type de visite"
                        options={refs.typesCollecte}
                        value={data.type_collecte_id || ""}
                        customValue={data.type_collecte_autre}
                        onSelectId={(id) => update({ type_collecte_id: id, type_collecte_autre: "" })}
                        onCreateNew={(val) => update({ type_collecte_id: null, type_collecte_autre: val })}
                        placeholder="Sélectionner ou saisir..."
                    />
                </div>
            </div>

            <div className="form-group pt-4 border-t">
                <label className="form-label">Localisation du site / chantier</label>
                <div className="relative">
                    <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="Ex: PK10 Route de Porto-Novo"
                        value={data.localisation_site || ""}
                        onChange={(e) => update({ localisation_site: e.target.value })}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
