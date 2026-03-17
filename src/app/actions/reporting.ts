"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getReportingData() {
    try {
        const data = await db.reportingVisite.findMany({
            orderBy: {
                id: 'asc'
            }
        });

        // Transformer les dates et objets pour qu'ils soient sérialisables du côté client.
        const serialized = data.map(record => {
            const result: any = { ...record };
            // Ne PAS écraser l'id de la base de données, on garde l'id unique pour les actions.
            // On peut afficher excel_id dans le tableau si besoin via une autre colonne.

            // Convertir les Decimals en numbers
            if (result.conso_jour !== null) result.conso_jour = Number(result.conso_jour);
            if (result.conso_semaine !== null) result.conso_semaine = Number(result.conso_semaine);
            if (result.conso_mois !== null) result.conso_mois = Number(result.conso_mois);
            if (result.conso_mensuelle_estime !== null) result.conso_mensuelle_estime = Number(result.conso_mensuelle_estime);
            if (result.volume_potentiel_dir !== null) result.volume_potentiel_dir = Number(result.volume_potentiel_dir);
            if (result.volume_potentiel !== null) result.volume_potentiel = Number(result.volume_potentiel);

            return result;
        });

        return { success: true, data: serialized };
    } catch (error: any) {
        console.error("Erreur lors de la récupération des rapports:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteReportingRow(id: number) {
    try {
        await db.reportingVisite.delete({
            where: { id }
        });
        revalidatePath("/dashboard");
        revalidatePath("/reporting");
        return { success: true };
    } catch (error: any) {
        console.error("Erreur lors de la suppression du rapport:", error);
        return { success: false, error: error.message };
    }
}

export async function updateReportingRow(id: number, data: any) {
    try {
        // Enlever les champs non modifiables ou auto-générés
        const { id: rowId, import_date, ...updateData } = data;
        
        // S'assurer que les nombres sont bien des Decimals ou null
        const numericFields = ['conso_jour', 'conso_semaine', 'conso_mois', 'conso_mensuelle_estime', 'volume_potentiel_dir', 'volume_potentiel'];
        numericFields.forEach(field => {
            if (updateData[field] === "" || updateData[field] === undefined) {
                updateData[field] = null;
            } else if (typeof updateData[field] === 'string') {
                updateData[field] = parseFloat(updateData[field]);
            }
        });

        const result = await db.$transaction(async (tx) => {
            // 1. Update Reporting Record
            const updatedRow = await tx.reportingVisite.update({
                where: { id: rowId },
                data: updateData
            });

            // 2. Bidirectional Sync: Update Enterprise if relevant fields changed
            if (updatedRow.entreprise_id && (updateData.raison_sociale || updateData.ville)) {
                await tx.entreprise.update({
                    where: { id: updatedRow.entreprise_id },
                    data: {
                        ...(updateData.raison_sociale && { raison_sociale: updateData.raison_sociale }),
                        ...(updateData.ville && { ville: updateData.ville }),
                    }
                });
            }

            return updatedRow;
        });

        revalidatePath("/dashboard");
        revalidatePath("/reporting");
        revalidatePath("/entreprises");
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Erreur lors de la mise à jour du rapport:", error);
        return { success: false, error: error.message };
    }
}
