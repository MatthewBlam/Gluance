# Gluance v1.0.0

The first official release of Gluance, a macOS app for viewing and monitoring continuous glucose readings from a Dexcom account.

Gluance is an independent, unofficial application and is not affiliated with or endorsed by Dexcom, Inc.

_Make sure you have at least one Dexcom Share follower before signing in._

## Features

### Real-time glucose monitoring

- Live readings streamed from your Dexcom account over WebSocket
- Trend arrows, rate of change, and connection status
- Automatic reconnection and 24-hour history backfill
- Device-agnostic glucose indicator with light and dark themes

### Glucose history

- Interactive graph with 1-, 3-, 6-, 12-, and 24-hour ranges
- Color-coded readings based on configurable high and low thresholds
- mg/dL and mmol/L support

### Floating widget

- Always-on-top draggable reading
- Optional sparkline and glucose indicator
- Adjustable opacity and remembered position

### macOS integration

- Menu bar glucose reading
- Quick widget controls
- Launch at login through `com.matthewblam.gluance.plist`
- `Gluance.app` with bundle ID `com.matthewblam.gluance`

### Security and privacy

- Dexcom account credentials encrypted at rest using macOS Keychain through Electron `safeStorage`
- No credentials passed through command-line arguments
- Direct access to the Dexcom Share API through `pydexcom`; Gluance operates no remote data server
- Production Content Security Policy

## System requirements

- macOS on Apple silicon or Intel
- A Dexcom account with an active sensor session available through Dexcom Share
- At least one Dexcom Share follower
- Internet connection

## Installation

Download the DMG from the [Gluance v1.0.0 release](https://github.com/MatthewBlam/Gluance/releases/tag/v1.0.0), open it, and drag Gluance to your Applications folder.

## Known limitations

- If a build is not code-signed or notarized, right-click Gluance and choose **Open**, or use **System Settings → Privacy & Security → Open Anyway**.
- Launch at Login registers a LaunchAgent and may trigger a one-time “Background Items Added” notification.
- Gluance uses a new application identity and does not migrate data from earlier builds. Sign in and configure the app again.

## Links

- [Repository](https://github.com/MatthewBlam/Gluance)
- [Release](https://github.com/MatthewBlam/Gluance/releases/tag/v1.0.0)
- [Demo](https://gluance.vercel.app/)

## License

MIT
