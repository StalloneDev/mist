"use server";

import { db } from "@/lib/db";

export async function getSecteurs() {
    return await db.secteur.findMany({ orderBy: { nom: "asc" } });
}

export async function getTypesCollecte() {
    return await db.typeCollecte.findMany({ orderBy: { nom: "asc" } });
}

export async function getStatutsProjet() {
    return await db.statutProjet.findMany({ orderBy: { nom: "asc" } });
}

export async function getTaillesProjet() {
    return await db.tailleProjet.findMany({ orderBy: { nom: "asc" } });
}

export async function getEquipements() {
    return await db.equipement.findMany({ orderBy: { nom: "asc" } });
}

export async function getProduits() {
    return await db.produit.findMany({ orderBy: { nom: "asc" } });
}

export async function getFournisseurs() {
    return await db.fournisseur.findMany({ orderBy: { nom: "asc" } });
}

export async function getTypesRelation() {
    return await db.typeRelation.findMany({ orderBy: { nom: "asc" } });
}

export async function getSatisfactions() {
    return await db.satisfaction.findMany({ orderBy: { nom: "asc" } });
}

export async function getNiveauxOpportunite() {
    return await db.niveauOpportunite.findMany({ orderBy: { nom: "asc" } });
}

export async function getFenetresEntree() {
    return await db.fenetreEntree.findMany({ orderBy: { nom: "asc" } });
}

export async function getPriorites() {
    return await db.priorite.findMany({ orderBy: { nom: "asc" } });
}

export async function getTypesAction() {
    return await db.typeAction.findMany({ orderBy: { nom: "asc" } });
}

export async function getCommerciaux() {
    return await db.user.findMany({
        where: {
            role: {
                in: ['Commercial', 'Manager', 'Directeur commercial']
            }
        },
        orderBy: { nom: "asc" }
    });
}
