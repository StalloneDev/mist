"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { sendActionMail, scheduleReminderMail } from "@/lib/mail";
import { safeInt, safeFloat } from "@/lib/utils";

/**
 * Récupère la liste des entreprises avec filtres optionnels
 */
export async function getEntreprises(filters?: { secteurId?: number; ville?: string; search?: string }) {
    try {
        const where: any = {};
        if (filters?.secteurId) where.secteur_id = filters.secteurId;
        if (filters?.ville) where.ville = { contains: filters.ville, mode: 'insensitive' };
        if (filters?.search) {
            where.raison_sociale = { contains: filters.search, mode: 'insensitive' };
        }

        const entreprises = await db.entreprise.findMany({
            where,
            select: {
                id: true,
                raison_sociale: true,
                ville: true,
                statut: true,
                secteur_id: true,
                secteur: {
                    select: {
                        id: true,
                        nom: true
                    }
                },
                _count: {
                    select: { visites: true, contacts: true }
                }
            },
            orderBy: { raison_sociale: 'asc' }
        });

        console.log(`[getEntreprises] Found ${entreprises.length} entreprises in db`);
        return { success: true, data: entreprises };
    } catch (error) {
        console.error("Erreur getEntreprises:", error);
        return { success: false, error: "Impossible de charger les entreprises" };
    }
}

/**
 * Synchronise les entreprises depuis la table ReportingVisite
 */
export async function syncEntreprisesFromReporting() {
    try {
        // 1. Récupérer toutes les raisons sociales uniques du reporting
        const reportingRows = await db.reportingVisite.findMany({
            select: { raison_sociale: true, secteur: true, localisation: true },
            where: { raison_sociale: { not: null } }
        });

        // 2. Récupérer les entreprises et secteurs existants
        const existingEntreprises = await db.entreprise.findMany({ select: { raison_sociale: true } });
        const existingNames = new Set(existingEntreprises.map(e => e.raison_sociale.toLowerCase().trim()));
        
        const existingSecteurs = await db.secteur.findMany();
        const secteurMap = new Map(existingSecteurs.map(s => [s.nom.toLowerCase(), s.id]));

        // Secteur par défaut "AUTRE" ou "IMPORT"
        let defaultSecteurId = secteurMap.get("autre") || secteurMap.get("divers");
        if (!defaultSecteurId) {
            const newSecteur = await db.secteur.create({ data: { nom: "AUTRE" } });
            defaultSecteurId = newSecteur.id;
            secteurMap.set("autre", defaultSecteurId);
        }

        // 3. Filtrer les nouvelles entreprises
        const newCompanies = new Map();
        for (const row of reportingRows) {
            const name = row.raison_sociale?.trim();
            if (name && !existingNames.has(name.toLowerCase())) {
                if (!newCompanies.has(name.toLowerCase())) {
                    // Trouver ou créer le secteur pour cette entreprise
                    let sId = defaultSecteurId;
                    const sNom = row.secteur?.trim();
                    if (sNom) {
                        if (secteurMap.has(sNom.toLowerCase())) {
                            sId = secteurMap.get(sNom.toLowerCase())!;
                        } else {
                            const ns = await db.secteur.create({ data: { nom: sNom.toUpperCase() } });
                            sId = ns.id;
                            secteurMap.set(sNom.toLowerCase(), sId);
                        }
                    }

                    newCompanies.set(name.toLowerCase(), {
                        raison_sociale: name,
                        ville: row.localisation || null,
                        secteur_id: sId,
                        statut: "Prospect brut"
                    });
                }
            }
        }

        // 4. Création des entreprises
        const created = [];
        for (const comp of newCompanies.values()) {
            const newEnt = await db.entreprise.create({
                data: comp
            });
            created.push(newEnt);
        }

        revalidatePath("/entreprises");
        return { success: true, count: created.length };
    } catch (error) {
        console.error("Erreur syncEntreprisesFromReporting:", error);
        return { success: false, error: "Erreur lors de la synchronisation" };
    }
}

/**
 * Récupère les détails d'une entreprise spécifique
 */
export async function getEntrepriseById(id: number) {
    try {
        const entreprise = await db.entreprise.findUnique({
            where: { id },
            include: {
                secteur: true,
                contacts: true,
                visites: {
                    include: {
                        commercial: true,
                        projets: {
                            include: {
                                opportunites: {
                                    include: { niveau: true, priorite: true }
                                }
                            }
                        }
                    },
                    orderBy: { date_visite: 'desc' }
                }
            }
        });
        return { success: true, data: entreprise };
    } catch (error) {
        console.error("Erreur getEntrepriseById:", error);
        return { success: false, error: "Entreprise non trouvée" };
    }
}

/**
 * Récupère la liste globale des contacts
 */
export async function getContacts(search?: string) {
    try {
        const where: any = {};
        if (search) {
            where.OR = [
                { nom: { contains: search, mode: 'insensitive' } },
                { entreprise: { raison_sociale: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const contacts = await db.contact.findMany({
            where,
            include: {
                entreprise: true
            },
            orderBy: { nom: 'asc' }
        });
        return { success: true, data: contacts };
    } catch (error) {
        console.error("Erreur getContacts:", error);
        return { success: false, error: "Impossible de charger les contacts" };
    }
}
/**
 * Récupère la liste des statuts possibles pour une entreprise
 */
export async function getStatutsEntreprise() {
    return [
        "Prospect brut",
        "Prospect contacté",
        "Prospect qualifié",
        "En négociation",
        "À valider / en décision",
        "Gagné – nouveau client",
        "Client actif régulier",
        "Client actif occasionnel",
        "Client stratégique",
        "Client à relancer",
        "Client inactif",
        "Client perdu"
    ];
}

/**
 * Met à jour le statut d'une entreprise
 */
export async function updateEntrepriseStatut(id: number, statut: string) {
    try {
        const entreprise = await db.entreprise.update({
            where: { id },
            data: { statut }
        });
        
        // Logique de synchronisation optionnelle avec le reporting si nécessaire
        
        revalidatePath("/entreprises");
        revalidatePath(`/entreprises/${id}`);
        revalidatePath("/dashboard");
        return { success: true, data: entreprise };
    } catch (error) {
        console.error("Erreur updateEntrepriseStatut:", error);
        return { success: false, error: "Impossible de mettre à jour le statut" };
    }
}

/**
 * Crée un nouveau suivi d'action
 */
export async function createSuiviAction(data: any) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Non authentifié" };

    try {
        const suivi = await db.suiviAction.create({
            data: {
                entreprise_id: safeInt(data.entreprise_id) as number,
                user_id: safeInt(session.user.id) as number,
                date_action: new Date(data.date_action),
                heure_debut: data.heure_debut,
                heure_fin: data.heure_fin,
                type_action: data.type_action,
                but_intervention: data.but_intervention,
                sujet_principal: data.sujet_principal,
                personne_contactee: data.personne_contactee,
                resume_discussion: data.resume_discussion,
                questions_client: data.questions_client,
                reponses_apportees: data.reponses_apportees,
                documents_remis: data.documents_remis,
                statut_obtenu: data.statut_obtenu,
                commentaires: data.commentaires,
                niveau_interet: safeInt(data.niveau_interet),
                prochaine_etape: data.prochaine_etape,
                date_prochaine_action: data.date_prochaine_action ? new Date(data.date_prochaine_action) : null,
                priorite: data.priorite
            }
        });

        // Envoi du mail automatique
        if (session.user.email) {
            const fullAction = await db.suiviAction.findUnique({
                where: { id: suivi.id },
                include: { entreprise: true }
            });
            await sendActionMail(fullAction, session.user.email);
            if (fullAction?.date_prochaine_action) {
                await scheduleReminderMail(fullAction, session.user.email);
            }
        }
        
        revalidatePath("/actions");
        return { success: true, data: suivi };
    } catch (error) {
        console.error("Erreur createSuiviAction:", error);
        return { success: false, error: "Erreur lors de l'enregistrement de l'action" };
    }
}

/**
 * Récupère les suivis d'actions avec filtres
 */
export async function getSuivisActions(filters?: { 
    entrepriseId?: number; 
    userId?: number;
    typeAction?: string;
    priorite?: string;
    startDate?: Date; 
    endDate?: Date;
    search?: string;
}) {
    try {
        const where: any = {};
        
        if (filters?.entrepriseId) where.entreprise_id = filters.entrepriseId;
        if (filters?.userId) where.user_id = filters.userId;
        if (filters?.typeAction && filters.typeAction !== "Tous") where.type_action = filters.typeAction;
        if (filters?.priorite && filters.priorite !== "Toutes") where.priorite = filters.priorite;
        
        if (filters?.search) {
            where.entreprise = {
                raison_sociale: { contains: filters.search, mode: 'insensitive' }
            };
        }

        if (filters?.startDate || filters?.endDate) {
            where.date_action = {};
            if (filters.startDate) where.date_action.gte = filters.startDate;
            if (filters.endDate) where.date_action.lte = filters.endDate;
        }

        const actions = await db.suiviAction.findMany({
            where,
            include: {
                entreprise: true,
                user: true
            },
            orderBy: { date_action: 'desc' }
        });

        return { success: true, data: actions };
    } catch (error) {
        console.error("Erreur getSuivisActions:", error);
        return { success: false, error: "Impossible de charger les actions" };
    }
}

/**
 * Supprime un suivi d'action par ID
 */
export async function deleteSuiviAction(id: number) {
    try {
        await db.suiviAction.delete({ where: { id } });
        revalidatePath("/actions");
        return { success: true };
    } catch (error: any) {
        console.error("Erreur deleteSuiviAction:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Supprime toutes les actions liées à une entreprise par nom (raison sociale)
 */
export async function deleteAllActionsForEntrepriseByName(raisonSociale: string) {
    try {
        const entreprise = await db.entreprise.findFirst({
            where: { raison_sociale: { equals: raisonSociale, mode: 'insensitive' } },
            select: { id: true }
        });

        if (!entreprise) return { success: false, error: `Entreprise "${raisonSociale}" introuvable` };

        const result = await db.suiviAction.deleteMany({
            where: { entreprise_id: entreprise.id }
        });

        revalidatePath("/actions");
        return { success: true, count: result.count };
    } catch (error: any) {
        console.error("Erreur deleteAllActionsForEntrepriseByName:", error);
        return { success: false, error: error.message };
    }
}
/**
 * Supprime une entreprise et TOUTES ses données liées (Contacts, Actions, Visites, RDVs)
 */
export async function deleteEntreprise(id: number) {
    try {
        await db.$transaction(async (tx) => {
            // 1. Supprimer les SuivisActions
            await tx.suiviAction.deleteMany({ where: { entreprise_id: id } });
            
            // 2. Supprimer les RendezVous
            await tx.rendezVous.deleteMany({ where: { entreprise_id: id } });

            // 3. Supprimer les Visites et leurs relations (Projets, etc.)
            const visites = await tx.visite.findMany({ where: { entreprise_id: id }, select: { id: true } });
            for (const v of visites) {
                // Supprimer les Projets liés à la visite
                const projets = await tx.projet.findMany({ where: { visite_id: v.id }, select: { id: true } });
                for (const p of projets) {
                    await tx.projetEquipement.deleteMany({ where: { projet_id: p.id } });
                    await tx.consommation.deleteMany({ where: { projet_id: p.id } });
                    await tx.projetFournisseur.deleteMany({ where: { projet_id: p.id } });
                    
                    // Supprimer les actions commerciales liées aux opportunités du projet
                    const opportunites = await tx.opportunite.findMany({ where: { projet_id: p.id }, select: { id: true } });
                    for (const opp of opportunites) {
                        await tx.actionCommerciale.deleteMany({ where: { opportunite_id: opp.id } });
                    }
                    
                    await tx.opportunite.deleteMany({ where: { projet_id: p.id } });
                    await tx.projet.delete({ where: { id: p.id } });
                }
                await tx.visite.delete({ where: { id: v.id } });
            }

            // 4. Supprimer les Contacts
            await tx.contact.deleteMany({ where: { entreprise_id: id } });

            // 5. Mettre à jour le ReportingVisite (dissocier au lieu de supprimer)
            await tx.reportingVisite.updateMany({
                where: { entreprise_id: id },
                data: { entreprise_id: null }
            });

            // 6. Supprimer enfin l'entreprise
            await tx.entreprise.delete({ where: { id } });
        });

        revalidatePath("/entreprises");
        revalidatePath("/dashboard");
        revalidatePath("/reporting");
        return { success: true };
    } catch (error: any) {
        console.error("Erreur deleteEntreprise:", error);
        return { success: false, error: error.message };
    }
}

export async function updateEntreprise(id: number, data: any) {
    try {
        const result = await db.$transaction(async (tx) => {
            // 1. Update Enterprise
            const entreprise = await tx.entreprise.update({
                where: { id },
                data: {
                    raison_sociale: data.raison_sociale,
                    secteur_id: safeInt(data.secteur_id) ?? undefined,
                    ville: data.ville,
                    adresse: data.adresse,
                }
            });

            // 2. Synchronize with ReportingVisite
            await tx.reportingVisite.updateMany({
                where: { entreprise_id: id },
                data: {
                    raison_sociale: data.raison_sociale,
                    localisation: data.ville, // 'ville' dans l'entreprise -> 'localisation' dans le reporting
                }
            });

            return entreprise;
        });

        revalidatePath("/entreprises");
        revalidatePath("/dashboard");
        revalidatePath("/reporting");
        
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error updating entreprise:", error);
        return { success: false, error: error.message };
    }
}
export async function updateContact(id: number, data: any) {
    try {
        const contact = await db.contact.update({
            where: { id },
            data: {
                nom: data.nom,
                fonction: data.fonction,
                email: data.email,
                telephone: data.telephone,
            }
        });

        revalidatePath("/entreprises");
        revalidatePath(`/entreprises/${contact.entreprise_id}`);
        
        return { success: true, data: contact };
    } catch (error: any) {
        console.error("Error updating contact:", error);
        return { success: false, error: error.message };
    }
}
