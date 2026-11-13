import { database, page } from "@podyard/database";
import { eq } from "drizzle-orm";
import type { Context } from "hono";

export const cron = async (c: Context) => {
  const [newPage] = await database
    .insert(page)
    .values({ name: "cron-temp" })
    .returning({ id: page.id });

  await database.delete(page).where(eq(page.id, newPage.id));

  return c.text("OK", 200);
};
