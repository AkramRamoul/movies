// app/api/auth/register/route.ts
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const { email, username, password } = await req.json();

  if (!email || !username || !password) {
    return new Response("Missing fields", { status: 400 });
  }

  const [exists] = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.username, username)))
    .limit(1);

  if (exists) {
    return new Response("Username already taken", { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);

  await db.insert(users).values({
    email,
    username,
    password: hashed,
  });

  return new Response("User created", { status: 201 });
}
