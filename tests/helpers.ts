import { Page, Response, expect } from "@playwright/test";

// Email domain used for accounts created by the signup tests, so the cleanup
// teardown can identify and sweep them without touching real users.
export const TEST_EMAIL_DOMAIN = "formjam-e2e.test";

// Clicks the login submit button and returns the auth-with-password response,
// transparently retrying past PocketBase's 429 ("Too Many Requests") responses
// with linear backoff. The suite fires many real logins in parallel, which trips
// the auth endpoint's rate limiter; without this, an otherwise-valid login (or
// the expected-400 failure test) flakes whenever it draws the 429.
export async function submitLoginForm(page: Page): Promise<Response> {
  const maxAttempts = 6;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/collections/users/auth-with-password") &&
        resp.request().method() === "POST",
      { timeout: 15_000 },
    );
    await page.locator('[data-cy="login_submit_btn"]').click();
    const response = await responsePromise;

    if (response.status() !== 429 || attempt === maxAttempts) return response;
    await page.waitForTimeout(500 * attempt); // back off, then resubmit
  }
  // Unreachable: the loop always returns on the final attempt.
  throw new Error("submitLoginForm: exhausted retries");
}

export async function login(
  page: Page,
  email?: string,
  password?: string,
  userExists = true,
) {
  const userEmail = email ?? process.env.USER_EMAIL!;
  const userPassword = password ?? process.env.USER_PASSWORD!;

  await page.goto("/");
  await page.locator('[data-cy="home_login_btn"]').click();
  await expect(page).toHaveURL(/\/auth\/login/);

  await page.locator('[data-cy="login_email_input"]').clear();
  await page.locator('[data-cy="login_email_input"]').fill(userEmail);
  await page.locator('[data-cy="login_password_input"]').fill(userPassword);

  const response = await submitLoginForm(page);

  if (userExists) {
    expect(response.status()).toBe(200);
    await expect(page).toHaveURL(/\/dashboard/);
  }
}

export async function logout(page: Page) {
  await page.goto("/");
  await expect(page).toHaveURL(/\/dashboard/);

  await page.locator('[data-cy="navbar_open_menu"]').first().click();
  await page.locator('[data-cy="dashboard_logout_btn"]').click();
  await expect(page).toHaveURL(/\/auth\/login/);
}

export async function validatePasswordInput(
  page: Page,
  dataAttrs: string,
  fieldName: string,
) {
  await page.locator(`[data-cy="${dataAttrs}"]`).fill("123");
  await expect(page.locator(`[data-cy="${dataAttrs}_error"]`)).toContainText(
    fieldName + " must be at least 8 characters",
  );

  await page
    .locator(`[data-cy="${dataAttrs}"]`)
    .fill("oVr32EB1b,KQe8oz#2JtD]5AOh@");
  await expect(page.locator(`[data-cy="${dataAttrs}_error"]`)).toContainText(
    fieldName + " must be at most 25 characters",
  );

  await page.locator(`[data-cy="${dataAttrs}"]`).fill("");
  await expect(page.locator(`[data-cy="${dataAttrs}_error"]`)).toContainText(
    fieldName + " is required",
  );
}

export async function validateConfirmPasswordInput(
  page: Page,
  dataAttrs: string,
  passwordDataAttrs: string,
  fieldName: string,
) {
  await page.locator(`[data-cy="${passwordDataAttrs}"]`).fill("123");
  await page.locator(`[data-cy="${passwordDataAttrs}"]`).fill("");
  await page.locator(`[data-cy="${dataAttrs}"]`).fill("123");
  await page.locator(`[data-cy="${dataAttrs}"]`).fill("");
  await expect(page.locator(`[data-cy="${dataAttrs}_error"]`)).toContainText(
    fieldName + " is required",
  );

  await page
    .locator(`[data-cy="${dataAttrs}"]`)
    .fill("oVr32EB1b,KQe8oz#2JtD]5AOh@");
  await expect(page.locator(`[data-cy="${dataAttrs}_error"]`)).toContainText(
    fieldName + " must match ",
  );
}
