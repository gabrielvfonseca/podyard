import { database } from "@podyard/database";
import type { Context } from "hono";

export const cron = async (c: Context) => {
  const newPage = await database.page.create({
    data: {
      name: "cron-temp",
    },
  });

  await database.page.delete({
    where: {
      id: newPage.id,
    },
  });

  return c.text("OK", 200);
};
