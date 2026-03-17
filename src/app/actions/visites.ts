"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function createVisite(formData: any) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Vous devez être connecté pour effectuer cette action" };
    }
    const userId = parseInt(session.user.id);

    try {
        await db.$transaction(async (tx) => {
            let entrepriseId = formData.entreprise_id;

            // Create new Entreprise if not existing
            if (!entrepriseId && formData.raison_sociale) {
                const newEnt = await tx.entreprise.create({
                    data: {
                        raison_sociale: formData.raison_sociale,
                        secteur_id: parseInt(formData.secteur_id),
                        secteur_autre: formData.secteur_autre,
                        ville: formData.ville,
                        statut: formData.entreprise_statut || "Prospect brut"
                    }
                });
                entrepriseId = newEnt.id;
            } else if (entrepriseId && formData.entreprise_statut) {
                // Update status if provided
                await tx.entreprise.update({
                    where: { id: parseInt(entrepriseId) },
                    data: { statut: formData.entreprise_statut }
                });
            }

            // Handle multiple contacts
            const contactIds: number[] = [];
            if (entrepriseId && formData.contacts && formData.contacts.length > 0) {
                for (const c of formData.contacts) {
                    if (!c.nom) continue;
                    const newContact = await tx.contact.create({
                        data: {
                            entreprise_id: entrepriseId,
                            nom: c.nom,
                            fonction: c.fonction,
                            telephone: c.telephone,
                            email: c.email
                        }
                    });
                    contactIds.push(newContact.id);
                }
            }

            // 2. Create the main Visite record
            const visite = await tx.visite.create({
                data: {
                    date_visite: new Date(formData.date_visite),
                    commercial_id: userId,
                    entreprise_id: entrepriseId,
                    type_collecte_id: formData.type_collecte_id || null,
                    type_collecte_autre: formData.type_collecte_autre,
                    localisation_site: formData.localisation_site,
                    contact_id: contactIds[0] || null, // Primary contact
                    observations: formData.observations,
                }
            });

            // 3. Create the Projet
            if (formData.projet_description || formData.projet_activite || formData.parc_materiel_texte) {
                const projet = await tx.projet.create({
                    data: {
                        visite_id: visite.id,
                        activite: formData.projet_activite,
                        description: formData.projet_description,
                        date_debut: formData.projet_date_debut ? new Date(formData.projet_date_debut) : null,
                        date_fin_estimee: formData.projet_date_fin ? new Date(formData.projet_date_fin) : null,
                        statut_projet_id: formData.statut_projet_id || null,
                        statut_projet_autre: formData.statut_projet_autre,
                        taille_projet_id: formData.taille_projet_id || null,
                        taille_projet_autre: formData.taille_projet_autre,
                        parc_materiel: formData.parc_materiel_texte,
                    }
                });

                // 4. Attach Equipements (Direct entry) - DEPRECATED in favor of parc_materiel text
                /*
                if (formData.equipements && formData.equipements.length > 0) {
                    await tx.projetEquipement.createMany({
                        data: formData.equipements.map((eq: any) => ({
                            projet_id: projet.id,
                            equipement_autre: eq.equipement_nom,
                            nombre: eq.nombre,
                            heures_moy_jour: eq.heures_moy_jour
                        }))
                    });
                }
                */

                // 5. Consommation
                if ((formData.produit_ids && formData.produit_ids.length > 0) || formData.produit_id) {
                    const productIds = formData.produit_ids || [formData.produit_id];
                    for (const pid of productIds) {
                        if (!pid) continue;
                        await tx.consommation.create({
                            data: {
                                projet_id: projet.id,
                                produit_id: pid,
                                conso_jour: formData.conso_jour,
                                conso_semaine: formData.conso_semaine,
                                conso_mois: formData.conso_mois,
                                conso_mensuelle_estimee: formData.conso_mois
                            }
                        });
                    }
                }

                // 6. Fournisseurs
                if (formData.fournisseur_principal_id || formData.fournisseur_principal_nom) {
                    await tx.projetFournisseur.create({
                        data: {
                            projet_id: projet.id,
                            fournisseur_principal_id: formData.fournisseur_principal_id || null,
                            fournisseur_secondaire_id: formData.fournisseur_secondaire_id || null,
                            type_relation_id: formData.type_relation_id || null,
                            type_relation_autre: formData.type_relation_autre,
                            satisfaction_id: formData.satisfaction_id || null,
                            satisfaction_autre: formData.satisfaction_autre,
                        }
                    });
                }

                // 7. Opportunité & Actions (Optionally create from visit)
                if (formData.niveau_id || formData.niveau_autre || formData.volume_potentiel) {
                    const opportunite = await tx.opportunite.create({
                        data: {
                            projet_id: projet.id,
                            niveau_id: formData.niveau_id || null,
                            niveau_autre: formData.niveau_autre,
                            decideur_identifie: formData.decideur_identifie || false,
                            decideur_nom: formData.decideur_nom,
                            fenetre_entree_id: formData.fenetre_entree_id || null,
                            fenetre_entree_autre: formData.fenetre_entree_autre,
                            volume_potentiel: formData.volume_potentiel,
                            priorite_id: formData.priorite_id || null,
                            priorite_autre: formData.priorite_autre,
                        }
                    });

                    if (formData.type_action_id || formData.type_action_autre) {
                        await tx.actionCommerciale.create({
                            data: {
                                opportunite_id: opportunite.id,
                                type_action_id: formData.type_action_id || null,
                                type_action_autre: formData.type_action_autre,
                                statut: "A_FAIRE"
                            }
                        });
                    }
                }
            }

            // 8. SYNCHRONISATION AVEC LA TABLE REPORTING
            const [secteur, commercial, typeCollecte, statutProjet, tailleProjet, produit, satisfaction, niveauOpp, fenetre, priorite, typeAction] = await Promise.all([
                formData.secteur_id ? tx.secteur.findUnique({ where: { id: formData.secteur_id } }) : null,
                tx.user.findUnique({ where: { id: userId } }),
                formData.type_collecte_id ? tx.typeCollecte.findUnique({ where: { id: formData.type_collecte_id } }) : null,
                formData.statut_projet_id ? tx.statutProjet.findUnique({ where: { id: formData.statut_projet_id } }) : null,
                formData.taille_projet_id ? tx.tailleProjet.findUnique({ where: { id: formData.taille_projet_id } }) : null,
                formData.produit_id ? tx.produit.findUnique({ where: { id: formData.produit_id } }) : null,
                formData.satisfaction_id ? tx.satisfaction.findUnique({ where: { id: formData.satisfaction_id } }) : null,
                formData.niveau_id ? tx.niveauOpportunite.findUnique({ where: { id: formData.niveau_id } }) : null,
                formData.fenetre_entree_id ? tx.fenetreEntree.findUnique({ where: { id: formData.fenetre_entree_id } }) : null,
                formData.priorite_id ? tx.priorite.findUnique({ where: { id: formData.priorite_id } }) : null,
                formData.type_action_id ? tx.typeAction.findUnique({ where: { id: formData.type_action_id } }) : null,
            ]);

            const contactsInfo = formData.contacts?.map((c: any) => `${c.nom} (${c.fonction})`).join(" / ") || "";

            await tx.reportingVisite.create({
                data: {
                    date_visite: formData.date_visite,
                    commercial: commercial ? `${commercial.prenom} ${commercial.nom}` : "Commercial Inconnu",
                    type_collecte: typeCollecte?.nom || formData.type_collecte_autre,
                    raison_sociale: formData.raison_sociale || (entrepriseId ? (await tx.entreprise.findUnique({ where: { id: entrepriseId } }))?.raison_sociale : null),
                    secteur: secteur?.nom,
                    secteur_autre: formData.secteur_autre,
                    localisation: formData.localisation_site,
                    contact_nom: formData.contacts?.[0]?.nom,
                    contact_fonction: formData.contacts?.[0]?.fonction,
                    contact_tel: formData.contacts?.[0]?.telephone,
                    activite: formData.projet_activite,
                    description: formData.projet_description,
                    debut: formData.projet_date_debut,
                    fin_estimee: formData.projet_date_fin,
                    statut_projet: statutProjet?.nom || formData.statut_projet_autre,
                    taille_projet: tailleProjet?.nom || formData.taille_projet_autre,
                    produit: produit?.nom,
                    conso_jour: formData.conso_jour,
                    conso_semaine: formData.conso_semaine,
                    conso_mois: formData.conso_mois,
                    conso_mensuelle_estime: formData.conso_mois,
                    satisfaction: satisfaction?.nom || formData.satisfaction_autre,
                    opportunite_niveau: niveauOpp?.nom || formData.niveau_autre,
                    decideur_identifie: formData.decideur_identifie ? "Oui" : "Non",
                    decideur_nom: formData.decideur_nom,
                    fenetre_entree: fenetre?.nom || formData.fenetre_entree_autre,
                    priorite: priorite?.nom || formData.priorite_autre,
                    volume_potentiel: formData.volume_potentiel,
                    observations: (formData.observations || "") + (contactsInfo ? "\nContacts: " + contactsInfo : ""),
                    actions: typeAction?.nom || formData.type_action_autre,
                    mois_visite: formData.date_visite ? formData.date_visite.substring(0, 7) : null,
                    excel_id: `TV-${Date.now()}`,
                    equipements: formData.parc_materiel_texte,
                    entreprise_id: entrepriseId
                }
            });
        });

        revalidatePath("/dashboard");
        revalidatePath("/reporting");
        revalidatePath("/entreprises");
        return { success: true };
    } catch (error) {
        console.error("Erreur lors de la création de la visite:", error);
        return { success: false, error: "Erreur lors de l'enregistrement" };
    }
}
