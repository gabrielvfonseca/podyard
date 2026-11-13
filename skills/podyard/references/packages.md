# Packages

All packages live in `/packages/` and are imported as `@podyard/<name>`.

## Authentication (`@podyard/auth`)

**Provider**: Better Auth

Handles user authentication, organization management, and session handling.

**Key exports**:
- `AuthProvider` — wrapped inside `DesignSystemProvider`
- Auth components: `<SignIn>`, `<SignUp>`, `<UserButton>`, `<OrganizationSwitcher>` (stub)

**Webhooks**: Auth lifecycle events can be posted to `POST /api/webhooks/auth` (handled in the `api` app).

**Swappable to**: Supabase Auth, Auth.js, Better Auth.

## Database (`@podyard/database`)

**ORM**: Drizzle
**Default provider**: Neon PostgreSQL

**Key exports**:
- `database` — Drizzle client instance
- `schema` — Drizzle table definitions

**Usage**:
```typescript
import { database, user } from '@podyard/database';
import { eq } from 'drizzle-orm';
const users = await database.select().from(user).where(eq(user.id, id));
```

**Schema**: `packages/database/src/schema.ts`
**Migrations**: `bun run migrate` (generate → migrate)

**Swappable to**: PlanetScale, Supabase, Turso, EdgeDB, Prisma Postgres.

## Payments (`@podyard/payments`)

**Provider**: Stripe

**Key exports**:
- `stripe` — Stripe client instance (optional chaining: `stripe?.prices.list()`)

**Features**: Subscriptions, one-time payments, Stripe Radar fraud prevention.

**Webhooks**: `POST /api/webhooks/payments` handles Stripe events (payment success, subscription changes, etc.).

**Swappable to**: Paddle, Lemon Squeezy.

## Email (`@podyard/email`)

**Provider**: Resend + React Email

**Key exports**:
- `resend` — Resend client instance

**Usage**:
```typescript
import { resend } from '@podyard/email';
import { WelcomeEmail } from '@podyard/email/templates/welcome';

await resend?.emails.send({
  from: 'hello@example.com',
  to: 'user@example.com',
  subject: 'Welcome',
  react: <WelcomeEmail />,
});
```

**Templates**: React components in the email package. Preview at `http://localhost:3003`.

## CMS (`@podyard/cms`)

**Provider**: BaseHub

**Key exports**:
- `Feed`, `Body`, `TableOfContents`, `Image`, `Toolbar` — content rendering components

**Setup**: Fork the `basehub/podyard` template, generate a Read Token, set `BASEHUB_TOKEN`.

**Features**: Type-safe content queries, Draft Mode preview, on-demand revalidation via webhooks.

**Swappable to**: Content Collections.

## Design System (`@podyard/design-system`)

**Library**: shadcn/ui (New York style, neutral colors)

**Key exports**:
- `DesignSystemProvider` — wraps tooltip, toast, analytics, auth, and theme providers
- Full component library (Button, Dialog, Form, Table, etc.)
- Font configuration
- Utility hooks

**Add components**:
```bash
npx shadcn@latest add [component] -c packages/design-system
```

**Update components**:
```bash
bun run bump-ui
```

**Dark mode**: Integrated via `next-themes`. The provider handles theme switching.

## Analytics (`@podyard/analytics`)

**Web analytics**: Vercel Web Analytics (enable in dashboard), Google Analytics (via `NEXT_PUBLIC_GA_MEASUREMENT_ID`).

**Product analytics**: PostHog (default).

**Key exports**:
- `analytics` from `@podyard/analytics/server` — server-side tracking
- `analytics` from `@podyard/analytics/posthog/client` — client-side tracking

**Usage**:
```typescript
import { analytics } from '@podyard/analytics/server';
analytics?.capture({ event: 'user_signed_up', distinctId: userId });
```

**Ad-blocker bypass**: PostHog requests are reverse-proxied through Next.js rewrites (`/ingest/*`).

## Observability (`@podyard/observability`)

**Error tracking**: Sentry — captures exceptions and performance data.

**Logging**: BetterStack Logs in production, console in development.

**Key exports**:
- `log` from `@podyard/observability/log` — logging interface (`log.info()`, `log.error()`, etc.)
- Sentry configuration via `instrumentation.ts` and `sentry.client.config.ts`

**Uptime monitoring**: BetterStack integration.

**Sentry tunneling**: Requests proxied through rewrites to bypass ad-blockers.

## Storage (`@podyard/storage`)

**Provider**: Vercel Blob

**Key exports**:
- `put` from `@podyard/storage` — server-side upload
- `upload` from `@podyard/storage/client` — client-side upload

**Note**: Server uploads are limited to 4.5MB. Use client uploads for larger files.

## Security (`@podyard/security`)

**Provider**: Arcjet

**Features**: Bot detection, Shield WAF (SQL injection, XSS, OWASP Top 10 prevention), rate limiting, IP geolocation.

**Configuration**: Central client at `@podyard/security`, extended per app with specific rules.

**Bot policy**: Allows search engines and preview generators; blocks scrapers and AI crawlers.

**Web app**: Security middleware runs on all non-static routes.
**Main app**: Security checks in the authenticated layout.

**Usage**:
```typescript
const decision = await aj.protect(request);
if (decision.isDenied()) {
  // handle denial
}
```

## SEO (`@podyard/seo`)

**Key exports**:
- `createMetadata` from `@podyard/seo/metadata` — generates Next.js metadata with deep merge

**Usage**:
```typescript
import { createMetadata } from '@podyard/seo/metadata';
export const metadata = createMetadata({
  title: 'Page Title',
  description: 'Page description',
});
```

**Sitemap**: Auto-generated at build time. Scans `/app`, `/content/blog`, `/content/legal`. Filters `_` and `()` directories.

**JSON-LD**: Structured data support for search engines.

**Security headers**: Nosecone integration via `@podyard/security/middleware`.

## Feature Flags (`@podyard/feature-flags`)

**System**: Vercel Flags SDK + PostHog

**Define flags** in `packages/feature-flags/index.ts`:
```typescript
export const myFlag = createFlag('myFlagKey');
```

**Usage**:
```typescript
const isEnabled = await myFlag();
```

Flags require an authenticated user context. Override flags in development via the Vercel Toolbar.

## Internationalization (`@podyard/internationalization`)

**Provider**: Languine

**Configuration**: `languine.json` defines source and target locales.

**Dictionaries**: TypeScript files per locale. Non-source locales are auto-translated.

**Usage**:
```typescript
const dict = await getDictionary(locale);
```

**Routing**: Language-specific paths (`/en/about`, `/fr/about`) with automatic language detection.

**Middleware**: `internationalizationMiddleware` configured for the `web` app.

**Translate**: `bun run translate`

## Webhooks (`@podyard/webhooks`)

### Inbound
- **Stripe**: `POST /api/webhooks/payments` — payment and subscription events
- **Auth**: `POST /api/webhooks/auth` — user lifecycle events
- **Local testing**: Stripe CLI auto-forwards to localhost

### Outbound
**Provider**: Svix

**Key exports**:
- `webhooks.send(eventType, data)` — send a webhook event
- `webhooks.getAppPortal()` — get embeddable webhook management portal URL

Uses organization ID as the Svix app UID (stateless design).

## Cron Jobs (`@podyard/cron`)

**Platform**: Vercel Cron

**Location**: `apps/api/app/cron/[job-name]/route.ts`

**Configuration**: `apps/api/vercel.json`

```json
{ "path": "/cron/keep-alive", "schedule": "0 1 * * *" }
```

Cron routes must use the `GET` HTTP method. Test locally via direct HTTP GET.

## Notifications (`@podyard/notifications`)

**Provider**: Knock

**Key exports**:
- `notifications.workflows.trigger(workflowKey, { recipients, data })` — trigger a notification
- `<NotificationsTrigger>` — renders in-app notification feed

**Channels**: In-app, email, SMS, push, and chat — configured via Knock workflows.

## Collaboration (`@podyard/collaboration`)

**Provider**: Liveblocks

**Features**: Real-time presence indicators, multiplayer document editing, threaded comments.

**Hooks**: `useOthers()`, `useStorage()`, `useMutation()`, `useThreads()`

**Components**: `<Thread>`, `<Composer>`, `<InboxNotification>`

**Editor integration**: Tiptap or Lexical for collaborative rich text editing.

Requires `LIVEBLOCKS_SECRET` environment variable.

## AI (`@podyard/ai`)

AI/LLM integration package for adding AI-powered features to the application.

## Rate Limit (`@podyard/rate-limit`)

Rate limiting utilities used in conjunction with `@podyard/security` for request throttling.

## Next Config (`@podyard/next-config`)

Shared Next.js configuration applied across apps:
- Image optimization (AVIF, WebP)
- Auth-related image domain patterns (if configured)
- Drizzle ORM webpack compatibility for monorepo builds
- PostHog reverse proxy rewrites (`/ingest/*`)
- OpenTelemetry webpack compatibility fix
- Bundle analyzer support

## TypeScript Config (`@podyard/typescript-config`)

Shared TypeScript configurations extended by all apps and packages.
