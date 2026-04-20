import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
    const entreprise = await db.entreprise.findFirst({
        where: { raison_sociale: { equals: 'TOTO', mode: 'insensitive' } },
        select: { id: true, raison_sociale: true }
    });

    if (!entreprise) {
        console.log('❌ Aucune entreprise "TOTO" trouvée en base de données.');
        return;
    }

    console.log(`✅ Entreprise trouvée : ${entreprise.raison_sociale} (ID: ${entreprise.id})`);

    const result = await db.suiviAction.deleteMany({
        where: { entreprise_id: entreprise.id }
    });

    console.log(`✅ ${result.count} action(s) supprimée(s) pour ${entreprise.raison_sociale}`);
}

main().catch(console.error).finally(() => db.$disconnect());
