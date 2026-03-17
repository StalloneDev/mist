import CreatableSelect from "@/components/forms/CreatableSelect";

export default function Step2({ data, update, refs }: any) {
    return (
        <div className="premium-panel p-8 space-y-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="19" cy="11" r="2" /></svg>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Identification de l&apos;Entreprise</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="form-group">
                    <label className="form-label">Raison Sociale</label>
                    <input type="text" className="form-input"
                        placeholder="Ex: ORIGO AFRICA"
                        value={data.raison_sociale || ""}
                        onChange={(e) => update({ raison_sociale: e.target.value })} />
                </div>

                <div className="form-group">
                    <label className="form-label">Ville</label>
                    <input type="text" className="form-input"
                        placeholder="Ex: Cotonou"
                        value={data.ville || ""}
                        onChange={(e) => update({ ville: e.target.value })} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CreatableSelect
                    label="Secteur d'activité"
                    options={refs.secteurs}
                    value={data.secteur_id || ""}
                    customValue={data.secteur_autre}
                    onSelectId={(id) => update({ secteur_id: id, secteur_autre: "" })}
                    onCreateNew={(val) => update({ secteur_id: null, secteur_autre: val })}
                    placeholder="Rechercher ou ajouter..."
                />

                {data.secteur_autre && (
                    <div className="form-group">
                        <label className="form-label">Secteur précisé</label>
                        <input type="text" className="form-input" value={data.secteur_autre}
                            onChange={(e) => update({ secteur_autre: e.target.value })} />
                    </div>
                )}
            </div>

            <div className="pt-8 border-t">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                            Contacts rencontrés ({data.contacts?.length || 0})
                        </h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Ajoutez les interlocuteurs clés de cette visite</p>
                    </div>
                    <button 
                        type="button"
                        className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
                        onClick={() => {
                            const current = data.contacts || [];
                            update({ contacts: [...current, { nom: "", fonction: "", telephone: "", email: "" }] });
                        }}
                        title="Ajouter un contact"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>
                    </button>
                </div>

                <div className="space-y-8">
                    {(data.contacts || []).map((contact: any, index: number) => (
                        <div key={index} className="relative p-6 rounded-2xl bg-white/5 border border-white/5 space-y-6">
                            {index > 0 && (
                                <button
                                    type="button"
                                    className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors"
                                    onClick={() => {
                                        const newContacts = data.contacts.filter((_: any, i: number) => i !== index);
                                        update({ contacts: newContacts });
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                                </button>
                            )}
                            
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                Contact #{index + 1}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-group">
                                    <label className="form-label text-[10px]">Nom complet</label>
                                    <input type="text" className="form-input" placeholder="Ex: M. André"
                                        value={contact.nom || ""}
                                        onChange={(e) => {
                                            const newContacts = [...data.contacts];
                                            newContacts[index].nom = e.target.value;
                                            update({ contacts: newContacts });
                                        }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label text-[10px]">Fonction</label>
                                    <input type="text" className="form-input" placeholder="Ex: DAF"
                                        value={contact.fonction || ""}
                                        onChange={(e) => {
                                            const newContacts = [...data.contacts];
                                            newContacts[index].fonction = e.target.value;
                                            update({ contacts: newContacts });
                                        }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label text-[10px]">Téléphone</label>
                                    <input type="tel" className="form-input"
                                        value={contact.telephone || ""}
                                        onChange={(e) => {
                                            const newContacts = [...data.contacts];
                                            newContacts[index].telephone = e.target.value;
                                            update({ contacts: newContacts });
                                        }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label text-[10px]">Email</label>
                                    <input type="email" className="form-input"
                                        value={contact.email || ""}
                                        onChange={(e) => {
                                            const newContacts = [...data.contacts];
                                            newContacts[index].email = e.target.value;
                                            update({ contacts: newContacts });
                                        }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
