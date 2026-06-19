import { test as teardown } from "@playwright/test";
import PocketBase from "pocketbase";
import { TEST_EMAIL_DOMAIN } from "./helpers";

// Runs once after the whole suite (wired as the `setup` project's teardown in
// playwright.config.ts). It removes the real records the tests create against
// the shared PocketBase instance:
//   - forms (+ their questions and choices) owned by the test user, created by
//     the "should be able to create a new form" test;
//   - users created by the "should sign up successfully" test, which use the
//     dedicated TEST_EMAIL_DOMAIN below so the sweep can target them safely.
//
// Cleanup is best-effort: failures are logged, never thrown, so a cleanup
// hiccup can't fail an otherwise-green run.
teardown("clean up test data", async () => {
  const url = process.env.VITE_POCKET_BASE ?? process.env.API_URL;
  if (!url) {
    console.warn("[cleanup] VITE_POCKET_BASE not set — skipping cleanup.");
    return;
  }

  // --- Forms / questions / choices: deletable by their owner (the test user).
  const { USER_EMAIL, USER_PASSWORD } = process.env;
  if (USER_EMAIL && USER_PASSWORD) {
    try {
      const pb = new PocketBase(url);
      pb.autoCancellation(false);
      await pb.collection("users").authWithPassword(USER_EMAIL, USER_PASSWORD);
      const uid = pb.authStore.record?.id ?? pb.authStore.model?.id;

      // Children first, in case the schema has no cascade-delete configured.
      const choices = await pb
        .collection("question_choices")
        .getFullList({ filter: `question.form.user="${uid}"` })
        .catch(() => []);
      for (const c of choices) await pb.collection("question_choices").delete(c.id);

      const questions = await pb
        .collection("questions")
        .getFullList({ filter: `form.user="${uid}"` })
        .catch(() => []);
      for (const q of questions) await pb.collection("questions").delete(q.id);

      const forms = await pb
        .collection("forms")
        .getFullList({ filter: `user="${uid}"` });
      for (const f of forms) await pb.collection("forms").delete(f.id);

      console.log(
        `[cleanup] removed ${forms.length} form(s), ${questions.length} question(s), ${choices.length} choice(s) for the test user.`,
      );
    } catch (err) {
      console.warn("[cleanup] form cleanup failed:", (err as Error).message);
    }
  } else {
    console.warn("[cleanup] USER_EMAIL/USER_PASSWORD not set — skipping form cleanup.");
  }

  // --- Signup users: require a superuser to delete other accounts.
  const { PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD } = process.env;
  if (PB_SUPERUSER_EMAIL && PB_SUPERUSER_PASSWORD) {
    try {
      const admin = new PocketBase(url);
      admin.autoCancellation(false);
      await admin
        .collection("_superusers")
        .authWithPassword(PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD);

      const users = await admin
        .collection("users")
        .getFullList({ filter: `email ~ "@${TEST_EMAIL_DOMAIN}"` });
      for (const u of users) await admin.collection("users").delete(u.id);

      console.log(`[cleanup] removed ${users.length} test user(s).`);
    } catch (err) {
      console.warn("[cleanup] user cleanup failed:", (err as Error).message);
    }
  } else {
    console.warn(
      "[cleanup] PB_SUPERUSER_EMAIL/PB_SUPERUSER_PASSWORD not set — skipping signup-user cleanup.",
    );
  }
});
