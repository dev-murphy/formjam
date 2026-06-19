import { test, expect } from "@playwright/test";

const apiUrl = process.env.VITE_POCKET_BASE ?? process.env.API_URL ?? "";

// Dashboard tests share real data state, so run them serially
test.describe.configure({ mode: "serial" });

test.describe("Dashboard tests", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !process.env.USER_EMAIL || !process.env.USER_PASSWORD,
      "Requires USER_EMAIL and USER_PASSWORD env vars",
    );
    // Already authenticated via the saved storageState (see auth.setup.ts),
    // so we land straight on the dashboard without a UI login.
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);
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
    const mockForm = {
      id: "mock-form-id",
      title: "Test Form",
      description: "",
      view: "list",
      starred: false,
      questions: [],
      preview_link: "",
      link: "",
      user: "mock-user-id",
      collectionId: "mock-coll-id",
      collectionName: "forms",
      created: "2024-01-01T00:00:00.000Z",
      updated: "2024-01-01T00:00:00.000Z",
    };

    await page.route(`${apiUrl}/api/collections/forms/records*`, (route) => {
      if (route.request().method() === "DELETE") {
        route.fulfill({ status: 204, body: "" });
      } else {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            page: 1,
            perPage: 500,
            totalItems: 1,
            totalPages: 1,
            items: [mockForm],
          }),
        });
      }
    });

    await page.reload();

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
