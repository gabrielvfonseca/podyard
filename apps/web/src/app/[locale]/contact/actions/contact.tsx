"use server";

import { FrontalError } from "@frontal-labs/error";
import { resend } from "@podyard/email";
import { ContactTemplate } from "@podyard/email/templates/contact";
import { parseError } from "@podyard/observability/error";
import { createRateLimiter, slidingWindow } from "@podyard/rate-limit";
import { headers } from "next/headers";
import { env } from "@/env";

/**
 * Stable error codes for the contact form. Branch on these, never on
 * message text.
 */
const ContactErrorCodes = {
  RATE_LIMITED: "contact_rate_limited",
  EMAIL_NOT_CONFIGURED: "contact_email_not_configured",
  EMAIL_SEND_FAILED: "contact_email_send_failed",
} as const;

type ContactErrorCode =
  (typeof ContactErrorCodes)[keyof typeof ContactErrorCodes];

const CONTACT_SCOPE = "contact";

const raise = (
  message: string,
  options: {
    code: ContactErrorCode;
    statusCode: number;
    public: { message: string };
    cause?: unknown;
  }
): never => {
  throw new FrontalError(message, {
    scope: CONTACT_SCOPE,
    ...options,
  });
};

export const contact = async (
  name: string,
  email: string,
  message: string
): Promise<{
  error?: string;
}> => {
  try {
    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      const rateLimiter = createRateLimiter({
        limiter: slidingWindow(1, "1d"),
      });
      const head = await headers();
      const ip = head.get("x-forwarded-for");

      const { success } = await rateLimiter.limit(`contact_form_${ip}`);

      if (!success) {
        raise("Contact form rate limit exceeded", {
          code: ContactErrorCodes.RATE_LIMITED,
          statusCode: 429,
          public: {
            message:
              "You have reached your request limit. Please try again later.",
          },
        });
      }
    }

    if (!(resend && env.RESEND_FROM)) {
      raise("Email is not configured on this deployment", {
        code: ContactErrorCodes.EMAIL_NOT_CONFIGURED,
        statusCode: 503,
        public: { message: "The contact form is temporarily unavailable." },
      });
    }

    try {
      await resend.emails.send({
        from: env.RESEND_FROM,
        to: env.RESEND_FROM,
        subject: "Contact form submission",
        replyTo: email,
        react: <ContactTemplate email={email} message={message} name={name} />,
      });
    } catch (cause) {
      raise("Failed to send contact form email", {
        code: ContactErrorCodes.EMAIL_SEND_FAILED,
        statusCode: 502,
        cause,
        public: {
          message:
            "We could not send your message right now. Please try again.",
        },
      });
    }

    return {};
  } catch (error) {
    // parseError reports to Sentry and returns the public-safe message
    // (FrontalError.public.message when present).
    return { error: parseError(error) };
  }
};
