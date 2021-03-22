var server = require("../../utils/server.js")
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    aa: {
      "bg_color": "white",
      "color": "#000",
      "flag": 1,
      "name": "会员提醒"
    },
    navbar: ["到场提醒", "生日提醒", "课程到期", "会员卡到期"],
    currentTab: 0,
    botEnd: false,
    botEnd1: false,
    listinfo: [],
    listinfo1: [],
    listinfo2: [],
    listinfo3: [],
  },
  toinfomation: function (e) {
    // this.setData({
    //   phonemodel: false
    // })
    // if (e.currentTarget.dataset.info.UI_Face.indexOf('http')) {
    //   delete e.currentTarget.dataset.info.UI_Face
    // }
    console.log(e.currentTarget.dataset.info.FK_UI_ID )
    wx.navigateTo({
      url: '/thirdly_pages/Member_information/Member_information?info=' + JSON.stringify(e.currentTarget.dataset.info) + "&id=1" ,
    })
  },
  navbarTap: function(e) {
    console.log(e.currentTarget.dataset.idx)
    var index = e.currentTarget.dataset.idx
    if (index == 1) {
      var ID = wx.getStorageSync("IDlist1")
      for (var i = 0; i < this.data.listinfo1.length; i++) {
        ID.push(this.data.listinfo1[i].UI_ID)
      }
      wx.setStorageSync("IDlist1", this.unique(ID))
    } else if (index == 2) {
      var ID = wx.getStorageSync("IDlist2")
      for (var i = 0; i < this.data.listinfo2.length; i++) {
        ID.push(this.data.listinfo2[i].CO_ID)
      }

      wx.setStorageSync("IDlist2", this.unique(ID))
    } else if (index == 3) {
      var ID = wx.getStorageSync("IDlist3")
      for (var i = 0; i < this.data.listinfo3.length; i++) {
        ID.push(this.data.listinfo3[i].UI_ID)
      }
      wx.setStorageSync("IDlist3", this.unique(ID))
    }
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })


  },


  unique: function(arr) {
    return Array.from(new Set(arr))
  },
  


  /**
   * 生命周期函数--监听页面加载
   */
  
  callphone1: function(e) {
    wx.showActionSheet({
      itemList: ['呼叫', '添加联系人'],
      success: function (res) {
        if (res.tapIndex === 0) {
          // 呼叫号码
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone,
          })
        } else if (res.tapIndex == 1) {
          // 添加到手机通讯录
          wx.addPhoneContact({
            firstName: e.currentTarget.dataset.name,//联系人姓名
            mobilePhoneNumber: e.currentTarget.dataset.phone,//联系人手机号
          })
        }
      }
    })
  },


  // 截取字符串

  sub: function(arr, U_name,userid) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].firstname = arr[i][U_name].substring(0, 1)
      arr[i].FK_UI_ID = arr[i][userid]
    }
  },
  // 数据调用

  getmes: function() {
    var that = this
    let info = {
      PageIndex: "1",
      PageSize: "200"
    }
    // 到场提醒
    server.request('RemindLastCheckinDate', info, function(res) {
      // console.log(res.data.data)

      that.sub(res.data.data, 'UI_Name','UI_ID')
      that.setData({
        listinfo: res.data.data
      })
      var ID = wx.getStorageSync("IDlist")
      for (var i = 0; i < res.data.data.length; i++) {
      
        ID.push(res.data.data[i].UI_ID)
      }
      let nowdate = util.formatTime(new Date());
      wx.setStorageSync("date", nowdate)
      wx.setStorageSync("IDlist", that.unique(ID))
    })
    // 生日提醒
    server.request('RemindBirthday', info, function(res) {
      that.sub(res.data.data, 'UI_Name','UI_ID')
      var con = res.data.data
      // console.log(con)
      that.setData({
        listinfo1: con
      })
    })
    // 课程到期
    server.request('RemindCoachEndDate', info, function(res) {
      that.sub(res.data.data, 'UI_Name','FK_UI_ID')
      var con = res.data.data
      console.log(con)
      that.setData({
        listinfo2: con
      })
    })
    // 会员卡到期
    server.request('RemindLastDate', info, function(res) {
      that.sub(res.data.data, 'UI_Name','UI_ID')
      var con = res.data.data
      // console.log(con)
      for (var i = 0; i < con.length; i++) {
        con[i].UI_LastDate = con[i].UI_LastDate.split(" ")[0]
      }
      that.setData({
        listinfo3: res.data.data
      })
    })
  },

  overUser: function (onload) {
    if (onload == 2) {
      this.setData({
        pageindex: this.data.pageindex + 1
      })
      var index = this.data.pageindex
    } else {
      var index = 1
    }
    var that = this
    let info = {
      PageIndex: index,
      PageSize: "20"
    }
    server.request('RemindCoachEndDate', info, function (res) {
    console.log(res)
      if (res.data.code == 1) {
        that.sub(res.data.data, 'UI_Name','FK_UI_ID')
        var con = res.data.data
        if (onload == 2) {
          that.setData({
            listinfo4: that.data.listinfo4.concat(con)
          })
        } else {
          that.setData({
            listinfo4: con
          })
        }
      }
      that.setData({
        botEnd: res.data.data.length == 0 && that.data.pageindex1 > 2 ? true : false,
      })
    })
  },

  inactiveUser: function (onload) {
    if (onload == 2) {
      this.setData({
        pageindex1: this.data.pageindex1 + 1
      })
      var index = this.data.pageindex1
    } else {
      var index =1
    }
    var that = this
    let info = {
      PageIndex: index,
      PageSize: "20"
    }
    server.request('RemindLastDate', info, function (res) {

      if (res.data.code == 1) {
        that.sub(res.data.data, 'UI_Name', 'UI_ID')
        var con = res.data.data
        for (var i = 0; i < con.length; i++) {
          con[i].UI_LastDate = con[i].UI_LastDate.split(" ")[0]
        }
        if (onload == 2) {
          that.setData({
            listinfo5: that.data.listinfo5.concat(con)
          })
        } else {
          that.setData({
            listinfo5: con
          })
        }
      }
      that.setData({
        botEnd1: res.data.data.length == 0 && that.data.pageindex1 > 2 ? true : false,
      })
    })
  },
  onLoad: function(options) {
    this.getmes()
    var that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          "high": res.statusBarHeight + 140
        });
      }
    })
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    this.overUser(0)
    this.inactiveUser(0)

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.currentTab == 2) {
      this.overUser(2)
    } else if (this.data.currentTab == 3) {
      this.inactiveUser(2)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})