import { test, expect } from "@playwright/test";
import { login } from "./helpers";

const apiUrl = process.env.API_URL!;

// Dashboard tests share real data state, so run them serially
test.describe.configure({ mode: "serial" });

test.describe("Dashboard tests", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("should have no forms", async ({ page }) => {
    await page.route(`${apiUrl}/api/collections/forms/records*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          page: 1,
          perPage: 500,
          totalItems: -1,
          totalPages: -1,
          items: [],
        }),
      }),
    );

    await page.reload();

    await expect(page.locator('[data-cy="create_form_card"]')).toBeVisible();
    await expect(page.locator('[data-cy="form_card"]')).not.toBeVisible();
  });

  test("should be able to create a new form", async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/collections/forms/records") &&
        resp.request().method() === "POST",
    );

    await page.locator('[data-cy="create_form_card"]').click();
    await responsePromise;
  });

  test("should be able to delete a form", async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/collections/forms/records/") &&
        resp.request().method() === "DELETE",
    );

    await page.locator('[data-cy="form_card_dropdown"]').first().click();
    await page.locator('[data-cy="form_card_delete_btn"]').first().click();
    await page.locator('[data-cy="dialog_confirm_delete_btn"]').click();
    await responsePromise;
  });
});
