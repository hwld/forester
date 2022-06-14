import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  await db.user.create({
    data: {
      username: "user",
      // passwd
      passwordHash:
        "$2a$10$23npgq4g421e70Nc/aS5gOB4cSYw6zyHV6PvAct9atdxU71nHjywW",
    },
  });
}

seed();
