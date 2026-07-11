const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  let owner = await prisma.user.findFirst({ where: { role: 'owner' } });
  if (!owner) {
    owner = await prisma.user.create({
      data: {
        phone: '+919999999998',
        role: 'owner',
        name: 'Sitapur Owner',
        isVerified: true
      }
    });
  }

  const rooms = [
    {
      title: 'Spacious 2 BHK near Lalbagh',
      address: 'Lalbagh, Sitapur',
      city: 'Sitapur',
      rent: 6500,
      advance: 6500,
      type: '2 BHK',
      photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
      amenities: ['Wi-Fi', 'Parking', '24x7 Water'],
      rating: 4.5,
      ownerId: owner.id
    },
    {
      title: 'Cozy 1 RK in Tareenpur',
      address: 'Tareenpur, Sitapur',
      city: 'Sitapur',
      rent: 3000,
      advance: 3000,
      type: '1 RK',
      photos: ['https://images.unsplash.com/photo-1502672260266-1c1cd2cb94bd?auto=format&fit=crop&q=80&w=800'],
      amenities: ['Attached Washroom'],
      rating: 4.2,
      ownerId: owner.id
    },
    {
      title: 'Single Room near Bus Stand',
      address: 'Bus Stand, Sitapur',
      city: 'Sitapur',
      rent: 2500,
      advance: 2500,
      type: 'Single Room',
      photos: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800'],
      amenities: ['Balcony'],
      rating: 4.0,
      ownerId: owner.id
    }
  ];

  for (const room of rooms) {
    await prisma.room.create({ data: room });
  }
  
  console.log("Seeded 3 rooms in Sitapur!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
