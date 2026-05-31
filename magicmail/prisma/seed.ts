import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { seedDemoDataFor } from "../src/lib/seed-user";

// Creates a ready-to-use demo account:  demo@kriskringlemail.com / magicmail
async function main() {
  const email = "demo@kriskringlemail.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  const user =
    existing ??
    (await prisma.user.create({
      data: {
        email,
        name: "Demo Sender",
        passwordHash: await bcrypt.hash("magicmail", 10),
        plan: "pro",
      },
    }));
  await seedDemoDataFor(user.id);
  console.log(`✓ Demo account ready: ${email} / magicmail`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
