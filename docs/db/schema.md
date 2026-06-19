# FormJAM — PocketBase Schema

## Collections

### `users` (built-in auth)

PocketBase's built-in auth collection. No custom fields needed beyond the defaults (email, password, name).

---

### `forms`

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | Text | yes | HTML string from the rich-text editor |
| `description` | Text | no | HTML string |
| `user` | Relation → `users` | yes | Form owner; cascade delete |
| `status` | Select | yes | `draft` \| `published` \| `closed` |
| `view_mode` | Select | yes | `list` \| `step` |
| `starred` | Bool | no | Default `false` |
| `slug` | Text (unique) | yes | Used to build the public share URL |
| `settings` | JSON | no | Extensible: `allow_anonymous`, `multiple_submissions`, etc. |

---

### `questions`

| Field | Type | Required | Notes |
|---|---|---|---|
| `form` | Relation → `forms` | yes | Cascade delete |
| `label` | Text | yes | The question prompt (HTML) |
| `description` | Text | no | Helper/hint text (HTML) |
| `type` | Select | yes | See values below |
| `order` | Number | yes | 1-based display order |
| `required` | Bool | no | Default `false` |
| `settings` | JSON | no | Type-specific config, e.g. `{min:1,max:5}` for `linear_scale`, `{placeholder:"..."}` for text |

**`type` values:** `short_text` · `long_text` · `single_choice` · `multiple_choice` · `dropdown` · `linear_scale`

---

### `question_choices`

Stores the selectable options for `single_choice`, `multiple_choice`, and `dropdown` questions. Replaces the old inline `answers` JSON field on questions.

| Field | Type | Required | Notes |
|---|---|---|---|
| `question` | Relation → `questions` | yes | Cascade delete |
| `label` | Text | yes | Display text |
| `order` | Number | yes | Display order within the question |

---

### `responses`

One record per form submission attempt. Replaces the old `submitted_forms` collection.

| Field | Type | Required | Notes |
|---|---|---|---|
| `form` | Relation → `forms` | yes | |
| `respondent` | Relation → `users` | no | Null for anonymous submissions |
| `is_complete` | Bool | yes | `false` while in progress, `true` after submit |
| `submitted_at` | Date | no | Set when `is_complete` flips to `true` |

---

### `response_answers`

One record per question per response. Replaces the old `form_data` JSON blob on `submitted_forms`. This normalized structure enables per-question analytics and filtering.

| Field | Type | Required | Notes |
|---|---|---|---|
| `response` | Relation → `responses` | yes | Cascade delete |
| `question` | Relation → `questions` | yes | |
| `value` | JSON | no | Flexible: `"text"`, `42`, or `["choice-id-a","choice-id-b"]` for multi-select |

---

## Relationships

```
users ─────────────────────────────────────────────── owns
  │                                                     │
  ▼                                                     │
forms ──────────────── has many ──────────────► questions
  │                                                     │
  │                                                     └── has many ──► question_choices
  │
  └── has many ──► responses
                        │
                        └── has many ──► response_answers ──► (question)
```

## Design decisions

- **`question_choices` as a separate collection** — choice options for select-type questions are first-class records, enabling proper CRUD, ordering, and future features (choice analytics, conditional logic).
- **`response_answers` as rows** — one record per question answer means you can query "how many responses chose option X", filter by answer, and compute distributions without parsing JSON blobs.
- **`slug` on forms** — the public share URL is derived from `slug` (e.g. `/f/my-form-slug`) rather than storing computed link strings.
- **`settings` JSON on both `forms` and `questions`** — provides extensibility without schema migrations for each new feature flag or type-specific option.
- **`respondent` nullable** — forms can accept anonymous submissions; authenticated submissions link the response to the user.
