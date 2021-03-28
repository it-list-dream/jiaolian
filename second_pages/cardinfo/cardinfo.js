var util = require("../../utils/util.js")
const app = getApp()
const server = require('../../utils/server.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    aa: {
      "bg_color": "white",
      "color": "#000",
      "flag": 1,
      "name": "上课时间"
    },
    dothing: '休息',
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
    // datatime: [{
    //   starttime: '06:00',
    //   endtime: "07:00",
    //   sort: 1,
    //   type: 1
    // },
    // {
    //   starttime: '07:00',
    //   endtime: "08:00",
    //   sort: 2,
    //   type: 1
    // },
    // {
    //   starttime: '08:00',
    //   endtime: "09:00",
    //   sort: 3,
    //   type: 1
    // },
    // {
    //   starttime: '09:00',
    //   endtime: "10:00",
    //   sort: 4,
    //   type: 1
    // },
    // {
    //   starttime: '10:00',
    //   endtime: "11:00",
    //   sort: 5,
    //   type: 1
    // },
    // {
    //   starttime: '11:00',
    //   endtime: "12:00",
    //   sort: 6,
    //   type: 1
    // },
    // {
    //   starttime: '12:00',
    //   endtime: "13:00",
    //   sort: 7,
    //   type: 1
    // },
    // {
    //   starttime: '13:00',
    //   endtime: "14:00",
    //   sort: 8,
    //   type: 1
    // },
    // {
    //   starttime: '14:00',
    //   endtime: "15:00",
    //   sort: 9,
    //   type: 1
    // },
    // {
    //   starttime: '15:00',
    //   endtime: "16:00",
    //   sort: 10,
    //   type: 1
    // },
    // {
    //   starttime: '16:00',
    //   endtime: "17:00",
    //   sort: 11,
    //   type: 1
    // },
    // {
    //   starttime: '17:00',
    //   endtime: "18:00",
    //   sort: 12,
    //   type: 1
    // },
    // {
    //   starttime: '18:00',
    //   endtime: "19:00",
    //   sort: 13,
    //   type: 1
    // },
    // {
    //   starttime: '19:00',
    //   endtime: "20:00",
    //   sort: 14,
    //   type: 1
    // },
    // {
    //   starttime: '20:00',
    //   endtime: "21:00",
    //   sort: 15,
    //   type: 1
    // },
    // {
    //   starttime: '21:00',
    //   endtime: "22:00",
    //   sort: 16,
    //   type: 1
    // },
    // {
    //   starttime: '22:00',
    //   endtime: "23:00",
    //   sort: 17,
    //   type: 1
    // },
    // {
    //   starttime: '23:00',
    //   endtime: "24:00",
    //   sort: 18,
    //   type: 1
    // },
    // ],
    datatime: [],
    chose: false,
    showId: 0,
    date: false,
    dataup: [],
    dataup2: [],
    dothingidx:3
  },
  // 课程结束提醒
  no_order1:function(){
     wx.showToast({
       title: '课程已结束',
       icon:'none'
     })
  },
  // 取消预约
  no_order: function (event) {
    var that =this
    var idx = event.currentTarget.dataset.index
    var ch = "listinfo1[" + idx + "].canisub"
    var that = this
    wx.showModal({
      content: '确认取消预约吗',
      success: function (e) {
        if (e.cancel) { } else {
          var info ={
            cs_id: event.currentTarget.dataset.id
          }
          server.request('AppointmentCancel ', info, function (res) {

            if (res.data.code == 1){
         wx.showToast({
            title: '取消成功',
            icon: "none"
          })
              that.teachmytime(that.data.searchDate)
              that.setData({
                dataup2: []
              })
            }else{
              wx.showToast({
                title: "操作失败",
                icon: "none"
              })
            }
          })
        }
      }
    })
  },
  // 点击取消选择日期
  removeWithoutCopy: function (arr, item) {
    var n = arr.length;
    for (var i = 0; i < n; i++) {
      if (arr[i].time == item){
        arr.splice(i, 1);
      }
    }
  },
  showch(e) {
    var that = this
    if (that.data.dataup2.length) {
    } else {
      var num = e.currentTarget.dataset.num
      var touchbgcolor
      var writecolor
      var bordercolor
      var changeischeck = that.data.dataall[num].ischecked
      var changebg = 'dataall[' + num + '].bgcolor'
      var changebor = 'dataall[' + num + '].bordercolor'
      var changewrite = 'dataall[' + num + '].writecolor'
      var changebgg = 'dataall[' + num + '].ischecked'
      that.data.dataall[num].ischecked ? touchbgcolor = 'white' : touchbgcolor = '#307AF5'
      that.data.dataall[num].ischecked ? writecolor = '#FE8473' : writecolor = 'white'
      that.data.dataall[num].ischecked ? bordercolor = '#FE8473' : bordercolor = '#307AF5'
  
      if (that.data.dataall[num].ischecked) {
        that.removeWithoutCopy(that.data.dataup, e.currentTarget.dataset.s + "-" + e.currentTarget.dataset.e)
      } else {
        var obj ={}
        obj.time = e.currentTarget.dataset.s + "-" + e.currentTarget.dataset.e
        obj.type = 1
        that.data.dataup.push(obj)
      }
      that.setData({
        [changebor]: bordercolor,
        [changebg]: touchbgcolor,
        [changewrite]: writecolor,
        [changebgg]: !that.data.dataall[num].ischecked,
        dothing:"工作",
        dothingidx:0,
      })
    }
  },
  showch1(e) {
    var that = this
    if (this.data.dataup.length) {
    } else {
      var num = e.currentTarget.dataset.num
      var touchbgcolor
      var writecolor
      var bordercolor
      var changeischeck = that.data.dataall[num].ischecked
      var changebg = 'dataall[' + num + '].bgcolor'
      var changewrite = 'dataall[' + num + '].writecolor'
      var changebgg = 'dataall[' + num + '].ischecked'
      var changebor = 'dataall[' + num + '].bordercolor'
      that.data.dataall[num].ischecked ? touchbgcolor = 'white' : touchbgcolor = '#FE8473'
      that.data.dataall[num].ischecked ? writecolor = '#307AF5' : writecolor = 'white'
      that.data.dataall[num].ischecked ? bordercolor = '#307AF5' : bordercolor = '#FE8473'
      if (that.data.dataall[num].ischecked) {
        that.removeWithoutCopy(that.data.dataup2, e.currentTarget.dataset.s + "-" + e.currentTarget.dataset.e)
      } else {
        var obj = {}
        obj.time = e.currentTarget.dataset.s + "-" + e.currentTarget.dataset.e
        obj.type = 0
        that.data.dataup2.push(obj)
      }
      that.setData({
        [changebor]: bordercolor,
        [changebg]: touchbgcolor,
        [changewrite]: writecolor,
        [changebgg]: !that.data.dataall[num].ischecked,
        dothing: "休息",
        dothingidx: 1
      })
    }
  },
  showch2() {
    wx.showToast({
      title: '此时间段已有预约',
      icon: 'none'
    })
  },
  closemodel() {
    this.setData({
      date: false
    })
  },
  succ() {
    var that = this

    if(this.data.dothingidx==1){
      var info = {
        searchDate:that.data.searchDate, 
        Date: JSON.stringify(that.data.dataup2)
       }
      server.request('CoachSpendStopTimeAdd ', info, function (res) {
        that.teachmytime(that.data.searchDate)
       that.setData({
         dataup2:[],
         dothingidx:3
       })
      })
    } else if (this.data.dothingidx == 0){
      var info = {
        searchDate: that.data.searchDate,
        Date: JSON.stringify(that.data.dataup)
      }
   
      server.request('CoachSpendStopTimeAdd ', info, function (res) {

        that.teachmytime(that.data.searchDate)
        that.setData({
          dataup: [],
          dothingidx: 3
        })
      })
    }else{
      wx.showToast({
        title: '请选择时间',
        icon:'none'
      })
    }
  },
  changebg(e) {
    var that = this
    var idx = e.currentTarget.dataset.index
    this.setData({
      date: false,
      num: 0,
      showId: idx,
      searchDate: e.currentTarget.dataset.year + '-' + e.currentTarget.dataset.day
    })
    this.teachmytime(e.currentTarget.dataset.year + '-' + e.currentTarget.dataset.day)
  },
  todate() {
    this.setData({
      date: !this.data.date
    })
  },
  //给点击的日期设置一个背景颜色
  dayClick: function (event) {
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
        searchDate: ti,
        clickdate: clickYear + '-' + clickMonth + "-" + clickDay,
        showId:0
      })
      this.clickme(ti)
      this.teachmytime(ti)
    } else {
      wx.showToast({
        title: '时间已过',
        icon: "none"
      })
    }
  },
  closmdel:function(){
    this.setData({
      date: false,
    })
  },
  clickme: function (ti) {
    // var ti = new Date();
    var myDate = new Date(ti);
    myDate.toLocaleDateString();
    var month = myDate.getMonth() + 1;
    var time = myDate.getFullYear() + '-' + month + '-' + myDate.getDate();
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
      dayList[i].month = dayList[i].month < 10 ? '0' + dayList[i].month : dayList[i].month
      dayList[i].day = dayList[i].day < 10 ? '0' + dayList[i].day : dayList[i].day
    }
    this.setData({
      dayList: dayList
    })
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
  // 我的请求封装
  teachmytime: function (searchDate){
    var that = this
    // 我的预约列表
    var AppointmentListByDate ={
      PageIndex:1,
      PageSize:200,
      SearchDate: that.data.searchDate 
    }
    server.request('AppointmentListByDate', AppointmentListByDate, function (res) { 
      for (var i = 0; i < res.data.data.length;i++){
        res.data.data[i].CS_Spenddate = res.data.data[i].CS_Spenddate.split(" ")[1].split(":")
        res.data.data[i].CS_Spenddate.length = res.data.data[i].CS_Spenddate.length-1
        res.data.data[i].CS_Spenddate = res.data.data[i].CS_Spenddate.join(":")
        res.data.data[i].CS_SpenddateEnd = res.data.data[i].CS_SpenddateEnd.split(" ")[1].split(":")
        res.data.data[i].CS_SpenddateEnd.length = res.data.data[i].CS_SpenddateEnd.length - 1
        res.data.data[i].CS_SpenddateEnd = res.data.data[i].CS_SpenddateEnd.join(":")
        res.data.data[i].firstname = res.data.data[i].UI_Name.substring(0, 1)
      }

      that.setData({
        listinfo1: res.data.data
      })
     })
    //  我的时间详情
    server.request('TeachMyTime', { SearchDate: searchDate }, function (res) {
      console.log(res);
      var sdts = res.data.data.sort(that.compare("sort", false)).reverse()
      // 时间去重
      var result = [];
      var obj = {};
      for (var i = 0; i < sdts.length; i++) {
        if (!obj[sdts[i].sort]) {
          result.push(sdts[i]);
          obj[sdts[i].sort] = true;
        }
      }
 
      var data = JSON.parse(JSON.stringify(that.data.datatime)) 
      for (var i = 0; i < data.length; i++) {
        data[i].ischecked = false
        for (var j = 0; j < result.length; j++) {
          if (data[i].sort == result[j].sort) {
            data[i].type = result[j].Type
            break
          }
        }
      }
      for (var i = 0; i < data.length; i++) {
        if (data[i].type == 0) {
          data[i].bordercolor = "#FE8473"
          data[i].writecolor = "#FE8473"
        }
        if (data[i].type == 1) {
          data[i].bordercolor = "#307AF5"
          data[i].writecolor = "#307AF5"
        }
        if (data[i].type == 2) {
          data[i].bordercolor = "#999999"
          data[i].writecolor = "#999999"
        }
      }

      that.setData({
        dataall: data,
      })
    })
  },
  onLoad: function () {
    var that = this
    let isIphoneX = getApp().globalData.isIphoneX;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          "commonHeadHeight.titleHeight": res.statusBarHeight * 2 + 16,
          "high": res.statusBarHeight + 140,
          "high1": res.statusBarHeight + 280,
        });
      }
    })
    var ti = new Date();
    ti.toLocaleDateString();
    var month = ti.getMonth() + 1 < 10 ? "0" + (ti.getMonth() + 1) : ti.getMonth() + 1;
    var day = ti.getDate() < 10 ? "0" + ti.getDate() : ti.getDate()
    var time = ti.getFullYear() + '-' + month + '-' + day;
    this.setData({
      todaytime: time,
      searchDate: time
    })
    this.teachmytime(time)
    this.clickme(ti)
  },
  onShow: function () {
    this.setData({
      datatime:util.createEveryday()
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})