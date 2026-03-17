"use server";

import { db } from "@/lib/db";

/**
 * Récupère les statistiques globales pour le dashboard
 */
export async function getDashboardStats() {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // 1. Fetch all basic counts and aggregates
        const [
            manualCounts,
            reportingCounts,
            manualVolume,
            reportingVolume,
            lastMonthManualVolume,
            lastMonthReportingVolume,
            manualEnts,
            reportingEntsGroups
        ] = await Promise.all([
            db.visite.count().catch(() => 0),
            db.reportingVisite.count().catch(() => 0),
            db.opportunite.aggregate({ _sum: { volume_potentiel: true } }).catch(() => ({ _sum: { volume_potentiel: 0 } })),
            // Aggregate all potential volume sources from reporting
            db.reportingVisite.aggregate({ 
                _sum: { 
                    volume_potentiel: true,
                    volume_potentiel_dir: true,
                    conso_mensuelle_estime: true
                } 
            }).catch(() => ({ _sum: { volume_potentiel: 0, volume_potentiel_dir: 0, conso_mensuelle_estime: 0 } })),
            db.opportunite.aggregate({
                where: { projet: { visite: { date_visite: { gte: startOfLastMonth, lt: startOfMonth } } } },
                _sum: { volume_potentiel: true }
            }).catch(() => ({ _sum: { volume_potentiel: 0 } })),
            db.reportingVisite.aggregate({
                where: { import_date: { gte: startOfLastMonth, lt: startOfMonth } },
                _sum: { 
                    volume_potentiel: true,
                    volume_potentiel_dir: true,
                    conso_mensuelle_estime: true
                }
            }).catch(() => ({ _sum: { volume_potentiel: 0, volume_potentiel_dir: 0, conso_mensuelle_estime: 0 } })),
            db.entreprise.count().catch(() => 0),
            db.reportingVisite.groupBy({ by: ['raison_sociale'] }).catch(() => [])
        ]);

        // 2. Volume and Growth Calculation (Summing multiple sources)
        const reportingVolSum = 
            Number(reportingVolume._sum?.volume_potentiel || 0) + 
            Number(reportingVolume._sum?.volume_potentiel_dir || 0) + 
            Number(reportingVolume._sum?.conso_mensuelle_estime || 0);
            
        const lastReportingVolSum = 
            Number(lastMonthReportingVolume._sum?.volume_potentiel || 0) + 
            Number(lastMonthReportingVolume._sum?.volume_potentiel_dir || 0) + 
            Number(lastMonthReportingVolume._sum?.conso_mensuelle_estime || 0);

        const currentVolume = Number(manualVolume._sum?.volume_potentiel || 0) + reportingVolSum;
        const lastVolume = Number(lastMonthManualVolume._sum?.volume_potentiel || 0) + lastReportingVolSum;
        
        let growth = 0;
        if (lastVolume > 0) {
            growth = ((currentVolume - lastVolume) / lastVolume) * 100;
        } else if (currentVolume > 0) {
            growth = 100;
        }

        // 3. Sector Distribution Aggregation
        const sectorVolumes: Record<string, number> = {};

        // From manual entries
        try {
            const manualSectorsData = await db.entreprise.findMany({
                where: { visites: { some: { projets: { some: { opportunites: { some: { volume_potentiel: { gt: 0 } } } } } } } },
                select: {
                    secteur: { select: { nom: true } },
                    visites: { select: { projets: { select: { opportunites: { select: { volume_potentiel: true } } } } } }
                }
            });

            manualSectorsData.forEach(ent => {
                const sName = ent.secteur?.nom || "Autre";
                let vol = 0;
                ent.visites?.forEach(v => v.projets?.forEach(p => p.opportunites?.forEach(o => {
                    vol += Number(o.volume_potentiel || 0);
                })));
                if (vol > 0) sectorVolumes[sName] = (sectorVolumes[sName] || 0) + vol;
            });
        } catch (e) {
            console.error("Error aggregating manual sectors:", e);
        }

        // From reporting entries (aggregating all volume fields)
        try {
            const reportingSectorsData = await db.reportingVisite.groupBy({
                by: ['secteur'],
                _sum: { 
                    volume_potentiel: true,
                    volume_potentiel_dir: true,
                    conso_mensuelle_estime: true
                }
            });

            reportingSectorsData.forEach(row => {
                const vol = 
                    Number(row._sum?.volume_potentiel || 0) + 
                    Number(row._sum?.volume_potentiel_dir || 0) + 
                    Number(row._sum?.conso_mensuelle_estime || 0);
                
                if (vol > 0) {
                    const sName = row.secteur || "Autre";
                    sectorVolumes[sName] = (sectorVolumes[sName] || 0) + vol;
                }
            });
        } catch (e) {
            console.error("Error aggregating reporting sectors:", e);
        }

        const sectorDistribution = Object.entries(sectorVolumes)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);

        // 4. Safe fetching for secondary components
        let upcomingRDVs: any[] = [];
        try {
            upcomingRDVs = await db.rendezVous.findMany({
                where: { date_rdv: { gte: new Date() } },
                take: 3,
                include: { entreprise: true },
                orderBy: { date_rdv: 'asc' }
            });
        } catch (e: any) {
            console.error("Error fetching RDVs:", e);
        }

        return {
            success: true,
            data: {
                totals: {
                    entreprises: manualEnts + (reportingEntsGroups?.length || 0),
                    visites: manualCounts + reportingCounts,
                    volumeTotal: currentVolume
                },
                growth: growth.toFixed(1),
                activeSectors: sectorDistribution.length,
                sectorDistribution,
                engagement: Math.min(Math.round(((manualCounts + reportingCounts) / 100) * 100), 100),
                upcomingRDVs,
                debug: {
                    reportingCounts,
                    reportingVolSum
                }
            }
        };
    } catch (error: any) {
        console.error("CRITICAL ERROR in getDashboardStats:", error);
        return { 
            success: false, 
            error: error.message || "Erreur interne du serveur lors du calcul des stats"
        };
    }
}

/**
 * Récupère les dernières activités terrain
 */
export async function getRecentActivities(limit = 5) {
    try {
        const activities = await db.visite.findMany({
            take: limit,
            orderBy: { date_visite: 'desc' },
            include: {
                entreprise: true,
                commercial: true,
                projets: {
                    include: {
                        opportunites: {
                            include: { niveau: true }
                        }
                    }
                }
            }
        });
        return { success: true, data: activities };
    } catch (error) {
        console.error("Erreur getRecentActivities:", error);
        return { success: false, error: "Erreur lors du chargement des activités" };
    }
}
