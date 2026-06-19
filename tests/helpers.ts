import { Page, expect } from "@playwright/test";

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
  await page.locator('[data-cy="login_submit_btn"]').click();

  if (userExists) {
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
