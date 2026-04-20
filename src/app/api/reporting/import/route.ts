import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Column mapping from Excel headers to our data model
const COLUMN_MAP: Record<string, string> = {
    "ID": "id",
    "Date visite": "date_visite",
    "Commercial": "commercial",
    "Type collecte": "type_collecte",
    "Raison sociale": "raison_sociale",
    "Secteur": "secteur",
    "Secteur (autre)": "secteur_autre",
    "Localisation site/chantier": "localisation",
    "Contact - Nom": "contact_nom",
    "Contact - Fonction": "contact_fonction",
    "Contact - Tel": "contact_tel",
    "Activité": "activite",
    "Activite (autre)": "activite_autre",
    "Description": "description",
    "Debut": "debut",
    "Fin estimee": "fin_estimee",
    "Statut du Projet": "statut_projet",
    "Periode projet": "periode_projet",
    "Taille projet": "taille_projet",
    "Equipements (liste)": "equipements",
    "Nb equip.": "nb_equip",
    "Heures moy/jour": "heures_jour",
    "Produit": "produit",
    "Produit (autre)": "produit_autre",
    "Conso jour (L)": "conso_jour",
    "Conso semaine (L)": "conso_semaine",
    "Conso mois (L)": "conso_mois",
    "Conso mensuelle estimee (L)": "conso_mensuelle_estime",
    "Mode appro": "mode_appro",
    "Fournisseur principal": "fournisseur_principal",
    "Fournisseur secondaire": "fournisseur_secondaire",
    "Type relation": "type_relation",
    "Satisfaction": "satisfaction",
    "Opportunite niveau": "opportunite_niveau",
    "Decideur identifie": "decideur_identifie",
    "Decideur nom/fonction": "decideur_nom",
    "Fenetre entree": "fenetre_entree",
    "Observations": "observations",
    "Actions a prevoir": "actions",
    "Volume potentiel Direction (L/mois)": "volume_potentiel_dir",
    "Priorite": "priorite",
    "Volume potentiel calc (L/mois)": "volume_potentiel",
    "Mois visite": "mois_visite",
};

function excelDateToString(excelDate: number | string): string {
    if (typeof excelDate === "number") {
        const date = XLSX.SSF.parse_date_code(excelDate);
        if (date) {
            return `${date.d.toString().padStart(2, "0")}/${date.m.toString().padStart(2, "0")}/${date.y}`;
        }
    }
    return String(excelDate);
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file) {
            return NextResponse.json({ success: false, error: "Aucun fichier reçu" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(Buffer.from(buffer), { type: "buffer" });

        // Try to find "Saisie" sheet, fallback to first sheet
        const sheetName = wb.SheetNames.includes("Saisie") ? "Saisie" : wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }) as any[][];

        // Find header row - Scoring system based on COLUMN_MAP matches
        let bestHeaderIndex = -1;
        let maxMatchCount = 0;

        // Search through first 50 rows for the best candidate
        for (let i = 0; i < Math.min(rawData.length, 50); i++) {
            let matchCount = 0;
            const row = rawData[i];
            row.forEach((cell: any) => {
                const cellStr = String(cell).toLowerCase().trim();
                const isMatch = Object.keys(COLUMN_MAP).some(k => {
                    const normalizedK = k.toLowerCase().trim();
                    return cellStr === normalizedK || (cellStr.length > 5 && cellStr.includes(normalizedK));
                });
                if (isMatch) matchCount++;
            });

            if (matchCount > maxMatchCount) {
                maxMatchCount = matchCount;
                bestHeaderIndex = i;
            }
        }

        if (bestHeaderIndex === -1 || maxMatchCount < 3) {
            return NextResponse.json({ 
                success: false, 
                error: `Structure du fichier non reconnue. Aucun en-tête trouvé parmi les 50 premières lignes. Colonnes trouvées à la ligne 1: ${rawData[0]?.slice(0, 5).join(", ")}` 
            }, { status: 400 });
        }

        // Create a normalized map for case-insensitive lookup
        const NORMALIZED_MAP: Record<string, string> = {};
        Object.keys(COLUMN_MAP).forEach(k => {
            NORMALIZED_MAP[k.toLowerCase().trim()] = COLUMN_MAP[k];
        });

        const headers: string[] = rawData[bestHeaderIndex].map((h: any) => String(h).trim());
        const dataRows = rawData.slice(bestHeaderIndex + 1);
        
        const records = dataRows.map((row: any[]) => {
            const record: Record<string, any> = {};
            let hasData = false;
            
            headers.forEach((header, idx) => {
                const normalizedHeader = header.toLowerCase().trim();
                
                // 1. Try exact match
                let key = NORMALIZED_MAP[normalizedHeader];
                
                // 2. Fallback to fuzzy match
                if (!key) {
                    const foundKey = Object.keys(NORMALIZED_MAP).find(k => 
                        normalizedHeader.includes(k) || k.includes(normalizedHeader)
                    );
                    if (foundKey) key = NORMALIZED_MAP[foundKey];
                }

                if (!key) return; 
                
                let val = row[idx];
                if (val !== undefined && val !== null && val !== "") hasData = true;

                if (key === "date_visite" && typeof val === "number") {
                    val = excelDateToString(val);
                }
                
                // Handle numeric fields
                if (["conso_jour", "conso_semaine", "conso_mois", "conso_mensuelle_estime", "volume_potentiel", "volume_potentiel_dir"].includes(key)) {
                    if (val === "" || val === null || val === undefined) {
                        record[key] = null;
                    } else if (typeof val === "number") {
                        record[key] = val;
                    } else {
                        const cleaned = String(val).replace(",", ".").replace(/[^\d.-]/g, "");
                        const num = parseFloat(cleaned);
                        record[key] = isNaN(num) ? null : num;
                    }
                } else {
                    record[key] = val !== "" && val !== null ? String(val) : null;
                }
            });
            
            return { record, hasData };
        })
        .filter(item => {
            const r = item.record;
            // Skip rows without meaningful reason_sociale (ignore technical validation text)
            const rs = String(r.raison_sociale || "").toLowerCase();
            const isValidRS = rs.length > 1 && !rs.includes("obligatoire") && !rs.includes("champ");
            return item.hasData && isValidRS;
        })
        .map(item => item.record);

        if (records.length === 0) {
            return NextResponse.json({ 
                success: false, 
                error: `Aucune donnée valide n'a été trouvée après la ligne d'en-tête (ligne ${bestHeaderIndex + 1}). Vérifiez que la colonne 'Raison sociale' est bien remplie.` 
            }, { status: 400 });
        }

        await db.reportingVisite.deleteMany({});

        if (records.length > 0) {
            await db.reportingVisite.createMany({
                data: records.map((r: any) => {
                    const cleanRecord: any = { ...r };
                    cleanRecord.excel_id = String(r.id || "");
                    delete cleanRecord.id;
                    return cleanRecord;
                })
            });
        }

        revalidatePath("/dashboard");
        revalidatePath("/reporting");

        return NextResponse.json({
            success: true,
            data: records, // For immediate UI update if needed
            count: records.length,
            sheet: sheetName,
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
