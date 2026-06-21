import { test, expect, type Page } from "@playwright/test";
import type {
  Question,
  QuestionChoice,
  QuestionType,
  Response,
  ResponseAnswer,
} from "../src/types/pocketbase";

// ─────────────────────────────────────────────────────────────────────────────
// Form-responses dashboard E2E
//
// Exercises the new responses analytics views (src/components/form/response/*)
// and the aggregation logic in summarizeQuestion() (src/utils/responses.ts)
// end-to-end through the form editor's "Responses" section, plus the publish /
// share controls added to FormNavbar.vue.
//
// Like validation.spec.ts, every PocketBase read is mocked and a structurally
// valid (but fake) session is injected, so the auth-guarded /form/:id/edit route
// renders without provisioning real records. No network writes, no account, no
// cleanup — fully deterministic and CI-safe.
// ─────────────────────────────────────────────────────────────────────────────

const FORM_ID = "e2e-responses-form";

// The editor reads `pb.authStore.isValid`, which decodes the JWT in
// localStorage["pocketbase_auth"] and checks its `exp`. A token with a
// far-future exp passes the guard without any real auth request.
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

const meta = {
  created: "",
  updated: "",
};

function buildForm(status: "draft" | "published" | "closed") {
  return {
    id: FORM_ID,
    title: "Responses Test Form",
    description: "",
    status,
    view_mode: "list",
    starred: false,
    slug: "e2e-responses",
    settings: {},
    user: "e2e-user",
    ...meta,
    collectionId: "forms",
    collectionName: "forms",
  };
}

type QuestionSeed = {
  id: string;
  label: string;
  type: QuestionType;
  choices?: { id: string; label: string }[];
};

// Three questions covering the main chart kinds: a single-choice (donut), a
// short-text (raw list) and a rating (scale + average).
const QUESTIONS: QuestionSeed[] = [
  {
    id: "q-color",
    label: "Favorite color",
    type: "single_choice",
    choices: [
      { id: "c-red", label: "Red" },
      { id: "c-blue", label: "Blue" },
    ],
  },
  { id: "q-comment", label: "Any comments?", type: "short_text" },
  { id: "q-rating", label: "Rate us", type: "rating" },
];

function buildQuestions(): Question[] {
  return QUESTIONS.map((seed, i) => ({
    id: seed.id,
    label: seed.label,
    description: "",
    type: seed.type,
    order: i + 1,
    required: false,
    settings: {},
    form: FORM_ID,
    ...meta,
    collectionId: "questions",
    collectionName: "questions",
  }));
}

function buildChoices(): QuestionChoice[] {
  return QUESTIONS.flatMap((seed) =>
    (seed.choices ?? []).map((c, order) => ({
      id: c.id,
      label: c.label,
      order: order + 1,
      question: seed.id,
      ...meta,
      collectionId: "question_choices",
      collectionName: "question_choices",
    })),
  );
}

// Three completed submissions. r-3 deliberately omits a comment so the
// "answered" rate and per-question respondent counts differ from the total.
const RESPONSES: Response[] = [
  {
    id: "r-1",
    form: FORM_ID,
    respondent: "u1",
    is_complete: true,
    submitted_at: "2026-06-20T10:00:00Z",
    ...meta,
    collectionId: "responses",
    collectionName: "responses",
  },
  {
    id: "r-2",
    form: FORM_ID,
    respondent: "u2",
    is_complete: true,
    submitted_at: "2026-06-19T10:00:00Z",
    ...meta,
    collectionId: "responses",
    collectionName: "responses",
  },
  {
    id: "r-3",
    form: FORM_ID,
    respondent: "u3",
    is_complete: true,
    submitted_at: "2026-06-18T10:00:00Z",
    ...meta,
    collectionId: "responses",
    collectionName: "responses",
  },
];

function answer(
  id: string,
  response: string,
  question: string,
  value: ResponseAnswer["value"],
): ResponseAnswer {
  return {
    id,
    response,
    question,
    value,
    ...meta,
    collectionId: "response_answers",
    collectionName: "response_answers",
  };
}

const ANSWERS: ResponseAnswer[] = [
  answer("a1", "r-1", "q-color", "c-red"),
  answer("a2", "r-1", "q-comment", "Loved it"),
  answer("a3", "r-1", "q-rating", 5),
  answer("a4", "r-2", "q-color", "c-blue"),
  answer("a5", "r-2", "q-comment", "Pretty good"),
  answer("a6", "r-2", "q-rating", 4),
  answer("a7", "r-3", "q-color", "c-red"),
  answer("a8", "r-3", "q-rating", 3),
  // r-3 has no comment answer.
];

type Seed = {
  status?: "draft" | "published" | "closed";
  responses?: Response[];
  answers?: ResponseAnswer[];
};

// Mocks every collection the editor + responses views read, then navigates to
// the edit route. Returns the live form status so PATCH-aware tests can flip it.
async function gotoEdit(page: Page, seed: Seed = {}) {
  let status = seed.status ?? "published";
  const responses = seed.responses ?? RESPONSES;
  const answers = seed.answers ?? ANSWERS;

  const json = (body: string) =>
    ({ status: 200, contentType: "application/json", body }) as const;

  // forms — getOne (FormNavbar.fetchForm) + PATCH (publish toggle) + getList.
  await page.route(/\/api\/collections\/forms\/records/, (route) => {
    const req = route.request();
    if (req.method() === "PATCH") {
      const body = JSON.parse(req.postData() || "{}");
      if (body.status) status = body.status;
      return route.fulfill(json(JSON.stringify(buildForm(status))));
    }
    // getOne hits /records/<id>; getList hits /records?<query>.
    if (/\/records\/[^/?]+/.test(req.url())) {
      return route.fulfill(json(JSON.stringify(buildForm(status))));
    }
    return route.fulfill(json(listBody([buildForm(status)])));
  });

  await page.route(/\/api\/collections\/questions\/records/, (route) =>
    route.fulfill(json(listBody(buildQuestions()))),
  );

  await page.route(/\/api\/collections\/question_choices\/records/, (route) =>
    route.fulfill(json(listBody(buildChoices()))),
  );

  await page.route(/\/api\/collections\/responses\/records/, (route) =>
    route.fulfill(json(listBody(responses))),
  );

  await page.route(/\/api\/collections\/response_answers\/records/, (route) =>
    route.fulfill(json(listBody(answers))),
  );

  await page.goto(`/form/${FORM_ID}/edit`);
  await expect(page).toHaveURL(/\/edit/);
}

// Switches the editor to the Responses section (a navbar tab) and waits for the
// heading to render. The tab only appears on the EditForm route.
async function openResponses(page: Page) {
  await page.getByRole("button", { name: "Responses", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: /Responses?$/ }),
  ).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await injectFakeAuth(page);
});

test.describe("Responses dashboard", () => {
  test("summary view aggregates answers into charts", async ({ page }) => {
    await gotoEdit(page);
    await openResponses(page);

    // Heading reflects the (animated) response count — settles on the value.
    await expect(
      page.getByRole("heading", { name: /Responses$/ }),
    ).toContainText("3");

    // Single-choice question → donut legend with per-choice counts/percent.
    await expect(page.getByText("Favorite color")).toBeVisible();
    await expect(page.getByText("Red", { exact: true })).toBeVisible();
    await expect(page.getByText("2 · 67%")).toBeVisible();
    await expect(page.getByText("Blue", { exact: true })).toBeVisible();
    await expect(page.getByText("1 · 33%")).toBeVisible();

    // Short-text question → raw answer list.
    await expect(page.getByText("Loved it")).toBeVisible();
    await expect(page.getByText("Pretty good")).toBeVisible();

    // Rating question → average (5 + 4 + 3) / 3 = 4.0 out of 5.
    await expect(page.getByText("average out of 5")).toBeVisible();
  });

  test("question view pages through one question at a time", async ({
    page,
  }) => {
    await gotoEdit(page);
    await openResponses(page);
    await page.getByRole("button", { name: "Question", exact: true }).click();

    // Defaults to the first question.
    await expect(page.locator("select")).toBeVisible();
    await expect(page.getByText("1 / 3")).toBeVisible();

    // Jump to the short-text question and confirm its answers render.
    await page.locator("select").selectOption({ label: "2. Any comments?" });
    await expect(page.getByText("Loved it")).toBeVisible();
    await expect(page.getByText("Pretty good")).toBeVisible();
  });

  test("individual view shows a single submission's answers", async ({
    page,
  }) => {
    await gotoEdit(page);
    await openResponses(page);
    await page.getByRole("button", { name: "Individual", exact: true }).click();

    // Newest submission first (r-1): choice mapped to its label, rating as stars.
    await expect(page.getByText("1 / 3")).toBeVisible();
    await expect(page.getByText("Red", { exact: true })).toBeVisible();
    await expect(page.getByText("Loved it")).toBeVisible();
    await expect(page.getByText("★★★★★ (5)")).toBeVisible();

    // Step to the next submission (r-2).
    await page.getByRole("button", { name: "›" }).click();
    await expect(page.getByText("2 / 3")).toBeVisible();
    await expect(page.getByText("Blue", { exact: true })).toBeVisible();
    await expect(page.getByText("Pretty good")).toBeVisible();
    await expect(page.getByText("★★★★ (4)")).toBeVisible();
  });

  test("shows an empty state when there are no responses", async ({ page }) => {
    await gotoEdit(page, { responses: [], answers: [] });
    await openResponses(page);

    await expect(page.getByText("No responses yet")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /^0 Responses$/ }),
    ).toBeVisible();
  });
});

test.describe("Publish & share controls", () => {
  test("share is disabled until the form is published", async ({ page }) => {
    await gotoEdit(page, { status: "draft" });

    await expect(page.locator('[data-cy="share_btn"]')).toBeDisabled();
    await expect(page.locator('[data-cy="publish_btn"]')).toContainText(
      "Publish",
    );
  });

  test("publishing enables the share link", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-write"]);
    await gotoEdit(page, { status: "draft" });

    await page.locator('[data-cy="publish_btn"]').click();

    // Toggle reflects the new status and the share button unlocks.
    await expect(page.locator('[data-cy="publish_btn"]')).toContainText(
      "Published",
    );
    await expect(page.locator('[data-cy="share_btn"]')).toBeEnabled();

    // Copying the link gives transient "Copied!" feedback.
    await page.locator('[data-cy="share_btn"]').click();
    await expect(page.locator('[data-cy="share_btn"]')).toContainText(
      "Copied!",
    );
  });
});
