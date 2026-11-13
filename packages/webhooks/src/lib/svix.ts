import "server-only";
import { getSession } from "@podyard/auth/server";
import { Svix } from "svix";
import { keys } from "../keys";

const svixToken = keys().SVIX_TOKEN;

/**
 * Resolve the application identity from the current session.
 * better-auth has no org concept yet (teams/orgs are a [DECIDE] item),
 * so the signed-in user's id stands in for the application uid.
 */
const resolveAppUid = async (headers: Headers): Promise<string | null> => {
  const session = await getSession(headers);
  return session?.user.id ?? null;
};

export const send = async (
  eventType: string,
  payload: object,
  headers: Headers
) => {
  if (!svixToken) {
    throw new Error("SVIX_TOKEN is not set");
  }

  const appUid = await resolveAppUid(headers);
  if (!appUid) {
    return;
  }

  const svix = new Svix(svixToken);
  return svix.message.create(appUid, {
    eventType,
    payload: {
      eventType,
      ...payload,
    },
    application: {
      name: appUid,
      uid: appUid,
    },
  });
};

export const getAppPortal = async (headers: Headers) => {
  if (!svixToken) {
    throw new Error("SVIX_TOKEN is not set");
  }

  const appUid = await resolveAppUid(headers);
  if (!appUid) {
    return;
  }

  const svix = new Svix(svixToken);
  return svix.authentication.appPortalAccess(appUid, {
    application: {
      name: appUid,
      uid: appUid,
    },
  });
};
