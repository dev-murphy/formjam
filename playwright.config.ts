import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

// Target URL for the tests. Defaults to the local dev server; set BASE_URL to a
// deployed URL to run the suite against that environment instead.
const baseURL = process.env.BASE_URL ?? "http://localhost:5173";
const isLocalTarget =
  baseURL.includes("localhost") || baseURL.includes("127.0.0.1");

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL,
    trace: "on-first-retry",
  },

  // Only start a local dev server when targeting localhost. When BASE_URL points
  // at a deployed environment, run against it directly (no server to wait on, so
  // it can't time out waiting for one).
  webServer: isLocalTarget
    ? {
        command: "pnpm dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,

  projects: [
    // Logs in once and saves the session; runs before everything else.
    // Its `teardown` project runs once after the whole suite finishes.
    { name: "setup", testMatch: /auth\.setup\.ts/, teardown: "cleanup" },

    // Deletes the real records the tests create (runs after everything).
    { name: "cleanup", testMatch: /cleanup\.teardown\.ts/ },

    // Unauthenticated specs (auth flows, public UI) — fresh context each test.
    {
      name: "chromium",
      testIgnore: /dashboard\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },

    // Authenticated specs — reuse the saved session instead of logging in.
    {
      name: "chromium-dashboard",
      testMatch: /dashboard\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
});
