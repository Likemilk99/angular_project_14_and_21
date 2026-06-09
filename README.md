# Angular 14 shell with an isolated Angular 22 widget

This repository contains two independent Angular applications:

- `apps/shell-ng14`: the Angular 14 shell. It exposes `/widget-modern`.
- `apps/widget-modern-ng22`: an intentionally empty Angular 22 widget.

The shell renders the widget in an `iframe`. This gives the Angular 22 application its own runtime and dependency graph instead of mixing Angular 14 and Angular 22 in one injector.

## Install

Each application has an independent `package.json` and Node.js runtime boundary. Use the `.nvmrc` file inside each app before installing it (Node 16 for the Angular 14 shell and Node 22 for the Angular 22 widget):

```bash
cd apps/shell-ng14
nvm use
npm install

cd ../widget-modern-ng22
nvm use
npm install
```

## Run

Use two terminals. Select the app-specific Node.js version in each terminal before starting the app:

```bash
cd apps/widget-modern-ng22
nvm use
npm start
```

```bash
cd apps/shell-ng14
nvm use
npm start
```

Open <http://localhost:4200/widget-modern>. The shell route loads the independently served Angular 22 widget from <http://localhost:4300/>.

The widget URL can be changed for a deployment by replacing `widgetModernUrl` in the shell environment files.

## Build

Build each application with its own Node.js version:

```bash
cd apps/shell-ng14 && nvm use && npm run build
cd apps/widget-modern-ng22 && nvm use && npm run build
```
