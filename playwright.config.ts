import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

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
    baseURL: process.env.BASE_URL ?? "http://localhost:5173",
    trace: "on-first-retry",
  },

  webServer: {
    command: "pnpm dev",
    url: process.env.BASE_URL ?? "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

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
