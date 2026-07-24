import vinext from "vinext";
import { defineConfig, loadEnv } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async ({ mode }) => {
  const configuredEnv = loadEnv(mode, process.cwd(), "");
  // Older copies of this project stored local credentials in .env.example.
  // Keep that working locally, while preferring the standard .env.local file.
  const legacyExampleEnv = loadEnv("example", process.cwd(), "");
  const razorpayKeyId =
    configuredEnv.RAZORPAY_KEY_ID || legacyExampleEnv.RAZORPAY_KEY_ID;
  const razorpayKeySecret =
    configuredEnv.RAZORPAY_KEY_SECRET || legacyExampleEnv.RAZORPAY_KEY_SECRET;
  const razorpayMonthlyTotalCount =
    configuredEnv.RAZORPAY_MONTHLY_TOTAL_COUNT ||
    legacyExampleEnv.RAZORPAY_MONTHLY_TOTAL_COUNT;
  const adminUsername =
    configuredEnv.ADMIN_USERNAME;
  const adminPassword =
    configuredEnv.ADMIN_PASSWORD;
  const adminSessionSecret =
    configuredEnv.ADMIN_SESSION_SECRET;
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: {
          ...localBindingConfig,
          vars: {
            ...(razorpayKeyId ? { RAZORPAY_KEY_ID: razorpayKeyId } : {}),
            ...(razorpayKeySecret
              ? { RAZORPAY_KEY_SECRET: razorpayKeySecret }
              : {}),
            ...(razorpayMonthlyTotalCount
              ? { RAZORPAY_MONTHLY_TOTAL_COUNT: razorpayMonthlyTotalCount }
              : {}),
            ...(adminUsername ? { ADMIN_USERNAME: adminUsername } : {}),
            ...(adminPassword ? { ADMIN_PASSWORD: adminPassword } : {}),
            ...(adminSessionSecret
              ? { ADMIN_SESSION_SECRET: adminSessionSecret }
              : {}),
          },
        },
      }),
    ],
  };
});
