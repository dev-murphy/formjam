import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import {
  login,
  logout,
  submitLoginForm,
  TEST_EMAIL_DOMAIN,
  validatePasswordInput,
  validateConfirmPasswordInput,
} from "./helpers";

const apiUrl = process.env.VITE_POCKET_BASE ?? process.env.API_URL ?? "";

test.describe("Login Tests", () => {
  test("should log in successfully", async ({ page }) => {
    test.skip(
      !process.env.USER_EMAIL || !process.env.USER_PASSWORD,
      "Requires USER_EMAIL and USER_PASSWORD env vars",
    );
    await login(page);
  });

  test("should fail to login", async ({ page }) => {
    await page.goto("/auth/login");
    await page.locator('[data-cy="login_email_input"]').fill("test@test.com");
    await page.locator('[data-cy="login_password_input"]').fill("password");

    const response = await submitLoginForm(page);
    expect(response.status()).toBe(400);

    await expect(
      page.locator('[data-cy="server_error_message"]'),
    ).toContainText("Failed to authenticate");
    await expect(
      page.locator('[data-cy="server_error_message"]'),
    ).not.toBeVisible({ timeout: 8000 });
  });

  test("should show email address validation error", async ({ page }) => {
    await page.goto("/auth/login");

    await page.locator('[data-cy="login_email_input"]').fill("test");
    await expect(
      page.locator('[data-cy="login_email_input_error"]'),
    ).toContainText("Your email must be valid");

    await page.locator('[data-cy="login_email_input"]').fill("");
    await expect(
      page.locator('[data-cy="login_email_input_error"]'),
    ).toContainText("Your email is required");
  });

  test("should show password validation error", async ({ page }) => {
    await page.goto("/auth/login");
    await validatePasswordInput(page, "login_password_input", "Your password");
  });

  test("should redirect to sign up page", async ({ page }) => {
    await page.goto("/auth/login");
    await page.locator('[data-cy="login_goto_signup_link"]').click();
    await expect(page).toHaveURL(/\/auth\/signup/);
  });

  test("should redirect to password reset page", async ({ page }) => {
    await page.goto("/auth/login");
    await page.locator('[data-cy="login_goto_password_reset_link"]').click();
    await expect(page).toHaveURL(/\/auth\/reset-your-password/);
  });

  test("should redirect to homepage", async ({ page }) => {
    await page.goto("/auth/login");
    await page.locator('[data-cy="login_goto_home_link"]').click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("Signup Tests", () => {
  test("should sign up successfully", async ({ page }) => {
    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      // Dedicated domain so the cleanup teardown can safely sweep test users.
      email: `e2e-${faker.string.uuid()}@${TEST_EMAIL_DOMAIN}`,
      password: "password",
    };

    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/collections/users/records") &&
        resp.request().method() === "POST",
    );

    await page.goto("/auth/signup");
    await page.locator('[data-cy="signup_firstname_input"]').fill(user.firstName);
    await page.locator('[data-cy="signup_lastname_input"]').fill(user.lastName);
    await page.locator('[data-cy="signup_email_input"]').fill(user.email);
    await page.locator('[data-cy="signup_password_input"]').fill(user.password);
    await page
      .locator('[data-cy="signup_confirm_password_input"]')
      .fill(user.password);
    await page.locator('[data-cy="signup_submit_btn"]').click();

    const response = await responsePromise;
    expect(response.status()).toBe(200);
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("should fail to sign up with existing email", async ({ page }) => {
    test.skip(
      !process.env.USER_EMAIL || !process.env.USER_PASSWORD,
      "Requires USER_EMAIL and USER_PASSWORD env vars",
    );
    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/collections/users/records") &&
        resp.request().method() === "POST",
    );

    await page.goto("/auth/signup");
    await page
      .locator('[data-cy="signup_firstname_input"]')
      .fill(faker.person.firstName());
    await page
      .locator('[data-cy="signup_lastname_input"]')
      .fill(faker.person.lastName());
    await page
      .locator('[data-cy="signup_email_input"]')
      .fill(process.env.USER_EMAIL!);
    await page
      .locator('[data-cy="signup_password_input"]')
      .fill(process.env.USER_PASSWORD!);
    await page
      .locator('[data-cy="signup_confirm_password_input"]')
      .fill(process.env.USER_PASSWORD!);
    await page.locator('[data-cy="signup_submit_btn"]').click();

    const response = await responsePromise;
    expect(response.status()).toBe(400);

    await expect(
      page.locator('[data-cy="server_error_message"]'),
    ).toContainText("Value must be unique.");
    await expect(
      page.locator('[data-cy="server_error_message"]'),
    ).not.toBeVisible({ timeout: 8000 });
  });

  test("should show first name validation error", async ({ page }) => {
    await page.goto("/auth/signup");

    await page.locator('[data-cy="signup_firstname_input"]').fill("123");
    await expect(
      page.locator('[data-cy="signup_firstname_input_error"]'),
    ).toContainText("Please enter valid name");

    await page.locator('[data-cy="signup_firstname_input"]').fill("ma");
    await expect(
      page.locator('[data-cy="signup_firstname_input_error"]'),
    ).toContainText("Your first name must contain at least 3 characters");

    await page.locator('[data-cy="signup_firstname_input"]').fill("");
    await expect(
      page.locator('[data-cy="signup_firstname_input_error"]'),
    ).toContainText("Your first name is required");
  });

  test("should show last name validation error", async ({ page }) => {
    await page.goto("/auth/signup");

    await page.locator('[data-cy="signup_lastname_input"]').fill("123");
    await expect(
      page.locator('[data-cy="signup_lastname_input_error"]'),
    ).toContainText("Please enter valid name");

    await page.locator('[data-cy="signup_lastname_input"]').fill("ma");
    await expect(
      page.locator('[data-cy="signup_lastname_input_error"]'),
    ).toContainText("Your last name must contain at least 3 characters");

    await page.locator('[data-cy="signup_lastname_input"]').fill("");
    await expect(
      page.locator('[data-cy="signup_lastname_input_error"]'),
    ).toContainText("Your last name is required");
  });

  test("should show email address validation error", async ({ page }) => {
    await page.goto("/auth/signup");

    await page.locator('[data-cy="signup_email_input"]').fill("123");
    await expect(
      page.locator('[data-cy="signup_email_input_error"]'),
    ).toContainText("Your email must be valid");

    await page.locator('[data-cy="signup_email_input"]').fill("");
    await expect(
      page.locator('[data-cy="signup_email_input_error"]'),
    ).toContainText("Your email is required");
  });

  test("should show password validation error", async ({ page }) => {
    await page.goto("/auth/signup");
    await validatePasswordInput(page, "signup_password_input", "Your password");
  });

  test("should show confirm password validation error", async ({ page }) => {
    await page.goto("/auth/signup");
    await validateConfirmPasswordInput(
      page,
      "signup_confirm_password_input",
      "signup_password_input",
      "Confirm Password",
    );
  });

  test("should redirect to login page", async ({ page }) => {
    await page.goto("/auth/signup");
    await page.locator('[data-cy="signup_goto_login_link"]').click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("should redirect to homepage", async ({ page }) => {
    await page.goto("/auth/signup");
    await page.locator('[data-cy="signup_goto_home_link"]').click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("Forgot Password Flow Tests", () => {
  test("should navigate to reset password page", async ({ page }) => {
    await page.goto("/auth/login");
    await page.locator('[data-cy="login_goto_password_reset_link"]').click();
    await expect(page).toHaveURL(/\/auth\/reset-your-password/);
  });

  test("should submit reset link successfully", async ({ page }) => {
    test.skip(
      !process.env.USER_EMAIL,
      "Requires USER_EMAIL env var",
    );
    const responsePromise = page.waitForResponse(
      (resp) =>
        resp
          .url()
          .includes("/api/collections/users/request-password-reset") &&
        resp.request().method() === "POST",
    );

    await page.goto("/auth/reset-your-password");
    await page
      .locator('[data-cy="reset_password_email_input"]')
      .fill(process.env.USER_EMAIL!);
    await page.locator('[data-cy="reset_password_submit_btn"]').click();

    const response = await responsePromise;
    expect(response.status()).toBe(204);
  });

  test("should show reset password email validation errors", async ({
    page,
  }) => {
    await page.goto("/auth/reset-your-password");

    await page.locator('[data-cy="reset_password_email_input"]').fill("123");
    await expect(
      page.locator('[data-cy="reset_password_email_input_error"]'),
    ).toContainText("Your email must be valid");

    await page.locator('[data-cy="reset_password_email_input"]').fill("");
    await expect(
      page.locator('[data-cy="reset_password_email_input_error"]'),
    ).toContainText("Your email is required");
  });

  test("should confirm new password successfully", async ({ page }) => {
    test.skip(
      !process.env.USER_PASSWORD,
      "Requires USER_PASSWORD env var",
    );
    await page.route(
      `${apiUrl}/api/collections/users/confirm-password-reset`,
      (route) => route.fulfill({ status: 204, body: "" }),
    );

    await page.goto("/auth/confirm-password-reset/dummy-token");
    await page
      .locator('[data-cy="new_password_input"]')
      .fill(process.env.USER_PASSWORD!);
    await page
      .locator('[data-cy="confirm_new_password_input"]')
      .fill(process.env.USER_PASSWORD!);
    await page.locator('[data-cy="confirm_password_submit_btn"]').click();

    await expect(
      page.locator('[data-cy="confirm_password_success_message"]'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 5000 });
  });

  test("should show new password input validation error", async ({ page }) => {
    await page.goto("/auth/confirm-password-reset/dummy-token");
    await validatePasswordInput(page, "new_password_input", "Your new password");
  });

  test("should show confirm new password validation error", async ({ page }) => {
    await page.goto("/auth/confirm-password-reset/dummy-token");
    await validateConfirmPasswordInput(
      page,
      "confirm_new_password_input",
      "new_password_input",
      "Confirm password",
    );
  });
});

test.describe("Logout Test", () => {
  test("should log out successfully", async ({ page }) => {
    test.skip(
      !process.env.USER_EMAIL || !process.env.USER_PASSWORD,
      "Requires USER_EMAIL and USER_PASSWORD env vars",
    );
    await login(page);
    await logout(page);
  });
});
