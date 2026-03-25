# Codex Specification Prompt — Best Practice Enterprise Version

Build a **production-quality microfrontend reference workspace** that demonstrates **Angular Module Federation with mixed Angular versions** using **best practices**.

This project is **not** a toy example.  
It should be generated as a **clean enterprise-ready reference starter** for a platform that currently runs on **Angular 14**, while safely introducing one **latest Angular** widget.

---

# Core Goal

Demonstrate a **safe mixed-version microfrontend architecture** with:

- **Shell app** → Angular **14**
- **Widget A** → Angular **14**
- **Widget B** → Angular **14**
- **Widget Modern** → **latest Angular version available**
- Angular 14 widgets are **native federated remotes**
- The latest Angular widget is **isolated** and **must not share Angular runtime**
- The final result should reflect **best practices for scalability, maintainability, observability, and migration-readiness**

---

# Non-Negotiable Architecture Principles

## 1) Platform stability over novelty
The architecture must optimize for:

- maintainability
- debuggability
- deployment safety
- clean ownership boundaries
- future migration

Do **not** optimize for clever tricks.

---

## 2) Angular 14 widgets are “native citizens”
The Angular 14 widgets must behave like **first-class platform widgets**:

- same Angular major as shell
- normal Module Federation integration
- shared Angular runtime
- shared dependency graph where appropriate

---

## 3) Latest Angular widget is an “isolated foreign app”
The latest Angular widget must **not** behave like a normal shared Angular remote.

It must be isolated using one of these patterns:

### Preferred
- **Web Component / Angular Element / custom element**

### Acceptable fallback
- a self-contained remote exposing `mount(container, props)` / `unmount()`

### Forbidden
- exposing a normal Angular module that expects to run inside Angular 14 shared runtime

This is a **hard rule**.

---

# Expected Deliverable

Generate a **fully runnable workspace** that contains:

- 1 Angular 14 shell
- 2 Angular 14 widgets
- 1 latest Angular isolated widget
- shared shell communication contract
- working dashboard
- clear runtime boundaries
- clean documentation
- reliable local developer experience

The result should be something a senior engineer could realistically use as a **starter repo**.

---

# Recommended Repository Strategy (Best Practice)

Because Angular 14 and latest Angular should **not** be forced into one fragile dependency tree, use a structure that reflects **runtime and version boundaries**.

## Recommended structure

```txt
microfrontend-platform-demo/
  package.json
  README.md

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

## Important versioning rule
Each app may have its **own package.json** if necessary.

This is preferred over pretending all Angular versions can coexist cleanly in one package tree.

### Acceptable approaches
- separate `package.json` per app
- nested workspaces
- npm/pnpm/yarn workspaces with isolation

### Avoid
- one forced dependency graph that introduces version conflict hacks

---

# Required Technology Choices

Use these technologies unless there is a strong technical reason not to:

## Shell + Angular 14 widgets
- Angular 14
- TypeScript
- Webpack 5
- Angular CLI compatible setup
- `@angular-architects/module-federation` or equivalent stable Angular 14 MF setup

## Latest Angular widget
- latest Angular version available at generation time
- TypeScript
- standalone APIs if appropriate for latest Angular
- Angular Elements / custom elements preferred
- independent build and runtime

## Shared communication
Use browser-native communication:

- `CustomEvent`
- `window.dispatchEvent`
- typed event helper abstraction

This is preferred over coupling apps through Angular services.

---

# Best Practice Requirements

The generated solution must follow these engineering best practices.

---

# 1) Clear Runtime Boundaries

The code must make it obvious which parts are:

- **shared runtime**
- **isolated runtime**

## Required distinction

### Native Federated
These apps share Angular runtime:

- shell-ng14
- widget-a-ng14
- widget-b-ng14

### Isolated
This app does **not** share Angular runtime:

- widget-modern-latest

This distinction should be visible in:

- code structure
- config
- documentation
- UI labels

---

# 2) Explicit Dependency Sharing

Do **not** use lazy or dangerous dependency sharing like “share everything blindly”.

## Forbidden pattern
Avoid things like:

```ts
shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })
```

unless carefully constrained and justified.

## Best practice
Use **explicit shared dependency configuration** for Angular 14 apps only.

### Angular 14 native shared dependencies
Share only what is intentionally shared:

- `@angular/core`
- `@angular/common`
- `@angular/router`
- `rxjs`

Optionally:
- small internal shell contract package if implemented safely

### Latest Angular widget
Do **not** share Angular dependencies with shell.

This is non-negotiable.

---

# 3) Strong App Contract

Implement a **small typed shell contract** package.

Create something like:

```txt
packages/shell-contract/
```

This package should define:

- event types
- message payload interfaces
- event names/constants
- helper functions for publishing/subscribing

## Example types
```ts
export type WidgetSource = 'widget-a' | 'widget-b' | 'widget-modern';

export interface ShellWidgetEvent {
  source: WidgetSource;
  message: string;
  timestamp: string;
}
```

## Example event constant
```ts
export const SHELL_WIDGET_EVENT = 'shell-widget-event';
```

## Example helper
```ts
export function emitShellEvent(payload: ShellWidgetEvent): void
```

This contract should be used by:

- shell
- widget-a
- widget-b
- widget-modern

This is important because **cross-version communication must happen through stable contracts, not framework internals**.

---

# 4) Clean Widget Lifecycle

The shell must manage widgets in a clean and observable way.

## Angular 14 widgets
Load them as normal federated remotes.

## Latest Angular widget
Mount it via:

### Preferred
- custom element insertion into a host container

### Required lifecycle handling
The shell must:

- create host container
- render isolated widget into it
- show status if load succeeds/fails
- avoid silent failures

## Optional but recommended
Add:

- loading state
- error state
- retry button

This is a best-practice platform behavior.

---

# 5) Observability / Debuggability

Add basic but useful observability.

## Required
The shell must show:

- a visible **Shell Event Log**
- source widget
- message
- timestamp

## Recommended
Also log:

- remote loaded successfully
- remote failed to load
- isolated widget mounted successfully

These can be shown in UI or console, but should be easy to debug.

This is important for real-world microfrontend supportability.

---

# Functional Requirements

---

# Shell App (Angular 14)

Create an Angular 14 shell application named:

```txt
shell-ng14
```

## Shell responsibilities
The shell must:

- act as the **host/container**
- define dashboard layout
- define routes
- load all widgets
- host the shell event log
- provide integration containers/cards
- show integration metadata

## Shell routes
Must include:

- `/dashboard`
- `/about`

### `/dashboard`
Display all widgets on one page.

### `/about`
Explain architecture and integration modes.

## Shell layout
Use a clean responsive dashboard layout with:

- header
- nav
- content area
- widget cards
- shell event log card

Use minimal but polished styling.

---

# Widget A (Angular 14)

Create:

```txt
widget-a-ng14
```

## Integration type
- Native Federated
- Angular 14
- shared runtime with shell

## UI requirements
Display:

- title: `"Widget A"`
- Angular version badge
- integration type badge
- counter
- increment button
- current timestamp
- “Send Event” button

## Behavior
When “Send Event” is clicked:

- emit a typed shell event
- source must be `widget-a`

---

# Widget B (Angular 14)

Create:

```txt
widget-b-ng14
```

## Integration type
- Native Federated
- Angular 14
- shared runtime with shell

## UI requirements
Display:

- title: `"Widget B"`
- Angular version badge
- integration type badge
- small fake data list
- “Refresh Data” button
- “Send Event” button

## Behavior
When “Refresh Data” is clicked:
- regenerate fake list items

When “Send Event” is clicked:
- emit a typed shell event
- source must be `widget-b`

---

# Widget Modern (Latest Angular)

Create:

```txt
widget-modern-latest
```

This widget must use the **latest Angular version available at generation time**.

## Integration type
- Isolated Cross-Version
- separate Angular runtime
- no Angular dependency sharing

## Preferred implementation
Implement this widget as an **Angular Element / custom element**.

For example, expose something like:

```html
<widget-modern-root></widget-modern-root>
```

The shell should dynamically load and render it.

## UI requirements
Display:

- title: `"Widget Modern"`
- Angular version badge
- integration type badge: `"Isolated Cross-Version"`
- a small text input
- a “Send Event” button
- mount status indicator: `"Mounted"` / `"Ready"`

## Behavior
When “Send Event” is clicked:

- emit a typed shell event
- source must be `widget-modern`

## Important
This widget must be fully self-contained.

It must not depend on:

- shell Angular injector
- shell services
- Angular 14 shared packages

---

# Module Federation Requirements

---

# Shell ↔ Angular 14 Widgets

Use standard Angular Module Federation for:

- shell-ng14
- widget-a-ng14
- widget-b-ng14

## Shared dependencies
Configure **explicitly**:

- `@angular/core`
- `@angular/common`
- `@angular/router`
- `rxjs`

Use stable singleton configuration appropriate for Angular 14.

## Remote loading
Use dynamic remote loading in the shell.

The shell dashboard should display both Angular 14 widgets inside their own containers.

---

# Widget Modern Integration

## Hard requirement
Do **not** integrate the modern widget as a normal Angular remote module.

## Preferred loading model
One of the following:

### Best option
- shell loads `remoteEntry.js` or equivalent asset
- remote registers custom element
- shell inserts the custom element into DOM

### Acceptable alternative
- remote exposes a `mount(container)` function
- shell calls `mount()` in a host container

## Critical rule
Even if Module Federation is used for delivery/loading, the latest Angular widget must remain:

- self-contained
- isolated
- runtime-independent

---

# Shell Communication Contract

Implement a small but real shared communication mechanism.

This is important and should be done **cleanly**.

## Required package
Create:

```txt
packages/shell-contract/
```

## It should include
- event name constants
- payload types
- helper methods

## Recommended API
```ts
export const SHELL_WIDGET_EVENT = 'shell-widget-event';

export interface ShellWidgetEvent {
  source: 'widget-a' | 'widget-b' | 'widget-modern';
  message: string;
  timestamp: string;
}

export function emitShellEvent(payload: ShellWidgetEvent): void;
export function subscribeToShellEvents(handler: (payload: ShellWidgetEvent) => void): () => void;
```

## Required behavior
All 3 widgets must use this contract to send messages to shell.

The shell must subscribe to these events and display them in a visible log panel.

This communication must be framework-agnostic.

---

# UI / UX Requirements

Keep styling minimal but professional.

## Dashboard must contain
1. Header
2. Widget A card
3. Widget B card
4. Widget Modern card
5. Shell Event Log card

## Each widget card must visibly show
- widget name
- Angular version
- integration type

Examples:
- `Angular 14`
- `Native Federated`

or

- `Angular 21` (or latest)
- `Isolated Cross-Version`

## Error handling UX
For remote loading/mounting, show at least basic UI states:

- loading
- ready
- failed

This is important for best practice.

---

# Code Quality Expectations

The generated code must reflect good engineering practices.

## Must have
- clean folder structure
- readable naming
- clear boundaries
- minimal duplication
- typed APIs
- simple components
- small focused files where practical

## Avoid
- unnecessary patterns
- giant god-services
- fake enterprise abstraction
- deeply coupled cross-app code
- hidden magic

## Comments
Add comments only where they clarify:
- why the architecture works
- why the modern widget is isolated
- why Angular runtime is not shared across majors

---

# Routing Requirements

## Shell routes
Must include:

- `/dashboard`
- `/about`

## About page content
The `/about` page should briefly explain:

- what “Native Federated” means
- what “Isolated Cross-Version” means
- why this architecture is correct

This is useful for demo clarity.

---

# Local Development Experience

The project should be easy to run.

## Stable ports
Use stable dev ports such as:

- shell-ng14 → `4200`
- widget-a-ng14 → `4201`
- widget-b-ng14 → `4202`
- widget-modern-latest → `4203`

## Required scripts
Each app should have:

```json
"start"
"serve"
"build"
```

## Root-level developer convenience
If practical, provide root-level scripts like:

```json
"start:all"
"build:all"
```

If unified scripts are not practical, document exact startup commands clearly.

---

# Required Documentation

Create a **high-quality root README.md**.

This is mandatory.

The README must include the following sections:

---

## 1) Overview
Explain what the project demonstrates.

---

## 2) Architecture Summary
Explain:

- Shell = Angular 14
- Widget A/B = Angular 14 native federated
- Widget Modern = latest Angular isolated

---

## 3) Why this architecture is correct
Explain clearly:

- Angular 14 apps can safely share Angular runtime
- latest Angular widget must not share Angular runtime with Angular 14 shell
- this is the correct migration-safe approach

---

## 4) Architecture Diagram
Include a simple diagram such as:

```txt
Shell (Angular 14)
 ├── Widget A (Angular 14, Native Federated)
 ├── Widget B (Angular 14, Native Federated)
 └── Widget Modern (Latest Angular, Isolated Web Component)
```

---

## 5) How to Run
Include:

- prerequisites
- install instructions
- startup instructions
- ports
- troubleshooting notes

---

## 6) Design Decisions
Document:

- explicit dependency sharing
- shell contract package
- isolated modern widget strategy
- communication via browser events

---

## 7) Scaling Guidance
Add a short section describing how this architecture can scale to:

- 20+ widgets
- platform governance
- gradual Angular upgrade strategy

This is important for real-world relevance.

---

# Implementation Order (Very Important)

Generate the project in the following order to reduce errors and improve stability.

## Step 1
Create the root structure and README scaffold.

## Step 2
Create `packages/shell-contract` with typed event helpers.

## Step 3
Create Angular 14 shell.

## Step 4
Create Angular 14 widget-a remote.

## Step 5
Create Angular 14 widget-b remote.

## Step 6
Wire shell ↔ widget-a/widget-b federation.

## Step 7
Create latest Angular widget-modern as isolated custom element.

## Step 8
Integrate widget-modern into shell.

## Step 9
Add event log and communication wiring.

## Step 10
Add styling, loading/error states, and final documentation.

Do not jump randomly between apps without maintaining runnable state.

---

# Success Criteria

The project is successful only if all of the following are true:

1. Shell starts successfully
2. Widget A loads into shell
3. Widget B loads into shell
4. Widget Modern loads into shell
5. Widget Modern runs on latest Angular without Angular version conflict
6. Angular 14 shell and Angular 14 widgets share Angular runtime correctly
7. Widget Modern does **not** share Angular runtime with shell
8. All widgets can emit events to shell
9. Shell event log shows those events correctly
10. The codebase is understandable, stable, and representative of best practices

---

# Forbidden Mistakes

Do **not** do any of the following:

- Do not claim mixed Angular majors can safely share Angular runtime
- Do not use `shareAll()` blindly across all apps
- Do not expose latest Angular widget as a normal Angular 14-compatible remote module
- Do not tightly couple widgets to shell services
- Do not rely on undocumented hacks
- Do not generate placeholder code that does not actually run

---

# Final Instruction to Codex

Generate this project as if it will be reviewed by a **senior frontend platform architect**.

Optimize for:

- correctness
- maintainability
- clarity
- long-term migration safety
- realistic enterprise best practices

Do not optimize for “shortest code”.  
Do not optimize for “most clever trick”.  
Optimize for **clean architecture that would survive in a real company**.
