function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function regexConfig() {
  var reg = {
    email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
    phone: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
  }
  return reg;
}
// 10位时间戳秒转换为标准时间 10位时间戳乘以1000
function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return Y + M + D + h + m + s
}
// 13位时间戳毫秒不用乘以1000
function timestampToTimeLong(timestamp) {
  let date = new Date(parseInt(timestamp));
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  const f = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  // console.log( y + '-' + m + '-' + d + ' ' + '　' + h + ':' + minute + ':' + second)
  return Y + M + D + '' + h + f + s;
};
//计算两个时间之间的时间差 多少天时分秒
function intervalTime(startTime, endTime) {
  // var timestamp=new Date().getTime(); //计算当前时间戳
  var timestamp = (Date.parse(new Date())); ///1000计算当前时间戳 (毫秒级)
  var date1 = startTime; //开始时间
  // if(timestamp<startTime){
  //     date1=startTime;
  // }else{
  //     date1 = timestamp; //开始时间
  // }
  var date2 = endTime; //结束时间
  // var date3 = date2.getTime() - date1.getTime(); //时间差的毫秒数
  var date3 = (date2 - date1); //*1000时间差的毫秒数
  console.log('时间戳差', date3);
  //计算出相差天数
  var days = Math.floor(date3 / (24 * 3600 * 1000));
  //计算出小时数

  var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));

  //计算相差秒数

  var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000);
  // console.log(days + "天 " + hours + "小时" + minutes + " 分钟" + seconds + " 秒")
  if (days > 0) {
    return days + "天" + hours + "小时" + minutes + "分钟" + seconds + "秒"
  } else if (hours > 0) {
    return hours + "小时" + minutes + "分钟" + seconds + "秒"
  } else if (minutes > 0) {
    return minutes + "分钟" + seconds + "秒"
  } else {
    return seconds + "秒"
  }
}
module.exports = {
  formatTime,
  regexConfig,
  timestampToTime,
  timestampToTimeLong,
  intervalTime
}