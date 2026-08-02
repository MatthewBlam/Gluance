<!-- PROJECT LOGO -->
<div align="center">
  <a href="https://github.com/MatthewBlam/Gluance/releases/tag/v1.0.0">
    <img src="src/graphics/app-icon-1024.png" alt="Gluance icon" width="80" height="80">
  </a>

<h3 align="center">Gluance</h3>

  <p align="center">
    View and monitor glucose readings from the Dexcom Share API on your Mac.
    <br />
    Credentials stay Keychain-encrypted.
    <br />
    <br />
    For monitoring purposes only; do not use for medical decisions.
    <br />
    Download <a href="https://github.com/MatthewBlam/Gluance/releases/tag/v1.0.0">Gluance v1.0.0</a>
  </p>
</div>

[Demo](https://gluance.vercel.app/)

Gluance is an independent, unofficial application and is not affiliated with or endorsed by Dexcom, Inc.

## Features

- Live readings and history from the Dexcom Share API
- Device-agnostic glucose indicator with light and dark themes
- Configurable mg/dL or mmol/L thresholds
- Always-on-top draggable widget with optional sparkline
- Menu bar reading, automatic reconnection, and launch at login
- Keychain-encrypted Dexcom account credentials

You need a Dexcom account with an active sensor session and at least one Dexcom Share follower.

## Architecture

Gluance is an Electron app with a FastAPI Python backend that streams glucose readings over WebSocket.

```text
src/
  main.ts                  # Electron main process orchestrator
  preload.ts               # Typed context bridge (GluanceApi)
  main/                    # Main process modules
    windows.ts             # Window creation (main + widget)
    ipc-handlers.ts        # IPC handler registration
    python-backend.ts      # FastAPI child-process management
    storage.ts             # Settings + encrypted credential storage
    tray.ts                # System tray management
    menu.ts                # Native menu template
    logger.ts              # Rotating file logger (electron-log)
    launch-agent.ts        # macOS LaunchAgent login-item management
  shared/                  # Shared between main and renderers
    branding.ts            # Product identity, URLs, and disclaimer
    types.ts               # Domain types
    ipc-channels.ts        # IPC channel constants
    reading-utils.ts       # Reading formatting + range utilities
    preload.d.ts           # Window.api type declarations
  renderer/                # Main renderer (login + display)
  widget/                  # Floating widget renderer
  components/
    GlucoseIndicator.tsx   # Device-agnostic glucose indicator
  contexts/                # React contexts
  hooks/                   # Custom React hooks
  __tests__/               # Vitest + React Testing Library

python/
  entry.py                 # PyInstaller entry point
  gluance_server/
    main.py                # FastAPI app (HTTP + WebSocket)
    glucose_service.py     # Async polling through pydexcom
    models.py              # Pydantic models
  tests/                   # pytest tests
  requirements.txt
```

The Electron process starts `python3 -m gluance_server` during development and the packaged `gluance-backend` executable in production. IPC channel names, HTTP/WebSocket routes, readings, and credential formats remain stable.

## Local data

Gluance stores settings and encrypted credentials at:

```text
~/Library/Application Support/Gluance/config.json
```

Logs are written to:

```text
~/Library/Application Support/Gluance/logs/main.log
```

The Gluance identity is a clean break from earlier builds. It does not migrate or delete settings, credentials, application data, or launch-agent files created under previous names.

See [DATA_RETENTION.md](DATA_RETENTION.md) for full details.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18, < 24
- [Python](https://www.python.org/) >= 3.12
- npm

## Development

```bash
npm install
cd python && pip install -r requirements.txt && cd ..
npm start
```

To start only the backend:

```bash
cd python
python3 -m gluance_server
```

## Building

```bash
npm run make
```

This builds `gluance-backend`, packages `Gluance.app`, and creates the platform release artifacts. The macOS bundle ID is `com.matthewblam.gluance`.

## Scripts

| Command                | Description                    |
| ---------------------- | ------------------------------ |
| `npm start`            | Start development mode         |
| `npm test`             | Run Vitest tests               |
| `npm run test:watch`   | Run Vitest in watch mode       |
| `npm run lint`         | Run ESLint                     |
| `npm run build:python` | Compile `gluance-backend`      |
| `npm run package`      | Build and package the app      |
| `npm run make`         | Build distributable artifacts  |

## Tech stack

| Layer             | Technology                                      |
| ----------------- | ----------------------------------------------- |
| Desktop framework | Electron 42                                     |
| Frontend          | React 19, Tailwind CSS 4, Recharts 3, Motion 12 |
| Build             | Vite 8, TypeScript 6, Electron Forge 7          |
| Backend           | FastAPI, uvicorn, pydexcom                      |
| Testing           | Vitest, React Testing Library, pytest           |
| Linting           | ESLint 10, typescript-eslint                    |

## Release

- Repository: https://github.com/MatthewBlam/Gluance
- v1.0.0: https://github.com/MatthewBlam/Gluance/releases/tag/v1.0.0
- Demo: https://gluance.vercel.app/

## License

MIT
