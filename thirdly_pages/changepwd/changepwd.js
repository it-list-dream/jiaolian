var server = require("../../utils/server.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aa: {
      "bg_color": "white",
      "color": "#000",
      "flag": 1,
      "name": "修改密码"
    },
    oldValue: null,
    newValue: null,
    readyValue: null

  },

  //旧密码
  watcholdValue: function (e) {

    this.setData({
      oldValue: e.detail.value
    })
  },

  watchnewValue: function (e) {

    this.setData({
      newValue: e.detail.value
    })
  },

  watchreadyValue: function (e) {

    this.setData({
      readyValue: e.detail.value
    })
  },
  confirm() {
   
    var that = this
    let oldpwd = wx.getStorageSync("pwd")
    console.log(this.data.oldValue, oldpwd, typeof (this.data.oldValue), typeof (oldpwd))
    if (oldpwd != this.data.oldValue) {
      wx.showToast({
        title: '旧密码输入不正确，请重新输入',
        icon: "none"
      })
      return false
    } 
    if (!this.data.newValue){
      wx.showToast({
        title: '新密码不能为空',
        icon: "none"
      })
      return false
    }
    if ( this.data.newValue.length != 6 ) {
      wx.showToast({
        title: '密码长度为六位',
        icon: "none"
      })
      return false
    } 
   if (this.data.newValue != this.data.readyValue  ) {
     
     wx.showToast({
       title: '两次新密码不一致，请重新输入',
       icon: "none"
     })
     return false
    } 
      server.request('MyPassWordUpdate', {
        oldpassword: this.data.oldValue,
        newpassword: this.data.newValue
      }, function (res) {

        var code = res.data.code
        if (code == 1) {
          wx.setStorageSync("pwd", that.data.newValue)
          wx.showToast({
            title: '密码修改成功',
          })
          var timer = setTimeout(function () {
            wx.navigateBack({})
          }, 2000)
        } else {
          wx.showToast({
            title: '密码修改失败，请重试',
            icon: "none"
          })
        }
      })
    

  },

  onLoad: function (options) {
    var that = this
    let isIphoneX = getApp().globalData.isIphoneX;

    wx.getSystemInfo({
      success(res) {
        that.setData({
          "commonHeadHeight.titleHeight": res.statusBarHeight * 2 + 16,
        });

        if (that.data.isIphoneX) {
          that.setData({
            "high2": res.statusBarHeight * 2 + 118,
            "high3": res.statusBarHeight * 2 + 188
          });
        } else {
          that.setData({
            "high2": res.statusBarHeight * 2 + 124,
            "high3": res.statusBarHeight * 2 + 474
          });
        }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    // console.log(timer)
    // clearTimeOut(timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log(timer)
    // clearTimeOut(this.timer)
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