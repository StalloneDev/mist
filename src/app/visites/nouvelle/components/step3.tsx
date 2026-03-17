import CreatableSelect from "@/components/forms/CreatableSelect";

export default function Step3({ data, update, refs }: any) {
    const updateProject = (field: string, value: any) => {
        update({ [field]: value });
    };

    return (
        <div className="premium-panel p-8 space-y-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Travaux / Activités du Projet</h3>
            </div>

            <div className="form-group">
                <label className="form-label">Description du projet</label>
                <textarea
                    className="form-textarea min-h-[100px]"
                    placeholder="Ex: TRAVAUX D'ASSAINISSEMENT DES VILLES PLUVIALES..."
                    value={data.projet_description || ""}
                    onChange={(e) => updateProject('projet_description', e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CreatableSelect
                    label="Activité principale"
                    options={[
                        { id: 'Route', nom: 'Route' },
                        { id: 'Bâtiment', nom: 'Bâtiment' },
                        { id: 'Génie civil', nom: 'Génie civil' },
                        { id: 'Production industrielle', nom: 'Production industrielle' },
                    ]}
                    value={data.projet_activite || ""}
                    onSelectId={(id) => updateProject('projet_activite', id)}
                    onCreateNew={(val) => updateProject('projet_activite', val)}
                />

                <CreatableSelect
                    label="Statut du projet"
                    options={refs.statutsProjet}
                    value={data.statut_projet_id || ""}
                    customValue={data.statut_projet_autre}
                    onSelectId={(id) => updateProject('statut_projet_id', id)}
                    onCreateNew={(val) => {
                        updateProject('statut_projet_id', null);
                        updateProject('statut_projet_autre', val);
                    }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b">
                <div className="form-group">
                    <label className="form-label">Date début</label>
                    <input type="date" className="form-input" value={data.projet_date_debut || ""}
                        onChange={(e) => updateProject('projet_date_debut', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Date fin estimée</label>
                    <input type="date" className="form-input" value={data.projet_date_fin || ""}
                        onChange={(e) => updateProject('projet_date_fin', e.target.value)} />
                </div>
                <CreatableSelect
                    label="Taille"
                    options={refs.taillesProjet}
                    value={data.taille_projet_id || ""}
                    customValue={data.taille_projet_autre}
                    onSelectId={(id) => updateProject('taille_projet_id', id)}
                    onCreateNew={(val) => {
                        updateProject('taille_projet_id', null);
                        updateProject('taille_projet_autre', val);
                    }}
                />
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                    <h4 className="text-sm font-black uppercase tracking-widest">Parc Matériel</h4>
                </div>
                <div className="form-group">
                    <label className="form-label">Description du parc matériel (saisie libre)</label>
                    <textarea
                        className="form-textarea min-h-[120px]"
                        placeholder="Ex: 2 PELLES HYDRAULIQUES, 1 NIVELEUSE, 3 BENNES BASCULANTES..."
                        value={data.parc_materiel_texte || ""}
                        onChange={(e) => update({ parc_materiel_texte: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}
