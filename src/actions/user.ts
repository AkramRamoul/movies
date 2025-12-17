import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import getSession from "./session";

export const getCurrentUser = async () => {
  try {
    const session = await getSession();
    if (!session?.user?.username) {
      return null;
    }
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, session?.user?.username))
      .limit(1);
    if (!currentUser) {
      return null;
    }
    return currentUser;
  } catch (error: unknown) {
    console.error(error);
    return null;
  }
};
