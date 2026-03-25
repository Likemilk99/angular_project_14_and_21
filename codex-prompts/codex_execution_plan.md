# Codex Execution Plan — Angular 14 Shell + Angular 14 Widgets + Latest Angular Isolated Widget

This document is a **strict implementation plan** for Codex.

It exists to prevent common code-generation failures such as:

- broken Angular workspace setup
- incompatible Angular dependency graphs
- incorrect Module Federation sharing
- cross-version Angular runtime conflicts
- partially generated non-runnable apps

The goal is to generate a **working, clean, best-practice reference implementation**.

---

# Mission

Build a **microfrontend reference workspace** with:

- **Shell** → Angular 14
- **Widget A** → Angular 14
- **Widget B** → Angular 14
- **Widget Modern** → latest Angular version
- Angular 14 widgets integrated as **native federated remotes**
- latest Angular widget integrated as **isolated cross-version widget**

The final result must be **runnable**, **documented**, and **architecturally correct**.

---

# Hard Rules

These are mandatory.

## Rule 1 — Never share Angular runtime across Angular majors
Angular 14 shell and Angular 14 widgets may share Angular runtime.

The latest Angular widget must **not** share Angular runtime with Angular 14 apps.

This is the most important rule in the project.

---

## Rule 2 — Do not use `shareAll()` blindly
Never use a blanket “share everything” approach unless explicitly constrained.

Prefer explicit shared dependency lists.

---

## Rule 3 — Keep the project runnable at every major step
After each major implementation phase, ensure the generated code is still buildable and logically runnable.

Avoid generating 20 broken files before testing architecture assumptions.

---

## Rule 4 — Optimize for maintainability, not cleverness
Choose the solution that a real team could support.

Do not use hacks unless absolutely necessary.

---

# Recommended Repository Layout

Use this structure unless there is a strong technical reason to deviate:

```txt
microfrontend-platform-demo/
  README.md
  package.json

  apps/
    shell-ng14/
    widget-a-ng14/
    widget-b-ng14/
    widget-modern-latest/

  packages/
    shell-contract/
    shared-styles/

  scripts/
    start-all.(js|ts|sh)
```

---

# Dependency / Versioning Strategy

Because Angular 14 and latest Angular should not be forced into one dependency graph:

## Preferred strategy
Each app can have its **own package.json** and isolated dependency tree.

This is acceptable and often preferable.

## Allowed options
- multiple independent Angular app roots
- workspace with isolated package boundaries
- nested workspaces

## Avoid
- one fragile root dependency tree trying to satisfy Angular 14 and latest Angular together

---

# Required App Responsibilities

---

# App 1 — `shell-ng14`

## Angular version
Angular 14

## Role
Host / shell application

## Responsibilities
- provides dashboard layout
- provides routing
- loads native Angular 14 remotes
- hosts isolated latest Angular widget
- displays event log
- shows integration status

## Required routes
- `/dashboard`
- `/about`

---

# App 2 — `widget-a-ng14`

## Angular version
Angular 14

## Role
Native federated remote

## Responsibilities
- expose Angular component/module through Module Federation
- display simple counter widget
- send events to shell

---

# App 3 — `widget-b-ng14`

## Angular version
Angular 14

## Role
Native federated remote

## Responsibilities
- expose Angular component/module through Module Federation
- display simple list widget
- send events to shell

---

# App 4 — `widget-modern-latest`

## Angular version
Latest Angular version available at generation time

## Role
Isolated cross-version widget

## Responsibilities
- build independently
- expose custom element or mount API
- run on its own Angular runtime
- send events to shell

---

# Package 1 — `packages/shell-contract`

This package is mandatory.

It should contain the shared framework-agnostic communication contract.

## Responsibilities
- define shared event names
- define payload types
- define helper functions

## Example API
```ts
export const SHELL_WIDGET_EVENT = 'shell-widget-event';

export type WidgetSource = 'widget-a' | 'widget-b' | 'widget-modern';

export interface ShellWidgetEvent {
  source: WidgetSource;
  message: string;
  timestamp: string;
}

export function emitShellEvent(payload: ShellWidgetEvent): void;
export function subscribeToShellEvents(
  handler: (payload: ShellWidgetEvent) => void
): () => void;
```

## Important
This package must be **framework-agnostic**.

Do not put Angular services or Angular-specific abstractions in this package.

It must be safe for both Angular 14 and latest Angular to use.

---

# Recommended Generation Order (Mandatory)

Generate the project in the following order.

Do not skip or reorder casually.

---

# Phase 1 — Create Project Skeleton

## Tasks
1. Create root folder structure
2. Create root README scaffold
3. Create root package.json (if using one)
4. Create scripts folder
5. Create package placeholders

## Verify
At the end of this phase, the repo structure should be clear and documented.

---

# Phase 2 — Create `packages/shell-contract`

## Tasks
1. Create shared contract package
2. Add:
   - event constants
   - payload interfaces
   - helper functions
3. Export a clean API

## Recommended implementation
Use browser-native eventing:

```ts
window.dispatchEvent(new CustomEvent(...))
window.addEventListener(...)
```

Wrap this in typed helper functions.

## Verify
At the end of this phase:
- shell-contract should be framework-agnostic
- API should be clean and reusable
- no Angular dependency should exist in this package

---

# Phase 3 — Create Angular 14 Shell

## Tasks
1. Generate Angular 14 shell app
2. Add Angular routing
3. Add dashboard page
4. Add about page
5. Add shell layout:
   - header
   - nav
   - dashboard cards
   - event log card

## Required shell components/pages
Recommended minimum:

```txt
app/
  app.module.ts
  app-routing.module.ts

  layout/
    shell-layout.component.*

  pages/
    dashboard/
    about/

  components/
    shell-event-log/
    widget-host-card/
    widget-modern-host/
```

## Verify
At the end of this phase:
- shell app starts independently
- `/dashboard` works
- `/about` works

Do not proceed until shell runs cleanly.

---

# Phase 4 — Create Angular 14 Widget A

## Tasks
1. Generate Angular 14 app `widget-a-ng14`
2. Add Module Federation remote setup
3. Expose a widget module or component
4. Build simple UI:
   - title
   - version badge
   - integration badge
   - counter
   - increment button
   - timestamp
   - send event button

## Event behavior
“Send Event” should emit:

```ts
{
  source: 'widget-a',
  message: '...some message...',
  timestamp: new Date().toISOString()
}
```

using the shared shell contract.

## Verify
At the end of this phase:
- widget-a builds
- widget-a can run independently
- exposed remote entry exists

---

# Phase 5 — Create Angular 14 Widget B

## Tasks
1. Generate Angular 14 app `widget-b-ng14`
2. Add Module Federation remote setup
3. Expose a widget module or component
4. Build simple UI:
   - title
   - version badge
   - integration badge
   - list of fake items
   - refresh button
   - send event button

## Event behavior
“Send Event” should emit:

```ts
{
  source: 'widget-b',
  message: '...some message...',
  timestamp: new Date().toISOString()
}
```

## Verify
At the end of this phase:
- widget-b builds
- widget-b runs independently
- exposed remote entry exists

---

# Phase 6 — Wire Shell ↔ Angular 14 Remotes

This is the first real integration phase.

## Tasks
1. Configure shell Module Federation host
2. Register remotes:
   - widget-a-ng14
   - widget-b-ng14
3. Add explicit shared dependency config
4. Load remotes into dashboard

## Important shared dependencies
Explicitly share only these (or similarly justified minimal set):

- `@angular/core`
- `@angular/common`
- `@angular/router`
- `rxjs`

## Strong recommendation
Do not use blind:

```ts
shareAll(...)
```

If a helper is used, constrain it carefully.

## Verify
At the end of this phase:
- shell loads widget-a
- shell loads widget-b
- both render on `/dashboard`

Do not proceed until native federation works cleanly.

---

# Phase 7 — Wire Event Log for Angular 14 Widgets

## Tasks
1. In shell, subscribe to shell contract events
2. Add event log UI
3. Display:
   - source
   - message
   - timestamp
4. Verify widget-a and widget-b can send messages to shell

## Recommended UI
A simple list or table in a card:

```txt
[10:20:30] widget-a → Counter updated
[10:21:12] widget-b → Data refreshed
```

## Verify
At the end of this phase:
- event communication works for both Angular 14 widgets
- shell event log updates live

---

# Phase 8 — Create Latest Angular Widget (Isolated)

This is the most sensitive phase.

## Tasks
1. Generate `widget-modern-latest` using latest Angular version
2. Build it as a **fully isolated app**
3. Prefer implementing as **Angular Element / custom element**
4. Add UI:
   - title
   - version badge
   - integration badge
   - text input
   - send event button
   - mounted/ready indicator

## Required UI labels
It should visibly show:

- latest Angular version
- `Isolated Cross-Version`

## Event behavior
Use the same shell contract package shape (or duplicated compatible contract if package sharing is impractical across isolated installs).

Payload example:

```ts
{
  source: 'widget-modern',
  message: '...some message...',
  timestamp: new Date().toISOString()
}
```

## Critical rule
Do not make this widget depend on:
- Angular 14 runtime
- shell Angular services
- shell injector
- Angular 14 shared packages

## Verify
At the end of this phase:
- widget-modern runs independently
- widget-modern builds cleanly
- widget-modern can emit browser events

Do not proceed until isolation is real.

---

# Phase 9 — Integrate Latest Angular Widget into Shell

## Tasks
1. Add a dedicated host component in shell, for example:

```txt
widget-modern-host.component
```

2. Dynamically load the modern widget asset or registration bundle
3. Render the custom element into the DOM
4. Show:
   - loading state
   - ready state
   - failure state

## Recommended behavior
The shell host component should:

- inject/load remote script once
- wait for custom element registration
- render element
- handle duplicate registration safely
- avoid reloading unnecessarily

## Verify
At the end of this phase:
- modern widget renders inside shell
- shell remains stable
- Angular 14 apps still work
- no Angular runtime conflict occurs

This is a critical milestone.

---

# Phase 10 — Final UX / Hardening

## Tasks
1. Add consistent card styling
2. Add status badges
3. Add loading/error states
4. Add optional retry buttons
5. Ensure `/about` explains architecture clearly
6. Clean up naming and docs

## Recommended final dashboard cards
- Widget A
- Widget B
- Widget Modern
- Shell Event Log

## Verify
At the end of this phase:
- app looks coherent
- integration states are understandable
- code is readable and demo-ready

---

# Recommended Technical Details

---

# Shell Contract Implementation Guidance

Implement helpers like:

```ts
export const SHELL_WIDGET_EVENT = 'shell-widget-event';

export function emitShellEvent(payload: ShellWidgetEvent): void {
  window.dispatchEvent(new CustomEvent(SHELL_WIDGET_EVENT, { detail: payload }));
}

export function subscribeToShellEvents(
  handler: (payload: ShellWidgetEvent) => void
): () => void {
  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<ShellWidgetEvent>;
    handler(customEvent.detail);
  };

  window.addEventListener(SHELL_WIDGET_EVENT, listener);

  return () => {
    window.removeEventListener(SHELL_WIDGET_EVENT, listener);
  };
}
```

This keeps communication stable across framework boundaries.

---

# Angular 14 Module Federation Guidance

## Host / remotes
Use a stable Angular 14-compatible Module Federation setup.

## Recommended remote exposure
Expose one focused feature entry per widget, such as:

```txt
./WidgetModule
```

or

```txt
./WidgetComponent
```

## Recommended shell consumption
Load the remote into a dedicated host card or lazy-loaded widget container.

Keep it simple and explicit.

---

# Latest Angular Widget Isolation Guidance

## Preferred pattern
Build the latest Angular widget as a **custom element**.

### Why
This is the cleanest cross-version integration boundary because:

- the shell only sees DOM
- Angular runtimes remain isolated
- coupling stays low

## Expected shell behavior
The shell should treat it like a browser-native element, not like a shared Angular feature module.

---

# UI Structure Recommendation

Use a clean, obvious dashboard.

## Suggested visual structure

```txt
------------------------------------------------------
| Header                                             |
------------------------------------------------------
| Widget A            | Widget B                     |
------------------------------------------------------
| Widget Modern       | Shell Event Log              |
------------------------------------------------------
```

## Each widget card should show
- title
- Angular version
- integration mode
- content/actions

This is important for demo clarity.

---

# Required Stable Ports

Use stable local dev ports such as:

- `shell-ng14` → `4200`
- `widget-a-ng14` → `4201`
- `widget-b-ng14` → `4202`
- `widget-modern-latest` → `4203`

Document them in README.

---

# Required Scripts

Each app should have at minimum:

```json
"start"
"serve"
"build"
```

## Root-level convenience (recommended)
If practical, add:

```json
"start:all"
"build:all"
```

A simple script runner is enough.

Do not overengineer this.

---

# README Requirements (Mandatory)

The root `README.md` must include:

## 1) Project overview
What the project demonstrates

## 2) Architecture summary
Which apps are native federated vs isolated

## 3) Why this architecture is correct
Explain mixed Angular version strategy clearly

## 4) How to run
Install + startup steps

## 5) Ports
Stable local ports

## 6) Key design decisions
Explain:
- explicit dependency sharing
- shell contract package
- isolated latest Angular widget
- browser-event communication

## 7) Scaling guidance
How this pattern can scale to 20+ widgets

This documentation is part of the deliverable, not optional polish.

---

# Anti-Patterns to Avoid

Do not generate any of the following:

## Forbidden
- Angular 21+ widget consuming Angular 14 shared runtime
- shell Angular services imported directly into latest Angular widget
- giant shared “core” library tightly coupling everything
- hidden cross-app singleton hacks
- massive abstraction for a simple demo
- untyped event payloads
- non-runnable placeholder code
- fragile install steps that only work by accident

---

# Definition of Done

The project is complete only if all of the following are true:

1. Shell runs
2. Widget A runs
3. Widget B runs
4. Widget Modern runs
5. Shell loads Widget A
6. Shell loads Widget B
7. Shell renders Widget Modern
8. Widget A sends event to shell
9. Widget B sends event to shell
10. Widget Modern sends event to shell
11. Shell event log displays all messages
12. Angular 14 apps share runtime safely
13. Latest Angular widget remains isolated
14. README explains architecture clearly

If any of these are missing, the project is incomplete.

---

# Final Instruction to Codex

Implement this as if it will be handed to a **frontend platform team** and reviewed by a **staff engineer**.

Prioritize:

- correctness
- clarity
- maintainability
- version safety
- realistic enterprise best practices

Do not optimize for shortest possible code.

Do not fake the architecture.

Build the project so that it is:

- understandable
- runnable
- defensible in a real engineering review
