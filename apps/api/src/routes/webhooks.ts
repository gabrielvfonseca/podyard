import type { Handler } from "hono";
import { auth } from "./webhooks/auth";
import { payments } from "./webhooks/payments";

export const webhooks: {
  auth: Handler;
  payments: Handler;
} = {
  auth,
  payments,
};
