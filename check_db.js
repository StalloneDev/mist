const { Pool } = require('pg');

async function checkEntreprises() {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false } 
  });

  try {
    const res = await pool.query(`SELECT count(*) FROM "Entreprise"`);
    console.log(`Nombre total d'entreprises: ${res.rows[0].count}`);
    
    if (parseInt(res.rows[0].count) > 0) {
        const top = await pool.query(`SELECT id, raison_sociale, statut FROM "Entreprise" LIMIT 5`);
        console.log("5 premières entreprises :");
        console.table(top.rows);
    }
  } catch (error) {
    console.error("Erreur :", error);
  } finally {
    await pool.end();
  }
}

checkEntreprises();
