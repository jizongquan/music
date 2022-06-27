module.exports = (date)=>{
  //年月日 小时分钟秒
  let fmt = "yyyy-MM-dd hh:mm:ss"
  const o = {
    "M+": date.getMonth() + 1,//对应月份
    "d+":date.getDate(),//日
    "h+":date.getHours(), //时
    "m+":date.getMinutes(), //分钟
    "s+":date.getSeconds() //秒
  }

  if(/(y+)/.test(fmt)){
    fmt = fmt.replace(RegExp.$1,date.getFullYear())
  }
  for(let k in o){
    if(new RegExp('('+k+')').test(fmt)){
      fmt = fmt.replace(RegExp.$1,o[k].toString().length == 1 ? '0'+ o[k]:o[k])
    }
  }
  console.log(fmt)
  return fmt
}