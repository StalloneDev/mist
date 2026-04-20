
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    const reportingCount = await prisma.reportingVisite.count();
    const totalVolume = await prisma.reportingVisite.aggregate({
      _sum: { volume_potentiel: true }
    });
    console.log("ReportingVisite count:", reportingCount);
    console.log("Total Volume from ReportingVisite:", totalVolume._sum.volume_potentiel);
    
    const manualCount = await prisma.visite.count();
    console.log("Manual Visite count:", manualCount);
  } catch (e) {
    console.error("Error checking database:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
