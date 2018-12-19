var HID = require('node-hid')
var sel = document.getElementById('select')
var os = require('os')
var fs = require('fs')
var app = require('electron').app
const path = require('path')
var AdmZip = require('adm-zip')

const APP_VERSION = 'v0.148'

var clearAllTimeout = () => {
  for (var i = setTimeout(() => {}, 0); i; i--) {
    clearTimeout(i)
  }
}
//Electron

//shell，用于Election呼叫系统原生界面
let shell
try {
  shell = require('electron').shell
} catch (e) {
  console.log(e)
}
const ahrefSafeFun = () => {
  if (shell) {
    let links = document.querySelectorAll('a[href]')
    //绑定页面所有 a 元素事件
    links.forEach(function(link) {
      if (!link.hrefSafe) {
        const url = link.getAttribute('href')
        //console.log(url);
        if (url.indexOf('http') === 0) {
          link.addEventListener('click', function(e) {
            e.preventDefault()
            shell.openExternal(url)
          })
        }
        link.hrefSafe = true
      }
    })
  }
}

const keyboardSpaceReplace = () =>
  Array.prototype.forEach.call(
    document.getElementsByClassName('key'),
    e => (e.innerHTML = e.innerHTML.replace(' ', '<br>'))
  )

//ipc，用于Election和主进程通讯
let ipc
try {
  ipc = require('electron').ipcRenderer
} catch (e) {
  console.log(e)
}
if (ipc) {
  ipc.on('winId', function(e, winId) {
    //最小化
    // document.getElementById('mimWinBtn').addEventListener('click', () => {
    //   ipc.send('window-min', winId)
    // })
    //关闭
    document.getElementById('exitProgram').addEventListener('click', () => {
      ipc.send('window-close', winId)
    })
    document.getElementById('closeApp').addEventListener('click', () => {
      ipc.send('window-close', winId)
    })
  })
}
document.getElementById('returnToContinue').addEventListener('click', () => {
  jumpPage(2)
})

//硬件列表
// var deviceList = require('./devices/deviceList.js').deviceList
var deviceList = []
;(() => {
  let files = fs.readdirSync(path.join(__dirname, '/devices'))
  files.forEach(val => {
    let filePath = path.join(__dirname, '/devices', val)
    let stats = fs.statSync(filePath)
    if (stats.isDirectory()) {
      deviceList.push(require(path.join(filePath, '/device.js')))
    }
    if (stats.isFile()) {
      if (filePath.indexOf('.ssz') === filePath.length - 4) {
        const zip = new AdmZip(filePath)
        zip.extractAllTo(filePath.substring(0, filePath.length - 4), true)
        fs.unlinkSync(filePath)
        deviceList.push(
          require(path.join(
            filePath.substring(0, filePath.length - 4),
            '/device.js'
          ))
        )
      }
    }
  })
})()

var deviceIdList = () => deviceList.map(e => `${e.vendorId}&${e.productId}`)

var devices

var device
var deviceInfo

//语言列表
var langList = require('./js/lang/langList.js').langList
var langDesList = langList.map(e => e.description)

//获取本地语言
var langLocal

if (ipc) {
  ipc.on('lang', function(e, langGet) {
    //Lang
    if (
      window.localStorage.getItem('lang') &&
      window.localStorage.getItem('lang').length > 0
    ) {
      langLocal = window.localStorage.getItem('lang')
    } else if (langDesList.indexOf(langGet) > -1) {
      langLocal = langGet
    } else {
      var have
      var shortLang = langGet.substr(0, 2)
      langDesList.forEach(str => {
        if (str.indexOf(shortLang) === 0) {
          have = str
        }
      })
      if (have) {
        langLocal = have
      }
    }
    //Apply
    resetLang()
  })
}

//应用当前语言
var lang = {} // = require(`./js/lang/en-US.js`).lang
var defLang = require(`./js/lang/en-US.js`).lang

let langDevice = {}

//GetLang
/**
 *
 * @param {string} key
 * @returns {string}
 */
const getLang = (key, langObject = langDevice) => {
  if (langObject[langLocal] && langObject[langLocal][key]) {
    return langObject[langLocal][key]
  }
  if (lang && lang[key]) {
    return lang[key]
  }
  if (langObject['en-US'] && langObject['en-US'][key]) {
    return langObject['en-US'][key]
  }
  if (defLang[key]) {
    return defLang[key]
  }
  return 'Missing No.'
}

const resetLang = (fresh = true) => {
  window.localStorage.setItem('lang', langLocal)
  if (langDesList.indexOf(langLocal) > -1) {
    console.log(langLocal + ' is OK')
    lang = require(`./js/lang/${langLocal}.js`).lang
  } else {
    lang = require(`./js/lang/en-US.js`).lang
  }
  lang['version'] = APP_VERSION
  ;[...document.querySelectorAll('[data-lang-key]')].forEach(node => {
    node.innerHTML = getLang(node.dataset.langKey)
  })
  ahrefSafeFun()
  keyboardSpaceReplace()
  if (fresh) {
    freshDevices(false)
  }
}

const getName = deviceName => {
  const langName = require(path.join(
    __dirname,
    '/devices/',
    deviceName,
    '/name.lang.js'
  ))
  if (langName[langLocal]) {
    return langName[langLocal]
  }
  if (lang[deviceName]) {
    return lang[deviceName]
  }
  if (langName['en-US']) {
    return langName['en-US']
  }
  if (defLang[deviceName]) {
    return defLang[deviceName]
  }
  return 'Unknown Device'
}

//加载语言列表到语言选单
var setLangList = document.getElementById('setLangList')
langList.forEach(e => {
  var newNode = document.createElement('p')
  newNode.innerHTML = e.title
  newNode.addEventListener('click', () => {
    langLocal = e.description
    resetLang()
  })
  setLangList.appendChild(newNode)
})

var nowDevice = document.getElementById('nowDevice')
var reselectDevice = document.getElementById('reselectDevice')

var timeOutSet

/**
 *
 * @param {HTMLElement} node
 */
const addClassName = (node, str) => {
  if (node.className.split(' ').filter(s => s === str).length === 0) {
    node.className += ` ${str}`
  }
}

/**
 *
 * @param {HTMLElement} node
 */
const removeClassName = (node, str) => {
  node.className = node.className
    .split(' ')
    .filter(s => s !== str)
    .join(' ')
}

/**
 * @param {HTMLElement} node
 */
const boolClassName = (node, str) => {
  if (node.className.split(' ').filter(s => s === str).length === 0) {
    addClassName(node, str)
  } else {
    removeClassName(node, str)
  }
}

let getDataFunction

const page4Init = () => {
  addClassName(document.getElementById('successToApply'), 'hide')
  removeClassName(document.getElementById('pleaseWait'), 'hide')
}
const page4Fin = () => {
  removeClassName(document.getElementById('successToApply'), 'hide')
  addClassName(document.getElementById('pleaseWait'), 'hide')
}

var nowPage = 0

var pages = [
  document.getElementById('page1'),
  document.getElementById('page2'),
  document.getElementById('page3'),
  document.getElementById('page4')
]

pages.forEach(e => {
  e.style.display = 'none'
  addClassName(e, 'readyToShowPage')
})
pages[nowPage].style.display = 'block'
removeClassName(pages[nowPage], 'readyToShowPage')
addClassName(pages[nowPage], 'showingPage')

var jumpPageTimer

const jumpPage = to => {
  pages[nowPage].style.display = 'block'
  pages[to].style.display = 'block'
  for (let i = 0; i < pages.length; i++) {
    if (i < to) {
      removeClassName(pages[i], 'readyToShowPage')
      removeClassName(pages[i], 'showingPage')
      addClassName(pages[i], 'hiddenPage')
    } else if (i > to) {
      removeClassName(pages[i], 'hiddenPage')
      removeClassName(pages[i], 'showingPage')
      addClassName(pages[i], 'readyToShowPage')
    } else {
      ;(function(i) {
        setTimeout(() => {
          addClassName(pages[i], 'showingPage')
          removeClassName(pages[i], 'readyToShowPage')
          removeClassName(pages[i], 'hiddenPage')
        }, 200)
      })(i)
    }
    if (i > 0) {
      if (to >= i) {
        addClassName(
          document.getElementById(`linge${i}-${i + 1}`),
          'compleLine'
        )
      } else {
        removeClassName(
          document.getElementById(`linge${i}-${i + 1}`),
          'compleLine'
        )
      }
    }
    if (to >= i) {
      addClassName(document.getElementById(`page${i + 1}Btn`), 'compleBtn')
      addClassName(document.getElementById(`page${i + 1}Text`), 'compleText')
    } else {
      removeClassName(document.getElementById(`page${i + 1}Btn`), 'compleBtn')
      removeClassName(document.getElementById(`page${i + 1}Text`), 'compleText')
    }
  }
  clearTimeout(jumpPageTimer)
  jumpPageTimer = setTimeout(() => {
    nowPage = to
    for (let i = 0; i < pages.length; i++) {
      if (i !== nowPage) {
        pages[i].style.display = 'none'
      }
    }
  }, 200)
}

function freshDevices(autoNext = true) {
  clearTimeout(timeOutSet)
  removeClassName(reselectDevice, 'easeInInfo')
  nowDevice.innerText = getLang('noDevice')
  sel.innerHTML = ''
  var deviceCount = {}
  const devicesHIDs = HID.devices()
  var linuxInterfaces = []
  if (os.platform() === 'linux') {
    devicesHIDs.forEach(dev => {
      deviceList.forEach(d => {
        if (dev.vendorId === d.vendorId && dev.productId === d.productId) {
          linuxInterfaces.push(dev)
        }
      })
    })
    linuxInterfaces.sort((deviceA, deviceB) => {
      return (
        parseInt(deviceA.path.substring(deviceA.path.indexOf('/hidraw') + 7)) -
        parseInt(deviceB.path.substring(deviceB.path.indexOf('/hidraw') + 7))
      )
    })
    let devicesGetterCount = {}
    linuxInterfaces = linuxInterfaces.reduce((accumulator, dev) => {
      deviceList.forEach(d => {
        if (dev.vendorId === d.vendorId && dev.productId === d.productId) {
          if (
            !devicesGetterCount[d.description] ||
            devicesGetterCount[d.description] === 0
          ) {
            devicesGetterCount[d.description] = d.maxEndpoint
          }
          devicesGetterCount[d.description]--
          // if (
          //   d.maxEndpoint - 1 - devicesGetterCount[d.description] ===
          //   parseInt(d.endpoint, 16)
          // ) {
          //   accumulator.push(dev)
          // }
          try {
            const deviceTemp = new HID.HID(dev.path)
            deviceTemp.close()
            accumulator.push(dev)
          } catch (e) {}
        }
      })
      return accumulator
    }, [])
  }
  devices = devicesHIDs
    .filter(e => {
      let boolvar = false
      if (os.platform() === 'darwin') {
        deviceList.forEach(
          d =>
            (boolvar |=
              e.vendorId === d.vendorId &&
              e.productId === d.productId &&
              e.path.indexOf('IOUSBHostInterface@' + parseInt(d.endpoint)) > -1)
        )
      } else if (os.platform() === 'win32') {
        deviceList.forEach(
          d =>
            (boolvar |=
              e.vendorId === d.vendorId &&
              e.productId === d.productId &&
              e.path.indexOf('&mi_' + d.endpoint) > -1)
        )
      } else if (os.platform() === 'linux') {
        linuxInterfaces.forEach(interfaceDevice => {
          boolvar |= interfaceDevice === e
        })
      }
      return boolvar
    })
    .map((value, index) => {
      var temp = document.createElement('option')
      if (!deviceCount[`${value.vendorId}&${value.productId}`]) {
        deviceCount[`${value.vendorId}&${value.productId}`] = 0
      }
      deviceCount[`${value.vendorId}&${value.productId}`]++
      deviceInfo =
        deviceList[
          deviceIdList().indexOf(`${value.vendorId}&${value.productId}`)
        ]

      temp.innerText =
        getName(deviceInfo.description) +
        ' - ' +
        deviceCount[`${value.vendorId}&${value.productId}`]
      temp.value = JSON.stringify({
        path: value.path,
        index: deviceIdList().indexOf(`${value.vendorId}&${value.productId}`)
      })
      sel.appendChild(temp)
      return value
    })

  if (autoNext && devices.length === 1) {
    document.getElementById('selBtn').click()
  }
  if (!devices || devices.length === 0) {
    timeOutSet = setTimeout(() => freshDevices(autoNext), 500)
  }
}

document.getElementById('refreshDev').addEventListener('click', e => {
  freshDevices(false)
})

reselectDevice.addEventListener('click', e => {
  jumpPage(0)
  freshDevices(false)
})

document.getElementById('page1Btn').addEventListener('click', e => {
  jumpPage(0)
  freshDevices(false)
})
;[2, 3, 4].forEach(i =>
  document.getElementById(`page${i}Btn`).addEventListener('click', e => {
    if (nowPage > i - 1) {
      jumpPage(i - 1)
    }
  })
)

document.getElementById('selBtn').addEventListener('click', async e => {
  if (devices && devices.length > 0) {
    if (device) device.close()
    clearTimeout(timeOutSet)
    const selectObject = JSON.parse(sel.value)
    const deviceInfoBlock = deviceList[selectObject.index]
    device = new HID.HID(selectObject.path)
    device.on('data', data => getDataFunction(data))
    // getAllSettings().then(() => initSettings())

    // 加载HTML
    const page2HTML = new Promise(resolve => {
      fs.readFile(
        path.join(
          __dirname,
          '/devices/',
          deviceInfoBlock.description,
          '/page2.html'
        ),
        (err, data) => {
          if (err) {
            throw err
          }
          resolve(data.toString())
        }
      )
    })
    const page3HTML = new Promise(resolve => {
      fs.readFile(
        path.join(
          __dirname,
          '/devices/',
          deviceInfoBlock.description,
          '/page3.html'
        ),
        (err, data) => {
          if (err) {
            throw err
          }
          resolve(data.toString())
        }
      )
    })
    document.getElementById('page2').innerHTML = await page2HTML
    document.getElementById('page3').innerHTML = await page3HTML

    // 载入设备语言定义
    langDevice = {}
    langDevice = require(path.join(
      __dirname,
      '/devices/',
      deviceInfoBlock.description,
      '/lang.js'
    ))

    // 读取语言
    resetLang(false)

    document.getElementById('deviceCss').href = path.join(
      __dirname,
      '/devices/',
      deviceInfoBlock.description,
      '/style.css'
    )
    const deciveFun = require(path.join(
      __dirname,
      '/devices/',
      deviceInfoBlock.description,
      '/script.js'
    ))
    deciveFun(
      document,
      {
        connect: device,
        info: deviceInfoBlock,
        devices: devices.filter(
          ele =>
            ele.productId === deviceInfoBlock.productId &&
            ele.vendorId === deviceInfoBlock.vendorId
        )
      },
      {
        sendData: sendData,
        get getData() {
          return getDataFunction
        },
        set getData(val) {
          getDataFunction = val
        },
        getLang: getLang,
        getName: getName,
        page4Init: page4Init,
        page4Fin: page4Fin,
        jumpPage: jumpPage
      }
    )

    nowDevice.innerText = getName(deviceInfoBlock.description)
    addClassName(reselectDevice, 'easeInInfo')

    jumpPage(1)
  }
})

function sendData(buffer, deviceIn = device) {
  return new Promise((r, e) => {
    if (!deviceIn) {
      e()
      return
    }
    var buff = [...buffer]
    if (os.platform() === 'win32' || os.platform() === 'darwin') {
      buff.unshift(0) // prepend throwaway byte
    }
    deviceIn.write(buff)
    setTimeout(() => r(), 15)
  })
}

//初始化

freshDevices(false) //刷新列表
// initSettingsFunction() //初始化设置和设置统计

ipc.send('window0-ready')

process.on('uncaughtException', e => {
  if (e.message === 'could not read from HID device') {
    console.warn('Discon.')
    jumpPage(0)
    freshDevices(false)
  } else {
    console.error(e.stack)
    jumpPage(0)
    freshDevices(false)
  }
})
