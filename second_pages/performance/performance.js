const app = getApp()
const util = require('../../utils/util.js')
const server = require("../../utils/server.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aa: {
      "bg_color": "white",
      "color": "#000",
      "flag": 1,
      "name": "销售金额"
    },
    clear: 1,
    inputValue: "",
    botEnd: false,
    listinfo1: [],
    listinfo: [],
    
    headLsit:[],
    nofind:false,
    startTime: '2018-01-01',//默认起始时间  
    endTime: '',//默认结束时间 
    floorstatus: false,
    pageindex:1
  },

  //返回顶部
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 2000) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },


  bindDateChange: function (e) {
    this.setData({
      startTime: e.detail.value
    })
    this.request(this.data.inputValue,1)
    this.dateChangeHead()
  },
  bindDateChange2: function (e) {
    this.setData({
      endTime: e.detail.value
    })
    this.request(this.data.inputValue, 1)
    this.dateChangeHead()
  },

  //筛选
 
  watchPassWord: function (e) {
    if (e.detail.value.length == 0) {
      this.clearValue()
    } else {
      this.request(e.detail.value, 1)
      this.setData({
        inputValue: e.detail.value,
        clear: 0,
      })
    }
  },
  clearValue: function () {
    console.log("a")
    this.setData({
      clear: 1,
      inputValue:"",
      listinfo: this.data.listinfo1,
      nofind: false
    })

  },
  //数据请求时间封装下部列表
  request: function (name, onload) {
    if (onload == 2) {
      this.setData({
        pageindex: this.data.pageindex + 1
      })
      var index = this.data.pageindex
    } else {
      var index = 1
    }
    var that = this
    server.request("RepSalesAmount ", {
      StartDate: that.data.startTime,
      EndDate: that.data.endTime,
      name:name,
      PageIndex:index,
      PageSize:20
    }, function (res) {
      console.log(res.data.data)
      that.setData({
        pageindex: index
      })
      var code = res.data.code
      var data=res.data.data
      for (var i = 0; i < res.data.data.length; i++) {
        res.data.data[i].Money = Math.floor(res.data.data[i].Money)
        res.data.data[i].firstname = res.data.data[i].UI_Name.slice(0, 1)
        res.data.data[i].CreateDate = res.data.data[i].CreateDate.split(" ")[0].split("/").join("-")
      }
      if (code == 1) {
        if (res.data.data.length == 0 && onload != 2) {
          that.setData({
            nofind: true,
          })
        } else if (res.data.data.length != 0) {
          that.setData({
            nofind: false,
          })
        }
        if (name != "") {
          if (onload == 2) {
            that.setData({
              listinfo: that.data.listinfo.concat(res.data.data),
            })
          } else {
            that.setData({
              listinfo: data,
            })
          }
        }
        else {
          if (onload == 2) {
            that.setData({
              listinfo: that.data.listinfo.concat(res.data.data),
            })
          } else {
            that.setData({
              listinfo: data,
              listinfo1: data,
            })
          }
        }

      }
      that.setData({
        botEnd: res.data.data.length == 0 && that.data.pageindex > 2 ? true : false,
      })
    })
  },
//头部数据
dateChangeHead:function(){
  var that = this
  server.request("RepMoneyCurrentMonth ", {
    StartDate: that.data.startTime,
    EndDate: that.data.endTime,
  }, function (res) {
    console.log(res.data.data)
    for (var i = 0; i < res.data.data.length; i++) {
      res.data.data[i].AllMoney = Math.floor(res.data.data[i].AllMoney)
    }
    that.setData({
      headLsit:res.data.data
    })
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 得到当前日期
    let nowdate = util.formatTime(new Date());
    console.log(nowdate)
    let yesterday = util.yesterday(new Date());
    this.setData({
      endTime: nowdate,
      startTime: yesterday,
      distime: nowdate,
    })
    // 设置头部距离
    var that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          "high": res.statusBarHeight + 140
        });
      }
    })
    //上课金额
    this.request("", 0)
    this.dateChangeHead()
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.request(this.data.inputValue, 2)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})