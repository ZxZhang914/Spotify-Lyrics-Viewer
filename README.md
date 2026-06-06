# Spotify Lyrics Viewer

A floating desktop lyrics window for Spotify, built with Electron.

![Electron](https://img.shields.io/badge/Electron-30-47848F?logo=electron) ![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

![demo](https://github.com/user-attachments/assets/e8ab7cea-937d-413d-9d63-158e79e59a34)

## Features

- **Floating window** — always on top, frameless, with a frosted-glass look
- **Synced lyrics** — KTV-style character-by-character highlight in real time
- **Multi-source lyrics** — fetches from NetEase Cloud Music → LRCLIB → lyrics.ovh as fallback
- **Playback controls** — previous / play-pause / next, right from the window
- **Dark / bright mode** — toggle with one click, preference saved across sessions
- **Auto-scroll** — plain lyrics auto-scroll based on track progress
- **Font size** — adjust with `A+` / `A−` buttons or `+` / `-` keys
- **One-click reconnect** — re-authorize Spotify without touching DevTools

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A Spotify account (free or premium)

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/ZxZhang914/Spotify-Lyrics-Viewer.git
cd Spotify-Lyrics-Viewer
npm install
```

### 2. Run

```bash
npm start
```

### 3. Connect Spotify

Click **Connect with Spotify** in the app and authorize. The app uses the [PKCE OAuth flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow) — no client secret required, nothing is stored on any server.

> **Permissions requested:** read currently playing track · read playback state · control playback

## Usage

| Control | Action |
|---|---|
| Drag titlebar | Move window |
| `A+` / `A−` | Increase / decrease lyric font size |
| `+` / `-` keys | Same as above |
| Pin button | Toggle always-on-top |
| Refresh button | Reload current track and lyrics |
| Sun/Moon button | Toggle dark / bright mode |
| Logout button | Re-authorize Spotify (use when switching accounts or after permission changes) |
| ⏮ / ⏯ / ⏭ | Previous track / play-pause / next track |

## Lyrics Sources

Lyrics are fetched in this order until one succeeds:

1. **NetEase Cloud Music** — best coverage for Chinese songs, synced
2. **LRCLIB** — synced LRC for Western music
3. **lyrics.ovh** — plain text fallback

## Project Structure

```
├── main.js          # Electron main process, window & auth handling
├── preload.js       # Context bridge between main and renderer
├── renderer/
│   └── index.html   # All UI, styles, and renderer logic
└── package.json
```

## License

MIT
