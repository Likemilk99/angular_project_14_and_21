# Codex Acceptance Checklist — Angular 14 Shell + Angular 14 Widgets + Latest Angular Isolated Widget

Use this checklist as a **strict acceptance gate** after generating the project.

This checklist is designed to catch the most common failures in mixed-version Angular microfrontend setups.

It should be used by Codex (or a human reviewer) to verify that the generated project is:

- architecturally correct
- runnable
- maintainable
- aligned with best practices

---

# How to Use This Checklist

Use this checklist **after code generation** and before considering the project “done”.

## Goal
The project should only be considered complete if the answers to the important checks are **YES**.

If any **critical** item fails, the implementation must be corrected.

---

# Section 1 — Repository Structure

## 1.1 Root structure
- [ ] The repository has a clear top-level structure
- [ ] Apps are separated cleanly
- [ ] Shared packages are separated cleanly
- [ ] There is a root `README.md`
- [ ] There are no obviously broken placeholder folders/files

## 1.2 Recommended folders exist
- [ ] `apps/shell-ng14/` exists
- [ ] `apps/widget-a-ng14/` exists
- [ ] `apps/widget-b-ng14/` exists
- [ ] `apps/widget-modern-latest/` exists
- [ ] `packages/shell-contract/` exists

## 1.3 Dependency isolation
- [ ] Angular 14 apps are not forced into the same fragile dependency graph as latest Angular
- [ ] The repository structure supports separate package management if needed
- [ ] There are no obvious dependency hacks to force incompatible Angular majors together

---

# Section 2 — Shell Contract Quality

## 2.1 Contract package exists
- [ ] `packages/shell-contract/` contains actual source code
- [ ] The contract package exports types/constants/helpers
- [ ] The contract is framework-agnostic

## 2.2 Contract API quality
- [ ] There is a constant for the shared event name
- [ ] There is a typed payload interface
- [ ] There is a helper to emit events
- [ ] There is a helper to subscribe to events
- [ ] Event communication is based on browser-native APIs (e.g. `CustomEvent`)

## 2.3 Contract safety
- [ ] The contract package does **not** contain Angular services
- [ ] The contract package does **not** depend on Angular internals
- [ ] The contract can be safely used by both Angular 14 and latest Angular apps

---

# Section 3 — Angular 14 Shell Quality

## 3.1 Shell exists and is Angular 14
- [ ] `shell-ng14` exists
- [ ] The shell is actually built on Angular 14
- [ ] The shell can be started independently

## 3.2 Shell routing
- [ ] `/dashboard` route exists
- [ ] `/about` route exists
- [ ] Routing is implemented cleanly

## 3.3 Shell layout
- [ ] The shell has a header
- [ ] The shell has navigation
- [ ] The shell has a dashboard area
- [ ] The shell has widget containers/cards
- [ ] The shell has an event log panel

## 3.4 Shell code quality
- [ ] The shell code is readable
- [ ] The shell does not contain unnecessary complexity
- [ ] The shell clearly separates layout, pages, and widget host logic

---

# Section 4 — Widget A Quality

## 4.1 Widget A exists and is Angular 14
- [ ] `widget-a-ng14` exists
- [ ] Widget A is actually built on Angular 14
- [ ] Widget A can run independently

## 4.2 Widget A functionality
- [ ] Widget A displays a title
- [ ] Widget A shows Angular version
- [ ] Widget A shows integration type
- [ ] Widget A has a counter
- [ ] Widget A has an increment button
- [ ] Widget A shows a timestamp
- [ ] Widget A has a “Send Event” button

## 4.3 Widget A integration
- [ ] Widget A exposes a proper Module Federation remote entry
- [ ] Widget A can be loaded by the shell
- [ ] Widget A can emit shell events

---

# Section 5 — Widget B Quality

## 5.1 Widget B exists and is Angular 14
- [ ] `widget-b-ng14` exists
- [ ] Widget B is actually built on Angular 14
- [ ] Widget B can run independently

## 5.2 Widget B functionality
- [ ] Widget B displays a title
- [ ] Widget B shows Angular version
- [ ] Widget B shows integration type
- [ ] Widget B shows a fake list of items
- [ ] Widget B has a “Refresh Data” button
- [ ] Widget B has a “Send Event” button

## 5.3 Widget B integration
- [ ] Widget B exposes a proper Module Federation remote entry
- [ ] Widget B can be loaded by the shell
- [ ] Widget B can emit shell events

---

# Section 6 — Widget Modern Quality

## 6.1 Widget Modern exists
- [ ] `widget-modern-latest` exists
- [ ] Widget Modern can run independently
- [ ] Widget Modern uses the latest Angular version available at generation time

## 6.2 Widget Modern functionality
- [ ] Widget Modern displays a title
- [ ] Widget Modern shows Angular version
- [ ] Widget Modern shows integration type
- [ ] Widget Modern has a text input
- [ ] Widget Modern has a “Send Event” button
- [ ] Widget Modern has a mounted/ready indicator

## 6.3 Widget Modern architecture
- [ ] Widget Modern is implemented as an isolated app
- [ ] Widget Modern is exposed as a custom element or mountable isolated app
- [ ] Widget Modern does **not** require Angular 14 shared runtime
- [ ] Widget Modern does **not** depend on shell Angular services
- [ ] Widget Modern can emit shell events

---

# Section 7 — Module Federation Correctness

## 7.1 Native federation exists
- [ ] Shell is configured as a Module Federation host
- [ ] Widget A is configured as a remote
- [ ] Widget B is configured as a remote

## 7.2 Explicit dependency sharing
- [ ] Shared dependencies are configured explicitly
- [ ] Angular 14 apps share only intended dependencies
- [ ] Shared dependencies include only appropriate Angular 14 packages

## 7.3 Dangerous patterns are absent
- [ ] There is **no blind `shareAll()` usage** across all apps
- [ ] There is **no unsafe Angular sharing** between Angular 14 and latest Angular
- [ ] Widget Modern is **not** treated as a normal Angular shared remote module

---

# Section 8 — Cross-Version Safety (Critical)

This section is **critical**.

If any of these fail, the architecture is incorrect.

## 8.1 Runtime isolation
- [ ] Angular 14 shell shares Angular runtime only with Angular 14 widgets
- [ ] Widget Modern runs on its **own Angular runtime**
- [ ] Widget Modern is isolated from Angular 14 DI/runtime

## 8.2 No unsafe cross-major coupling
- [ ] Shell does not inject Angular services into Widget Modern
- [ ] Widget Modern does not import shell Angular code
- [ ] Widget Modern does not rely on Angular 14 router or injector

## 8.3 Integration boundary is correct
- [ ] The shell treats Widget Modern as a DOM/custom-element/mountable app boundary
- [ ] The shell does **not** treat Widget Modern as a shared Angular feature module

---

# Section 9 — Shell Event Log (Critical)

## 9.1 Event log exists
- [ ] The shell displays an event log UI
- [ ] The event log is visible on the dashboard

## 9.2 Event log data quality
- [ ] The event log displays event source
- [ ] The event log displays event message
- [ ] The event log displays timestamp

## 9.3 Event flow works
- [ ] Widget A can send events to shell
- [ ] Widget B can send events to shell
- [ ] Widget Modern can send events to shell
- [ ] The shell receives all 3 event sources correctly

---

# Section 10 — Widget Loading / Mount Lifecycle

## 10.1 Angular 14 widgets
- [ ] Widget A has a clear loading path
- [ ] Widget B has a clear loading path
- [ ] Errors are not silently swallowed

## 10.2 Widget Modern
- [ ] Widget Modern has a clear mount lifecycle
- [ ] The shell shows loading state for Widget Modern
- [ ] The shell shows ready state for Widget Modern
- [ ] The shell shows error state if Widget Modern fails to load

## 10.3 Stability
- [ ] Widget Modern mounting does not break shell rendering
- [ ] Re-rendering/reloading the shell does not obviously duplicate or corrupt Widget Modern mounting

---

# Section 11 — Developer Experience

## 11.1 Local startup
- [ ] Each app has a working start/serve script
- [ ] Each app has a working build script
- [ ] Startup commands are documented

## 11.2 Stable ports
- [ ] Shell has a stable dev port
- [ ] Widget A has a stable dev port
- [ ] Widget B has a stable dev port
- [ ] Widget Modern has a stable dev port

## 11.3 Developer usability
- [ ] It is reasonably easy to run the project locally
- [ ] There is no obviously confusing startup process
- [ ] Optional root convenience scripts exist or startup is clearly documented

---

# Section 12 — UI / Demo Quality

## 12.1 Dashboard clarity
- [ ] Dashboard visually separates all widgets
- [ ] Dashboard layout is understandable
- [ ] Event log is clearly visible

## 12.2 Demo clarity
- [ ] Each widget clearly shows its Angular version
- [ ] Each widget clearly shows its integration type
- [ ] The difference between native federation and isolated widget is visible

## 12.3 Polish
- [ ] Styling is minimal but clean
- [ ] The demo does not look broken or unfinished
- [ ] Obvious empty placeholders are absent

---

# Section 13 — README / Documentation (Critical)

## 13.1 README exists
- [ ] Root `README.md` exists
- [ ] README is readable and complete

## 13.2 README explains architecture
- [ ] README explains the shell role
- [ ] README explains native Angular 14 remotes
- [ ] README explains isolated latest Angular widget
- [ ] README explains why this architecture is correct

## 13.3 README explains setup
- [ ] README includes install instructions
- [ ] README includes startup instructions
- [ ] README includes ports
- [ ] README includes troubleshooting notes or helpful caveats

## 13.4 README explains design decisions
- [ ] README explains dependency sharing strategy
- [ ] README explains shell contract package
- [ ] README explains event-based communication
- [ ] README explains cross-version isolation strategy

## 13.5 README includes scaling guidance
- [ ] README includes guidance for scaling to 20+ widgets
- [ ] README mentions migration strategy or platform governance ideas

---

# Section 14 — Code Smell / Anti-Pattern Review

Use this section to catch “looks okay but is actually bad” implementations.

## 14.1 Architecture smells
- [ ] There is no fake “shared core” that tightly couples all apps
- [ ] There is no hidden cross-app Angular singleton hack
- [ ] There is no brittle dependency trickery masking version conflicts

## 14.2 Runtime smells
- [ ] There is no accidental Angular runtime sharing across majors
- [ ] There is no shell-to-widget-modern Angular DI coupling
- [ ] There is no “works only because of a lucky dev setup” dependency issue

## 14.3 Codegen smells
- [ ] There are no obvious TODO placeholders in core logic
- [ ] There are no fake or stubbed integration points pretending to work
- [ ] There are no clearly dead/unwired components in the main flow

---

# Section 15 — Final Acceptance Gate

This section determines whether the project can be accepted.

## The project is ACCEPTED only if all of these are true:
- [ ] Shell starts successfully
- [ ] Widget A starts successfully
- [ ] Widget B starts successfully
- [ ] Widget Modern starts successfully
- [ ] Shell loads Widget A
- [ ] Shell loads Widget B
- [ ] Shell renders Widget Modern
- [ ] Widget A sends events to shell
- [ ] Widget B sends events to shell
- [ ] Widget Modern sends events to shell
- [ ] Shell event log shows all events
- [ ] Angular 14 apps share runtime correctly
- [ ] Widget Modern remains isolated
- [ ] README is complete
- [ ] The architecture is clean enough to use as a real reference implementation

---

# Reviewer Verdict

Use one of the following:

## PASS
Use PASS only if:
- all critical items are green
- no major architecture violations exist
- the project is genuinely runnable and understandable

## PASS WITH FIXES
Use PASS WITH FIXES if:
- architecture is mostly correct
- a few non-critical issues remain
- project is still a good reference with small improvements needed

## FAIL
Use FAIL if:
- mixed Angular runtime is handled incorrectly
- shell/widget integration is broken
- event flow is broken
- the project is not actually runnable
- documentation is insufficient
- the architecture violates core best practices

---

# Final Reviewer Instruction

Do not accept the project just because it “kind of works”.

Accept it only if it is:

- structurally correct
- technically safe
- maintainable
- useful as a real-world reference starter
