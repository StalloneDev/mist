
import { Client } from "pg";

async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_6UIq4LfpPlMG@ep-late-surf-ahasgdw8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require",
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to database.");

    // 1. Check ReportingVisite
    const resCount = await client.query('SELECT COUNT(*) FROM "ReportingVisite"');
    console.log("ReportingVisite count:", resCount.rows[0].count);

    const resSums = await client.query('SELECT SUM(volume_potentiel) as vol, SUM(volume_potentiel_dir) as vol_dir FROM "ReportingVisite"');
    console.log("ReportingVisite sums:", resSums.rows[0]);

    const sample = await client.query('SELECT raison_sociale, volume_potentiel, volume_potentiel_dir, secteur FROM "ReportingVisite" LIMIT 5');
    console.log("Sample records:", JSON.stringify(sample.rows, null, 2));

    // 2. Check Visite
    const resVisite = await client.query('SELECT COUNT(*) FROM "Visite"');
    console.log("Visite count:", resVisite.rows[0].count);

  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
