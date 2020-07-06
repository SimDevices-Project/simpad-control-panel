'use strict'

const fs = require('fs')

/**
 * 读取单行 HEX 仅接受输入值以 : 开头
 * @param {string} hexLine 单行的 HEX 文本
 */
const hexLineReader = hexLine => {
  if (!hexLine.startsWith(':')) {
    return null
  }
  let checksumCounter = 0x00
  const hexLineObject = {
    length: parseInt(hexLine.substr(1, 2), 16),
    address: parseInt(hexLine.substr(3, 4), 16),
    type: parseInt(hexLine.substr(7, 2), 16),
    checksum: parseInt(hexLine.substr(hexLine.length - 2, 2), 16),
    data: [],
    verify: false
  }
  for (let i = 9; i < hexLine.length - 2; i += 2) {
    let charData = parseInt(hexLine.substr(i, 2), 16)
    hexLineObject.data.push(charData)
    checksumCounter += charData
  }
  checksumCounter += hexLineObject.length
  checksumCounter += hexLineObject.type
  checksumCounter += (hexLineObject.address & 0xff00) >> 8
  checksumCounter += hexLineObject.address & 0x00ff
  checksumCounter &= 0xff
  if (hexLineObject.checksum === ((0x100 - checksumCounter) & 0xff)) {
    hexLineObject.verify = true
  }
  return hexLineObject
}

/**
 * 将 HEX 转为 Buffer
 * @param {string} hexString HEX 字符串
 */
const hexToBuffer = hexString => {
  console.log(`Hex to Buffer`)
  const hexArray = hexString
    .split('\r\n')
    .map(hexLineReader)
    .filter(hexLine => !!hexLine)
  console.log(`Hex Length ${hexArray.length}`)
  if (hexArray.map(hexLine => hexLine.verify).includes(false)) {
    return null
  }
  const hexAddressArray = hexArray
    .filter(hexLine => hexLine.type === 0x00)
    .map(hexLine => hexLine.address)
  const addressMax = Math.max(...hexAddressArray)
  const addressMin = Math.min(...hexAddressArray)
  const addressLength =
    addressMax -
    addressMin +
    hexArray.filter(hexLine => hexLine.address === addressMax)[0].length
  console.log(`Address Max    ${addressMax}`)
  console.log(`Address Min    ${addressMin}`)
  console.log(`Address Length ${addressLength}`)
  const buf = new Uint8Array(addressLength)
  hexArray.forEach(hexLine => {
    if (!hexLine.verify) {
      console.log(
        `Verify Failed ${hexLine.data.join(',')} \n With ${hexLine.checksum}`
      )
      return
    }
    if (hexLine.type !== 0x00) {
      console.log(
        `HEX Line Type Is ${hexLine.type}`
      )
    }
    for (let i = 0; i < hexLine.length; i++) {
      buf[hexLine.address - addressMin + i] = hexLine.data[i]
    }
  })
  return buf
}

/**
 * 将 HEX 文件转为 BIN 文件
 * @param {string} hexFileName 输入 HEX 的文件名
 * @param {string} binFileName 输出 BIN 的文件名
 * @returns {Promise<Uint8Array>}
 */
const hex2bin = (hexFileName, binFileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(hexFileName, 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        // 成功读取了 HEX 文件，进行解析
        const buf = hexToBuffer(data)
        // 解析完毕，写入
        if(binFileName){
          fs.writeFile(binFileName, buf, { encoding: 'binary' }, err => {
            if (err) {
              reject(err)
            } else {
              resolve(buf)
            }
          })
        }else{
          // 没有提供输出路径，则直接继续
          resolve(buf)
        }
      }
    })
  })
}

module.exports = hex2bin
