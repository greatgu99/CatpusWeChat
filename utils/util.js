const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
const dataAddHash = data =>{
  const CryptoJS = require("crypto-js");
  let bytesToSign=''
  for (let x in data){
    bytesToSign+=x
    bytesToSign+=data[x]
  }
  console.log(bytesToSign)
  // let bytesToSign =JSON.stringify(data)
  // console.log(bytesToSign)
  const SecretKey = 'rOWh1msXOsxLYu5xY0NtFVmcKVGntqLPTFNZ2gDy';
  let hash = CryptoJS.HmacSHA256(bytesToSign, SecretKey);
  let secret = CryptoJS.enc.Base64.stringify(hash);
  console.log(secret)
  return {...data,hashCode:secret} 
}
module.exports = {
  formatTime,
  dataAddHash
}
