// // prisma/seed.ts

// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function main() {
//   // Create 20 users
//   const users = await prisma.user.createMany({
//     data: Array.from({ length: 20 }).map((_, i) => ({
//       email: `user${i + 1}@example.com`,
//       password: `hashedPassword${i + 1}`, // Ideally, use a real hashed password
//       fullName: `User Fullname ${i + 1}`,
//       firstName: `User${i + 1}`,
//       lastName: `Last${i + 1}`,
//       nicNum: `NIC123456789${i + 1}`,
//       contact: `07712345${(i + 1).toString().padStart(2, '0')}`,
//       dateofBirth: new Date(`199${i % 10}-01-01`),
//       gender: i % 2 === 0 ? 'Male' : 'Female',
//       district: `District${(i % 5) + 1}`,
//     })),
//     skipDuplicates: true,
//   });

//   // Now fetch all created users
//   const allUsers = await prisma.user.findMany();

//   // Add a Player record for each user
//   for (const user of allUsers) {
//     await prisma.player.create({
//       data: {
//         userId: user.id,
//         weight: 70 + (user.id % 10),
//         height: 160 + (user.id % 10),
//         idType: "NIC",
//         idFrontImage: `front_${user.id}.jpg`,
//         idBackImage: `back_${user.id}.jpg`,
//         closeClub: `Close Club ${user.id}`,
//         openClub: `Open Club ${user.id}`,
//         regDate: new Date(),
//         regExpDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
//       },
//     });

//     // Optional: Add a Payment record for each user
//     await prisma.payment.create({
//       data: {
//         userId: user.id,
//         slipImage: `slip_${user.id}.jpg`,
//         referenceNo: `REF${1000 + user.id}`,
//         status: user.id % 2 === 0 ? 'approved' : 'pending',
//       },
//     });
//   }
// }

// main()
//   .then(() => console.log("Seeding complete!"))
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
