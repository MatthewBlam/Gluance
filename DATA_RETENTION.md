# Gluance Data Retention Policy

Gluance is an independent, unofficial application and is not affiliated with or endorsed by Dexcom, Inc.

## Glucose readings

Glucose readings are primarily stored in memory during the current application session.

- Gluance retains up to 300 recent readings in memory.
- On login, up to 24 hours of historical readings are fetched from Dexcom's servers through the Dexcom Share API.
- In-memory history is discarded when Gluance quits.
- The most recent reading is persisted to `config.json` for the menu bar display on the next launch and is overwritten when new data arrives.

## Credentials

- Dexcom account credentials are encrypted using the operating system keychain through Electron `safeStorage`.
- Encrypted credentials are stored in `~/Library/Application Support/Gluance/config.json`.
- Credentials are never written to application logs or passed through command-line arguments.

## Settings and preferences

- Theme, unit, thresholds, widget options, and launch-at-login settings are stored in `config.json`.
- Widget position, window bounds, and history layout preferences are also stored there.
- The configuration file is written with owner-only permissions (`0600`).

Gluance uses a new application identity and data directory. It does not migrate or delete settings, credentials, user data, or launch-agent files created by earlier builds.

## Logs

- Logs are written to `~/Library/Application Support/Gluance/logs/main.log`.
- Logs rotate automatically at 1 MB.
- Logs contain operational events and errors, but do not contain credentials or glucose values.

## No Gluance server-side storage

Gluance does not operate a remote data server. Data is fetched directly from the Dexcom Share API through the `pydexcom` library. Gluance does not transmit user data to any other third party.
