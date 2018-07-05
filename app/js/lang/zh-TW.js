var lang = {
  title: 'SimPad Control Panel',
  selectDevice: '選擇設備',
  selectOperation: '選擇操作',
  detailedSettings: '具體配置',
  apply: '套用',
  conInfo: '請連接並選取您要更改的設備',
  refresh: '更新',
  confirmAndNext: '確定，對該設備進行操作',
  chooseInfo: '請選擇您要進行的設定',
  changeKeyCodeBT: '修改鍵位',
  changeLightsBT: '設置燈光',
  otherSettingsBT: '其他選項',
  pleaseWait: '套用中，請稍後……',
  successToApply: '套用成功',
  exitProgram: '退出',

  edit: '編輯',

  changeKeyCode: '鍵值設定',
  changeKeyCodeInfo: '您可以在這裡分別設置每個鍵的鍵值，支援基本組合鍵功能',
  viewKeyMap: '檢視設備按鍵配置',

  changeLights: '燈光模式與顏色',
  changeLightsInfo: '您可以在這裡調整燈光模式或是分別設置每組燈光的顏色',
  viewLightsMap: '檢視設備燈光配置',
  lightsMode: '模式',
  easeOut: '按下亮起，然後淡出',
  easeIn: '按下熄滅，然後淡入',
  keepOn: '一直常亮',
  keepOff: '關閉',
  keyPress:'按下亮起',
  colorAndBrightness: '顏色', //與亮度
  setBrightness: '設置亮度',

  keyDelay: '按鍵防抖',
  keyDelayInfo: `SimPad使用了一種不同於普通鍵盤的防抖方式，可以有效降低防抖帶來的延遲，
  <br>但您依然可以調整防抖延遲相對值，這個設置將會用於按鍵抬起防抖`,
  delay: '延遲',

  advancedOptions: '進階',
  advancedOptionsInfo: `進階選單提供一些進階操作，這些操作不建議使用者去使用，
  <br>在進階選單的所有操作都將跳過確認而直接套用`,
  sendDataPack: '傳送數據包',
  sendDataPackInfo: `如果您熟悉SimPad數據包格式，您亦可以直接向設備傳送數據包，
  <br>您輸入的文字將按照空格分開解析為16進位數據`,
  sendDataPackBtn: '傳送',
  superSpeedMode: '極速模式',
  superSpeedModeInfo:
    '您可以使用極速模式來徹底關閉所有的燈光效果來獲得最極速的體驗，需要重啓設備來生效更改',
  superSpeedModeeBtnOn: '開啓',
  superSpeedModeeBtnOff: '關閉',
  resetDevice: '重置設備',
  resetDeviceInfo: '您可以重置您的設備，將所有設置恢復為初始設置',
  resetDeviceBtn: '重置',

  about: '關於',
  checkUpdate: '檢查更新',
  aboutText: `<p>感謝您使用SimPad！</p>
  <p>SimPad是一款基於C51單片機實現的自訂鍵盤，得名於Simple與Pad，表明這個設備力求簡單與實用，在這款設備的開發過程中受到以下人的幫助，</p>
  <p>特此感謝！</p>
  <p></p>
  <p class="nameBefore">Sayobot小夜</p>
  <p class="nameBefore">noodlefighter</p>
  <p class="nameBefore">kd飞飞</p>
  <p class="nameBefore">rikka0w0</p>
  <p class="nameBefore">晨旭</p>
  <p class="nameBefore">Antecer</p>
  <p></p>
  <p>特別感謝</p>
  <p>中文（臺灣）翻譯</p>
  <p class="nameBefore">Spy</p>
  <p></p>
  <a href="https://www.bysb.net">
    <p class="canBeSeleted">訪問鍵盤發佈頁面</p>
  </a>
  <a href="https://www.bysb.net">
    <p class="canBeSeleted">訪問手柄君的小閣博客</p>
  </a>
  <p></p>
  <p>By Handle</p>
  <p>Last Update At 2018.7.4</p>`,

  changesCount: '項生效的更變',
  abandonsChanges: '放棄所有更變',
  applyToDevice: '套用到設備',

  selectedDevice: '目前設備',
  noDevice: '等待選取',
  reselectDevice: '重新選擇設備',

  simpadv2: 'SimPad v2',

  
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
  keyN_bsp: '回退鍵',
  keyN_ins: 'Insert',
  keyN_home: 'Home',
  keyN_pageUp: '上翻頁',
  keyN_numPad_numLk: 'Num Lock',
  keyN_numPad_slash: '小鍵盤/',
  keyN_numPad_asterisk: '小鍵盤*',
  keyN_numPad_bar: '小鍵盤-',
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
  keyN_pgDn: '下翻頁',
  keyN_numPad_7: '小鍵盤7',
  keyN_numPad_8: '小鍵盤8',
  keyN_numPad_9: '小鍵盤9',
  keyN_numPad_add: '小鍵盤+',
  keyN_capsLock: '大寫鎖定',
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
  keyN_numPad_4: '小鍵盤4',
  keyN_numPad_5: '小鍵盤5',
  keyN_numPad_6: '小鍵盤6',
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
  keyN_numPad_1: '小鍵盤1',
  keyN_numPad_2: '小鍵盤2',
  keyN_numPad_3: '小鍵盤3',
  keyN_numPad_enter: '小鍵盤Enter',
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
  keyN_numPad_0: '小鍵盤0',
  keyN_numPad_period: '小鍵盤.'
}
exports.lang = lang
