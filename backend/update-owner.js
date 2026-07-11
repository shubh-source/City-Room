const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);

  await prisma.user.updateMany({
    where: { role: 'owner' },
    data: { subscriptionEnd: futureDate }
  });
  
  console.log("Updated all owners with active subscriptions!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
