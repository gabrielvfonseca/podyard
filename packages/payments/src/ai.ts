import { StripeAgentToolkit } from "@stripe/agent-toolkit/ai-sdk";
import { keys } from "./keys";

const { STRIPE_SECRET_KEY } = keys();

export const paymentsAgentToolkit = STRIPE_SECRET_KEY
  ? new StripeAgentToolkit({
      secretKey: STRIPE_SECRET_KEY,
      configuration: {
        context: {
          mode: "toolkit",
        },
      },
    })
  : undefined;

// NOTE: The Stripe Agent Toolkit v0.9.0 `Configuration` type is
// `{ context?: { account?, customer?, mode? } }`. The previous code
// passed an `actions: { defaultAccount }` block that does not exist in
// this version's type. If you need to pin a default Stripe account,
// pass it via `configuration.context.account`.
