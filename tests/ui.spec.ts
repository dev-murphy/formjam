import { test, expect } from "@playwright/test";

test.describe("UI Tests", () => {
  test("should be able to toggle theme button", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.locator('[data-cy="theme_toggle"] input'),
    ).not.toBeChecked();
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    await page.locator('[data-cy="theme_toggle"]').click();

    await expect(page.locator('[data-cy="theme_toggle"] input')).toBeChecked();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("should have specific content on home page", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('[data-cy="home_login_btn"]')).toBeVisible();
    await expect(page.locator('[data-cy="home_signup_btn"]')).toBeVisible();
    await expect(page.locator('[data-cy="theme_toggle"]')).toBeVisible();

    await expect(page.locator("h2").first()).toContainText("Welcome to FormJAM");
    await expect(page.locator("h2").last()).toContainText(
      "Revolutionize Your Data Collection",
    );
  });
});
