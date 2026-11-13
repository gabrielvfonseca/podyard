import type { Context } from "hono";

export const health = (c: Context) => {
  return c.text("OK", 200);
};
