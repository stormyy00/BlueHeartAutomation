"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUser = async ({ id }: { id: string }) => {
  return await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
};
