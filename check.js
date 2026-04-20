const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.entreprise.count().then(c => {
    console.log('Total Entreprises in DB:', c);
}).finally(() => prisma.$disconnect());
