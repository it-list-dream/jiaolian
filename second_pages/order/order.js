const util = require('../../utils/util.js')
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
    listinfo1: [],
    index: 0,
    modelshow: false,
    clear: 1,
    inputValue: "",
    inputValueStart: null,
    inputValueEnd: null,
    AppointmentTime: "",
    AD_ID: "",
    bg: "bg1",
    bgOne: "bg0",
    phonemodel: false,
    nofind: false,
    choseidx: 4,
    inpvalue: null,
    pageidx: 1,
    floorstatus: false
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

  order: function(e) {
    wx.navigateTo({
      url: '/thirdly_pages/order_time/order_time?userid=' + e.currentTarget.dataset.userid,
    })
  },
  // closemo: function() {
  //   this.setData({
  //     modelshow: false
  //   })
  // },
  purpose_chose: function() {
    this.setData({
      modelshow: !this.data.modelshow
    })
  },
  // chose_followOne: function(e) {
  //   var bindidx = e.currentTarget.dataset.inx
  //   this.setData({
  //     bgOne: bindidx,
  //     choseidx: bindidx == 'bg0' ? 4 : (bindidx == 'bg1' ? 1 : (bindidx == 'bg2' ? 2 : (bindidx == 'bg3' ? 3 : 0)))
  //   })
  // },
  //搜索
  clickWord: function() {
    this.setData({
      modelshow: false
    })
  },
  //筛选
  watchPassWord: function(e) {
    this.setData({
      listinfo1: [],
      clear: e.detail.value.length == 0 ? 1 : 0,
    })
    var inp = e.detail.value
    this.sergetinfo(e.detail.value, 4)
  },
  //输入框清除
  clearValue: function() {
    console.log(this.data.listinfo)
    this.setData({
      clear: 1,
      inputValue: "",
      // listinfo1: this.data.listinfo,
      nofind: false
    })
    this.sergetinfo("", 4)
  },

  // 请求封装
  sergetinfo: function(text, num, bot) {
     var that = this
     num == 3 ? text = this.data.inpvalue : (num == 4 ? text = text : text = "")
 
    this.setData({
      textcon: text,
      type: num,
      pageidx: bot ? this.data.pageidx + 1 : 1
    })
    var infoList = {
      searchText: text,
      type: num,
      PageIndex: that.data.pageidx,
      PageSize: 20
    }
    server.request('MyCoachUser', infoList, function(res) {
      console.log(res.data.data)
      var userinfo1 = that.data.listinfo1
      var userinfo = res.data.data
      userinfo1 = userinfo1.concat(userinfo)
      for (var i = 0; i < userinfo.length; i++) {
        userinfo[i].canisee = userinfo[i].UI_Face.indexOf('http') ? false : true
        userinfo[i].firstname = userinfo[i].UI_Name.substring(0, 1)
      }
      that.setData({
        nofind: userinfo1.length != 0 ? false : true,
        botEnd: res.data.data.length == 0 && that.data.pageidx > 2 ? true : false,
        listinfo1: userinfo1,
        modelshow: false
      })
    })
  },
  // 筛选会员
  // inquire: function() {
  //   this.setData({
  //     listinfo1: [],
  //   })
  //   this.sergetinfo("", this.data.choseidx)
  // },
  onLoad: function(options) {
    var that = this
    this.sergetinfo("", 4)
    let isIphoneX = getApp().globalData.isIphoneX;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          "commonHeadHeight.titleHeight": res.statusBarHeight * 2 + 16,
          "high": res.statusBarHeight + 140
        });
      }
    })
  },

  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },
  onReachBottom: function() {
    this.sergetinfo(this.data.textcon, this.data.type, 1)
  },
})