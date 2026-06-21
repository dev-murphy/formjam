import { test, expect, type Page } from "@playwright/test";
import type {
  Question,
  QuestionType,
  QuestionValidation,
} from "../src/types/pocketbase";

// ─────────────────────────────────────────────────────────────────────────────
// Question-validation E2E
//
// Exercises validateAnswer() (src/utils/validation.ts) end-to-end through the
// form preview page (src/pages/form/preview.vue), which renders one input per
// question type and surfaces validation errors live as the respondent types.
//
// Rather than provisioning real PocketBase records, each test mocks the three
// GET endpoints the preview page reads (forms, questions, question_choices) and
// injects a structurally-valid (but fake) PocketBase session so the
// auth-guarded /form/:id/preview route renders. No network writes, no account,
// no cleanup — fully deterministic and CI-safe.
// ─────────────────────────────────────────────────────────────────────────────

const FORM_ID = "e2e-validation-form";

// The preview page reads `pb.authStore.isValid`, which decodes the JWT in
// localStorage["pocketbase_auth"] and checks its `exp`. A token with a
// far-future exp passes the guard without any real auth request — every data
// fetch is mocked below, so the token is never sent anywhere.
function injectFakeAuth(page: Page) {
  return page.addInitScript(() => {
    const payload = {
      exp: 9999999999, // year 2286 — never "expired"
      id: "e2e-user",
      type: "auth",
      collectionId: "_pb_users_auth_",
    };
    const token = `x.${btoa(JSON.stringify(payload))}.y`;
    localStorage.setItem(
      "pocketbase_auth",
      JSON.stringify({
        token,
        record: {
          id: "e2e-user",
          email: "e2e@formjam.test",
          collectionName: "users",
        },
      }),
    );
  });
}

type QuestionChoiceSeed = { id: string; label: string };

type QuestionSeed = {
  type: QuestionType;
  validation: QuestionValidation;
  required?: boolean;
  choices?: QuestionChoiceSeed[];
};

// PocketBase list-response envelope (getList / getFullList both expect it).
function listBody(items: unknown[]) {
  return JSON.stringify({
    page: 1,
    perPage: 500,
    totalItems: items.length,
    totalPages: 1,
    items,
  });
}

function buildQuestion(seed: QuestionSeed, index: number): Question {
  return {
    id: `q-${index}`,
    label: `Question ${index + 1}`,
    description: "",
    type: seed.type,
    order: index + 1,
    required: seed.required ?? false,
    settings: { validation: seed.validation },
    form: FORM_ID,
    created: "",
    updated: "",
    collectionId: "questions",
    collectionName: "questions",
  };
}

// Mocks the forms / questions / question_choices reads the preview page issues
// on mount, then navigates to the preview route for the given questions.
async function gotoPreview(page: Page, seeds: QuestionSeed[]) {
  const questions = seeds.map(buildQuestion);

  const choices = seeds.flatMap((seed, i) =>
    (seed.choices ?? []).map((choice, order) => ({
      id: choice.id,
      label: choice.label,
      order: order + 1,
      question: `q-${i}`,
      created: "",
      updated: "",
      collectionId: "question_choices",
      collectionName: "question_choices",
    })),
  );

  await page.route(/\/api\/collections\/forms\/records/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: listBody([
        {
          id: FORM_ID,
          title: "Validation Test Form",
          description: "",
          status: "published",
          view_mode: "list",
          starred: false,
          slug: "e2e-validation",
          settings: {},
          user: "e2e-user",
          created: "",
          updated: "",
          collectionId: "forms",
          collectionName: "forms",
        },
      ]),
    }),
  );

  await page.route(/\/api\/collections\/questions\/records/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: listBody(questions),
    }),
  );

  await page.route(/\/api\/collections\/question_choices\/records/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: listBody(choices),
    }),
  );

  await page.goto(`/form/${FORM_ID}/preview`);
  await expect(page).toHaveURL(/\/preview/);
}

// Single error <p> on the page (each test mocks exactly one question, so the
// `.text-red-500` paragraph is unambiguous — the required asterisk is a <span>).
function errorMessage(page: Page) {
  return page.locator("p.text-red-500");
}

// Submitting runs validateForm() and gates navigation. We assert through Submit
// rather than the live `watch`, because the number/email/date inputs clear their
// error on every `@input`, which races the live re-validation. Submit is the
// single, reliable trigger across all types — and verifies the submit gate too.
async function expectInvalid(page: Page, message: string) {
  await page.getByRole("button", { name: "Submit Form" }).click();
  await expect(page).toHaveURL(/\/preview/); // submit blocked
  await expect(errorMessage(page)).toHaveText(message);
}

// Once a valid answer is entered the error clears live (via the input's @input
// handler or the localAnswers watcher), so no resubmit is needed.
async function expectValid(page: Page) {
  await expect(errorMessage(page)).toBeHidden();
}

test.beforeEach(async ({ page }) => {
  await injectFakeAuth(page);
});

// ── Text-input categories (short_text / long_text): text, length, regex ──────

const TEXT_INPUTS: { type: QuestionType; selector: string }[] = [
  { type: "short_text", selector: 'input[type="text"]' },
  { type: "long_text", selector: "textarea" },
];

for (const { type, selector } of TEXT_INPUTS) {
  test.describe(`${type} validation`, () => {
    test("text: contains", async ({ page }) => {
      await gotoPreview(page, [
        {
          type,
          validation: {
            enabled: true,
            category: "text",
            condition: "contains",
            value: "@",
            errorMessage: "Must contain an @ symbol",
          },
        },
      ]);

      await page.locator(selector).fill("no symbol here");
      await expectInvalid(page, "Must contain an @ symbol");

      await page.locator(selector).fill("has @ symbol");
      await expectValid(page);
    });

    test("text: notContains", async ({ page }) => {
      await gotoPreview(page, [
        {
          type,
          validation: {
            enabled: true,
            category: "text",
            condition: "notContains",
            value: "spam",
            errorMessage: "Must not contain 'spam'",
          },
        },
      ]);

      await page.locator(selector).fill("this is spam!");
      await expectInvalid(page, "Must not contain 'spam'");

      await page.locator(selector).fill("this is fine");
      await expectValid(page);
    });

    test("length: minLength", async ({ page }) => {
      await gotoPreview(page, [
        {
          type,
          validation: {
            enabled: true,
            category: "length",
            condition: "minLength",
            value: "5",
            errorMessage: "At least 5 characters",
          },
        },
      ]);

      await page.locator(selector).fill("abc");
      await expectInvalid(page, "At least 5 characters");

      await page.locator(selector).fill("abcdef");
      await expectValid(page);
    });

    test("length: maxLength", async ({ page }) => {
      await gotoPreview(page, [
        {
          type,
          validation: {
            enabled: true,
            category: "length",
            condition: "maxLength",
            value: "5",
            errorMessage: "At most 5 characters",
          },
        },
      ]);

      await page.locator(selector).fill("way too long");
      await expectInvalid(page, "At most 5 characters");

      await page.locator(selector).fill("short");
      await expectValid(page);
    });

    test("regex: matches", async ({ page }) => {
      await gotoPreview(page, [
        {
          type,
          validation: {
            enabled: true,
            category: "regex",
            condition: "matches",
            value: "[0-9]{3}",
            errorMessage: "Must be exactly 3 digits",
          },
        },
      ]);

      // matches anchors the pattern (^(?:...)$), so partial/invalid input fails.
      await page.locator(selector).fill("12");
      await expectInvalid(page, "Must be exactly 3 digits");

      await page.locator(selector).fill("123");
      await expectValid(page);
    });

    test("regex: notMatches", async ({ page }) => {
      await gotoPreview(page, [
        {
          type,
          validation: {
            enabled: true,
            category: "regex",
            condition: "notMatches",
            value: "[0-9]+",
            errorMessage: "Digits only is not allowed",
          },
        },
      ]);

      await page.locator(selector).fill("4567");
      await expectInvalid(page, "Digits only is not allowed");

      await page.locator(selector).fill("letters");
      await expectValid(page);
    });
  });
}

// ── number ───────────────────────────────────────────────────────────────────

test.describe("number validation", () => {
  const input = 'input[type="number"]';

  test("greater than", async ({ page }) => {
    await gotoPreview(page, [
      {
        type: "number",
        validation: {
          enabled: true,
          category: "number",
          condition: "gt",
          value: "10",
          errorMessage: "Must be greater than 10",
        },
      },
    ]);

    await page.locator(input).fill("10");
    await expectInvalid(page, "Must be greater than 10");

    await page.locator(input).fill("11");
    await expectValid(page);
  });

  test("less than or equal to", async ({ page }) => {
    await gotoPreview(page, [
      {
        type: "number",
        validation: {
          enabled: true,
          category: "number",
          condition: "lte",
          value: "100",
          errorMessage: "Must be at most 100",
        },
      },
    ]);

    await page.locator(input).fill("101");
    await expectInvalid(page, "Must be at most 100");

    await page.locator(input).fill("100");
    await expectValid(page);
  });

  test("equal to", async ({ page }) => {
    await gotoPreview(page, [
      {
        type: "number",
        validation: {
          enabled: true,
          category: "number",
          condition: "eq",
          value: "42",
          errorMessage: "Must equal 42",
        },
      },
    ]);

    await page.locator(input).fill("41");
    await expectInvalid(page, "Must equal 42");

    await page.locator(input).fill("42");
    await expectValid(page);
  });

  test("between", async ({ page }) => {
    await gotoPreview(page, [
      {
        type: "number",
        validation: {
          enabled: true,
          category: "number",
          condition: "between",
          value: "18",
          value2: "65",
          errorMessage: "Must be between 18 and 65",
        },
      },
    ]);

    await page.locator(input).fill("17");
    await expectInvalid(page, "Must be between 18 and 65");

    await page.locator(input).fill("30");
    await expectValid(page);
  });

  test("whole number", async ({ page }) => {
    await gotoPreview(page, [
      {
        type: "number",
        validation: {
          enabled: true,
          category: "number",
          condition: "wholeNumber",
          value: "",
          errorMessage: "Must be a whole number",
        },
      },
    ]);

    await page.locator(input).fill("2.5");
    await expectInvalid(page, "Must be a whole number");

    await page.locator(input).fill("3");
    await expectValid(page);
  });
});

// ── email ────────────────────────────────────────────────────────────────────

test.describe("email validation", () => {
  test("isEmail", async ({ page }) => {
    await gotoPreview(page, [
      {
        type: "email",
        validation: {
          enabled: true,
          category: "email",
          condition: "isEmail",
          value: "",
          errorMessage: "Enter a valid email address",
        },
      },
    ]);

    const input = 'input[type="email"]';
    await page.locator(input).fill("not-an-email");
    await expectInvalid(page, "Enter a valid email address");

    await page.locator(input).fill("user@example.com");
    await expectValid(page);
  });
});

// ── date ─────────────────────────────────────────────────────────────────────

test.describe("date validation", () => {
  const input = 'input[type="date"]';

  test("on or after", async ({ page }) => {
    await gotoPreview(page, [
      {
        type: "date",
        validation: {
          enabled: true,
          category: "date",
          condition: "onOrAfter",
          value: "2026-01-01",
          errorMessage: "Must be on or after 2026-01-01",
        },
      },
    ]);

    await page.locator(input).fill("2025-12-31");
    await expectInvalid(page, "Must be on or after 2026-01-01");

    await page.locator(input).fill("2026-06-01");
    await expectValid(page);
  });

  test("between", async ({ page }) => {
    await gotoPreview(page, [
      {
        type: "date",
        validation: {
          enabled: true,
          category: "date",
          condition: "between",
          value: "2026-01-01",
          value2: "2026-12-31",
          errorMessage: "Must be within 2026",
        },
      },
    ]);

    await page.locator(input).fill("2027-03-15");
    await expectInvalid(page, "Must be within 2026");

    await page.locator(input).fill("2026-07-04");
    await expectValid(page);
  });
});

// ── rating ───────────────────────────────────────────────────────────────────

test.describe("rating validation", () => {
  const star = (n: number) => `button[aria-label="Rate ${n}"]`;

  test("at least", async ({ page }) => {
    await gotoPreview(page, [
      {
        type: "rating",
        validation: {
          enabled: true,
          category: "rating",
          condition: "min",
          value: "3",
          errorMessage: "Please rate at least 3 stars",
        },
      },
    ]);

    await page.locator(star(2)).click();
    await expectInvalid(page, "Please rate at least 3 stars");

    await page.locator(star(4)).click();
    await expectValid(page);
  });

  test("at most", async ({ page }) => {
    await gotoPreview(page, [
      {
        type: "rating",
        validation: {
          enabled: true,
          category: "rating",
          condition: "max",
          value: "3",
          errorMessage: "Please rate at most 3 stars",
        },
      },
    ]);

    await page.locator(star(5)).click();
    await expectInvalid(page, "Please rate at most 3 stars");

    await page.locator(star(2)).click();
    await expectValid(page);
  });
});

// ── multiple_choice (selection) ──────────────────────────────────────────────

test.describe("multiple_choice (selection) validation", () => {
  const choices = [
    { id: "c-1", label: "Option A" },
    { id: "c-2", label: "Option B" },
    { id: "c-3", label: "Option C" },
  ];
  // PrimeVue Checkbox renders a hidden input with input-id=choice.id; toggle via
  // the associated <label for="choice.id">.
  const choice = (id: string) => `label[for="${id}"]`;

  test("select at least", async ({ page }) => {
    await gotoPreview(page, [
      {
        type: "multiple_choice",
        choices,
        validation: {
          enabled: true,
          category: "selection",
          condition: "atLeast",
          value: "2",
          errorMessage: "Select at least 2 options",
        },
      },
    ]);

    await page.locator(choice("c-1")).click();
    await expectInvalid(page, "Select at least 2 options");

    await page.locator(choice("c-2")).click();
    await expectValid(page);
  });

  test("select at most", async ({ page }) => {
    await gotoPreview(page, [
      {
        type: "multiple_choice",
        choices,
        validation: {
          enabled: true,
          category: "selection",
          condition: "atMost",
          value: "1",
          errorMessage: "Select at most 1 option",
        },
      },
    ]);

    await page.locator(choice("c-1")).click();
    await page.locator(choice("c-2")).click();
    await expectInvalid(page, "Select at most 1 option");

    await page.locator(choice("c-2")).click(); // deselect back to 1
    await expectValid(page);
  });

  test("select exactly", async ({ page }) => {
    await gotoPreview(page, [
      {
        type: "multiple_choice",
        choices,
        validation: {
          enabled: true,
          category: "selection",
          condition: "exactly",
          value: "2",
          errorMessage: "Select exactly 2 options",
        },
      },
    ]);

    await page.locator(choice("c-1")).click();
    await expectInvalid(page, "Select exactly 2 options");

    await page.locator(choice("c-2")).click();
    await expectValid(page);
  });
});

// ── default (no custom message) + submit gating ──────────────────────────────

test.describe("validation behavior", () => {
  test("falls back to a generated message when none is provided", async ({
    page,
  }) => {
    await gotoPreview(page, [
      {
        type: "number",
        validation: {
          enabled: true,
          category: "number",
          condition: "gt",
          value: "10",
          errorMessage: "", // no custom message → defaultMessage()
        },
      },
    ]);

    await page.locator('input[type="number"]').fill("5");
    await expectInvalid(page, "This answer must satisfy: Greater than 10");
  });

  test("empty answer passes (emptiness is the required flag's job)", async ({
    page,
  }) => {
    await gotoPreview(page, [
      {
        type: "short_text",
        validation: {
          enabled: true,
          category: "length",
          condition: "minLength",
          value: "5",
          errorMessage: "At least 5 characters",
        },
      },
    ]);

    // Too short → error, then clear — an empty value must not trigger the rule.
    await page.locator('input[type="text"]').fill("ab");
    await expectInvalid(page, "At least 5 characters");
    await page.locator('input[type="text"]').fill("");
    await expectValid(page);
  });

  test("invalid answer blocks submit; valid answer navigates to success", async ({
    page,
  }) => {
    await gotoPreview(page, [
      {
        type: "number",
        validation: {
          enabled: true,
          category: "number",
          condition: "between",
          value: "1",
          value2: "5",
          errorMessage: "Pick a number from 1 to 5",
        },
      },
    ]);

    await page.locator('input[type="number"]').fill("9");
    await expectInvalid(page, "Pick a number from 1 to 5"); // submit blocked

    await page.locator('input[type="number"]').fill("3");
    await page.getByRole("button", { name: "Submit Form" }).click();
    await expect(page).toHaveURL(/\/success/);
  });
});
