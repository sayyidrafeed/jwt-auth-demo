import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { eq } from "drizzle-orm";

async function seed() {
  const email = "admin@gmail.com";
  const password = "admin123";

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) {
    console.log(`Admin ${email} already exists. Skipping seed.`);
    process.exit(0);
  }

  const passwordHash = await hashPassword(password);
  await db.insert(users).values({ email, passwordHash, role: "admin" });
  console.log(`Admin account created: ${email} / ${password}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
