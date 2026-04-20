const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false } 
  });

  const models = [
    'User', 'Entreprise', 'Secteur', 'Contact', 'Visite', 
    'TypeCollecte', 'Projet', 'StatutProjet', 'TailleProjet', 
    'Equipement', 'ProjetEquipement', 'Produit', 'Consommation', 
    'ModeApprovisionnement', 'Fournisseur', 'ProjetFournisseur', 
    'TypeRelation', 'Satisfaction', 'Opportunite', 'NiveauOpportunite', 
    'FenetreEntree', 'Priorite', 'ActionCommerciale', 'TypeAction', 
    'ReportingVisite', 'RendezVous', 'SuiviAction'
  ];

  try {
    for (const modelName of models) {
      console.log(`Checking sequence for ${modelName}...`);
      const res = await pool.query(`SELECT MAX(id) as max_id FROM "${modelName}"`);
      const maxId = res.rows[0].max_id;
      
      if (maxId) {
        await pool.query(`SELECT setval('"${modelName}_id_seq"', ${maxId}, true)`);
        console.log(`Reset ${modelName} sequence to ${maxId}`);
      } else {
        console.log(`No records in ${modelName}`);
      }
    }
    console.log("All sequences updated successfully.");
  } catch (error) {
    console.error("Error setting sequence:", error);
  } finally {
    await pool.end();
  }
}

main();
