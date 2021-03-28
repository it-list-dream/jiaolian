var util = require("../../utils/util.js")
const server = require('../../utils/server.js')
const app = getApp()
Page({
  data: {
    aa: {
      "bg_color": "white",
      "color": "#000",
      "flag": 1,
      "name": "预约"
    },
    datatime:[],
    dayStyle: [{
      month: 'current',
      day: new Date().getDate(),
      color: 'white',
      background: '#AAD4F5'
    },
    {
      month: 'current',
      day: new Date().getDate(),
      color: 'white',
      background: '#AAD4F5'
    }
    ],
    chose: false,
    showId: 0,
    date: false,
    num: null, 
    seatshow: false,
    seat:[],
    co_id:null,
    cp_id:null,
    lessonName:null
  },
  // closmdel: function () {
  //   this.setData({
  //     date: false,
  //   })
  // },
  shownum(e) {
    var chosetime = e.currentTarget.dataset.s + "-" + e.currentTarget.dataset.e
    this.setData({
      num: e.currentTarget.dataset.num,
      chosetime: chosetime
    })
  },
  cantorder() {
    wx.showToast({
      title: '预约时间已过',
      icon: "none"
    })
  },
  cantorder1() {
    wx.showToast({
      title: '该时间已有预约',
      icon: "none"
    })
  },
  cantorder2() {
    wx.showToast({
      title: '该时间是您选择的休息时间',
      icon: "none"
    })
  },
  // cantorder2() {
  //   wx.showToast({
  //     title: '该时间是您上课时间',
  //     icon: "none"
  //   })
  // },
  //弹出提示框
  closebacground() {
    console.log("弹出提示框");
    this.setData({
      chose: false,
      seatshow: false,
    })
  },
  uplessonTime(fieldName){
    console.log(wx.getStorageSync("meminfo").AI_ID )
    var   that =this
    var info = {
      Content: "",
      FK_CO_ID:that.data.co_id,
      FK_UI_ID: that.data.userid,
      FK_CP_ID: that.data.cp_id,
      SpendDate: that.data.SearchDate,
      Time: that.data.chosetime,
      FieldName: fieldName,
      CP_Name: that.data.lessonName,
      coachID: wx.getStorageSync("meminfo").AI_ID
    }
    console.log(info)
    server.request('Coach_SpendAddFromCoachV3', info, function (res) {
      console.log(res)
      var msgtitle
      res.data.code == -16 ? msgtitle = "课程已过期" : (res.data.code == -15 ? msgtitle = "课程已过期，不能约课" : (res.data.code == -17 ? msgtitle = "会员已停用" : (res.data.code == -13 ? msgtitle = "教练休息时间" : (res.data.code == -14 ? msgtitle = "课程已经被预约" : (res.data.code == -4 ? msgtitle = '剩余课程数量不足' : msgtitle = '预约失败')))))
      res.data.code
      if (res.data.code == 1) {
        wx.showToast({
          title: '预约成功',
          success: function () {
            setTimeout(function () {
              that.setData({
                num: null,
                chose: false
              })
              that.teachMyTime()
            }, 1000)
          }
        })
      } else {
        wx.showToast({
          title: msgtitle,
          icon: 'none'
        })
        that.setData({
          chose: false
        })
      }
    })
  },
  //选择场地
   uploadSeat(e) {
    var that = this
    that.setData({
      seatshow: false,
    })
     this.uplessonTime(e.currentTarget.dataset.fieldname)
   
  },
  upclass(e) {
    //选课
    console.log(e.currentTarget.dataset.name)
    var that = this
    this.setData({
      co_id: e.currentTarget.dataset.co_id,
      cp_id: e.currentTarget.dataset.cp_id,
      lessonName: e.currentTarget.dataset.name
    })
    //查询课程
    server.request('CoachFieldList', {
      FK_GB_ID: wx.getStorageSync("meminfo").FK_GB_ID
    }, function (res) {
      console.log("xuanke",res);
      that.setData({
        chose:false,
        seat: res.data.data,
        seatshow: res.data.data.length ? true : false
      })
      if (res.data.data.length) {
        return
      } else {
        that.uplessonTime(" ")
      }
    })
  },
  //预约
  succ() {
    var that = this
    if (!this.data.num) {
      wx.showToast({
        title: '请选择可预约时间',
        icon: "none"
      })
      return false
    }
    server.request('TeachUserClass', {
      userid: this.data.userid
    }, function (res) {
      console.log(res);
      var listinfo = res.data.data
      for (var i = 0; i < listinfo.length; i++) {
        listinfo[i].CO_ActiveEnd = listinfo[i].CO_ActiveEnd.split(" ")[0]
        listinfo[i].textcolor = Date.parse(listinfo[i].CO_ActiveEnd.split(" ")[0]) >= Date.parse(that.data.todaytime) ? "rgba(123,130,140,1)" : "rgba(254,132,115,1)"
        listinfo[i].CO_ActiveEnd = listinfo[i].CO_ActiveEnd.split(" ")[0]
      }
      console.log(listinfo );
      that.setData({
        classlist: listinfo,
        chose: true
      })

    })
  },
  // 日期
  changebg(e) {
    var that = this
    var idx = e.currentTarget.dataset.index
    this.setData({
      num: 0,
      showId: idx,
      date: false,
      SearchDate: e.currentTarget.dataset.year + '-' + e.currentTarget.dataset.day
    })
    this.teachMyTime()
  },
  todate() {
    this.setData({
      date: !this.data.date
    })
  },
  //给点击的日期设置一个背景颜色
  dayClick: function (event) {
    var that =this
    let clickDay = event.detail.day;
    let clickYear = event.detail.year;
    let clickMonth = event.detail.month;
    clickMonth < 10 ? clickMonth = "0" + clickMonth : clickMonth
    clickDay < 10 ? clickDay = "0" + clickDay : clickDay
    let changeDay = `dayStyle[1].day`;
    let changeBg = `dayStyle[1].background`;
    let ti = clickYear + '-' + clickMonth + "-" + clickDay
    var caniclick = Date.parse(ti) >= Date.parse(this.data.todaytime)
    if (caniclick) {
      this.setData({
        [changeDay]: clickDay,
        [changeBg]: "#84e7d0",
        date: false,
        showId: 0,
        SearchDate: clickYear + '-' + clickMonth + "-" + clickDay
      })
      this.clickme(ti)
      this.teachMyTime()
      that.setData({
        date: false,
      })
    } else {
      wx.showToast({
        title: '预约时间已过',
        icon: "none"
      })
    }
  },
  clickme: function (ti) {
    var myDate = new Date(ti);
    myDate.toLocaleDateString();
    var month = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
    var tday = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()
    var time = myDate.getFullYear() + '-' + month + '-' + tday;
    var total = 1;
    var dayList = [];
    dayList.push({
      'day': myDate.getDate(),
      'month': myDate.getMonth() + total,
      'week': util.toWeekDay(myDate.getDay()),
      'year': myDate.getFullYear()
    });
    for (var i = 0; i < 4; i++) {
      myDate.setDate(myDate.getDate() + total);
      dayList.push({
        'day': myDate.getDate(),
        'month': myDate.getMonth() + total,
        'week': util.toWeekDay(myDate.getDay()),
        'year': myDate.getFullYear()
      });
    }
    for (var i = 0; i < dayList.length; i++) {
      dayList[i].month < 10 ? dayList[i].month = '0' + dayList[i].month : ''
      dayList[i].day < 10 ? dayList[i].day = '0' + dayList[i].day : ''
    }
    this.setData({
      dayList: dayList,
      SearchDate: time
    })
    this.teachMyTime()
  },
  // 对得到的时间进行排序
  compare: function (property, desc) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      if (desc == true) {
        return value1 - value2;
      } else {
        return value2 - value1;
      }
    }
  },
  // 得到我的时间封装
  teachMyTime: function () {
    var that = this
    server.request('TeachMyTime', {
      SearchDate: that.data.SearchDate
    }, function (res) {
      console.log(res);
      var sdts = res.data.data.sort(that.compare("sort", false)).reverse()
      //console.log(sdts)
      //// 时间去重
      var result = [];
      var obj = {};
      for (var i = 0; i < sdts.length; i++) {
        if (!obj[sdts[i].sort]) {
          result.push(sdts[i]);
          obj[sdts[i].sort] = true;
        }
      }
      var date = new Date();
      var hours = date.getHours()
      var minnutes = date.getMinutes();
      var data = that.data.datatime

      var datacopy = JSON.parse(JSON.stringify(data))
      for (var i = 0; i < datacopy.length; i++) {
        if (Date.parse(that.data.todaytime) == Date.parse(that.data.SearchDate) && Number(hours) + minnutes / 60  > Number(datacopy[i].index)) {
          datacopy[i].type = -1
        }
        //判断下一个时间点
        if (that.data.num) {
         // console.log("判断时间点");
          if (that.data.num == datacopy[i].sort) {
            datacopy[i].type = 3;
          }
        }
        for (var j = 0; j < result.length; j++) {  
          console.log(result[j])
          if (datacopy[i].sort == result[j].sort) {
            datacopy[i].type = result[j].Type
            break
          }
        }
      }

      that.setData({
        data1: datacopy.slice(0, 12),
        data2: datacopy.slice(12, 24),
        data3: datacopy.slice(24, 36)
      })
    })
  },
  onLoad: function (options) {
    var that = this
    var ti = new Date();
    ti.toLocaleDateString();
    var month = ti.getMonth() + 1 < 10 ? '0' + (ti.getMonth() + 1) : ti.getMonth() + 1;
    var today = ti.getDate() < 10 ? '0' + ti.getDate() : ti.getDate()
    var time = ti.getFullYear() + '-' + month + '-' + today;
    this.setData({
      todaytime: time
    })
    this.clickme(ti)
    var that = this
    let isIphoneX = getApp().globalData.isIphoneX;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          "commonHeadHeight.titleHeight": res.statusBarHeight * 2 + 16,
          "high": res.statusBarHeight + 140,
          "high1": res.statusBarHeight + 280,
          userid: options.userid
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      datatime:util.createEveryday()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {


  }
})