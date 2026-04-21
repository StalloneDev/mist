"use server";

import { db as prisma } from "@/lib/db";

export async function getStatisticsData() {
    try {
        const records = await prisma.reportingVisite.findMany({
            select: {
                mois_visite: true,
                secteur: true,
                commercial: true,
                volume_potentiel: true,
                conso_mensuelle_estime: true,
                conso_mois: true,
                opportunite_niveau: true,
                raison_sociale: true,
                produit: true,
                localisation: true,
            }
        });

        // 1. Monthly Volume Trend (last 12 months, sorted)
        const monthlyMap: Record<string, number> = {};
        records.forEach(r => {
            const m = r.mois_visite || "N/A";
            monthlyMap[m] = (monthlyMap[m] || 0) + Number(r.volume_potentiel || 0);
        });
        const monthlyTrend = Object.entries(monthlyMap)
            .filter(([k]) => k !== "N/A")
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-12)
            .map(([month, volume]) => ({ month, volume }));

        // 2. Sector Distribution
        const sectorMap: Record<string, { volume: number; count: number; conso: number }> = {};
        records.forEach(r => {
            const s = r.secteur || "Autre";
            if (!sectorMap[s]) sectorMap[s] = { volume: 0, count: 0, conso: 0 };
            sectorMap[s].volume += Number(r.volume_potentiel || 0);
            sectorMap[s].count += 1;
            sectorMap[s].conso += Number(r.conso_mensuelle_estime || 0);
        });
        const sectorDistribution = Object.entries(sectorMap)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.volume - a.volume);

        // 3. Commercial Performance
        const commercialMap: Record<string, { volume: number; visites: number; opportunites: number }> = {};
        records.forEach(r => {
            const c = r.commercial || "Inconnu";
            if (!commercialMap[c]) commercialMap[c] = { volume: 0, visites: 0, opportunites: 0 };
            commercialMap[c].volume += Number(r.volume_potentiel || 0);
            commercialMap[c].visites += 1;
            const niv = String(r.opportunite_niveau || "").toLowerCase();
            if (["forte", "haute"].includes(niv)) commercialMap[c].opportunites += 1;
        });
        const commercialPerf = Object.entries(commercialMap)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 8);

        // 4. Opportunity Breakdown
        const oppMap: Record<string, number> = {};
        records.forEach(r => {
            const n = r.opportunite_niveau || "N/A";
            oppMap[n] = (oppMap[n] || 0) + 1;
        });
        const opportunityBreakdown = Object.entries(oppMap)
            .filter(([k]) => k !== "N/A")
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // 5. Top 10 Clients by volume
        const clientMap: Record<string, { volume: number; secteur: string; commercial: string }> = {};
        records.forEach(r => {
            const c = r.raison_sociale || "Inconnu";
            if (!clientMap[c]) clientMap[c] = {
                volume: 0,
                secteur: r.secteur || "",
                commercial: r.commercial || ""
            };
            clientMap[c].volume += Number(r.volume_potentiel || 0);
        });
        const topClients = Object.entries(clientMap)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 10);

        // 6. Summary KPIs
        const totalVolume = records.reduce((s, r) => s + Number(r.volume_potentiel || 0), 0);
        const totalConso = records.reduce((s, r) => s + Number(r.conso_mensuelle_estime || 0), 0);
        const totalOpportunites = records.filter(r => ["forte", "haute"].includes(String(r.opportunite_niveau || "").toLowerCase())).length;
        const activeSectors = new Set(records.map(r => r.secteur).filter(Boolean)).size;

        // 7. Smart Insights
        const topSector = sectorDistribution[0];
        const topSectorPct = totalVolume > 0 ? Math.round((topSector?.volume / totalVolume) * 100) : 0;
        const topCommercial = commercialPerf[0];

        return {
            success: true,
            data: {
                monthlyTrend,
                sectorDistribution,
                commercialPerf,
                opportunityBreakdown,
                topClients,
                summary: {
                    totalVolume,
                    totalConso,
                    totalOpportunites,
                    activeSectors,
                    totalRecords: records.length,
                },
                insights: {
                    topSector: topSector?.name || "N/A",
                    topSectorVolume: topSector?.volume || 0,
                    topSectorPct,
                    topCommercial: topCommercial?.name || "N/A",
                    topCommercialVolume: topCommercial?.volume || 0,
                    topCommercialVisites: topCommercial?.visites || 0,
                }
            }
        };
    } catch (error) {
        console.error("Statistics error:", error);
        return { success: false, error: "Erreur lors du chargement des statistiques" };
    }
}
