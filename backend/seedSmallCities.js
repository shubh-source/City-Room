const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mockRooms = [
  {
    title: "Cozy 1 RK Near Station",
    address: "Civil Lines, Kanpur, Uttar Pradesh",
    city: "Kanpur",
    rent: 4500,
    advance: 9000,
    type: "1 RK",
    amenities: "Fan, Light, Bed, Water",
    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80"],
    status: "vacant"
  },
  {
    title: "Student Single Room",
    address: "Kalyanpur, Kanpur, Uttar Pradesh",
    city: "Kanpur",
    rent: 3000,
    advance: 3000,
    type: "Single Room",
    amenities: "Fan, Table, Chair",
    photos: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80"],
    status: "vacant"
  },
  {
    title: "Family 2 BHK",
    address: "Friends Colony, Etawah, Uttar Pradesh",
    city: "Etawah",
    rent: 8000,
    advance: 16000,
    type: "2 BHK",
    amenities: "Parking, Balcony, Semi-furnished",
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?w=500&q=80"],
    status: "vacant"
  },
  {
    title: "1 BHK For Working Professionals",
    address: "Gomti Nagar, Lucknow, Uttar Pradesh",
    city: "Lucknow",
    rent: 12000,
    advance: 24000,
    type: "1 BHK",
    amenities: "AC, Geyser, Modular Kitchen",
    photos: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500&q=80"],
    status: "vacant"
  },
  {
    title: "Affordable Single Room",
    address: "Makarand Nagar, Kannauj, Uttar Pradesh",
    city: "Kannauj",
    rent: 2500,
    advance: 2500,
    type: "Single Room",
    amenities: "Basic",
    photos: ["https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=500&q=80"],
    status: "vacant"
  },
  {
    title: "Spacious 1 BHK",
    address: "Lalbagh, Sitapur, Uttar Pradesh",
    city: "Sitapur",
    rent: 5500,
    advance: 11000,
    type: "1 BHK",
    amenities: "Parking, Water Supply",
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80"],
    status: "vacant"
  }
];

async function main() {
  console.log("Seeding Database with Small Cities data...");
  
  // We need a dummy owner to link these rooms to. 
  // Let's create or find one.
  let owner = await prisma.user.findFirst({ where: { role: 'owner' } });
  
  if (!owner) {
    owner = await prisma.user.create({
      data: {
        name: "Test Owner",
        email: "owner@test.com",
        phone: "9999999999",
        role: "owner",
        isVerified: true
      }
    });
  }

  for (const room of mockRooms) {
    const created = await prisma.room.create({
      data: {
        ...room,
        amenities: room.amenities.split(', '),
        ownerId: owner.id
      }
    });
    console.log(`Created Room: ${created.title} in ${created.city}`);
  }

  console.log("Seeding Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
