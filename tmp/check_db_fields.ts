
import { Client } from "pg";

async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_6UIq4LfpPlMG@ep-late-surf-ahasgdw8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require",
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to database.");

    // 1. Check all numeric fields in ReportingVisite
    const resSums = await client.query(`
      SELECT 
        SUM(volume_potentiel) as vol_calc, 
        SUM(volume_potentiel_dir) as vol_dir,
        SUM(conso_mensuelle_estime) as conso_est,
        SUM(conso_mois) as conso_mois,
        COUNT(*) as total_rows
      FROM "ReportingVisite"
    `);
    console.log("ReportingVisite Stats:", JSON.stringify(resSums.rows[0], null, 2));

    const sample = await client.query('SELECT raison_sociale, volume_potentiel, volume_potentiel_dir, conso_mensuelle_estime, conso_mois FROM "ReportingVisite" WHERE conso_mensuelle_estime IS NOT NULL OR volume_potentiel IS NOT NULL LIMIT 5');
    console.log("Sample records with data:", JSON.stringify(sample.rows, null, 2));

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
