// import { hashPassword } from "../src/lib/bcrypt";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   const adminId = "admin";
//   const adminPassword = "admin123";

//   const existingAdmin = await prisma.admin.findUnique({
//     where: { username: adminId },
//   });

//   if (!existingAdmin) {
//     const hashedPassword = await hashPassword(adminPassword);
//     const admin = await prisma.admin.create({
//       data: {
//         id: crypto.randomUUID(),
//         username: adminId,
//         password_hash: hashedPassword,
//         name: "Administrator",
//       },
//     });
//     console.log("Admin created:", admin);
//   } else {
//     console.log("Admin already exists");
//   }
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
