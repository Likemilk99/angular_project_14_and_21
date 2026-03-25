# Codex Specification Prompt

Build a **microfrontend demo workspace** that demonstrates **Angular Module Federation with mixed Angular versions** in a **safe and maintainable way**.

The goal is to prove the following architecture:

- **Shell app** → Angular **14**
- **Widget 1** → Angular **14**
- **Widget 2** → Angular **14**
- **Widget 3** → **latest Angular version available** at generation time
- The **Angular 14 widgets must behave as native federated Angular widgets**
- The **latest Angular widget must be isolated**, and **must NOT share Angular runtime with the shell**

This project should be structured and documented as if it were a **reference implementation** for a real enterprise microfrontend platform.

---

## High-Level Requirements

### Main objective
Create a runnable demo showing:

1. A **Shell (Angular 14)** that loads 3 widgets
2. Two widgets built with **Angular 14**, loaded through **normal Module Federation**
3. One widget built with the **latest Angular version**, loaded in an **isolated way**
4. A dashboard page in the shell that displays all three widgets together
5. A clear demonstration of:
   - **native federated widgets**
   - **isolated cross-version widget**
   - **safe communication between shell and widgets**

---

## Architecture Rules

### 1) Shell
Create a **Shell application using Angular 14**.

The shell must:

- act as the **host/container**
- provide a simple dashboard layout
- dynamically load all 3 widgets
- expose a simple shared shell API for communication
- use **Webpack Module Federation**
- use **Angular routing**
- have a homepage `/dashboard`

The shell should have a clean layout:

- Header
- Navigation
- Dashboard content area
- 3 widget cards/containers

---

### 2) Angular 14 widgets
Create two Angular 14 widgets:

- `widget-a`
- `widget-b`

These must be implemented as **standard Angular Module Federation remotes**.

#### Requirements
They must:

- use **Angular 14**
- expose Angular modules/components via Module Federation
- be loaded normally by the Angular 14 shell
- share Angular dependencies with the shell:
  - `@angular/core`
  - `@angular/common`
  - `@angular/router`
  - `rxjs`

#### UI behavior

##### Widget A
Show:

- title: `"Widget A (Angular 14)"`
- a counter with increment button
- current timestamp
- a button to send an event/message to shell

##### Widget B
Show:

- title: `"Widget B (Angular 14)"`
- a small list of items
- a button to refresh/reload fake data
- a button to send an event/message to shell

These should be intentionally simple, but implemented cleanly.

---

### 3) Latest Angular widget
Create a third widget:

- `widget-modern`

This widget must use the **latest Angular version available at generation time**.

### Critical architecture rule
This widget **must NOT be integrated as a normal Angular federated remote module**.

Instead, it must be integrated using one of the following **safe isolation approaches**:

#### Preferred approach
**Expose as a Web Component / Angular Element / custom element**

#### Acceptable fallback
A self-contained remote with a `mount()` API

#### Do NOT do this
Do **not** expose an Angular module intended to run against Angular 14 shared runtime.

#### Isolation requirements
The latest Angular widget must:

- bundle and use its **own Angular runtime**
- **not share Angular packages** with shell
- **not share Angular DI/runtime**
- **not depend on shell Angular internals**

#### UI behavior
Show:

- title: `"Widget Modern (Latest Angular - Isolated)"`
- current framework version displayed in UI
- a simple text input
- a button that emits a custom event to the shell
- a small “status” indicator showing it mounted successfully

---

## Communication Requirements

Implement a **simple shell-widget communication contract**.

This should work for both:

- Angular 14 native widgets
- latest Angular isolated widget

### Use a simple shared communication mechanism
Recommended approaches:

- `window.dispatchEvent(...)`
- `CustomEvent`
- lightweight event bus abstraction
- shell API wrapper

### Required demo behavior
All widgets should be able to send a message to the shell.

When a widget sends a message:

- shell should capture it
- shell should display it in a “Shell Event Log” panel

#### Example event payload
```ts
{
  source: 'widget-a' | 'widget-b' | 'widget-modern',
  message: string,
  timestamp: string
}
```

---

## Routing Requirements

The shell must expose:

- `/dashboard` → main page showing all widgets
- `/about` → simple explanation page

The Angular 14 widgets may optionally expose child routes, but this is not required.

The latest Angular widget should remain **embedded and isolated**, not shell-routed as a shared Angular feature module.

---

## Build / Workspace Requirements

### Preferred workspace setup
Use a **monorepo** structure if practical.

Recommended structure:

```txt
workspace/
  apps/
    shell/
    widget-a/
    widget-b/
    widget-modern/
  libs/
    shared-ui/
    shell-api/
```

If monorepo is too complex due to mixed Angular versions, it is acceptable to use:

- separate app folders / separate package roots

But the final developer experience should still feel cohesive.

### Important versioning rule
Because Angular 14 and latest Angular will likely conflict in one package graph:

#### Acceptable implementation options:
1. **Separate package.json per app**
2. **Separate workspaces**
3. **Nested app folders with isolated dependency trees**

Choose the structure that is **most reliable and easiest to run**.

Do **not** force incompatible Angular versions into one fragile dependency tree.

---

## Module Federation Requirements

### Shell + Angular 14 widgets
Use **Module Federation** normally between:

- shell
- widget-a
- widget-b

These should share:

- `@angular/core`
- `@angular/common`
- `@angular/router`
- `rxjs`

Use a configuration appropriate for Angular 14 and Webpack 5.

### Latest Angular widget
Use Module Federation **only if useful for delivery/loading**, but do **not** share Angular runtime.

#### Explicit requirement
If `widget-modern` is loaded via federation, configure it so that:

- Angular packages are **not shared**
- it behaves as a **self-contained app**
- shell only consumes:
  - a custom element
  - or mount function

---

## UX / UI Requirements

Keep styling simple but polished.

### Dashboard layout
Show 4 sections:

1. Header
2. Widget A card
3. Widget B card
4. Widget Modern card
5. Shell Event Log card

Use a simple responsive card layout.

### Each widget card should visibly indicate:
- widget name
- Angular version
- integration type:
  - `"Native Federated"`
  - `"Isolated Cross-Version"`

This is important for demo clarity.

---

## Dev Experience Requirements

### Commands
Provide clear commands to run each app independently.

Expected dev startup experience:

- shell runs on one port
- widget-a on another
- widget-b on another
- widget-modern on another

#### Example (ports can differ, but keep them stable)
- shell → `4200`
- widget-a → `4201`
- widget-b → `4202`
- widget-modern → `4203`

### Required scripts
Each app should have working scripts like:

```json
"start"
"build"
"serve"
```

Also include a root-level convenience script if possible, such as:

```json
"start:all"
```

If a root-level unified script is not practical, document the startup process clearly.

---

## Documentation Requirements

Create a high-quality `README.md` at the project root.

The README must explain:

### 1) What this demo proves
Explain clearly:

- why Angular 14 widgets can be natively federated
- why the latest Angular widget must be isolated
- why this is the correct architecture for mixed Angular versions

### 2) Architecture diagram
Include a simple ASCII or markdown architecture diagram.

Example:

```txt
Shell (Angular 14)
 ├── Widget A (Angular 14, Native Federated)
 ├── Widget B (Angular 14, Native Federated)
 └── Widget Modern (Latest Angular, Isolated Web Component)
```

### 3) How to run
Document:

- install steps
- startup steps
- ports
- troubleshooting notes

### 4) Key design decisions
Document why:

- Angular runtime is shared only for Angular 14 apps
- latest Angular widget is isolated
- communication uses browser events or shell API

### 5) Future extension ideas
Include a short section describing how this pattern could scale to:

- 20+ widgets
- enterprise shell
- gradual migration strategy

---

## Implementation Quality Requirements

The generated project must be:

- runnable
- not pseudo-code
- not half-generated
- not full of TODO placeholders
- not overengineered

### Code quality expectations
Use:

- clear naming
- simple folder organization
- clean Angular patterns
- minimal but real implementation
- comments only where useful

Avoid:

- unnecessary abstraction
- bloated architecture
- fake enterprise complexity
- unused libraries

---

## Technical Constraints

### Must use
- Angular 14 for shell, widget-a, widget-b
- latest Angular for widget-modern
- Webpack 5 / Module Federation
- TypeScript
- Angular CLI-compatible setup where practical

### Must NOT do
- Do not pretend mixed Angular majors can safely share Angular runtime
- Do not share Angular dependencies between Angular 14 shell and latest Angular widget
- Do not build the modern widget as a normal Angular 14-compatible remote module
- Do not create a fragile setup that only “kind of” works

---

## Deliverables

Generate a complete project including:

- source code for all apps
- federation configs
- startup scripts
- minimal styling
- working widget communication
- root README
- comments where needed

---

## Success Criteria

The project is successful if:

1. Shell starts successfully
2. Widget A loads inside shell
3. Widget B loads inside shell
4. Widget Modern loads inside shell
5. Widget Modern runs independently on latest Angular without Angular version conflicts
6. All widgets can send events to shell
7. Shell displays those events in a visible log
8. The codebase clearly demonstrates **native federation vs isolated cross-version integration**

---

## Extra Nice-to-Have (optional)
If practical, also include:

- a shared shell event type/interface package
- simple health/status indicator for each widget
- retry/error UI if a remote fails to load
- “Reload widget” button for demo purposes

---

## Final instruction
Generate the project in a way that a senior frontend engineer could use it as a **reference starter for a real migration strategy**, not just as a toy example.

Prioritize:

- correctness
- maintainability
- clarity of architecture
- version safety

Do not optimize for “cleverness”. Optimize for **working and understandable**.
 
