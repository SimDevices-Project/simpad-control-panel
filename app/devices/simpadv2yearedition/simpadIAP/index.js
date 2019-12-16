const HID = require('node-hid')
const os = require('os')
const hex2bin = require('./hex2bin/index')
const path = require('path')

const isLog = false

/**
 * 发送数据包
 * @param {number[]} buffer 要发送的数据
 * @param {HID.HID} deviceIn 被发送的对象
 */
const sendData = (buffer, deviceIn) => {
  if (isLog) console.log('Send Data')
  if (isLog)
    console.log(buffer.map(num => num.toString(16).padStart(2, '0')).join(','))
  if (os.platform() === 'win32' || os.platform() === 'darwin') {
    buffer.unshift(0) // prepend throwaway byte
  }
  deviceIn.write(buffer)
}

const getDevices = () => {
  const devicesHIDs = HID.devices().filter(
    device => device.vendorId === 0x8088 && device.productId === 0x00ff // 厂商 0x8088 // 型号 0x00FF
  )
  devicesHIDs.forEach(deviceInfo => {
    console.log(
      `VID ${deviceInfo.vendorId}, PID ${deviceInfo.productId} Interface ${
        deviceInfo.interface
      }\nPATH ${deviceInfo.path}`
    )
  })
  return devicesHIDs.map(device => {
    return new HID.HID(device.path)
  })
}

/**
 * 向指定的设备分批次传输 ROM Buffer
 * @param {Uint8Array} buf Buffer
 * @param {HID.HID} device 设备实例
 * @param {number} redefine 重定义指令
 */
function* sendROM(buf, device, redefine = 0xa0) {
  const MAX_DATA_LENGTH = 0x30
  let address = 0
  /**
   * @type {number[]}
   */
  let dataBufffer = []
  for (let i = 0; i < buf.length; i++) {
    const val = buf[i]
    dataBufffer.push(val)
    if (dataBufffer.length === MAX_DATA_LENGTH) {
      yield sendData(
        [
          redefine,
          dataBufffer.length,
          (address & 0xff00) >> 8,
          address & 0xff,
          ...dataBufffer
        ],
        device
      )
      address += dataBufffer.length
      dataBufffer.splice(0)
    }
  }
  if (dataBufffer.length) {
    dataBufffer.push(...new Array(4 - (dataBufffer.length % 4)).fill(0x00))
    return sendData(
      [
        redefine,
        dataBufffer.length,
        (address & 0xff00) >> 8,
        address & 0xff,
        ...dataBufffer
      ],
      device
    )
  } else {
    return sendData([0x10, 0x00, 0x00, 0x00], device)
  }
}

/**
 * 完全自动刷入固件
 * @param {string} hexFileName HEX 文件路径
 */
const autoWriteAndVerifyROM = (
  hexFileName = path.join(__dirname, 'update.hex')
) => {
  getDevices().forEach(device => {
    let readyFlag = true
    /**
     * @type {number[]}
     */
    let lastTimeData
    let generatorDone = false
    // 收到消息
    device.on('data', data => {
      if (data.length) {
        readyFlag = true
        lastTimeData = data
      }
    })
    hex2bin(hexFileName).then(buf => {
      let running = 'WRITE'
      let romWriter = sendROM(buf, device)
      let romVerifier = sendROM(buf, device, 0xc0)
      let romVerifier2 = sendROM(buf, device, 0xc0)
      const timer = setInterval(() => {
        switch (running) {
          case 'WRITE': {
            if (readyFlag && !generatorDone) {
              generatorDone = romWriter.next().done
            } else if (readyFlag && generatorDone) {
              console.log('Write End')
              generatorDone = false
              running = 'VERIFY'
            }
            break
          }
          case 'VERIFY': {
            if (readyFlag && !generatorDone) {
              if (lastTimeData) {
                // 如果验证失败
                if (lastTimeData[1] === 0xff) {
                  console.log('Verify Failed')
                  console.log(lastTimeData.join(','))
                  romWriter = sendROM(buf, device)
                  running = 'WRITE'
                }
              }
              generatorDone = romVerifier.next().done
            } else if (readyFlag && generatorDone) {
              console.log('Verify End')
              generatorDone = false
              running = 'VERIFY2'
            }
            break
          }
          case 'VERIFY2': {
            if (readyFlag && !generatorDone) {
              if (lastTimeData) {
                // 如果验证失败
                if (lastTimeData[1] === 0xff) {
                  console.log('Verify Failed')
                  console.log(lastTimeData.join(','))
                  romWriter = sendROM(buf, device)
                  running = 'WRITE'
                }
              }
              generatorDone = romVerifier2.next().done
            } else if (readyFlag && generatorDone) {
              console.log('Verify2 End')
              // 清除定时器
              clearInterval(timer)
              // 重启设备
              sendData([0xf0, 0x00, 0x00, 0x00], device)
            }
            break
          }
        }
      }, 5)
    })
  })
}

module.exports = autoWriteAndVerifyROM
