var HID = require('node-hid')
var sel = document.getElementById('select')
var os = require('os')
var app = require('electron').app
//取色器
const ColorPicker = require(`./lib/color-picker.js`).ColorPicker
//按键键值关系表
const KeyData = require(`./js/keyboardData`).data

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
    //console.log('WinId is ' + winId)
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

/**获取数据格式
 * BYTE 0x00 获取值
 * BYTE 0x01 来自计算机 0x02来自单片机
 * BYTE 要获取的DataFlash偏移地址值 / 4
 * BYTE 留空
 * BYTE 留空
 * BYTE 留空
 * BYTE 留空
 * BYTE 留空
 */

/**下发数据到DataFlash数据格式
 * BYTE 要设置DataFlash的偏移地址值 / 4
 * BYTE 第0字节
 * BYTE 第1字节
 * BYTE 第2字节
 * BYTE 第3字节
 * BYTE 留空
 * BYTE 留空
 * BYTE 留空
 */
var noAnything

//硬件列表
var deviceList = require('./js/device/deviceList.js').deviceList
var deviceIdList = deviceList.map(e => e.productId)
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
var lang // = require(`./js/lang/en-US.js`).lang
var defLang = require(`./js/lang/en-US.js`).lang

const resetLang = () => {
  window.localStorage.setItem('lang', langLocal)
  if (langDesList.indexOf(langLocal) > -1) {
    console.log(langLocal + ' is OK')
    lang = require(`./js/lang/${langLocal}.js`).lang
  } else {
    lang = require(`./js/lang/en-US.js`).lang
  }
  ;[...document.querySelectorAll('[data-lang-key]')].forEach(node => {
    var inner = lang[node.dataset.langKey]
    if (inner && inner.length > 0) {
      node.innerHTML = inner
    } else {
      node.innerHTML = defLang[node.dataset.langKey]
    }
  })
  ahrefSafeFun()
  keyboardSpaceReplace()
  freshDevices(false)
}

//GetLang
/**
 *
 * @param {string} key
 * @returns {string}
 */
const getLang = key => {
  if (lang && lang[key]) return lang[key]
  return defLang[key]
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

//var HID = require('node-hid')
//var sel = document.getElementById('select')
//var os = require('os')

var devices

var device
var deviceInfo

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

/**
 * @type {number[][]}
 * 0: 置空
 * 1: 键值1
 * 2: 键值2
 * 3: 键值3
 * 4: 键值4
 * 5: 键值5
 * 6: LED0, R,G,B,亮度
 * 7: LED1, R,G,B,亮度
 * 8: 灯光模式
 * 9: 防抖设定
 * 10: 极速模式
 * 11: 保留
 */
const settingsSet = new Array(12).fill(0).map(() => new Array(8))

/**
 * @type {number[][]}
 */
var settingChanged

var getDataFunction

const getData = data => getDataFunction(data)

var autoGetDataTimer

const getSettings = (pointer, dev = device) =>
  new Promise(function doIt(r, e) {
    getDataFunction = data => {
      settingsSet[data[4]] = [...data]
      clearTimeout(autoGetDataTimer)
      if (pointer === data[4]) r()
    }
    if (dev) {
      var dat = [0x00, 0x01, pointer, 0x00, 0x00, 0x00, 0x00, 0x00]
      sendData(dat).catch(err => clearTimeout(autoGetDataTimer))
    } else {
      e()
      return
    }
    autoGetDataTimer = setTimeout(() => doIt(r, e), 30)
  })

const getVersion = (dev = device) =>
  new Promise(function doIt(r, e) {
    getDataFunction = data => {
      document.getElementById('firmwareVersionNum').innerHTML = ''
      ;[...data]
        .slice(0, 4)
        .forEach(
          d =>
            (document.getElementById(
              'firmwareVersionNum'
            ).innerHTML += d.toString().padStart(2, '0'))
        )
      clearTimeout(autoGetDataTimer)
      r()
    }
    if (dev) {
      var dat = [0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
      sendData(dat).catch(err => clearTimeout(autoGetDataTimer))
    } else {
      e()
      return
    }
    autoGetDataTimer = setTimeout(() => doIt(r, e), 30)
  })

var settingsAlready = false

const getAllSettings = (dev = device) => {
  if (dev) {
    console.time('getAllSettingsIn')
    settingsAlready = false
    return getSettings(1, dev)
      .then(() => getSettings(2, dev))
      .then(() => getSettings(3, dev))
      .then(() => getSettings(4, dev))
      .then(() => getSettings(5, dev))
      .then(() => getSettings(6, dev))
      .then(() => getSettings(7, dev))
      .then(() => getSettings(8, dev))
      .then(() => getSettings(9, dev))
      .then(
        () =>
          new Promise(r => {
            console.timeEnd('getAllSettingsIn')
            clearTimeout(autoGetDataTimer)
            settingsAlready = true
            r()
          })
      )
  } else {
    return new Promise((r, e) => e())
  }
}

const changesBool = Array(settingsSet.length).fill(false)
var changesLength = 0
//计算更改数量
const countChanges = () => {
  const isDiffArr = (a, b) => {
    if (a.length !== b.length) return true
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return true
    }
    return false
  }
  for (var i = 0; i < settingsSet.length; i++) {
    changesBool[i] = isDiffArr(settingsSet[i], settingChanged[i])
  }
  changesLength = changesBool.filter(e => e).length
  document.getElementById('changesCountValue').innerHTML = changesLength
  if (changesLength > 0) {
    removeClassName(document.getElementById('changesCount'), 'hide')
  } else {
    addClassName(document.getElementById('changesCount'), 'hide')
  }
}

//初始化两个取色器
const cpG1 = new ColorPicker({
  dom: document.getElementById('setG1ColorPicker'),
  value: document.getElementById('G1Color').value
})
cpG1.addEventListener('change', event => {
  document.getElementById('G1Color').value = cpG1.value
  document.getElementById('G1Color').dispatchEvent(new Event('change'))
})

const cpG2 = new ColorPicker({
  dom: document.getElementById('setG2ColorPicker'),
  value: document.getElementById('G2Color').value
})
cpG2.addEventListener('change', event => {
  document.getElementById('G2Color').value = cpG2.value
  document.getElementById('G2Color').dispatchEvent(new Event('change'))
})

const cpArr = [cpG1.getDOM(), cpG2.getDOM()]
cpG1.getDOM().addEventListener('mousedown', () => {
  cpG1.getDOM().style.display = 'block'
  cpG1.getDOM().style.animation = 'fadeInFromNone 0.2s ease-in'
})
cpG2.getDOM().addEventListener('mousedown', () => {
  cpG2.getDOM().style.display = 'block'
  cpG2.getDOM().style.animation = 'fadeInFromNone 0.2s ease-in'
})
window.addEventListener('mouseup', () => {
  cpArr.forEach(e => e.removeAttribute('style'))
})

const updateKeyCodeText = () => {
  //键值设置
  var keyNum = 5
  const keyInfoArr = [
    ...document.getElementById('btnSettingsList').getElementsByClassName('midP')
  ]
  keyInfoArr.forEach((nodeElement, index) => {
    nodeElement.innerHTML = ''
    const keyStrSet = []
    if (settingChanged[index + 1][0] > 0) {
      Object.values(KeyData).forEach(arr => {
        if (arr[0] === 1) {
          if ((arr[1] & settingChanged[index + 1][0]) > 0) {
            keyStrSet.push(getLang(arr[2]))
          }
        }
      })
    }
    if (settingChanged[index + 1][1] > 0) {
      Object.values(KeyData).forEach(arr => {
        if (arr[0] === 0) {
          if (arr[1] === settingChanged[index + 1][1]) {
            keyStrSet.push(getLang(arr[2]))
          }
        }
      })
    }
    if (settingChanged[index + 1][2] > 0) {
      Object.values(KeyData).forEach(arr => {
        if (arr[0] === 2) {
          if ((arr[1] & settingChanged[index + 1][2]) > 0) {
            keyStrSet.push(getLang(arr[2]))
          }
        }
      })
    }
    if (keyStrSet.length > 0) {
      nodeElement.innerHTML = keyStrSet.join(' + ')
    } else {
      nodeElement.innerHTML = getLang('keyN_null')
    }
  })
}

const initSettings = () => {
  //备份机器选项数据
  settingChanged = [...settingsSet.map(arr => [...arr])]
  //灯光模式单选框
  var radios = [...document.getElementsByName('lightsType')]
  radios.forEach(node => {
    node.checked = false
  })
  radios.forEach(radio => {
    if (radio.value === settingsSet[8][0].toString()) {
      radio.checked = true
    }
  })
  //灯光颜色
  document.getElementById('G1Color').value = `#${settingsSet[6][0]
    .toString(16)
    .padEnd(2, '0')}${settingsSet[6][1]
    .toString(16)
    .padEnd(2, '0')}${settingsSet[6][2].toString(16).padEnd(2, '0')}`
  cpG1.value = document.getElementById('G1Color').value
  document.getElementById('G2Color').value = `#${settingsSet[7][0]
    .toString(16)
    .padEnd(2, '0')}${settingsSet[7][1]
    .toString(16)
    .padEnd(2, '0')}${settingsSet[7][2].toString(16).padEnd(2, '0')}`
  cpG2.value = document.getElementById('G2Color').value
  //灯光亮度
  // var G1Brightness = document.getElementById('G1Brightness')
  // var G2Brightness = document.getElementById('G2Brightness')
  // if (settingsSet[6][3]) {
  //   G1Brightness.innerHTML = `${(settingsSet[6][3] / 4 * 100) >> 0}%`
  // } else {
  //   G1Brightness.innerHTML = 'OFF'
  // }
  // if (settingsSet[7][3]) {
  //   G2Brightness.innerHTML = `${(settingsSet[7][3] / 4 * 100) >> 0}%`
  // } else {
  //   G2Brightness.innerHTML = 'OFF'
  // }
  //消抖
  var delayInput = document.getElementById('delayInput')
  delayInput.value =
    settingsSet[9][0] * 0x01000000 +
    settingsSet[9][1] * 0x010000 +
    settingsSet[9][2] * 0x0100 +
    settingsSet[9][3]
  getVersion()
  updateKeyCodeText()
  countChanges()
}

const initSettingsFunction = () => {
  var radios = [...document.getElementsByName('lightsType')]
  radios.forEach(node => {
    node.addEventListener('click', e => {
      settingChanged[8][0] = parseInt(node.value)
      countChanges()
    })
  })
  var colorGroupsCount = 2
  var colorOffset = 6
  for (let i = 0; i < colorGroupsCount; i++) {
    document.getElementById(`G${i + 1}Color`).addEventListener('change', e => {
      const target = settingChanged[colorOffset + i]
      target[0] = parseInt(
        document.getElementById(`G${i + 1}Color`).value.substr(1, 2),
        16
      )
      target[1] = parseInt(
        document.getElementById(`G${i + 1}Color`).value.substr(3, 2),
        16
      )
      target[2] = parseInt(
        document.getElementById(`G${i + 1}Color`).value.substr(5, 2),
        16
      )
      //target[3] =
      countChanges()
    })
  }
  document.getElementById('delayInput').addEventListener('change', e => {
    var value = parseInt(document.getElementById('delayInput').value)
      .toString(16)
      .padStart(8, '0')
    settingChanged[9][0] = parseInt(value.substr(0, 2), 16)
    settingChanged[9][1] = parseInt(value.substr(2, 2), 16)
    settingChanged[9][2] = parseInt(value.substr(4, 2), 16)
    settingChanged[9][3] = parseInt(value.substr(6, 2), 16)
    countChanges()
  })
  //键值设置
  var keyNum = 5
  const keyInfoArr = [
    ...document
      .getElementById('btnSettingsList')
      .getElementsByClassName('rightP')
  ]
  let oneKeyCode = [0x00, 0x00, 0x00]
  const keyboardPannel = document.getElementById('keyboardPannel')
  keyboardPannel.addEventListener('click', e => e.stopPropagation())
  const updateKeyBoard = () => {
    const keyPosSet = []
    if (oneKeyCode[0] > 0) {
      for (let k in KeyData) {
        let arr = KeyData[k]
        if (arr[0] === 1) {
          if ((arr[1] & oneKeyCode[0]) > 0) {
            keyPosSet.push(k)
          }
        }
      }
    }
    if (oneKeyCode[1] > 0) {
      for (let k in KeyData) {
        let arr = KeyData[k]
        if (arr[0] === 0) {
          if (arr[1] === oneKeyCode[1]) {
            keyPosSet.push(k)
          }
        }
      }
    }
    if (oneKeyCode[2] > 0) {
      for (let k in KeyData) {
        let arr = KeyData[k]
        if (arr[0] === 2) {
          if ((arr[1] & oneKeyCode[2]) > 0) {
            keyPosSet.push(k)
          }
        }
      }
    }
    ;[...keyboardPannel.getElementsByClassName('key')].forEach(nodeEle => {
      removeClassName(nodeEle, 'select')
    })
    keyPosSet.forEach(keys => {
      const line = parseInt(keys.substr(0, 1))
      const col = parseInt(keys.substr(1, 2))
      addClassName(
        keyboardPannel
          .getElementsByClassName('keyboard-line')
          [line - 1].getElementsByClassName('key')[col - 1],
        'select'
      )
    })
  }
  keyInfoArr.forEach((e, index) => {
    e.addEventListener('click', event => {
      keyboardPannel.style.top = e.offsetTop + 24 + 'px'
      oneKeyCode = settingChanged[index + 1]
      oneKeyCode[0] = settingChanged[index + 1][0]
      oneKeyCode[1] = settingChanged[index + 1][1]
      addClassName(keyboardPannel, 'show')
      event.stopPropagation()
      const clickFun = () => {
        window.removeEventListener('click', clickFun)
        // keyInfoArr.forEach(element =>
        //   element.removeEventListener('click', clickFun)
        // )
        removeClassName(keyboardPannel, 'show')
      }
      window.addEventListener('click', clickFun)
      //e.addEventListener('click', clickFun)
      updateKeyBoard()
    })
  })

  for (let keys in KeyData) {
    const line = parseInt(keys.substr(0, 1))
    const col = parseInt(keys.substr(1, 2))
    keyboardPannel
      .getElementsByClassName('keyboard-line')
      [line - 1].getElementsByClassName('key')[col - 1].dataset.keyKey = keys
  }
  ;[...keyboardPannel.getElementsByClassName('key')].forEach(nodeEle => {
    nodeEle.addEventListener('click', event => {
      if (KeyData[nodeEle.dataset.keyKey][0] === 1) {
        oneKeyCode[0] ^= KeyData[nodeEle.dataset.keyKey][1]
      } else if (KeyData[nodeEle.dataset.keyKey][0] === 2) {
        oneKeyCode[2] ^= KeyData[nodeEle.dataset.keyKey][1]
      } else if (oneKeyCode[1] === KeyData[nodeEle.dataset.keyKey][1]) {
        oneKeyCode[1] = 0x00
      } else {
        oneKeyCode[1] = KeyData[nodeEle.dataset.keyKey][1]
      }
      updateKeyCodeText()
      updateKeyBoard()
      countChanges()
    })
  })
}

const page4Init = () => {
  addClassName(document.getElementById('successToApply'), 'hide')
  removeClassName(document.getElementById('pleaseWait'), 'hide')
}
const page4Fin = () => {
  removeClassName(document.getElementById('successToApply'), 'hide')
  addClassName(document.getElementById('pleaseWait'), 'hide')
}

const useSettings = () => {
  if (changesBool.filter(e => e).length > 0) {
    var promiseObj = new Promise(r => {
      page4Init()
      r()
    })
    for (let i = 0; i < changesBool.length; i++) {
      if (changesBool[i]) {
        promiseObj.then(() =>
          sendData([
            i,
            settingChanged[i][0],
            settingChanged[i][1],
            settingChanged[i][2],
            settingChanged[i][3],
            0x00,
            0x00,
            0x00
          ])
        )
      }
    }
    promiseObj.then(() => {
      getAllSettings().then(() => {
        initSettings()
        countChanges()
        setTimeout(() => {
          page4Fin()
        }, 300)
      })
    })
    jumpPage(3)
  }
}

document
  .getElementById('useSettings')
  .addEventListener('click', e => useSettings())

document.getElementById('abandonsChanges').addEventListener('click', e => {
  initSettings()
  //countChanges()
})

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
  devices = HID.devices()
    .filter(
      e =>
        e.vendorId === 0x8088 &&
        deviceIdList.indexOf(e.productId) > -1 &&
        e.path.indexOf('&mi_01') > -1
    )
    .map(e => {
      var temp = document.createElement('option')
      if (!deviceCount[e.productId]) {
        deviceCount[e.productId] = 0
      }
      deviceCount[e.productId]++
      deviceInfo = deviceList[deviceIdList.indexOf(e.productId)]
      document.getElementById(
        'theBtnDefInner'
      ).style.background = `url(./imgs/deviceKeyInfo/${
        deviceInfo.description
      }.png)`
      document.getElementById(
        'theLightDefInner'
      ).style.background = `url(./imgs/deviceLightInfo/${
        deviceInfo.description
      }.png)`
      document.getElementById('deviceKeyMapTitle').innerText = getLang(
        deviceInfo.description
      )
      document.getElementById('deviceLightTitle').innerText = getLang(
        deviceInfo.description
      )
      temp.innerText =
        getLang(deviceInfo.description) + ' - ' + deviceCount[e.productId]
      temp.value = e.path
      sel.appendChild(temp)
      return e
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

document.getElementById('selBtn').addEventListener('click', e => {
  if (devices && devices.length > 0) {
    if (device) device.close()
    clearTimeout(timeOutSet)
    device = new HID.HID(sel.value)
    device.on('data', data => getData(data))
    getAllSettings().then(() => initSettings())
    nowDevice.innerText = sel.options[sel.selectedIndex].text
    addClassName(reselectDevice, 'easeInInfo')
    jumpPage(1)
  }
  if (devices && devices.length > 1) {
    addClassName(document.getElementById('sendAllNewDev'), 'show')
    addClassName(document.getElementById('lightTest'), 'show')
  } else {
    removeClassName(document.getElementById('sendAllNewDev'), 'show')
    removeClassName(document.getElementById('lightTest'), 'show')
  }
})

document.getElementById('sendBtn').addEventListener('click', e => {
  if (device) {
    var buffer = Array(8).fill(0x00)
    document
      .getElementById('toSend')
      .value.split(' ')
      .map((str, no) => {
        buffer[no] = parseInt(str, 16)
        return no + 1
      }, 0)
    if (os.platform() === 'win32') {
      buffer.unshift(0) // prepend throwaway byte
    }
    device.write(buffer)
  }
})

document.getElementById('superSpeedOn').addEventListener('click', e => {
  sendData([0x0a, 0x01, 0x00, 0x00, 0x00]).then(() => {
    page4Init()
    jumpPage(3)
    setTimeout(page4Fin, 300)
  })
})

document.getElementById('superSpeedOff').addEventListener('click', e => {
  sendData([0x0a, 0x00, 0x00, 0x00, 0x00]).then(() => {
    page4Init()
    jumpPage(3)
    setTimeout(page4Fin, 300)
  })
})

function sendData(buffer, deviceIn = device) {
  return new Promise((r, e) => {
    if (!deviceIn) {
      e()
      return
    }
    var buff = [...buffer]
    if (os.platform() === 'win32') {
      buff.unshift(0) // prepend throwaway byte
    }
    deviceIn.write(buff)
    setTimeout(() => r(), 15)
  })
}

var rightPannel = document.getElementById('rightPannel')
var scrollStatus = new Array(5).fill(false)
scrollStatus[0] = true
const rightPannelSections = [...rightPannel.getElementsByTagName('section')]

const leftPannelSpans = [
  ...document.getElementById('leftPannel').getElementsByTagName('span')
].slice(0, 5)

const refreshLeftPannel = () => {
  for (var i = 0; i < scrollStatus.length; i++) {
    if (scrollStatus[i]) {
      addClassName(leftPannelSpans[i], 'activeTitle')
    } else {
      removeClassName(leftPannelSpans[i], 'activeTitle')
    }
  }
}

const checkScroll = () => {
  var scrollTop = rightPannel.scrollTop
  rightPannelSections.forEach(node => {
    if (scrollTop + 144 > node.offsetTop) {
      scrollStatus.fill(false)
      scrollStatus[rightPannelSections.indexOf(node)] = true
    }
  })
  refreshLeftPannel()
}
rightPannel.addEventListener('scroll', e => checkScroll())

var raf
const easeOut = x => {
  if (x > 1) x = 1
  if (x < 0) x = 0
  return 1 - Math.pow(1 - x, 2)
}

const leftPannelScrollTo = (i, t = 300) => {
  if (t === 0) {
    rightPannel.scrollTop = rightPannelSections[i].offsetTop - 46
    return
  }
  var timeStart
  var timeLong = t
  var scrollFrom = rightPannel.scrollTop
  var scrollGo = rightPannelSections[i].offsetTop - 46 - rightPannel.scrollTop
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(function autoRun(t) {
    if (!timeStart) {
      timeStart = t
    }
    rightPannel.scrollTop =
      easeOut((t - timeStart) / timeLong) * scrollGo + scrollFrom
    checkScroll()
    if (!(t - timeStart >= timeLong)) {
      raf = requestAnimationFrame(autoRun)
    }
  })
}
for (let i = 0; i < leftPannelSpans.length; i++) {
  leftPannelSpans[i].addEventListener('click', e => {
    leftPannelScrollTo(i)
  })
}

const bigBtn = [...document.getElementsByClassName('bigBtn')]
for (let i = 0; i < bigBtn.length; i++) {
  bigBtn[i].addEventListener('click', e => {
    if (settingsAlready) {
      jumpPage(2)
      leftPannelScrollTo(i, 0)
    } else {
      getAllSettings().then(() => {
        jumpPage(2)
        leftPannelScrollTo(i, 0)
      })
    }
  })
}

const templeData = [
  [0x01, 0x00, 0x1d, 0x00, 0x00], //Z
  [0x02, 0x00, 0x1b, 0x00, 0x00], //X
  [0x03, 0x01, 0x15, 0x00, 0x00], //Ctrl+R
  [0x04, 0x00, 0x29, 0x00, 0x00], //ESC
  [0x05, 0x00, 0x3b, 0x00, 0x00], //F3
  [0x06, 0x00, 0xff, 0x00, 0x04], //#00FF00 100%(4)
  [0x07, 0x00, 0x00, 0xff, 0x04], //#0000FF 100%(4)
  [0x08, 0x00, 0x00, 0x00, 0x00], //Mode 0
  [0x09, 0x00, 0x00, 0x00, 0x40], //0x40 => 64 (MAX 16^6-1)
  [0x0a, 0x00, 0x00, 0x00, 0x40] //0x00 极速模式处于关闭
]
const lightTestData = [
  [0x06, 0x00, 0xff, 0x00, 0x04], //#00FF00 100%(4)
  [0x07, 0x00, 0x00, 0xff, 0x04], //#0000FF 100%(4)
  [0x08, 0x02, 0x00, 0x00, 0x00], //Mode 0
]
document.getElementById('sendNewDev').addEventListener('click', e => {
  var promiseObj
  if (device) {
    page4Init()
    jumpPage(3)
    templeData.forEach(data => {
      if (promiseObj) {
        promiseObj.then(() => sendData(data))
      } else {
        promiseObj = sendData(data)
      }
    })
    promiseObj.then(() =>
      getAllSettings().then(() => {
        initSettings()
        setTimeout(page4Fin, 300)
        //countChanges()
      })
    )
  }
})

document.getElementById('sendAllNewDev').addEventListener('click', e => {
  var promiseObj
  if (devices && devices.length && devices.length > 0) {
    page4Init()
    jumpPage(3)
    devices.forEach(d => {
      let deviceToSend = new HID.HID(d.path)
      templeData.forEach(data => {
        if (promiseObj) {
          promiseObj.then(() => sendData(data, deviceToSend))
        } else {
          promiseObj = sendData(data, deviceToSend)
        }
      })
    })
    promiseObj.then(() =>
      getAllSettings().then(() => {
        initSettings()
        setTimeout(page4Fin, 300)
        //countChanges()
      })
    )
  }
})
document.getElementById('lightTest').addEventListener('click', e => {
  var promiseObj
  if (devices && devices.length && devices.length > 0) {
    page4Init()
    jumpPage(3)
    devices.forEach(d => {
      let deviceToSend = new HID.HID(d.path)
      lightTestData.forEach(data => {
        if (promiseObj) {
          promiseObj.then(() => sendData(data, deviceToSend))
        } else {
          promiseObj = sendData(data, deviceToSend)
        }
      })
    })
    promiseObj.then(() =>
      getAllSettings().then(() => {
        initSettings()
        setTimeout(page4Fin, 300)
        //countChanges()
      })
    )
  }
})


Array.prototype.forEach.call(
  document.querySelectorAll("input[type='color']"),
  e => {
    e.addEventListener('click', e => e.preventDefault())
  }
)

//初始化

freshDevices(false) //刷新列表
initSettingsFunction() //初始化设置和设置统计

ipc.send('window0-ready')

process.on('uncaughtException',e=>{
  if(e.message === 'could not read from HID device'){
    console.warn('Discon.')
    jumpPage(0)
    freshDevices(false)
  }else{
    throw e
  }
})