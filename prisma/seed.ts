import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

const main = async () => {
  const adminUser = await auth.api.signUpEmail({
    body: {
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      department: "administration",
      role: "admin",
    },
  });

  const itUser = await auth.api.signUpEmail({
    body: {
      name: "IT User",
      email: "it@example.com",
      password: "password123",
      department: "it",
      role: "user",
    },
  });

  const salesUser = await auth.api.signUpEmail({
    body: {
      name: "Sales User",
      email: "sales@example.com",
      password: "password123",
      department: "sales",
      role: "user",
    },
  });

  const adminApiKey = await auth.api.createApiKey({
    body: {
      userId: adminUser.user.id,
    },
  });

  const itApiKey = await auth.api.createApiKey({
    body: {
      userId: itUser.user.id,
    },
  });

  const salesApiKey = await auth.api.createApiKey({
    body: {
      userId: salesUser.user.id,
    },
  });

  const document = await prisma.document.create({
    data: {
      title: "Private Document",
      content: "Top secret shit",
      createdByUserId: adminUser.user.id,
      documentAccesses: {
        createMany: {
          data: [
            {
              accessLevel: "WRITE",
              userId: itUser.user.id,
            },
            {
              accessLevel: "READ",
              userId: salesUser.user.id,
            },
          ],
        },
      },
    },
  });

  console.log("Admin User API Key:", adminApiKey.key);
  console.log("IT User API Key:", itApiKey.key);
  console.log("Sales User API Key:", salesApiKey.key);
  console.log("Document created with ID:", document.id);
};

main()
  .then(() => {
    console.log("Seeding completed successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.log("Error seeding database:", error);
    process.exit(1);
  });
