"use client";

import { useRef, useState } from "react";

interface Option {
    id: number | string;
    nom: string;
}

interface CreatableSelectProps {
    label: string;
    options: Option[];
    value: string | number;
    customValue?: string;          // texte libre actuellement sauvegardé
    onSelectId: (id: number | string) => void;
    onCreateNew: (value: string) => void;
    placeholder?: string;
}

export default function CreatableSelect({
    label,
    options,
    value,
    customValue,
    onSelectId,
    onCreateNew,
    placeholder = "Sélectionner ou saisir...",
}: CreatableSelectProps) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Ce que l'input doit afficher quand il n'est pas actif
    const displayValue = open
        ? query
        : customValue || options.find((o) => o.id === value)?.nom || "";

    const filtered = options.filter((o) =>
        o.nom.toLowerCase().includes(query.toLowerCase())
    );

    const exactMatch = filtered.find(
        (o) => o.nom.toLowerCase() === query.toLowerCase()
    );

    const handleSelect = (opt: Option) => {
        setQuery("");
        setOpen(false);
        onSelectId(opt.id);
    };

    const handleCreateNew = () => {
        const val = query.trim();
        if (!val) return;
        setOpen(false);
        onCreateNew(val);
        setQuery("");
    };

    // Ferme si clic en dehors du composant
    const handleBlur = (e: React.FocusEvent) => {
        // relatedTarget est le prochain élément cliqué dans le DOM
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            // Si l'utilisateur a tapé quelque chose sans choisir, on l'enregistre tel quel
            if (query.trim() && !exactMatch) {
                onCreateNew(query.trim());
            }
            setOpen(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="form-group"
            style={{ position: "relative" }}
            onBlur={handleBlur}
        >
            <label className="form-label">{label}</label>

            <div style={{ position: "relative" }}>
                <input
                    type="text"
                    className="form-input"
                    placeholder={placeholder}
                    value={displayValue}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => {
                        setQuery("");
                        setOpen(true);
                    }}
                    autoComplete="off"
                />
                {/* Flèche */}
                <span style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem",
                    transition: "transform 0.2s",
                    ...(open ? { transform: "translateY(-50%) rotate(180deg)" } : {}),
                }}>▼</span>
            </div>

            {open && (
                <div
                    tabIndex={-1}
                    style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0, right: 0,
                        zIndex: 200,
                        background: "var(--surface)",
                        border: "1px solid var(--primary)",
                        borderRadius: "10px",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                        maxHeight: "240px",
                        overflowY: "auto",
                    }}
                >
                    {filtered.length === 0 && !query && (
                        <div style={{ padding: "0.75rem 1rem", color: "#94a3b8", fontSize: "0.9rem" }}>
                            Commencez à taper pour filtrer…
                        </div>
                    )}

                    {filtered.map((opt) => (
                        <div
                            key={opt.id}
                            tabIndex={0}
                            onMouseDown={(e) => { e.preventDefault(); handleSelect(opt); }}
                            onKeyDown={(e) => e.key === "Enter" && handleSelect(opt)}
                            style={{
                                padding: "0.65rem 1rem",
                                cursor: "pointer",
                                background: value === opt.id ? "rgba(37,99,235,0.1)" : "transparent",
                                color: value === opt.id ? "var(--primary)" : "var(--foreground)",
                                fontWeight: value === opt.id ? 600 : 400,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(37,99,235,0.07)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = value === opt.id ? "rgba(37,99,235,0.1)" : "transparent")}
                        >
                            {value === opt.id && <span style={{ color: "var(--primary)" }}>✓</span>}
                            {opt.nom}
                        </div>
                    ))}

                    {/* Option d'ajout : visible si la valeur saisie ne correspond à aucune option */}
                    {query.trim() && !exactMatch && (
                        <div
                            tabIndex={0}
                            onMouseDown={(e) => { e.preventDefault(); handleCreateNew(); }}
                            onKeyDown={(e) => e.key === "Enter" && handleCreateNew()}
                            style={{
                                padding: "0.65rem 1rem",
                                cursor: "pointer",
                                color: "var(--secondary)",
                                fontWeight: 600,
                                borderTop: "1px solid var(--input-border)",
                                display: "flex", alignItems: "center", gap: "0.5rem",
                                background: "rgba(16,185,129,0.05)",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.05)")}
                        >
                            <span style={{ fontSize: "1.1rem" }}>+</span>
                            Utiliser &laquo;&nbsp;{query.trim()}&nbsp;&raquo;
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
