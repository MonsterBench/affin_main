import "server-only";
import bcrypt from "bcryptjs";
import { cache } from "react";
import { prisma } from "./prisma";
import { getSession } from "./session";

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Cached per request so multiple components can call it without re-querying.
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session?.userId) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
});

export async function requireUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.userId ?? null;
}
