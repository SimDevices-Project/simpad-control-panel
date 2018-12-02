'use strict'

if (!Object.entries)
  Object.entries = function(obj) {
    var ownProps = Object.keys(obj),
      i = ownProps.length,
      resArray = new Array(i) // preallocate the Array
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]]

    return resArray
  }

if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    value: function assign(target, varArgs) {
      // .length of function is 2
      'use strict'
      if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object')
      }

      var to = Object(target)

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index]

        if (nextSource != null) {
          // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }
      return to
    },
    writable: true,
    configurable: true
  })
}

if (!String.prototype.padStart) {
  String.prototype.padStart =
    // 为了方便表示这里 fillString 用了ES6 的默认参数，不影响理解
    function(maxLength, fillString) {
      if (!fillString) {
        fillString = ' '
      }
      if (Object.prototype.toString.call(fillString) !== '[object String]')
        throw new TypeError('fillString must be String')
      let str = this
      // 返回 String(str) 这里是为了使返回的值是字符串字面量，在控制台中更符合直觉
      if (str.length >= maxLength) return String(str)

      let fillLength = maxLength - str.length,
        times = Math.ceil(fillLength / fillString.length)

      // 这个算法叫啥？
      // SICP 的中文版第 30页 有用到同种算法计算乘幂计算
      while ((times >>= 1)) {
        fillString += fillString
        if (times === 1) {
          fillString += fillString
        }
      }
      return fillString.slice(0, fillLength) + str
    }
}

var _typeof =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function(obj) {
        return typeof obj
      }
    : function(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj
      }

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    })
  } else {
    obj[key] = value
  }
  return obj
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i]
    }
    return arr2
  } else {
    return Array.from(arr)
  }
}

;(function() {
  /**
   * addClassName to an Element
   * @param {HTMLElement} node
   */
  var addClassName = function addClassName(node, str) {
    if (
      node.className.split(' ').filter(function(s) {
        return s === str
      }).length === 0
    ) {
      node.className += ' ' + str
    }
  }
  /**
   *
   * @param {HTMLElement} node
   */
  var removeClassName = function removeClassName(node, str) {
    node.className = node.className
      .split(' ')
      .filter(function(s) {
        return s !== str
      })
      .join(' ')
  }
  /**
   * 设定边界值 Set Max and Min
   * @param {number} num
   * @param {number} max
   * @param {number} min
   */
  var numberBorder = function numberBorder(num, max, min) {
    return Math.max(Math.min(num, max), min)
  }

  /**
   * 转换rgb颜色到hsb
   * @param {string} hex
   */
  var rgbToHsb = function rgbToHsb(hex) {
    var hsb = { h: 0, s: 0, b: 0 }
    if (hex.indexOf('#') === 0) {
      hex = hex.substring(1)
    }
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(function(s) {
          return s + s
        })
        .join('')
    }
    if (hex.length !== 6) return false
    hex = [hex.substr(0, 2), hex.substr(2, 2), hex.substr(4, 2)].map(function(
      s
    ) {
      return parseInt(s, 16)
    })
    var rgb = {
      r: hex[0],
      g: hex[1],
      b: hex[2]
    }
    var MAX = Math.max.apply(Math, _toConsumableArray(hex))
    var MIN = Math.min.apply(Math, _toConsumableArray(hex))
    //H start
    if (MAX === MIN) {
      hsb.h = 0
    } else if (MAX === rgb.r && rgb.g >= rgb.b) {
      hsb.h = (60 * (rgb.g - rgb.b)) / (MAX - MIN) + 0
    } else if (MAX === rgb.r && rgb.g < rgb.b) {
      hsb.h = (60 * (rgb.g - rgb.b)) / (MAX - MIN) + 360
    } else if (MAX === rgb.g) {
      hsb.h = (60 * (rgb.b - rgb.r)) / (MAX - MIN) + 120
    } else if (MAX === rgb.b) {
      hsb.h = (60 * (rgb.r - rgb.g)) / (MAX - MIN) + 240
    }
    //H end
    if (MAX === 0) {
      hsb.s = 0
    } else {
      hsb.s = 1 - MIN / MAX
    }
    hsb.b = MAX / 255
    return hsb
  }

  /**
   * 由百分比转为一个基准rgb颜色 Percent to RGB
   * @param {number} heightPercent 当前选中位置相对整体高度
   * @returns {r: any,g: any,b: any}
   */
  var heightToRgb = function heightToRgb(heightPercent) {
    heightPercent = 1 - heightPercent
    var rgb = { r: undefined, g: undefined, b: undefined }
    var percentInEach = heightPercent * 6
    return Object.entries(rgb).reduce(function(lastObj, nowArr, index) {
      return Object.assign(
        lastObj,
        _defineProperty(
          {},
          nowArr[0],
          Math.floor(
            (function() {
              var left = ((index + 1) % 3) * 2
              var right = left + 2
              var differenceL = percentInEach - left
              var differenceR = right - percentInEach
              if (differenceL >= 0 && differenceR >= 0) {
                return 0
              }
              var distance = Math.min(
                Math.abs(differenceL),
                Math.abs(differenceR),
                Math.abs(6 - differenceL),
                Math.abs(6 - differenceR)
              )
              return Math.min(255, 255 * distance)
            })()
          )
        )
      )
    }, {})
  }

  var heightAddLAndT_ToRGB = function heightAddLAndT_ToRGB(height, left, top) {
    var rgb = heightToRgb(height)
    for (var key in rgb) {
      rgb[key] = (255 - rgb[key]) * (1 - left) + rgb[key]
      rgb[key] = rgb[key] * (1 - top)
    }
    return rgb
  }

  var rgbToHex = function rgbToHex(rgb) {
    var r = rgb.r,
      g = rgb.g,
      b = rgb.b

    return (
      Math.floor(r)
        .toString(16)
        .padStart(2, '0') +
      Math.floor(g)
        .toString(16)
        .padStart(2, '0') +
      Math.floor(b)
        .toString(16)
        .padStart(2, '0')
    )
  }

  /**
   * Hex To RGB
   * @param {string} hex
   */
  var hexToRgb = function hexToRgb(hex) {
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16)
    }
  }

  /**
   * "cE" is only for zip codes
   * @param {HTMLElement} str
   */
  var cE = function cE(str) {
    return document.createElement(str)
  }

  var ColorPicker = (function() {
    function ColorPicker() {
      var _this = this

      var _ref =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : {},
        _ref$dom = _ref.dom,
        dom = _ref$dom === undefined ? cE('div') : _ref$dom,
        input = _ref.input,
        _ref$value = _ref.value,
        value = _ref$value === undefined ? 'FFF' : _ref$value

      _classCallCheck(this, ColorPicker)

      this.dom = dom
      var thisClass = this

      Array.prototype.forEach.call(this.getDOM().children, function(node) {
        node.remove()
      })
      addClassName(dom, 'color-picker')

      var rightBar = cE('div')
      rightBar.className = 'color-picker-right-bar'
      var rightBarPicker = cE('div')
      rightBarPicker.className = 'color-picker-right-bar-picker'

      rightBar.appendChild(rightBarPicker)

      var colorBlock = cE('div')
      colorBlock.className = 'color-picker-color-block'
      var gradientColor = cE('div')
      gradientColor.className =
        'color-picker-gradients color-picker-gradient-color'
      var gradientBlack = cE('div')
      gradientBlack.className =
        'color-picker-gradients color-picker-gradient-black'

      gradientColor.style.background =
        'linear-gradient(to right,#FFFFFF,#FF0000)'

      var gradientCircle = cE('div')
      gradientCircle.className = 'color-picker-circle'

      gradientBlack.appendChild(gradientCircle)

      var textInput = cE('input')
      var textInputBox = cE('div')
      textInputBox.className = 'color-picker-input'
      textInput.maxLength = 6
      textInput.style.width = '100%'
      textInput.style.height = '100%'
      textInput.type = 'text'
      textInputBox.appendChild(textInput)

      this.getDOM().appendChild(rightBar)
      this.getDOM().appendChild(colorBlock)
      this.getDOM().appendChild(textInputBox)
      this.getDOM().appendChild(gradientColor)
      this.getDOM().appendChild(gradientBlack)

      textInput.addEventListener('change', function() {
        _this.setValue(textInput.value, true)
        _this.onchange()
        _this.updatePicker()
      })

      this.textInput = textInput
      this._gradientBlack = gradientBlack
      this._gradientColor = gradientColor
      this._rightBar = rightBar
      this._rightBarPicker = rightBarPicker
      this._colorBlock = colorBlock

      this._gradientCircle = gradientCircle

      this._height = 0
      this._mouseX = 0
      this._mouseY = 0

      this.setValue(value, true)
      this._lastValue = this.value
      this.updatePicker()
      //this.input = input

      var mouseMoveFun = function mouseMoveFun(e) {
        window.addEventListener('mouseup', function mouseUpFun() {
          thisClass.getDOM().style.userSelect = 'text'
          window.removeEventListener('mousemove', mouseMoveFun)
          window.removeEventListener('mouseup', mouseUpFun)
        })
        var bbox = thisClass._gradientBlack.getBoundingClientRect()
        _this._mouseX = e.clientX - bbox.left // * (p.width / bbox.width)
        _this._mouseY = e.clientY - bbox.top // * (p.height / bbox.height)
        _this.mouseBorder()
        _this.setValue(
          heightAddLAndT_ToRGB(_this.height, _this.position.x, _this.position.y)
        )
        _this.updatePicker()
      }
      var mouseMoveFunBar = function mouseMoveFunBar(e) {
        window.addEventListener('mouseup', function mouseUpFunBar() {
          thisClass.getDOM().style.userSelect = 'text'
          window.removeEventListener('mousemove', mouseMoveFunBar)
          window.removeEventListener('mouseup', mouseUpFunBar)
        })
        var bbox = thisClass._rightBar.getBoundingClientRect()
        _this._height = e.clientY - bbox.top // * (p.height / bbox.height)
        _this.mouseBorderBar()
        _this.setValue(
          heightAddLAndT_ToRGB(_this.height, _this.position.x, _this.position.y)
        )
        _this.updatePicker()
      }
      this._gradientBlack.addEventListener('mousedown', function(e) {
        _this.getDOM().style.userSelect = 'none'
        mouseMoveFun(e)
        window.addEventListener('mousemove', mouseMoveFun)
      })
      this._rightBar.addEventListener('mousedown', function(e) {
        _this.getDOM().style.userSelect = 'none'
        mouseMoveFunBar(e)
        window.addEventListener('mousemove', mouseMoveFunBar)
      })

      if ('ontouchstart' in window) {
        var touchFun = function touchFun(e) {
          e.preventDefault()
          e = e.touches[0]
          var bbox = thisClass._gradientBlack.getBoundingClientRect()
          _this._mouseX = e.clientX - bbox.left // * (p.width / bbox.width)
          _this._mouseY = e.clientY - bbox.top // * (p.height / bbox.height)
          _this.mouseBorder()
          _this.setValue(
            heightAddLAndT_ToRGB(
              _this.height,
              _this.position.x,
              _this.position.y
            )
          )
          _this.updatePicker()
        }
        var touchFunBar = function touchFunBar(e) {
          e.preventDefault()
          e = e.touches[0]
          var bbox = _this._rightBar.getBoundingClientRect()
          _this._height = e.clientY - bbox.top // * (p.height / bbox.height)
          _this.mouseBorderBar()
          _this.setValue(
            heightAddLAndT_ToRGB(
              _this.height,
              _this.position.x,
              _this.position.y
            )
          )
          _this.updatePicker()
        }
        this._gradientBlack.addEventListener('touchmove', touchFun)
        this._gradientBlack.addEventListener('touchstart', touchFun)
        this._rightBar.addEventListener('touchmove', touchFunBar)
        this._rightBar.addEventListener('touchstart', touchFunBar)
      }

      this._changeFunctions = []
      //this.updateValue()
    }

    _createClass(ColorPicker, [
      {
        key: 'onchange',
        value: function onchange() {
          var _this2 = this

          this._changeFunctions.forEach(function(fun) {
            return fun({
              target: _this2,
              type: 'change',
              timeStamp: performance.now()
            })
          })
        }
        /**
         *
         * @param {"change"} type
         * @param {function} fun
         */
      },
      {
        key: 'addEventListener',
        value: function addEventListener(type, fun) {
          if (typeof fun !== 'function') {
            return
          }
          switch (type) {
            case 'change': {
              this._changeFunctions.push(fun)
              break
            }
          }
        }
      },
      {
        key: 'getValue',
        value: function getValue() {
          var mode =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : 'value'

          switch (mode) {
            case 'hex': {
              return this._value
            }
            case 'rgb': {
              return hexToRgb(this.getValue('hex'))
            }
            case 'hsb': {
              return rgbToHsb(this.getValue('hex'))
            }
            case 'value':
            default: {
              return '#' + this._value
            }
          }
        }
      },
      {
        key: 'getBrightness',
        value: function getBrightness() {
          var _getValue = this.getValue('rgb'),
            r = _getValue.r,
            g = _getValue.g,
            b = _getValue.b

          return 0.299 * r + 0.587 * g + 0.114 * b
        }
      },
      {
        key: 'setValue',
        value: function setValue(value) {
          var resetPosition =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : false

          var hex = ''
          switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
            case 'string': {
              if (value.indexOf('#') === 0) {
                value = value.substring(1)
              }
              if (value.length === 3) {
                value = value
                  .split('')
                  .map(function(s) {
                    return s + s
                  })
                  .join('')
              }
              if (value.length !== 6) {
                value = 'FFFFFF'
              }
              hex = value
              break
            }
            case 'object': {
              hex = rgbToHex(value)
            }
          }
          var rgb = void 0
          try {
            rgb = hexToRgb(hex)
          } catch (error) {
            rgb = {
              r: 255,
              g: 255,
              b: 255
            }
          }
          var _rgb = rgb,
            r = _rgb.r,
            g = _rgb.g,
            b = _rgb.b

          this._value = rgbToHex({ r: r, g: g, b: b }).toUpperCase()
          this.textInput.value = this._value
          this._colorBlock.style.backgroundColor = this.getValue()
          if (resetPosition) {
            var _rgbToHsb = rgbToHsb(hex),
              h = _rgbToHsb.h,
              s = _rgbToHsb.s,
              _b = _rgbToHsb.b

            this._height = 1 - h / 360
            if (h === 0) this._height = 0
            this._mouseX = s
            this._mouseY = 1 - _b
          } else {
            if (this._lastValue !== this.value) {
              this.onchange()
            }
          }
          this._lastValue = this.value
        }
        /**
         * @return {HTMLDivElement}
         */
      },
      {
        key: 'getDOM',
        value: function getDOM() {
          return this.dom
        }
      },
      {
        key: 'mouseBorder',
        value: function mouseBorder() {
          this._mouseX = numberBorder(
            this._mouseX /
              (this._gradientBlack.getBoundingClientRect().width - 2),
            1,
            0
          )
          this._mouseY = numberBorder(
            this._mouseY /
              (this._gradientBlack.getBoundingClientRect().height - 2),
            1,
            0
          )
        }
      },
      {
        key: 'mouseBorderBar',
        value: function mouseBorderBar() {
          this._height = numberBorder(
            this._height / (this._rightBar.getBoundingClientRect().height - 2),
            1,
            0
          )
        }
      },
      {
        key: 'updatePicker',
        value: function updatePicker() {
          var position = this.position
          var target = this._gradientCircle
          target.style.left = position.x * 100 + '%'
          target.style.top = position.y * 100 + '%'
          this._rightBarPicker.style.top = this.height * 100 + '%'
          this._gradientColor.style.background =
            'linear-gradient(to right,#FFFFFF,#' +
            rgbToHex(heightToRgb(this.height)) +
            ')'
          if (this.getBrightness() > 152) {
            addClassName(target, 'color-picker-circle-black')
            removeClassName(target, 'color-picker-circle-white')
          } else {
            removeClassName(target, 'color-picker-circle-black')
            addClassName(target, 'color-picker-circle-white')
          }
        }
      },
      {
        key: 'position',
        get: function get() {
          return {
            x: this._mouseX,
            y: this._mouseY
          }
        }
      },
      {
        key: 'height',
        get: function get() {
          return this._height
        }
      },
      {
        key: 'value',
        get: function get() {
          return this.getValue()
        },
        set: function set(value) {
          this.setValue(value, true)
          this.updatePicker()
        }
      }
    ])

    return ColorPicker
  })()

  if (window.module && _typeof(window.exports) === 'object') {
    // For Node, CommonJS
    module.exports.ColorPicker = ColorPicker
  } else if (
    (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object'
  ) {
    window.ColorPicker = ColorPicker
  }
})()
