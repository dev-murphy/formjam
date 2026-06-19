/// <reference path="../pb_data/types.d.ts" />

// Owner-scoped API rules for the FormJAM collections.
//
// Access model (see src/router): the app is fully authenticated — there is no
// anonymous access. `forms` are listed with an unfiltered getFullList(), so the
// list/view rules below are what actually scope each user to their own data.
// Child collections are scoped by walking the relation chain up to forms.user.
//
// Requires PocketBase >= 0.22 (uses the `app`/findCollectionByNameOrId JSVM API).
// Apply by placing this file in the server's pb_migrations/ dir and restarting
// PocketBase, or run the equivalent in Admin UI → each collection → API Rules.

migrate(
  (app) => {
    const AUTH = '@request.auth.id != ""';

    // forms — owned by `user`
    const forms = app.findCollectionByNameOrId("forms");
    forms.listRule = `${AUTH} && user = @request.auth.id`;
    forms.viewRule = `${AUTH} && user = @request.auth.id`;
    forms.createRule = AUTH;
    forms.updateRule = `${AUTH} && user = @request.auth.id`;
    forms.deleteRule = `${AUTH} && user = @request.auth.id`;
    app.save(forms);

    // questions — scoped through form.user
    const questions = app.findCollectionByNameOrId("questions");
    questions.listRule = `${AUTH} && form.user = @request.auth.id`;
    questions.viewRule = `${AUTH} && form.user = @request.auth.id`;
    questions.createRule = `${AUTH} && form.user = @request.auth.id`;
    questions.updateRule = `${AUTH} && form.user = @request.auth.id`;
    questions.deleteRule = `${AUTH} && form.user = @request.auth.id`;
    app.save(questions);

    // question_choices — scoped through question.form.user
    const choices = app.findCollectionByNameOrId("question_choices");
    choices.listRule = `${AUTH} && question.form.user = @request.auth.id`;
    choices.viewRule = `${AUTH} && question.form.user = @request.auth.id`;
    choices.createRule = `${AUTH} && question.form.user = @request.auth.id`;
    choices.updateRule = `${AUTH} && question.form.user = @request.auth.id`;
    choices.deleteRule = `${AUTH} && question.form.user = @request.auth.id`;
    app.save(choices);

    // responses — any authenticated user may submit; only the form owner reads.
    const responses = app.findCollectionByNameOrId("responses");
    responses.listRule = `${AUTH} && form.user = @request.auth.id`;
    responses.viewRule = `${AUTH} && form.user = @request.auth.id`;
    responses.createRule = AUTH;
    responses.updateRule = `${AUTH} && form.user = @request.auth.id`;
    responses.deleteRule = `${AUTH} && form.user = @request.auth.id`;
    app.save(responses);

    // response_answers — scoped through response.form.user; authed users submit.
    const answers = app.findCollectionByNameOrId("response_answers");
    answers.listRule = `${AUTH} && response.form.user = @request.auth.id`;
    answers.viewRule = `${AUTH} && response.form.user = @request.auth.id`;
    answers.createRule = AUTH;
    answers.updateRule = `${AUTH} && response.form.user = @request.auth.id`;
    answers.deleteRule = `${AUTH} && response.form.user = @request.auth.id`;
    app.save(answers);
  },
  (app) => {
    // Revert: lock every rule back to superuser-only (null).
    for (const name of [
      "forms",
      "questions",
      "question_choices",
      "responses",
      "response_answers",
    ]) {
      const c = app.findCollectionByNameOrId(name);
      c.listRule = null;
      c.viewRule = null;
      c.createRule = null;
      c.updateRule = null;
      c.deleteRule = null;
      app.save(c);
    }
  },
);
