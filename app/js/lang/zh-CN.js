var lang = {
  title: 'SimPad Control Panel',
  selectDevice: '选择设备',
  selectOperation: '选定操作',
  detailedSettings: '具体配置',
  apply: '应用',
  conInfo: '请连接并选中您要更改的设备',
  refresh: '刷新',
  confirmAndNext: '确认，对该设备进行操作',
  chooseInfo: '请选择您要进行的设定',
  changeKeyCodeBT: '修改键值',
  changeLightsBT: '设置灯光',
  otherSettingsBT: '其它选项',
  pleaseWait: '正在应用，请稍后……',
  successToApply: '成功应用',
  returnToContinue: '返回',
  exitProgram: '退出',

  edit: '编辑',

  changeKeyCode: '键值设定',
  changeKeyCodeInfo: '您可以在这里分别设置每个键的键值，支持基本组合键功能',
  viewKeyMap: '查看设备按键定义',

  changeLights: '灯光模式与颜色',
  changeLightsInfo: '您可以在这里调整灯光模式或是分别设置每组灯光的颜色',
  viewLightsMap: '查看设备灯光配置',
  lightsMode: '模式',
  easeOut: '按下立即亮起，然后渐隐',
  easeIn: '按下立即熄灭，然后渐显',
  keepOn: '一直常亮',
  keepOff: '关闭',
  keyPress: '按下时亮起',
  rainbowColor: '彩虹',

  colorAndBrightness: '颜色', //与亮度
  setBrightness: '设置亮度',

  keyDelay: '按键消抖',
  keyDelayInfo: `SimPad独特的消抖方式可以有效降低消抖带来的延迟，
  <br>您在这里可以调整按键抬起时消抖功能的触发延迟`,
  delay: '延时',

  advancedOptions: '高级',
  advancedOptionsInfo: `高级选单提供了一些高级操作，这些操作不建议用户去使用，
  <br>在高级选单的所有操作都将跳过确认而直接应用`,
  sendDataPack: '发送数据包',
  sendDataPackInfo: `如果您熟悉SimPad数据包格式，您亦可以直接向设备发送数据包，
  <br>您输入的文本将按照空格分开解析为16进制数据`,
  sendDataPackBtn: '发送',
  superSpeedMode: '极速模式',
  superSpeedModeInfo:
    '您可以使用极速模式来彻底关闭所有的灯光效果来获得最急速的体验，重启设备生效',
  superSpeedModeeBtnOn: '开启',
  superSpeedModeeBtnOff: '关闭',

  resetDevice: '重置设备',
  resetDeviceInfo: '您可以将您的设备重置，将所有设置恢复为默认',
  resetDeviceBtn: '重置',
  resetAllDevicesBtn: '重置全部',

  about: '关于',
  checkUpdate: '检查更新',
  jumpToBootMode: '进入升级模式',
  aboutText: `<p>感谢您使用SimPad！</p>
  <p>SimPad是一款基于C51单片机实现的自定义键盘，得名于Simple与Pad，表明这个设备力求简单与实用，在这款设备的开发过程中受到了以下人的帮助，</p>
  <p>特此感谢！</p>
  <p></p>
  <p class="nameBefore">Sayobot小夜</p>
  <p class="nameBefore">noodlefighter</p>
  <p class="nameBefore">kd飞飞</p>
  <p class="nameBefore">rikka0w0</p>
  <p class="nameBefore">晨旭</p>
  <p class="nameBefore">Antecer</p>
  <p></p>
  <a href="https://www.bysb.net/3363.html">
    <p class="canBeSeleted">访问键盘发布页</p>
  </a>
  <a href="https://www.bysb.net">
    <p class="canBeSeleted">访问手柄君的小阁博客</p>
  </a>
  <p></p>
  <p>By Handle</p>
  <p>Last Update At 2018.7.4</p>`,

  changesCount: '项生效的更改',
  abandonsChanges: '丢弃所有更改',
  applyToDevice: '应用到设备',

  selectedDevice: '当前设备',
  noDevice: '等待选中',
  reselectDevice: '重新选择设备',

  //设备列表
  simpadv2: 'SimPad 版本2',
  sayoo2c: '小夜のosu装备 O2C',

  key_mouseLeft: '鼠标左键',
  key_mouseMiddle: '鼠标中键',
  key_mouseRight: '鼠标右键',

  //ForKeyboard TextInfo
  keyN_null: '空',

  keyN_esc: 'Esc',
  keyN_f1: 'F1',
  keyN_f2: 'F2',
  keyN_f3: 'F3',
  keyN_f4: 'F4',
  keyN_f5: 'F5',
  keyN_f6: 'F6',
  keyN_f7: 'F7',
  keyN_f8: 'F8',
  keyN_f9: 'F9',
  keyN_f10: 'F10',
  keyN_f11: 'F11',
  keyN_f12: 'F12',
  keyN_prtSc: 'Print Screen',
  keyN_scrLk: 'Sroll Lock',
  keyN_pauseBreak: 'Pause Break',
  keyN_waveLine: '~',
  keyN_1: '1',
  keyN_2: '2',
  keyN_3: '3',
  keyN_4: '4',
  keyN_5: '5',
  keyN_6: '6',
  keyN_7: '7',
  keyN_8: '8',
  keyN_9: '9',
  keyN_0: '0',
  keyN_bar: '-',
  keyN_equal: '=',
  keyN_bsp: '回退键',
  keyN_ins: 'Insert',
  keyN_home: 'Home',
  keyN_pageUp: '上翻页',
  keyN_numPad_numLk: 'Num Lock',
  keyN_numPad_slash: '小键盘/',
  keyN_numPad_asterisk: '小键盘*',
  keyN_numPad_bar: '小键盘-',
  keyN_tab: 'Tab',
  keyN_q: 'Q',
  keyN_w: 'W',
  keyN_e: 'E',
  keyN_r: 'R',
  keyN_t: 'T',
  keyN_y: 'Y',
  keyN_u: 'U',
  keyN_i: 'I',
  keyN_o: 'O',
  keyN_p: 'P',
  keyN_leftParenthesis: '[',
  keyN_rightParenthesis: ']',
  keyN_backSlant: '\\',
  keyN_del: 'Delete',
  keyN_end: 'End',
  keyN_pgDn: '下翻页',
  keyN_numPad_7: '小键盘7',
  keyN_numPad_8: '小键盘8',
  keyN_numPad_9: '小键盘9',
  keyN_numPad_add: '小键盘+',
  keyN_capsLock: '大写锁定',
  keyN_a: 'A',
  keyN_s: 'S',
  keyN_d: 'D',
  keyN_f: 'F',
  keyN_g: 'G',
  keyN_h: 'H',
  keyN_j: 'J',
  keyN_k: 'K',
  keyN_l: 'L',
  keyN_semicolon: ';',
  keyN_quotationMark: "'",
  keyN_enter: 'Enter',
  keyN_numPad_4: '小键盘4',
  keyN_numPad_5: '小键盘5',
  keyN_numPad_6: '小键盘6',
  keyN_leftShift: '左Shift',
  keyN_z: 'Z',
  keyN_x: 'X',
  keyN_c: 'C',
  keyN_v: 'V',
  keyN_b: 'B',
  keyN_n: 'N',
  keyN_m: 'M',
  keyN_comma: ',',
  keyN_period: '.',
  keyN_questionMark: '/',
  keyN_rightShift: '右Shift',
  keyN_upArrow: '↑',
  keyN_numPad_1: '小键盘1',
  keyN_numPad_2: '小键盘2',
  keyN_numPad_3: '小键盘3',
  keyN_numPad_enter: '小键盘Enter',
  keyN_leftCtrl: '左Ctrl',
  keyN_leftWin: '左Win',
  keyN_leftAlt: '左Alt',
  keyN_space: 'Space',
  keyN_rightAlt: '右Alt',
  keyN_rightWin: '右Win',
  keyN_menu: 'Application',
  keyN_rightCtrl: '右Ctrl',
  keyN_leftArrow: '←',
  keyN_downArrow: '↓',
  keyN_rightArrow: '→',
  keyN_numPad_0: '小键盘0',
  keyN_numPad_period: '小键盘.',

  keyN_mouseLeft: '鼠标左键',
  keyN_mouseMiddle: '鼠标中键',
  keyN_mouseRight: '鼠标右键',

  firmwareVersion: '固件版本',
  lightTest: '灯光测试'
}
exports.lang = lang
