//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const server = require("../../utils/server.js")
Page({
  data: {
    aa: {
      "bg_color": "white",
      "color": "#000",
      "flag": 0,
      "name": "首页"
    },
    // 13025656211
    userInfo: {},
    indexList: [],
    orderlist: [],
    orderlist1: [],
    orderlist2: [],
    activeS:true,
    mesnum0: "",
    mesnum1: "",
    mesnum2: "",
    mesnum3: "",
    swiper: true,
    swiperList: [],
    interval: 2000,
  },
  //事件处理函数
  // 跳转
  tosetting() {
    wx.navigateTo({
      url: '/second_pages/setting/setting',
    })
  },
  torecommend() {
    wx.navigateTo({
      url: '/second_pages/recommend/recommend',
    })
  },
  toamountclass() {
    wx.navigateTo({
      url: '/second_pages/toamountclass/toamountclass',
    })
  },
  toperformance() {
    wx.navigateTo({
      url: '/second_pages/performance/performance',
    })

  },
  tomember() {
    wx.navigateTo({
      url: '/second_pages/member/member?id=1',
    })
    
  },
  tomembero() {
    wx.navigateTo({
      url: '/second_pages/member/member?id=0',
    })
  },
  tomes() {
    wx.navigateTo({
      url: '/second_pages/mes/mes',
    })
  },
  tocardinfo() {
    wx.navigateTo({
      url: '/second_pages/cardinfo/cardinfo',
    })
  },


  //头部活动推荐
  activeCross(){
    this.setData({
      activeS:false
    })
    wx.setStorageSync("dateActive", false)
    // let nowdate = util.formatTime(new Date());
    // wx.setStorageSync("dateActive", nowdate)
  },
  //数据请求
  request: function(url, postData, doSuccess, dofail) {
    var fixtion = {
      key: "BD687B66ECDBED4E12C4320B0ABB3BB111",
      coachname: wx.getStorageSync("phone"),
      password: wx.getStorageSync("pwd"),
      GymUrl: wx.getStorageSync("url")
    }
      wx.request({
        url: "https://user.360ruyu.cn/MobileCoach.asmx/" + url,
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: { ...fixtion,
          ...postData
        },
        postData,
        method: 'POST',
        success: function(res) {
          // wx.hideLoading()
          //console.log(res);
          doSuccess(res)
        },
        fail: function(res) {
          dofail(res)
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          })
        },
      })
  },



  //到店通知
  //通知请求
  setInterval: function() {
    var that = this
    var list = this.data.swiperList
    this.request("IndexUserCheckIn", { minite:1}, function(res) {
      if (res.data.data.length != 0) {

        that.indexlist()
        that.tixing()
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].GB_Name = res.data.data[i].GB_Name.replace(/(^\s*)|(\s*$)/g, "")
        }
        if (list.length >5) {
          list = list.concat(res.data.data)
          list.splice(0, res.data.data.length)
        } else if (res.data.data.length > 5 || list.length == 0) {
          list = res.data.data
        } else {
          list = list.concat(res.data.data)
          var result = [];
          var obj = {};
          for (var i = 0; i < list.length; i++) {
            if (!obj[list[i].UC_ID]) {
              result.push(list[i]);
              obj[list[i].UC_ID] = true;
            }
          }
          list = result
        }
        that.setData({
          swiperList: list,
          swiper: false
        })
      }
    })
  },
  //消息提醒
  tixing: function() {
    var that = this
    var allRequire = []
    let info = {
      PageIndex: "1",
      PageSize: "50"
    }
    if (wx.getStorageSync("IDlist").length == 0 && wx.getStorageSync("IDlist1").length == 0 && wx.getStorageSync("IDlist2").length == 0 && wx.getStorageSync("IDlist3").length == 0) {
      that.setData({
        mesnum0: 0,
        mesnum1: 0,
        mesnum2: 0,
        mesnum3: 0
      })
    } else {
      this.request('RemindLastCheckinDate', info, function(res) {
        var date = wx.getStorageSync("date")
        if (util.formatTime(new Date()) != date) {
          var ID = []
        } else {
          var ID = wx.getStorageSync("IDlist")
        }
        var newID = []
        var mesnum0 = 0
        var data = res.data.data
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < ID.length; j++) {
            if (data[i].UI_ID == ID[j]) {
              newID.push(ID[j])
              var mesnum0 = mesnum0 + 1
              break
            }
          }
        }
        that.setData({
          mesnum0: mesnum0
        })
        ID = newID
        wx.setStorageSync("IDlist", that.unique(ID))
      })
      this.request('RemindBirthday', info, function(res) {
        var ID = wx.getStorageSync("IDlist1")
        var newID = []
        var mesnum1 = 0
        var data = res.data.data
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < ID.length; j++) {
            if (data[i].UI_ID == ID[j]) {
              newID.push(ID[j])
              var mesnum1 = mesnum1 + 1
              break
            }
          }
        }
        that.setData({
          mesnum1: mesnum1
        })
        ID = newID
        wx.setStorageSync("IDlist1", that.unique(ID))
      })
      this.request('RemindCoachEndDate', info, function(res) {
        var ID = wx.getStorageSync("IDlist2")
        var newID = []
        var mesnum2 = 0
        var data = res.data.data
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < ID.length; j++) {
            if (data[i].CO_ID == ID[j]) {
              newID.push(ID[j])
              var mesnum2 = mesnum2 + 1
              break
            }
          }
        }
        that.setData({
          mesnum2: mesnum2
        })
        ID = newID
        wx.setStorageSync("IDlist2", that.unique(ID))
      })
      this.request('RemindLastDate', info, function(res) {
        var ID = wx.getStorageSync("IDlist3")
        var newID = []
        var mesnum3 = 0
        var data = res.data.data
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < ID.length; j++) {
            if (data[i].UI_ID == ID[j]) {
              newID.push(ID[j])
              var mesnum3 = mesnum3 + 1
              break
            }
          }
        }
        that.setData({
          mesnum3: mesnum3
        })
        ID = newID
        wx.setStorageSync("IDlist3", that.unique(ID))
      })
    }
  },
  unique: function(arr) {
    return Array.from(new Set(arr))
  },
  //预约



  // 截取字符串
  sub: function(arr, U_name) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].firstname = arr[i][U_name].substring(0, 1)
    }
  },

  orderuser(e) {
    wx.navigateTo({
      url: '/second_pages/order/order',
    })
  },
  //上部加通知请求
  indexlist: function() {
    var that = this
    this.request('Index', {}, function(res) {
      for (var i = 0; i < res.data.data.length; i++) {
        res.data.data[i].Num = Math.floor(res.data.data[i].Num)
      }
      res.data.data[0].AllMoney = Math.floor(res.data.data[0].AllMoney)
      res.data.data[1].AllMoney = Math.floor(res.data.data[1].AllMoney)

      res.data.data[2].AllMoney = Math.floor((res.data.data[2].AllMoney) * 100) + "%"

      res.data.data[3].AllMoney = Math.floor((res.data.data[3].AllMoney) * 100) + "%"
      var list = res.data.data.slice(0, 4)
      var newnum = res.data.data.slice(-4)
      let mesnum = 0
      for (var i = 0; i < newnum.length; i++) {
        mesnum += parseInt(newnum[i].Num)
      }
      that.setData({
        indexList: list,
        mesnum: mesnum
      })
    })
  },
  // 我的预约封装
  orderlist:function( type ,onload){
    var that = this
    if(onload==1){
      this.setData({
        pageindex:this.data.pageindex+1
      })
     var  index= this.data.pageindex
    }else{
     var index=1
    }
    server.request("AppointmentList ", {

      SearchType: type,
      PageIndex: index,
      PageSize:20
    }, function (res) {

      that.setData({
        pageindex:index
      })
      for (var i = 0; i < res.data.data.length; i++) {
        if (res.data.data[i].CP_Name.length>10){
          res.data.data[i].CP_Name = res.data.data[i].CP_Name.substring(0, 10) + "..."
        }
        res.data.data[i].UI_Name = res.data.data[i].UI_Name.replace(/(^\s*)|(\s*$)/g, "")
        res.data.data[i].firstname = res.data.data[i].UI_Name.slice(0, 1)
        res.data.data[i].CS_Spenddate = res.data.data[i].CS_Spenddate.split("/").join("-").substring(0, res.data.data[i].CS_Spenddate.length - 3);
      }
      if(onload==1){
        if(type==1){
          that.setData({
            orderlist: res.data.data.concat(that.data.orderlist)
          })
        }else if(type==2){
          that.setData({
            orderlist1: res.data.data.concat(that.data.orderlist1)
          })
        }else{
          that.setData({
            orderlist2: res.data.data.concat(that.data.orderlist2)
          })
        } 
      }else{
        if (type == 1) {
          that.setData({
            orderlist: res.data.data
          })
        } else if (type == 2) {
          that.setData({
            orderlist1: res.data.data
          })
        } else {
          that.setData({
            orderlist2: res.data.data
          })
        }
      }
     
    })
  },
  onLoad: function() {
  //   var startTime = Date.parse(new Date(wx.getStorageSync("dateActive")));
  //   var endTime = Date.parse(util.formatTime(new Date()));
  //   var value=(endTime - startTime) / 1000 / 3600 / 24 + '';
  //  if(value>=7){
  //    this.setData({
  //      activeS:true
  //    })
  //  } else if (value < 7) {
  //    this.setData({
  //      activeS: false
  //    })
     
  //  } else {
  //    this.setData({
  //      activeS: true
  //    })
  //  }
    var that = this
    let isIphoneX = getApp().globalData.isIphoneX;
    wx.getSystemInfo({
      success(res) {
        if (isIphoneX) {
          that.setData({
            "high": res.statusBarHeight * 2 + 100
          });
        } else {
          that.setData({
            "high": res.statusBarHeight * 2 + 144
          });
        }
      }
    })


   // 定时请求
    var myVar = setInterval(function () {
      that.setInterval()
    }, 1000)
    //如果会员到场了，应该清除定时器
    setTimeout(function () {
      clearInterval(myVar);
    }, 60000)
    setInterval(function () {
      that.setInterval()
    }, 60000)
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
    this.indexlist()
    this.tixing()
    this.orderlist(1,0)
    this.orderlist(2,0)
    this.orderlist(3,0)
    this.setData({
      activeS: wx.getStorageSync("dateActive") ? true : false
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
  onReachBottom: function (e) {
    this.orderlist(1, 1)
    this.orderlist(2, 1)
    this.orderlist(3, 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})