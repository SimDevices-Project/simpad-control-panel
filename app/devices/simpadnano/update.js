const elecron = require('electron')
elecron.ipcRenderer.on('hexPath',(event,path)=>{
  console.log(path)
  require('./simpadIAP/index')(path)
})
process.on('uncaughtException', e => {
  if (e.message === 'could not read from HID device') {
    alert('Successd, Enjoy!')
    window.close()
  } else {
    throw e
  }
})
