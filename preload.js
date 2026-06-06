const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  startAuth: (url) => ipcRenderer.send('start-auth', url),
  closeWindow: () => ipcRenderer.send('close-window'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  toggleAlwaysOnTop: (val) => ipcRenderer.send('toggle-always-on-top', val),
  onAuthResult: (cb) => ipcRenderer.on('auth-result', (e, data) => cb(data)),
  onAlwaysOnTopChanged: (cb) => ipcRenderer.on('always-on-top-changed', (e, val) => cb(val)),
  getConfig: () => ipcRenderer.invoke('get-config'),
  fetchNetease: (url) => ipcRenderer.invoke('fetch-netease', url)
})
