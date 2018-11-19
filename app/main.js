const electron = require('electron') // 控制应用生命周期的模块。
const ipc = electron.ipcMain //窗口通讯模块

//var HID = require('node-hid');
//var devices = HID.devices();

// Module to control application life.
const { app } = electron
// Module to create native browser window.
const { BrowserWindow } = electron
//var BrowserWindow = require('browser-window');  // 创建原生浏览器窗口的模块

// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
var guiWindows = null

//Debug mode
var debug = process.argv.indexOf('--debug') >= 0
var spThx = process.argv.indexOf('--thank_you') >= 0

// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function() {
  // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
  // 应用会保持活动状态
  if (process.platform != 'darwin') {
    app.quit()
  }
})

//窗口最小化
ipc.on('window-min', function(e, index) {
  guiWindows[index].minimize()
})
//窗口最大化
ipc.on('window-max', function(e, index) {
  if (guiWindows.isMaximized()) {
    guiWindows[index].restore()
  } else {
    guiWindows[index].maximize()
  }
})
//窗口关闭
ipc.on('window-close', function(e, index) {
  guiWindows[index].close()
})

ipc.on('window0-ready', function(e) {
  guiWindows[0].webContents.send('winId', 0)
  guiWindows[0].webContents.send('lang', app.getLocale())
  guiWindows[0].webContents.send('debug', debug ? 1 : 0)
  guiWindows[0].show()
})

// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on('ready', function() {
  // 创建浏览器窗口。
  //mainWindow = new BrowserWindow()[];
  guiWindows = {}
  guiWindows[0] = new BrowserWindow({
    width: 960,
    height: 540,
    frame: spThx,
    //transparent: true,
    //alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      minimumFontSize: 8,
      webSecurity: false
    }
  })
  electron.Menu.setApplicationMenu(null)
  guiWindows[0].hide()
  // 加载应用的 index.html
  if (!spThx) {
    guiWindows[0].loadURL('file://' + __dirname + '/index.html')
  } else {
    guiWindows[0].loadURL('file://' + __dirname + '/spThx.html')
    guiWindows[0].show()
  }
  //guiWindows[0].loadURL('file://' + __dirname + '/keyboard.html')

  // 打开开发工具

  if (debug) {
    guiWindows[0].openDevTools({ mode: 'detach' })
  }

  // 当 window 被关闭，这个事件会被发出
  guiWindows[0].on('closed', function() {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 但这次不是。
    guiWindows = null
    app.quit()
  })
})
