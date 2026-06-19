import { test as setup } from "@playwright/test";
import { login } from "./helpers";

// Authenticate once, before the rest of the suite runs, and persist the
// session to storageState. Tests that need an authenticated user (dashboard)
// reuse this state instead of logging in through the UI on every test — which
// previously caused flaky failures when many real auth requests from
// auth.spec.ts hit PocketBase in parallel and one got rate-limited/cancelled.
//
// This runs as a dependency of the other projects, so the single login here
// happens in isolation (no parallel auth load) and is reliable. When the
// USER_EMAIL/USER_PASSWORD env vars are absent we still write an (empty,
// unauthenticated) state file so the dependent project can load; the dashboard
// tests skip themselves in that case.
const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  if (process.env.USER_EMAIL && process.env.USER_PASSWORD) {
    await login(page);
  }
  await page.context().storageState({ path: authFile });
});
