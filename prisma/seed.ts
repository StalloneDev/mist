import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    // Secteurs
    await prisma.secteur.createMany({
        data: [
            { id: 1, nom: 'BTP' },
            { id: 2, nom: 'Usine' },
            { id: 3, nom: 'Carrière' },
            { id: 4, nom: 'Centrale' },
            { id: 5, nom: 'Autre' },
        ],
        skipDuplicates: true,
    })

    // Types de Collecte
    await prisma.typeCollecte.createMany({
        data: [
            { id: 1, nom: 'Visite terrain' },
            { id: 2, nom: 'Observation chantier' },
            { id: 3, nom: 'Recherche / renseignement indirect' },
        ],
        skipDuplicates: true,
    })

    // Statuts Projet
    await prisma.statutProjet.createMany({
        data: [
            { id: 1, nom: 'Confirmé' },
            { id: 2, nom: 'Probable' },
            { id: 3, nom: 'À l\'étude' },
        ],
        skipDuplicates: true,
    })

    // Tailles Projet
    await prisma.tailleProjet.createMany({
        data: [
            { id: 1, nom: 'Petit' },
            { id: 2, nom: 'Moyen' },
            { id: 3, nom: 'Grand' },
        ],
        skipDuplicates: true,
    })

    // Équipements
    await prisma.equipement.createMany({
        data: [
            { id: 1, nom: 'Bulldozer' },
            { id: 2, nom: 'Pelle' },
            { id: 3, nom: 'Grue' },
            { id: 4, nom: 'Camion' },
            { id: 5, nom: 'Groupe électrogène' },
            { id: 6, nom: 'Chargeuse' },
        ],
        skipDuplicates: true,
    })

    // Produits
    await prisma.produit.createMany({
        data: [
            { id: 1, nom: 'Gasoil' },
            { id: 2, nom: 'Essence' },
            { id: 3, nom: 'Lubrifiant' },
            { id: 4, nom: 'Bitume' },
            { id: 5, nom: 'Autre' },
        ],
        skipDuplicates: true,
    })

    // Modes Approvisionnement
    await prisma.modeApprovisionnement.createMany({
        data: [
            { id: 1, nom: 'Station-service' },
            { id: 2, nom: 'Livraison directe' },
            { id: 3, nom: 'Cuve interne' },
            { id: 4, nom: 'Cuve MRS' },
            { id: 5, nom: 'Mixte' },
        ],
        skipDuplicates: true,
    })

    // Types Relation
    await prisma.typeRelation.createMany({
        data: [
            { id: 1, nom: 'Comptant' },
            { id: 2, nom: 'Crédit' },
            { id: 3, nom: 'Contrat' },
            { id: 4, nom: 'Appel d\'offres' },
        ],
        skipDuplicates: true,
    })

    // Satisfaction
    await prisma.satisfaction.createMany({
        data: [
            { id: 1, nom: 'Bonne' },
            { id: 2, nom: 'Moyenne' },
            { id: 3, nom: 'Faible' },
        ],
        skipDuplicates: true,
    })

    // Niveau Opportunité
    await prisma.niveauOpportunite.createMany({
        data: [
            { id: 1, nom: 'Faible' },
            { id: 2, nom: 'Moyenne' },
            { id: 3, nom: 'Forte' },
        ],
        skipDuplicates: true,
    })

    // Fenêtre Entrée
    await prisma.fenetreEntree.createMany({
        data: [
            { id: 1, nom: 'Immédiate' },
            { id: 2, nom: 'Court terme' },
            { id: 3, nom: 'Moyen terme' },
        ],
        skipDuplicates: true,
    })

    // Priorité
    await prisma.priorite.createMany({
        data: [
            { id: 1, nom: 'Haute' },
            { id: 2, nom: 'Moyenne' },
            { id: 3, nom: 'Basse' },
        ],
        skipDuplicates: true,
    })

    // Types Action
    await prisma.typeAction.createMany({
        data: [
            { id: 1, nom: 'Relance commerciale' },
            { id: 2, nom: 'Proposition prix' },
            { id: 3, nom: 'Proposition crédit' },
            { id: 4, nom: 'Visite Direction' },
            { id: 5, nom: 'Suivi commercial' },
        ],
        skipDuplicates: true,
    })

    // Create a default commercial user
    const bcrypt = require('bcrypt')
    const password_hash = await bcrypt.hash('Mrs@Corlay', 10)

    await prisma.user.upsert({
        where: { email: 'admin@mist.com' },
        update: {},
        create: {
            nom: 'Admnistrateur',
            prenom: 'Admin',
            email: 'admin@mist.com',
            role: 'Administrateur',
            password_hash,
        },
    })

    console.log('Database seeded successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
