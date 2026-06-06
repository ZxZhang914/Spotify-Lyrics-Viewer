const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const CLIENT_ID = 'd71ace25c4f24990ab28668fab7e61e8'
// Use the GitHub Pages URL as redirect — Electron intercepts it before the browser loads it
const REDIRECT_URI = 'https://zxzhang914.github.io/Spotify-Lyrics-Viewer/'

let authWin = null
let lyricsWin = null
let pinEnabled = true

function applyAlwaysOnTop(val) {
  if (!lyricsWin) return
  pinEnabled = val
  lyricsWin.setAlwaysOnTop(val, 'screen-saver')
  lyricsWin.setVisibleOnAllWorkspaces(val)
}

function createLyricsWindow() {
  lyricsWin = new BrowserWindow({
    width: 340,
    height: 480,
    minWidth: 260,
    minHeight: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    skipTaskbar: false,
    hasShadow: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  lyricsWin.loadFile(path.join(__dirname, 'renderer', 'index.html'))
  applyAlwaysOnTop(true)

  const { globalShortcut } = require('electron')
  globalShortcut.register('F12', () => {
    if (lyricsWin) lyricsWin.webContents.toggleDevTools()
  })

  // Re-assert on every blur — some WMs/WSL2 drop the flag when focus changes
  lyricsWin.on('blur', () => {
    if (pinEnabled) applyAlwaysOnTop(true)
  })
}

function createAuthWindow(url) {
  authWin = new BrowserWindow({
    width: 500,
    height: 700,
    title: 'Connect Spotify',
    webPreferences: { nodeIntegration: false }
  })
  authWin.loadURL(url)

  authWin.webContents.on('will-navigate', (e, navUrl) => handleCallback(e, navUrl))
  authWin.webContents.on('will-redirect', (e, navUrl) => handleCallback(e, navUrl))
}

function handleCallback(e, url) {
  if (!url.startsWith(REDIRECT_URI)) return
  e.preventDefault()
  const parsed = new URL(url)
  const code = parsed.searchParams.get('code')
  const error = parsed.searchParams.get('error')
  if (authWin) { authWin.destroy(); authWin = null }
  if (lyricsWin) {
    lyricsWin.webContents.send('auth-result', { code, error })
  }
}

ipcMain.on('start-auth', (e, authUrl) => {
  createAuthWindow(authUrl)
})

ipcMain.on('close-window', () => { app.quit() })
ipcMain.on('minimize-window', () => { if (lyricsWin) lyricsWin.minimize() })

ipcMain.on('toggle-always-on-top', (e, val) => {
  applyAlwaysOnTop(val)
  e.reply('always-on-top-changed', val)
})

ipcMain.handle('get-config', () => ({
  clientId: CLIENT_ID,
  redirectUri: REDIRECT_URI
}))

app.whenReady().then(() => {
  createLyricsWindow()
})

app.on('window-all-closed', () => { app.quit() })
