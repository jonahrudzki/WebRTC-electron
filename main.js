const { app, BrowserWindow } = require('electron')
const { networkInterfaces } = require('node:os')
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.webContents.openDevTools()
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
})