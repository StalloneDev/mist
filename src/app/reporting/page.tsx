"use client";

import { useState, useRef, useEffect } from "react";
import { getReportingData, deleteReportingRow, updateReportingRow } from "../actions/reporting";
import { 
    getSecteurs, getTypesCollecte, getStatutsProjet, getTaillesProjet, 
    getEquipements, getProduits, getFournisseurs, getTypesRelation, 
    getSatisfactions, getNiveauxOpportunite, getFenetresEntree, 
    getPriorites, getTypesAction 
} from "../actions/reference";

const COLUMNS = [
    { key: "excel_id", label: "ID", width: "70px" },
    { key: "date_visite", label: "Date visite", width: "120px" },
    { key: "commercial", label: "Commercial", width: "160px" },
    { key: "type_collecte", label: "Type", width: "110px" },
    { key: "raison_sociale", label: "Raison sociale", width: "180px" },
    { key: "secteur", label: "Secteur", width: "130px" },
    { key: "localisation", label: "Localisation", width: "160px" },
    { key: "statut", label: "Actions", width: "130px" },
];

const OPPORTUNITE_COLORS: Record<string, string> = {
    forte: "badge-green",
    haute: "badge-green",
    moyenne: "badge-yellow",
    faible: "badge-red",
    nulle: "badge-gray",
};

const PRIORITE_COLORS: Record<string, string> = {
    forte: "badge-red",
    haute: "badge-red",
    moyenne: "badge-yellow",
    faible: "badge-gray",
};

function Badge({ value, colorMap }: { value: string; colorMap: Record<string, string> }) {
    const key = (value || "").toString().toLowerCase().trim();
    const cls = colorMap[key] || "badge-gray";
    if (!value) return <span className="text-slate-600">—</span>;
    return <span className={`reporting-badge ${cls}`}>{value}</span>;
}

function NumCell({ value }: { value: any }) {
    const n = parseFloat(String(value).replace(/[^\d.-]/g, ""));
    if (isNaN(n) || value === "") return <span className="text-slate-600">—</span>;
    return <span className="font-bold text-white">{n.toLocaleString("fr-FR")}</span>;
}

function DetailModal({ row, onClose }: { row: any; onClose: () => void }) {
    if (!row) return null;

    // Prevent background scroll
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    // Helper to format numeric values
    const fmtLitre = (val: any) => val ? `${Number(val).toLocaleString('fr-FR')} L` : null;

    // Group fields for better display
    const groups = [
        {
            title: "Informations Générales",
            fields: [
                { label: "Date Visite", value: row.date_visite },
                { label: "Mois Visite", value: row.mois_visite },
                { label: "Commercial", value: row.commercial },
                { label: "Type Collecte", value: row.type_collecte },
                { label: "Raison Sociale", value: row.raison_sociale },
                { label: "Secteur", value: row.secteur || row.secteur_autre },
                { label: "Localisation", value: row.localisation },
                { label: "Date Import", value: row.import_date ? new Date(row.import_date).toLocaleDateString('fr-FR') : null },
            ]
        },
        {
            title: "Contact Client",
            fields: [
                { label: "Nom Contact", value: row.contact_nom },
                { label: "Fonction", value: row.contact_fonction },
                { label: "Téléphone", value: row.contact_tel },
                { label: "Décideur identifié", value: row.decideur_identifie },
                { label: "Nom Décideur", value: row.decideur_nom },
            ]
        },
        {
            title: "Détails Projet & Activité",
            fields: [
                { label: "Activité", value: row.activite || row.activite_autre },
                { label: "Statut Projet", value: row.statut_projet },
                { label: "Taille Projet", value: row.taille_projet },
                { label: "Période", value: row.periode_projet },
                { label: "Début", value: row.debut },
                { label: "Fin Estimée", value: row.fin_estimee },
                { label: "Description", value: row.description },
            ]
        },
        {
            title: "Équipements & Utilisation",
            fields: [
                { label: "Liste Équipements", value: row.equipements },
                { label: "Nombre Équip.", value: row.nb_equip },
                { label: "Heures/Jour", value: row.heures_jour },
            ]
        },
        {
            title: "Consommation & Flux",
            fields: [
                { label: "Produit", value: row.produit || row.produit_autre },
                { label: "Conso/Jour", value: fmtLitre(row.conso_jour) },
                { label: "Conso/Semaine", value: fmtLitre(row.conso_semaine) },
                { label: "Conso/Mois", value: fmtLitre(row.conso_mois) },
                { label: "Estimation Mensuelle", value: fmtLitre(row.conso_mensuelle_estime) },
                { label: "Mode Appro.", value: row.mode_appro },
                { label: "Fournisseur Principal", value: row.fournisseur_principal },
                { label: "Fournisseur Secondaire", value: row.fournisseur_secondaire },
            ]
        },
        {
            title: "Relation & Satisfaction",
            fields: [
                { label: "Type Relation", value: row.type_relation },
                { label: "Niveau Satisfaction", value: row.satisfaction },
                { label: "Fenêtre Entrée", value: row.fenetre_entree },
            ]
        },
        {
            title: "Stratégie & Opportunité",
            fields: [
                { label: "Niveau Opportunité", value: row.opportunite_niveau },
                { label: "Priorité", value: row.priorite },
                { label: "Potentiel Volume", value: fmtLitre(row.volume_potentiel) },
                { label: "Volume DIR", value: fmtLitre(row.volume_potentiel_dir) },
                { label: "Actions Prévues", value: row.actions },
            ]
        }
    ];

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-8 overflow-hidden">
            {/* Overlay - Darker for more focus, covers everything */}
            <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose} />

            {/* Container - Lighter background (slate-800) and stronger border to distinguish */}
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-800 border-2 border-white/20 rounded-[3.5rem] shadow-[0_0_100px_rgba(59,130,246,0.15),0_50px_120px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10 transition-all scale-100 animate-in fade-in zoom-in duration-300">
                

                {/* Modal Header - Slightly lighter for depth */}
                <div className="px-12 py-10 border-b border-white/10 flex items-center justify-between bg-white/[0.05] shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-8 h-8 rounded-3xl bg-primary border-2 border-white/10 flex items-center justify-center text-white shadow-2xl shadow-primary/40">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-blue-500 uppercase tracking-tight leading-tight pr-12">{row.raison_sociale || "Détails Visite Terrain"}</h2>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-black text-primary uppercase tracking-[0.2em]">{row.excel_id || `ID: ${row.id}`}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">Enregistrement fait Par :  {row.commercial || 'Système'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-900/50" style={{ maxHeight: "calc(90vh - 200px)" }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                        {groups.map((group, idx) => (
                            <div key={idx} className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-primary/10 pb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{group.title}</h3>
                                </div>
                                <div className="space-y-3 px-3">
                                    {group.fields.map((f, fidx) => (
                                        <div key={fidx} className="flex flex-col gap-0.5 group/field">
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{f.label}</span>
                                            <div className="text-sm font-semibold text-slate-200 group-hover/field:text-white transition-colors">
                                                {f.value !== null && f.value !== "" ? String(f.value) : <span className="text-slate-700 italic opacity-40 text-xs">Non spécifié</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {row.observations && (
                        <div className="mt-12 space-y-4 pt-10 border-t border-white/5">
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-3">Observations Terrain</h3>
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-sm text-slate-400 leading-relaxed font-medium">
                                <div className="text-primary/40 mb-2">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 2.5 1 4.5 4 6" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 2.5 1 4.5 4 6" /></svg>
                                </div>
                                {row.observations}
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-10 py-6 border-t border-white/5 bg-white/[0.01] flex justify-end shrink-0">
                    <button onClick={onClose} className="group flex items-center gap-3 px-10 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95">
                        <span>Terminer la consultation</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14" /><path d="m11 18 6-6-6-6" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ReportingPage() {
    const [rows, setRows] = useState<any[]>([]);
    const [filteredRows, setFilteredRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filterSecteur, setFilterSecteur] = useState("");
    const [filterOpportunite, setFilterOpportunite] = useState("");
    const [filterCommercial, setFilterCommercial] = useState("");
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [selectedRowForEdit, setSelectedRowForEdit] = useState<any>(null);
    const [references, setReferences] = useState<any>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Initial load from database
    useEffect(() => {
        const loadData = async () => {
            setInitialLoading(true);
            try {
                const res = await getReportingData();
                if (res.success && res.data) {
                    setRows(res.data);
                    setFilteredRows(res.data);
                } else {
                    setError(res.error || "Erreur de chargement des données");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setInitialLoading(false);
            }
        };
        loadData();
        loadReferences();
    }, []);

    const loadReferences = async () => {
        try {
            const refs = {
                secteurs: await getSecteurs(),
                typesCollecte: await getTypesCollecte(),
                statutsProjet: await getStatutsProjet(),
                taillesProjet: await getTaillesProjet(),
                equipements: await getEquipements(),
                produits: await getProduits(),
                fournisseurs: await getFournisseurs(),
                typesRelation: await getTypesRelation(),
                satisfactions: await getSatisfactions(),
                niveauxOpportunite: await getNiveauxOpportunite(),
                fenetresEntree: await getFenetresEntree(),
                priorites: await getPriorites(),
                typesAction: await getTypesAction(),
            };
            setReferences(refs);
        } catch (error) {
            console.error("Erreur lors du chargement des références:", error);
        }
    };

    const loadData = async () => {
        setLoading(true);
        const res = await getReportingData();
        if (res.success && res.data) {
            setRows(res.data);
            setFilteredRows(res.data);
        }
        setLoading(false);
        setInitialLoading(false);
    };

    const handleUpdate = async (id: number, data: any) => {
        setLoading(true);
        const res = await updateReportingRow(id, data);
        if (res.success) {
            loadData();
            setSelectedRowForEdit(null);
        } else {
            alert("Erreur lors de la mise à jour: " + res.error);
        }
        setLoading(false);
    };

    const secteurs = [...new Set(rows.map(r => r.secteur).filter(Boolean))].sort();
    const commerciaux = [...new Set(rows.map(r => r.commercial).filter(Boolean))].sort();

    const applyFilters = (data: any[], s: string, sec: string, opp: string, com: string) => {
        let result = data;
        if (s) result = result.filter(r =>
            Object.values(r).some(v => String(v).toLowerCase().includes(s.toLowerCase()))
        );
        if (sec) result = result.filter(r => String(r.secteur).toLowerCase() === sec.toLowerCase());
        if (opp) result = result.filter(r => String(r.opportunite_niveau).toLowerCase() === opp.toLowerCase());
        if (com) result = result.filter(r => String(r.commercial).trim() === com.trim());
        setFilteredRows(result);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true);
        setError("");
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/reporting/import", { method: "POST", body: fd });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            // Refresh data from DB instead of using API response directly to ensure consistency
            const dbRes = await getReportingData();
            if (dbRes.success && dbRes.data) {
                setRows(dbRes.data);
                setSearch(""); setFilterSecteur(""); setFilterOpportunite(""); setFilterCommercial("");
                setFilteredRows(dbRes.data);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const handleSearch = (val: string) => {
        setSearch(val);
        applyFilters(rows, val, filterSecteur, filterOpportunite, filterCommercial);
    };
    const handleSecteur = (val: string) => {
        setFilterSecteur(val);
        applyFilters(rows, search, val, filterOpportunite, filterCommercial);
    };
    const handleOpp = (val: string) => {
        setFilterOpportunite(val);
        applyFilters(rows, search, filterSecteur, val, filterCommercial);
    };
    const handleCom = (val: string) => {
        setFilterCommercial(val);
        applyFilters(rows, search, filterSecteur, filterOpportunite, val);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet enregistrement ?")) return;
        setLoading(true);
        try {
            const res = await deleteReportingRow(id);
            if (res.success) {
                const newRows = rows.filter(r => r.id !== id);
                setRows(newRows);
                setFilteredRows(filteredRows.filter(r => r.id !== id));
            } else {
                setError(res.error || "Erreur lors de la suppression");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const totalVolume = filteredRows.reduce((sum, r) => {
        const v = parseFloat(String(r.volume_potentiel).replace(/[^\d.-]/g, ""));
        return sum + (isNaN(v) ? 0 : v);
    }, 0);

    // Pagination Logic
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

    return (
        <main className="p-8 max-w-screen-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-4">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Intelligence Terrain
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tight uppercase">Reporting <span className="text-primary prose-glow">Fiches Terrain</span></h1>
                    <p className="text-slate-400 font-medium max-w-2xl text-lg leading-relaxed">
                        Visualisez et analysez dynamiquement l'ensemble des données collectées.
                        Les nouvelles visites terrain sont synchronisées en temps réel.
                    </p>
                </div>

                {/* Import Button */}
                <div className="flex items-center gap-4">
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".xlsx,.xls"
                        className="hidden"
                        onChange={handleImport}
                        id="excel-import"
                    />
                    <label
                        htmlFor="excel-import"
                        className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm cursor-pointer transition-all duration-300 transform active:scale-95 ${loading
                            ? "bg-slate-800 text-slate-500 cursor-wait border border-white/5"
                            : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 border border-emerald-400/20"
                            }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                <span>Importation en cours...</span>
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-y-[-2px] transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                <span>IMPORTER HISTORIQUE EXCEL</span>
                            </>
                        )}
                    </label>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
                    ⚠ {error}
                </div>
            )}

            {/* KPI Cards - Always visible */}
            {/* KPI Cards - Always visible */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Visites totales", value: initialLoading ? "-" : filteredRows.length.toLocaleString("fr-FR"), sub: initialLoading ? "Chargement..." : `Flux de terrain actif`, color: "text-blue-400", bg: "border-t-blue-500/30", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
                    { label: "Volume Total", value: initialLoading ? "-" : totalVolume.toLocaleString("fr-FR") + " L", sub: initialLoading ? "Chargement..." : "Capacité mensuelle cumulée", color: "text-primary", bg: "border-t-primary/30", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20" /><path d="m17 7-5-5-5 5" /><path d="m17 17-5 5-5-5" /></svg> },
                    { label: "Opportunités Fortes", value: initialLoading ? "-" : filteredRows.filter(r => ["forte", "haute"].includes(String(r.opportunite_niveau).toLowerCase())).length.toLocaleString("fr-FR"), sub: initialLoading ? "Chargement..." : "Potentiel de conversion élevé", color: "text-emerald-500", bg: "border-t-emerald-500/30", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg> },
                    { label: "Secteurs couverts", value: initialLoading ? "-" : [...new Set(filteredRows.map(r => r.secteur).filter(Boolean))].length, sub: initialLoading ? "Chargement..." : "Diversification du marché", color: "text-purple-400", bg: "border-t-purple-500/30", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg> },
                ].map((kpi, i) => (
                    <div key={i} className={`premium-card relative overflow-hidden group p-6 border-t-2 ${kpi.bg}`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/10 transition-all duration-500" />
                        <div className="relative z-10">
                            <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${kpi.color}`}>
                                {kpi.icon}
                            </div>
                            <div className="space-y-1">
                                <div className={`text-3xl font-black text-white group-hover:${kpi.color} transition-colors ${initialLoading ? 'opacity-50' : ''}`}>{kpi.value}</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{kpi.label}</div>
                                <div className="text-[10px] text-slate-600 font-bold group-hover:text-slate-400 transition-colors">{kpi.sub}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters - Always visible */}
            {/* Ultra-Compact Filters - Single Line */}
            <div className="premium-panel px-4 py-3 flex flex-row items-center gap-3 shadow-2xl relative overflow-hidden group border-white/5">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                {/* Search - Flexible width */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        className="w-full bg-white/[0.03] border border-white/10 focus:border-primary/30 focus:bg-white/[0.06] transition-all py-2.5 pl-10 pr-4 rounded-lg text-sm placeholder:text-slate-500 outline-none"
                        placeholder="Recherche par raison sociale, commercial..."
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                        disabled={initialLoading || rows.length === 0}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] h-6 bg-white/10 hidden md:block" />

                {/* Sector Filter */}
                <div className="w-[140px] hidden lg:block">
                    <select className="w-full bg-white/[0.03] border border-white/10 py-2.5 px-3 rounded-lg text-xs appearance-none cursor-pointer text-slate-300 outline-none focus:border-primary/30" value={filterSecteur} onChange={e => handleSecteur(e.target.value)} disabled={initialLoading || rows.length === 0}>
                        <option value="" className="bg-slate-900">Secteur: Tout</option>
                        {secteurs.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                    </select>
                </div>

                {/* Potential Filter */}
                <div className="w-[130px] hidden lg:block">
                    <select className="w-full bg-white/[0.03] border border-white/10 py-2.5 px-3 rounded-lg text-xs appearance-none cursor-pointer text-slate-300 outline-none focus:border-primary/30" value={filterOpportunite} onChange={e => handleOpp(e.target.value)} disabled={initialLoading || rows.length === 0}>
                        <option value="" className="bg-slate-900">Potentiel: Tout</option>
                        <option value="Forte" className="bg-slate-900">Fort</option>
                        <option value="Moyenne" className="bg-slate-900">Moyen</option>
                        <option value="Faible" className="bg-slate-900">Faible</option>
                    </select>
                </div>

                {/* Commercial Filter */}
                <div className="w-[160px] hidden lg:block">
                    <select className="w-full bg-white/[0.03] border border-white/10 py-2.5 px-3 rounded-lg text-xs appearance-none cursor-pointer text-slate-300 outline-none focus:border-primary/30" value={filterCommercial} onChange={e => handleCom(e.target.value)} disabled={initialLoading || rows.length === 0}>
                        <option value="" className="bg-slate-900">Commercial: Tous</option>
                        {commerciaux.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                    </select>
                </div>

                {/* Reset Action */}
                {(search || filterSecteur || filterOpportunite || filterCommercial) && (
                    <button
                        className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 transition-all active:scale-95 shrink-0"
                        onClick={() => { setSearch(""); setFilterSecteur(""); setFilterOpportunite(""); setFilterCommercial(""); setFilteredRows(rows); }}
                        title="Réinitialiser les filtres"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                )}
            </div>

            {/* Table - Always visible block with conditional content */}
            <div className={`premium-panel overflow-hidden border border-white/5 shadow-2xl ${!initialLoading && rows.length === 0 && !loading ? 'pb-8 pt-4' : ''}`}>
                <div className="px-8 py-5 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        <span className="text-sm font-black text-white uppercase tracking-widest">
                            {initialLoading ? "Synchronisation..." : `${filteredRows.length} ENREGISTREMENT${filteredRows.length > 1 ? "S" : ""}`}
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                            <span className="w-3 h-3 text-slate-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="m13 18 6-6-6-6" /></svg></span>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Défilement horizontal actif</span>
                        </div>
                    </div>
                </div>

                {initialLoading ? (
                    <div className="py-24 text-center">
                        <svg className="animate-spin mx-auto text-primary mb-4" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                        <h3 className="text-slate-400 font-bold tracking-widest uppercase text-xs">Chargement depuis la base...</h3>
                    </div>
                ) : rows.length === 0 && !loading ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-slate-600">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
                        </div>
                        <h2 className="text-lg font-black text-white mb-2">Base de données d&apos;intelligence vide</h2>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm">
                            Veuillez importer le fichier Excel d&apos;historique pour commencer l&apos;analyse.
                        </p>
                    </div>
                ) : (
                    // Ajout spécifique de padding demandées (pb-8)
                    <div className="overflow-x-auto reporting-scroll pb-10 custom-scrollbar">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-white/[0.03] border-b-2 border-primary/20">
                                    {COLUMNS.map(col => (
                                        <th key={col.key} className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap sticky top-0 bg-slate-900/80 backdrop-blur-md border-r border-white/5 last:border-r-0" style={{ width: col.width, minWidth: col.width }}>
                                            <div className="flex items-center gap-2">
                                                {col.label}
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-700"><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></svg>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {paginatedRows.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                        {COLUMNS.map(col => {
                                            const val = row[col.key];

                                            // Colonne ID / Excel ID
                                            if (col.key === "excel_id" || col.key === "id") return (
                                                <td key={col.key} className="px-5 py-4 text-slate-600 font-bold text-xs whitespace-nowrap">{val || "—"}</td>
                                            );
                                            if (col.key === "raison_sociale") return (
                                                <td key={col.key} className="px-5 py-4 whitespace-nowrap font-bold text-white group-hover:text-primary transition-colors" style={{ maxWidth: col.width }}>
                                                    <div className="truncate" title={String(val)}>{val || "—"}</div>
                                                </td>
                                            );

                                            // Colonne Statut / Actions
                                            if (col.key === "statut") return (
                                                <td key={col.key} className="px-5 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setSelectedRow(row); }}
                                                            className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
                                                            title="Voir les détails"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                                        </button>
                                                        <button
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                setSelectedRowForEdit(row); 
                                                            }}
                                                            className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all active:scale-90"
                                                            title="Modifier"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" /></svg>
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
                                                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                                                            title="Supprimer"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            );

                                            // Autres colonnes standard
                                            return (
                                                <td key={col.key} className="px-6 py-4 text-slate-400 whitespace-nowrap border-r border-white/[0.02] last:border-r-0" style={{ maxWidth: col.width }}>
                                                    <div className="truncate font-medium group-hover:text-slate-200 transition-colors" style={{ maxWidth: col.width }}>
                                                        {val !== "" && val !== null ? String(val) : <span className="text-slate-800 italic opacity-40">Non renseigné</span>}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                {!initialLoading && filteredRows.length > 0 && (
                    <div className="px-8 py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.01]">
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Afficher</span>
                            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                {[10, 20, 30, 40].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => { setRowsPerPage(size); setCurrentPage(1); }}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${rowsPerPage === size
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "text-slate-500 hover:text-white"}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                Page <span className="text-white">{currentPage}</span> sur {totalPages || 1}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-all active:scale-95 group"
                                    title="Page précédente"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-all active:scale-95 group"
                                    title="Page suivante"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-0.5 transition-transform"><path d="m9 18 6-6-6-6" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedRow && (
                <DetailModal
                    row={selectedRow}
                    onClose={() => setSelectedRow(null)}
                />
            )}

            {selectedRowForEdit && (
                <EditModal
                    row={selectedRowForEdit}
                    references={references}
                    onClose={() => setSelectedRowForEdit(null)}
                    onSave={handleUpdate}
                />
            )}
        </main>
    );
}

// 🔷 MODAL D'ÉDITION ÉPURÉ (STYLE FICHE TERRAIN)
function EditModal({ row, references, onClose, onSave }: { row: any, references: any, onClose: () => void, onSave: (id: number, data: any) => void }) {
    const [formData, setFormData] = useState({ ...row });
    const [isSaving, setIsSaving] = useState(false);

    const updateField = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(row.id, formData);
        setIsSaving(false);
    };

    // Prevent background scroll
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    if (!references) return null;

    const inputCls = "w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:border-primary/50 transition-all outline-none";
    const labelCls = "text-[10px] font-bold text-slate-500 uppercase ml-1";
    const sectionTitleCls = "text-[10px] font-black text-primary uppercase tracking-[0.3em]";

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-8 overflow-hidden">
            {/* Overlay - High Isolation */}
            <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-0" onClick={onClose} />

            {/* Container */}
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-800 border-2 border-white/20 rounded-[3.5rem] shadow-[0_0_100px_rgba(59,130,246,0.15),0_50px_120px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="px-12 py-10 border-b border-white/10 flex items-center justify-between bg-white/[0.05] shrink-0">
                    <div className="pl-20">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Modification Fiche</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">ID: {row.excel_id || row.id} — {formData.raison_sociale || "—"}</p>
                    </div>
                    <button onClick={onClose} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-red-500/20 hover:text-red-500 transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Form Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-slate-900/50 space-y-12" style={{ maxHeight: "calc(90vh - 200px)" }}>

                    {/* Section 1: Général */}
                    <div className="space-y-6">
                        <h3 className={sectionTitleCls}>1. Informations Générales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className={labelCls}>Date visite</label>
                                <input type="text" className={inputCls} value={formData.date_visite || ""} onChange={(e) => updateField('date_visite', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Commercial</label>
                                <input type="text" className={inputCls} value={formData.commercial || ""} onChange={(e) => updateField('commercial', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Type Collecte</label>
                                <input list="typesCollecte" className={inputCls} value={formData.type_collecte || ""} onChange={(e) => updateField('type_collecte', e.target.value)} placeholder="Saisir ou choisir..." />
                                <datalist id="typesCollecte">
                                    {references.typesCollecte?.map((t: any) => <option key={t.id} value={t.libelle} />)}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Raison Sociale</label>
                                <input type="text" className={inputCls} value={formData.raison_sociale || ""} onChange={(e) => updateField('raison_sociale', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Secteur</label>
                                <input list="secteurs" className={inputCls} value={formData.secteur || ""} onChange={(e) => updateField('secteur', e.target.value)} placeholder="Saisir ou choisir..." />
                                <datalist id="secteurs">
                                    {references.secteurs?.map((s: any) => <option key={s.id} value={s.libelle} />)}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Localisation</label>
                                <input type="text" className={inputCls} value={formData.localisation || ""} onChange={(e) => updateField('localisation', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Ville</label>
                                <input type="text" className={inputCls} value={formData.ville || ""} onChange={(e) => updateField('ville', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Contact Client */}
                    <div className="space-y-6 pt-10 border-t border-white/5">
                        <h3 className={sectionTitleCls}>2. Contact Client</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className={labelCls}>Nom Contact</label>
                                <input type="text" className={inputCls} value={formData.contact_nom || ""} onChange={(e) => updateField('contact_nom', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Fonction</label>
                                <input type="text" className={inputCls} value={formData.contact_fonction || ""} onChange={(e) => updateField('contact_fonction', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Téléphone</label>
                                <input type="text" className={inputCls} value={formData.contact_tel || ""} onChange={(e) => updateField('contact_tel', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Décideur identifié</label>
                                <input type="text" className={inputCls} value={formData.decideur_identifie || ""} onChange={(e) => updateField('decideur_identifie', e.target.value)} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className={labelCls}>Nom Décideur</label>
                                <input type="text" className={inputCls} value={formData.decideur_nom || ""} onChange={(e) => updateField('decideur_nom', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Projet & Activité */}
                    <div className="space-y-6 pt-10 border-t border-white/5">
                        <h3 className={sectionTitleCls}>3. Détails Projet & Activité</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className={labelCls}>Activité</label>
                                <input type="text" className={inputCls} value={formData.activite || ""} onChange={(e) => updateField('activite', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Statut Projet</label>
                                <input list="statutsProjet" className={inputCls} value={formData.statut_projet || ""} onChange={(e) => updateField('statut_projet', e.target.value)} placeholder="Saisir ou choisir..." />
                                <datalist id="statutsProjet">
                                    {references.statutsProjet?.map((s: any) => <option key={s.id} value={s.libelle} />)}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Taille Projet</label>
                                <input list="taillesProjet" className={inputCls} value={formData.taille_projet || ""} onChange={(e) => updateField('taille_projet', e.target.value)} placeholder="Saisir ou choisir..." />
                                <datalist id="taillesProjet">
                                    {references.taillesProjet?.map((t: any) => <option key={t.id} value={t.libelle} />)}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Période</label>
                                <input type="text" className={inputCls} value={formData.periode_projet || ""} onChange={(e) => updateField('periode_projet', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Début</label>
                                <input type="text" className={inputCls} value={formData.debut || ""} onChange={(e) => updateField('debut', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Fin Estimée</label>
                                <input type="text" className={inputCls} value={formData.fin_estimee || ""} onChange={(e) => updateField('fin_estimee', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={labelCls}>Description du Projet</label>
                            <textarea className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:border-primary/50 transition-all outline-none min-h-[100px]" value={formData.description || ""} onChange={(e) => updateField('description', e.target.value)} />
                        </div>
                    </div>

                    {/* Section 4: Équipements */}
                    <div className="space-y-6 pt-10 border-t border-white/5">
                        <h3 className={sectionTitleCls}>4. Équipements & Utilisation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className={labelCls}>Équipements</label>
                                <input type="text" className={inputCls} value={formData.equipements || ""} onChange={(e) => updateField('equipements', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Nombre Équip.</label>
                                <input type="number" className={inputCls} value={formData.nb_equip || ""} onChange={(e) => updateField('nb_equip', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Heures/Jour</label>
                                <input type="text" className={inputCls} value={formData.heures_jour || ""} onChange={(e) => updateField('heures_jour', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Consommation */}
                    <div className="space-y-6 pt-10 border-t border-white/5">
                        <h3 className={sectionTitleCls}>5. Consommation & Flux</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-2">
                                <label className={labelCls}>Produit</label>
                                <input list="produits" className={inputCls} value={formData.produit || ""} onChange={(e) => updateField('produit', e.target.value)} placeholder="Saisir ou choisir..." />
                                <datalist id="produits">
                                    {references.produits?.map((p: any) => <option key={p.id} value={p.libelle} />)}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Conso/Jour</label>
                                <input type="number" className={inputCls} value={formData.conso_jour || ""} onChange={(e) => updateField('conso_jour', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Conso/Semaine</label>
                                <input type="number" className={inputCls} value={formData.conso_semaine || ""} onChange={(e) => updateField('conso_semaine', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Conso/Mois</label>
                                <input type="number" className={inputCls} value={formData.conso_mois || ""} onChange={(e) => updateField('conso_mois', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Estimation Mensuelle</label>
                                <input type="number" className={inputCls} value={formData.conso_mensuelle_estime || ""} onChange={(e) => updateField('conso_mensuelle_estime', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Fournisseur Principal</label>
                                <input list="fournisseurs" className={inputCls} value={formData.fournisseur_principal || ""} onChange={(e) => updateField('fournisseur_principal', e.target.value)} placeholder="Saisir ou choisir..." />
                                <datalist id="fournisseurs">
                                    {references.fournisseurs?.map((f: any) => <option key={f.id} value={f.libelle} />)}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Fournisseur Secondaire</label>
                                <input type="text" className={inputCls} value={formData.fournisseur_secondaire || ""} onChange={(e) => updateField('fournisseur_secondaire', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Mode Appro.</label>
                                <input type="text" className={inputCls} value={formData.mode_appro || ""} onChange={(e) => updateField('mode_appro', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Section 6: Relation */}
                    <div className="space-y-6 pt-10 border-t border-white/5">
                        <h3 className={sectionTitleCls}>6. Relation & Satisfaction</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className={labelCls}>Type Relation</label>
                                <input list="typesRelation" className={inputCls} value={formData.type_relation || ""} onChange={(e) => updateField('type_relation', e.target.value)} placeholder="Saisir ou choisir..." />
                                <datalist id="typesRelation">
                                    {references.typesRelation?.map((t: any) => <option key={t.id} value={t.libelle} />)}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Satisfaction</label>
                                <input list="satisfactions" className={inputCls} value={formData.satisfaction || ""} onChange={(e) => updateField('satisfaction', e.target.value)} placeholder="Saisir ou choisir..." />
                                <datalist id="satisfactions">
                                    {references.satisfactions?.map((s: any) => <option key={s.id} value={s.libelle} />)}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Fenêtre Entrée</label>
                                <input list="fenetresEntree" className={inputCls} value={formData.fenetre_entree || ""} onChange={(e) => updateField('fenetre_entree', e.target.value)} placeholder="Saisir ou choisir..." />
                                <datalist id="fenetresEntree">
                                    {references.fenetresEntree?.map((f: any) => <option key={f.id} value={f.libelle} />)}
                                </datalist>
                            </div>
                        </div>
                    </div>

                    {/* Section 7: Stratégie */}
                    <div className="space-y-6 pt-10 border-t border-white/5">
                        <h3 className={sectionTitleCls}>7. Stratégie & Opportunité</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className={labelCls}>Niveau Opportunité</label>
                                <input list="niveauxOpportunite" className={inputCls} value={formData.opportunite_niveau || ""} onChange={(e) => updateField('opportunite_niveau', e.target.value)} placeholder="Saisir ou choisir..." />
                                <datalist id="niveauxOpportunite">
                                    {references.niveauxOpportunite?.map((n: any) => <option key={n.id} value={n.libelle} />)}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Priorité</label>
                                <input list="priorites" className={inputCls} value={formData.priorite || ""} onChange={(e) => updateField('priorite', e.target.value)} placeholder="Saisir ou choisir..." />
                                <datalist id="priorites">
                                    {references.priorites?.map((p: any) => <option key={p.id} value={p.libelle} />)}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Volume Potentiel</label>
                                <input type="number" className={inputCls} value={formData.volume_potentiel || ""} onChange={(e) => updateField('volume_potentiel', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Volume DIR</label>
                                <input type="number" className={inputCls} value={formData.volume_potentiel_dir || ""} onChange={(e) => updateField('volume_potentiel_dir', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={labelCls}>Actions Prévues</label>
                            <textarea className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:border-primary/50 transition-all outline-none min-h-[80px]" value={formData.actions || ""} onChange={(e) => updateField('actions', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className={labelCls}>Observations Terrain</label>
                            <textarea className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:border-primary/50 transition-all outline-none min-h-[100px]" value={formData.observations || ""} onChange={(e) => updateField('observations', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-10 py-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center shrink-0">
                    <button onClick={onClose} className="px-8 py-4 rounded-2xl text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-all">
                        Annuler
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50">
                        {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
                    </button>
                </div>
            </div>
        </div>
    );
}
