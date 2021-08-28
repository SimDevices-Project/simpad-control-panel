var lang = {
  title: 'SimPad 컨트롤 패널',
  selectDevice: '장치 선택',
  selectOperation: 'Select Operation',
  detailedSettings: '세부 설정',
  apply: '적용',
  conInfo: '장치를 연결하고 선택해주세요',
  refresh: '새로고침',
  confirmAndNext: '연결',
  chooseInfo: 'Select the operation you want to perform',
  changeKeyCodeBT: '바로가기 수정',
  changeLightsBT: '라이트닝 수정',
  otherSettingsBT: 'Others',
  pleaseWait: '잠시만 기다려주세요...',
  successToApply: '적용되었습니다',
  returnToContinue: '돌아가기',
  exitProgram: '종료',

  edit: '수정',

  changeKeyCode: '바로가기 수정',
  changeKeyCodeInfo:
    '바로가기를 분리 설정할 수 있고 기본 키 조합을 지원합니다',
  viewKeyMap: '장치 바로가기 보기',

  changeLights: '라이트 모드 & 색',
  changeLightsInfo:
    '각 라이트에 대한 라이트 모드를 그룹별로 조정하거나 색상을 설정할 수 있습니다',
  viewLightsMap: '라이트닝 구성 모기',
  lightsMode: '모드',
  easeOut: '페이드 아웃',
  easeIn: '페이드 인',
  keepOn: '항상 켜짐',
  keepOff: '꺼짐',
  keyPress: '키 누름',
  rainbowColor: '무지개',

  colorAndBrightness: '색 설정', // & Brightness
  setBrightness: '밝기 설정',

  keyDelay: '인풋 디바운스',
  keyDelayInfo: `SimPad uses an advanced ID (input debounce) technology that is different from other keyboard, which can significantly control the delay caused by ID function
  <br>But you can still adjust the delay  for the ID function to be triggered, which will affect the experience when the keys are raised`,
  delay: '딜레이',

  advancedOptions: '고급 설정',
  advancedOptionsInfo: `You can fine tune some settings here, recommended for pro users，
  <br>All changes made in Advanced Options are applied immediately`,
  sendDataPack: '데이터 패킷 전송',
  sendDataPackInfo: `If you are familiar with SimPad data format，you can send data directly to the device，
  <br>Your text input will be treated as raw hex data, separated by space`,
  sendDataPackBtn: '전송',

  superSpeedMode: '풀스피드 모드',
  superSpeedModeInfo:
    '"풀스피드 모드"를 활성화하여 가장 빠른 속도를 위해 모든 라이트를 비활성화할 수 있습니다, 적용을 위해 장치를 재시작해야합니다.',
  superSpeedModeeBtnOn: '켜짐',
  superSpeedModeeBtnOff: '꺼짐',

  resetDevice: '장치 초기화',
  resetDeviceInfo: '장치는 기본 설정으로 초기화 될 수 있습니다',
  resetDeviceBtn: '초기화',
  resetAllDevicesBtn: '초기화',

  about: 'SimPad에 대하여',
  checkUpdate: '업데이트 확인',
  jumpToBootMode: '부트 모드 진입',
  aboutText: `<p>\SimPad를 사용해주셔서 감사합니다!</p>
  <p>SimPad는 8051 칩을 기반으로 한 커스텀 키보드로, 심플과 패드에서 이름을 붙여 간편하고 실용적인 것을 의미합니다.</p>
  <p>SSimPad의 개발 동안 아래에 있는 분들의 지원을 받았습니다.</p>
  <p> 정말로 감사합니다.</p>
  <p></p>
  <p class="nameBefore">Sayobot小夜</p>
  <p class="nameBefore">noodlefighter</p>
  <p class="nameBefore">kd飞飞</p>
  <p class="nameBefore">rikka0w0</p>
  <p class="nameBefore">晨旭</p>
  <p class="nameBefore">Antecer</p>
  <p></p>
  <p>특별히 감사를 전합니다</p>
  <p>영어 해석</p>
  <p class="nameBefore">Jeff - Source Localization Team</p>
  <p class="nameBefore">HDY</p>
  <p></p>
  <a href="https://www.bysb.net/3363.html">
    <p class="canBeSeleted">View the keyboard publishing page</p>
  </a>
  <a href="https://www.bysb.net">
    <p class="canBeSeleted">View Handle's Blog</p>
  </a>
  <p></p>
  <p>By Handle</p>
  <p>Last Update At 2018.7.4</p>`,

  changesCount: '변경 적용',
  abandonsChanges: '모든 변경 취소',
  applyToDevice: '장치에 적용',

  selectedDevice: '현재 장치',
  noDevice: '선택 대기 중',
  reselectDevice: '다른 장치 선택',

  //DevicesNames
  simpadv2: 'SimPad v2',
  sayoo2c: 'Sayobot\'s KeyPad O2C',

  //ForKeyboard
  key_esc: 'Esc',
  key_f1: 'F1',
  key_f2: 'F2',
  key_f3: 'F3',
  key_f4: 'F4',
  key_f5: 'F5',
  key_f6: 'F6',
  key_f7: 'F7',
  key_f8: 'F8',
  key_f9: 'F9',
  key_f10: 'F10',
  key_f11: 'F11',
  key_f12: 'F12',
  key_prtSc: 'Print Src',
  key_scrLk: 'Sroll Lock',
  key_pauseBreak: 'Pause Break',
  key_waveLine: '~ `',
  key_1: '! 1',
  key_2: '@ 2',
  key_3: '# 3',
  key_4: '$ 4',
  key_5: '% 5',
  key_6: '^ 6',
  key_7: '&amp; 7',
  key_8: '* 8',
  key_9: '( 9',
  key_0: ') 0',
  key_bar: '_ -',
  key_equal: '+ =',
  key_bsp: 'Backspace',
  key_ins: 'Ins',
  key_home: 'Home',
  key_pageUp: 'Page Up',
  key_numPad_numLk: 'Num Lock',
  key_numPad_slash: '/',
  key_numPad_asterisk: '*',
  key_numPad_bar: '-',
  key_tab: 'Tab',
  key_q: 'Q',
  key_w: 'W',
  key_e: 'E',
  key_r: 'R',
  key_t: 'T',
  key_y: 'Y',
  key_u: 'U',
  key_i: 'I',
  key_o: 'O',
  key_p: 'P',
  key_leftParenthesis: '{ [',
  key_rightParenthesis: '} ]',
  key_backSlant: '| \\',
  key_del: 'Del',
  key_end: 'End',
  key_pgDn: 'Page Down',
  key_numPad_7: '7 Hom',
  key_numPad_8: '8 ↑',
  key_numPad_9: '9 PgU',
  key_numPad_add: '+',
  key_capsLock: 'CapsLock',
  key_a: 'A',
  key_s: 'S',
  key_d: 'D',
  key_f: 'F',
  key_g: 'G',
  key_h: 'H',
  key_j: 'J',
  key_k: 'K',
  key_l: 'L',
  key_semicolon: ': ;',
  key_quotationMark: '" \'',
  key_enter: 'Enter',
  key_numPad_4: '4 ←',
  key_numPad_5: '5',
  key_numPad_6: '6 →',
  key_leftShift: 'Shift',
  key_z: 'Z',
  key_x: 'X',
  key_c: 'C',
  key_v: 'V',
  key_b: 'B',
  key_n: 'N',
  key_m: 'M',
  key_comma: '&lt; ,',
  key_period: '&gt; .',
  key_questionMark: '? /',
  key_rightShift: 'Shift',
  key_upArrow: '↑',
  key_numPad_1: '1 End',
  key_numPad_2: '2 ↓',
  key_numPad_3: '3 PgD',
  key_numPad_enter: 'Enter',
  key_leftCtrl: 'Ctrl',
  key_leftWin: '&#xF17A',
  key_leftAlt: 'Alt',
  key_space: 'Space',
  key_rightAlt: 'Alt',
  key_rightWin: '&#xF17A',
  key_menu: '&#xF022',
  key_rightCtrl: 'Ctrl',
  key_leftArrow: '←',
  key_downArrow: '↓',
  key_rightArrow: '→',
  key_numPad_0: '0 Ins',
  key_numPad_period: 'Del .',

  key_mouseLeft: 'MouseLeft',
  key_mouseMiddle: 'MouseMid',
  key_mouseRight: 'MouseRight',
  //ForKeyboard TextInfo
  keyN_null: 'Null',

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
  keyN_bsp: 'Backspace',
  keyN_ins: 'Insert',
  keyN_home: 'Home',
  keyN_pageUp: 'Page Up',
  keyN_numPad_numLk: 'Num Lock',
  keyN_numPad_slash: 'NumPad /',
  keyN_numPad_asterisk: 'NumPad *',
  keyN_numPad_bar: 'NumPad -',
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
  keyN_pgDn: 'Page Down',
  keyN_numPad_7: 'NumPad 7',
  keyN_numPad_8: 'NumPad 8',
  keyN_numPad_9: 'NumPad 9',
  keyN_numPad_add: 'NumPad +',
  keyN_capsLock: 'CapsLock',
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
  keyN_numPad_4: 'NumPad 4',
  keyN_numPad_5: 'NumPad 5',
  keyN_numPad_6: 'NumPad 6',
  keyN_leftShift: 'Left Shift',
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
  keyN_rightShift: 'Right Shift',
  keyN_upArrow: '↑',
  keyN_numPad_1: 'NumPad 1',
  keyN_numPad_2: 'NumPad 2',
  keyN_numPad_3: 'NumPad 3',
  keyN_numPad_enter: 'NumPad Enter',
  keyN_leftCtrl: 'Left Ctrl',
  keyN_leftWin: 'Left Win',
  keyN_leftAlt: 'Left Alt',
  keyN_space: 'Space',
  keyN_rightAlt: 'Right Alt',
  keyN_rightWin: 'Right Win',
  keyN_menu: 'Application',
  keyN_rightCtrl: 'Right Ctrl',
  keyN_leftArrow: '←',
  keyN_downArrow: '↓',
  keyN_rightArrow: '→',
  keyN_numPad_0: 'NumPad 0',
  keyN_numPad_period: 'NumPad .',

  keyN_mouseLeft: 'Mouse Left',
  keyN_mouseMiddle: 'Mouse Middle',
  keyN_mouseRight: 'Mouse Right',

  firmwareVersion: 'Firmware Version',
  lightTest: 'Lights Test',
  checkUpdateFailed: 'Check Update Failed',

  egg_1:'Good morning, and in case I don\'t see ya, good afternoon, good evening, and good night!'
}

exports.lang = lang
