
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log("--- DATABASE DEBUG ---");
    
    // 1. Check counts
    const reportingCount = await prisma.reportingVisite.count();
    console.log("ReportingVisite count:", reportingCount);
    
    // 2. Check a few records
    const sample = await prisma.reportingVisite.findMany({ take: 3 });
    console.log("Sample ReportingVisite records (first 3):", JSON.stringify(sample, null, 2));
    
    // 3. Check aggregation
    const agg = await prisma.reportingVisite.aggregate({
      _sum: { volume_potentiel: true },
      _count: { _all: true }
    });
    console.log("Aggregation result:", JSON.stringify(agg, null, 2));
    
    // 4. Check manual visites
    const manualCount = await prisma.visite.count();
    console.log("Manual Visite count:", manualCount);
    
    const manualAgg = await prisma.opportunite.aggregate({
      _sum: { volume_potentiel: true }
    });
    console.log("Manual Opportunite sum:", manualAgg._sum.volume_potentiel);

  } catch (e: any) {
    console.error("DEBUG ERROR:", e.message);
    if (e.code) console.error("Error Code:", e.code);
  } finally {
    await prisma.$disconnect();
  }
}

main();
