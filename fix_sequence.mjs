import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const models = [
      'User', 'Entreprise', 'Secteur', 'Contact', 'Visite', 
      'TypeCollecte', 'Projet', 'StatutProjet', 'TailleProjet', 
      'Equipement', 'ProjetEquipement', 'Produit', 'Consommation', 
      'ModeApprovisionnement', 'Fournisseur', 'ProjetFournisseur', 
      'TypeRelation', 'Satisfaction', 'Opportunite', 'NiveauOpportunite', 
      'FenetreEntree', 'Priorite', 'ActionCommerciale', 'TypeAction', 
      'ReportingVisite', 'RendezVous', 'SuiviAction'
    ];

    for (const modelName of models) {
      console.log(`Checking sequence for ${modelName}...`);
      // We query the maximum ID
      const maxRecord = await prisma.$queryRawUnsafe(`SELECT MAX(id) as max_id FROM "${modelName}";`);
      const maxId = maxRecord[0]?.max_id || 0;
      
      if (maxId > 0) {
        // We set the sequence to match the max ID
        // Note: nextval will yield maxId + 1
        await prisma.$executeRawUnsafe(`SELECT setval('"${modelName}_id_seq"', ${maxId}, true);`);
        console.log(`Reset ${modelName} sequence to ${maxId}`);
      }
    }
    
    console.log("All sequences updated seamlessly.");
  } catch (error) {
    console.error("Error setting sequence:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
