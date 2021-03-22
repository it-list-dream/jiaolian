const formatTime = date => {
  var date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  var hours = date.getHours()//获取小时
  var minutes = date.getMinutes()
  return [year, month, day].map(formatNumber).join('-')
}
const yesterday = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = '01'


  return [year, month, day].map(formatNumber).join('-')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//之后30天的日期
const days = () => {
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);
  //获取年份  
  var Y = date.getFullYear();
  //获取月份  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //获取当日日期 
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var time = []
  var DD = ""
  var length = 30
  for (var i = 0; i < length; i++) {
    if (M == "01" || M == "03" || M == "05" || M == "07" || M == "08" || M == "10" || M == "12") {
      if (DD == "31" || D == "31") {
        if (M == "12") {
          M = "01"
        } else if (M == "01" || M == "03" || M == "05" || M == "08") {
          M = Number(M) + Number(1)
          M = "0" + M
        } else if (M == "07") {
          M = Number(M) + Number(1)
          M = "0" + M
        } else {
          M = Number(M) + Number(1)
        }
        DD = "01"
        D = "01 "
        length = length - i
        i = 0
        var date = M + "月" + DD + "日"
      } else {
        DD = Number(D) + Number(i)
        DD = DD < 10 ? "0" + DD : DD
        var date = M + "月" + DD + "日"
      }
    } else if (M == "04" || M == "06" || M == "09" || M == "11") {
      if (DD == "30" || D == "30") {
        M = Number(M) + Number(1)
        if (M == "05" || M == "07") {
          M = "0" + M
        }
        DD = "01"
        D = "01"
        length = length - i
        i = 0
        var date = M + "月" + DD + "日"
      } else {
        DD = Number(D) + Number(i)
        DD = DD < 10 ? "0" + DD : DD
        var date = M + "月" + DD + "日"

      }
    } else if (M == "02") {
      if (Y % 4 == 0 && Y % 100 != 0 || Y % 400 == 0) {
        if (DD == "28" || D == "28") {
          M = Number(M) + Number(1)
          M = "0" + M
          D = "01"
          DD = "01"
          length = length - i
          i = 0
          var date = M + "月" + DD + "日"
        } else {
          DD = Number(D) + Number(i)
          DD = DD < 10 ? "0" + DD : DD
          var date = M + "月" + DD + "日"
        }
      } else {
        if (DD == "29" || D == "29") {
          M = Number(M) + Number(1)
          D = "01"
          DD = "01"
          length = length - i
          i = 0
          var date = M + "月" + DD + "日"
        } else {
          DD = Number(D) + Number(i)
          DD = DD < 10 ? "0" + DD : DD
          var date = M + "月" + DD + "日"
        }
      }
    }
    time.push(date)
  }
  return time
}
// //创建时间
// const createTime = () => {
  
// }
module.exports = {
  formatTime: formatTime,
  yesterday: yesterday,
  days: days
}