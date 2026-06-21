# Security Audit Report — FormJAM (`src-tauri`)

> Generated against the **actual** project lockfile, not hypothetical advisories.
> Tooling: `cargo-audit 0.22.2` against RustSec advisory-db (1,134 advisories loaded).
> Scope: `src-tauri/Cargo.lock` — 419 crate dependencies.
> Toolchain: `cargo 1.96.0` / `rustc 1.96.0`. Date: 2026-06-21.

## Executive Summary

A full RustSec scan of the Tauri backend found **zero known-exploitable vulnerabilities**.
`cargo audit` exited `0`. All 17 findings are **advisory warnings**, not vulnerabilities:

- **16 × `unmaintained`** — crates with no active maintainer. No known exploit; risk is *future* (un-patched bugs won't get fixes).
- **1 × `unsound`** — `glib` API that can trigger undefined behaviour *if a specific API is misused*. Linux-only, not reachable from this app's code.

Two facts dominate the risk picture and should frame every decision below:

1. **Platform isolation.** 11 of the 17 findings (`glib`, `gtk`, `atk`, `gdk*`, plus `proc-macro-error`) are pulled in **only on Linux** through Tauri's GTK3 backend (`gtk → muda / tao / tauri-runtime-wry`). They are **not compiled into the macOS or Windows builds** — confirmed via `cargo tree` (host-target resolution returns empty; Linux-target resolution returns the chain).
2. **No upgrade path exists.** `tauri 2.11.3` is the latest release and `cargo update` reports nothing to change. The flagged crates are pinned transitively by Tauri's own dependency on the (unmaintained-but-still-required) **GTK3** gtk-rs bindings. There is no version of Tauri 2.x that drops them, because `webkit2gtk-4.1` on Linux still requires GTK3. **You cannot fix these by bumping a version** — they are an accepted state of the Tauri 2.x Linux ecosystem.

**Bottom line:** no immediate action is forced. The correct response is *governance, not remediation* — add `cargo audit` + `cargo deny` to CI, explicitly allow-list these known-and-unavoidable advisories, and re-evaluate when Tauri ships a GTK4 backend.

### Note on the template's example crates

- **`idna`** — the project ships **`idna 1.1.0`**, which is **not vulnerable**. RUSTSEC-2024-0421 (punycode label confusion) affects `idna < 1.0.0`. ✅ No action.
- **`tauri`** — **`tauri 2.11.3`**, the latest release. No advisories against it. ✅ No action.
- **`glib`** — flagged (see below), but not as a vulnerability.

## Vulnerability Matrix

| Crate | Advisory | Type | Severity | Exploitable Remotely? | Compiled on macOS/Win? | Fixed Version |
|---|---|---|---|---|---|---|
| glib 0.18.5 | RUSTSEC-2024-0429 | Unsound (UB) | **Low** | No | No (Linux-only) | 0.20.0 — *unreachable via Tauri 2.x* |
| gtk 0.18.2 | RUSTSEC-2024-0415 | Unmaintained | Info | No | No (Linux-only) | none (GTK3 EOL) |
| gtk-sys 0.18.2 | RUSTSEC-2024-0420 | Unmaintained | Info | No | No (Linux-only) | none |
| gtk3-macros 0.18.2 | RUSTSEC-2024-0419 | Unmaintained | Info | No | No (Linux-only, build) | none |
| gdk 0.18.2 | RUSTSEC-2024-0412 | Unmaintained | Info | No | No (Linux-only) | none |
| gdk-sys 0.18.2 | RUSTSEC-2024-0418 | Unmaintained | Info | No | No (Linux-only) | none |
| gdkwayland-sys 0.18.2 | RUSTSEC-2024-0411 | Unmaintained | Info | No | No (Linux-only) | none |
| gdkx11 0.18.2 | RUSTSEC-2024-0417 | Unmaintained | Info | No | No (Linux-only) | none |
| gdkx11-sys 0.18.2 | RUSTSEC-2024-0414 | Unmaintained | Info | No | No (Linux-only) | none |
| atk 0.18.2 | RUSTSEC-2024-0413 | Unmaintained | Info | No | No (Linux-only) | none |
| atk-sys 0.18.2 | RUSTSEC-2024-0416 | Unmaintained | Info | No | No (Linux-only) | none |
| proc-macro-error 1.0.4 | RUSTSEC-2024-0370 | Unmaintained | Info | No | No (Linux-only, build) | use `proc-macro-error2` (upstream concern) |
| unic-char-property 0.9.0 | RUSTSEC-2025-0081 | Unmaintained | Info | No | Yes (build-time) | none |
| unic-char-range 0.9.0 | RUSTSEC-2025-0075 | Unmaintained | Info | No | Yes (build-time) | none |
| unic-common 0.9.0 | RUSTSEC-2025-0080 | Unmaintained | Info | No | Yes (build-time) | none |
| unic-ucd-ident 0.9.0 | RUSTSEC-2025-0100 | Unmaintained | Info | No | Yes (build-time) | none |
| unic-ucd-version 0.9.0 | RUSTSEC-2025-0098 | Unmaintained | Info | No | Yes (build-time) | none |

**Impact-class summary across all 17 findings:** RCE — none. Privilege Escalation — none. DoS — none. Auth/Authz Bypass — none. Information Disclosure — none. Memory Safety / Undefined Behaviour — **1** (glib, Linux-only, not reachable). Unmaintained-only — 16.

## Detailed Analysis

### 1. glib 0.18.5 — RUSTSEC-2024-0429 (Unsound)

- **Type:** Unsoundness (potential undefined behaviour) in the `Iterator` / `DoubleEndedIterator` impls for `glib::VariantStrIter`.
- **Severity:** Low. Triggering UB requires *direct* use of `VariantStrIter` over a `GVariant` string array. FormJAM's code does not call into glib's GVariant string iterators; the crate is present only because Tauri's Linux windowing stack links it.
- **Impact classes:** Memory Safety / Undefined Behaviour (theoretical). Not remotely reachable.
- **Path:** `glib ← atk ← gtk ← {muda, tao, tauri-runtime-wry, tauri-runtime} ← tauri`. **Linux target only.**
- **Fixed version:** `glib 0.20.0`. **Not adoptable** — Tauri 2.x's GTK3 stack pins glib 0.18. Upgrading glib in isolation would break `gtk 0.18`.
- **Recommendation:** Accept and allow-list. Track Tauri's GTK4 migration. Re-audit on every Tauri minor bump.

### 2. gtk-rs GTK3 bindings (10 crates) — RUSTSEC-2024-041x (Unmaintained)

- `gtk`, `gtk-sys`, `gtk3-macros`, `gdk`, `gdk-sys`, `gdkwayland-sys`, `gdkx11`, `gdkx11-sys`, `atk`, `atk-sys`.
- **Type:** Unmaintained. The gtk-rs project moved to **GTK4**; the GTK3 bindings are frozen. This is not a defect — it is the upstream maintenance status.
- **Severity:** Informational. No known vulnerability; the risk is that any *future* GTK3-binding bug will not be patched.
- **Impact classes:** none today.
- **Path:** all via `gtk ← {muda, tao, tauri-runtime-wry} ← tauri`. **Linux target only** — absent from macOS/Windows builds.
- **Fixed version:** none. Resolves only when Tauri/wry adopt GTK4 (webkit2gtk-6.0). Ecosystem-blocked.
- **Recommendation:** Accept and allow-list. No code change possible.

### 3. proc-macro-error 1.0.4 — RUSTSEC-2024-0370 (Unmaintained)

- **Type:** Unmaintained proc-macro helper. A maintained drop-in (`proc-macro-error2`) exists but the swap is upstream's call.
- **Severity:** Informational. **Build-time only** (proc-macro), never shipped in the binary.
- **Path:** `proc-macro-error ← glib-macros ← glib ← … ← tauri`. **Linux target, build-time.**
- **Recommendation:** Accept and allow-list. No runtime exposure.

### 4. unic-* (5 crates) — RUSTSEC-2025-00xx (Unmaintained)

- `unic-char-property`, `unic-char-range`, `unic-common`, `unic-ucd-ident`, `unic-ucd-version`.
- **Type:** Unmaintained Unicode tables, pulled via `urlpattern 0.3.0 ← tauri-utils`.
- **Severity:** Informational. Used at **build time** for URL-pattern compilation in Tauri's codegen; static Unicode data with no network surface.
- **Path:** `unic-* ← urlpattern ← tauri-utils ← {tauri-build, tauri-codegen, tauri-runtime}`. Present on all targets but **build-time**.
- **Recommendation:** Accept and allow-list. Resolves when `urlpattern`/`tauri-utils` migrate off `unic`.

## Recommended Cargo.toml Changes

**No dependency version changes are required or possible.** The project's direct dependencies are already current:

```toml
[build-dependencies]
tauri-build = { version = "2", features = [] }   # resolves to 2.6.3 — latest

[dependencies]
serde_json = "1.0"                               # current
serde = { version = "1.0", features = ["derive"] } # current
tauri = { version = "2", features = [] }         # resolves to 2.11.3 — latest
```

`cargo update --dry-run` reports nothing to update — the lockfile is already at the newest compatible versions. The only actionable change is **governance config** (`deny.toml`, added in this branch), which explicitly records these known advisories as accepted rather than letting them silently fail or silently pass CI.

## Priority Remediation Plan

### Immediate (24 hours)
- **None forced.** No exploitable vulnerability exists.
- ✅ Land the `deny.toml` + CI workflow added in this branch so the *current* clean state is enforced and future regressions are caught.

### Short Term (7 days)
- Add `cargo audit` to CI (workflow added here) so a *new* advisory against any of the 419 crates fails the build.
- Enable **Dependabot** (or Renovate) for the Cargo ecosystem to auto-PR patch bumps of direct deps.
- Document the accepted advisories (this report) so reviewers don't re-litigate them each scan.

### Long Term
- Track **Tauri's GTK4 / webkit2gtk-6.0 migration** — that single upstream change retires the entire gtk-rs GTK3 + glib + proc-macro-error cluster (12 of 17 findings).
- Track `urlpattern` dropping `unic-*` in favour of `std`/`icu` (retires the remaining 5).
- Re-run `cargo audit` on every Tauri minor/patch bump; prune the `deny.toml` allow-list as upstream fixes land so it never hides a *new* problem.

## Verification Commands

```bash
# from src-tauri/
cargo install cargo-audit cargo-deny --locked   # one-time

# 1. Vulnerability scan (should report 0 vulnerabilities)
cargo audit

# 2. Policy gate — advisories, licenses, banned/duplicate crates
cargo deny check

# 3. Prove the GTK/glib cluster is Linux-only (empty on host macOS/Windows):
cargo tree -i glib --target x86_64-apple-darwin        # -> empty
cargo tree -i glib --target x86_64-unknown-linux-gnu   # -> chain via tauri

# 4. Confirm nothing newer is available within semver:
cargo update --dry-run
cargo outdated   # requires: cargo install cargo-outdated
```

## Final Risk Assessment

| Metric | Value |
|---|---|
| Total advisories | 17 (0 vulnerabilities, 1 unsound, 16 unmaintained) |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low / Informational | 17 |
| Remotely exploitable | 0 |
| Memory-safety / UB | 1 (glib, Linux-only, unreachable) |
| Affecting macOS/Windows runtime binary | 0 |
| Build-time-only | 6 (proc-macro-error, 5× unic-*) |
| Fixable by upgrading today | 0 (ecosystem-pinned by Tauri 2.x) |

**Dependencies that must be upgraded immediately:** none.
**Dependencies to schedule for later maintenance:** the entire set is upstream-blocked — revisit on Tauri's GTK4 backend and `urlpattern`'s `unic` removal. No first-party action unblocks them.

**Verdict:** the FormJAM Rust backend is in **good security standing**. The right posture is to *lock in* this state with automated gates (done in this branch) and monitor upstream, not to churn dependencies.
