// pages/guidePage/guidePage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync("phone") && wx.getStorageSync("pwd") && wx.getStorageSync("url")) {
      wx.request({
        url: "https://user.360ruyu.cn/MobileCoach.asmx/CoachLogin",

        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          key: "BD687B66ECDBED4E12C4320B0ABB3BB111",

          coachname: wx.getStorageSync("phone"),

          passWord: wx.getStorageSync("pwd"),
          GymUrl: wx.getStorageSync("url")
        },
        method: 'POST',
        success: function (res) {
 console.log(res)
          if (res.data.code == 1) {
            wx.navigateTo({
              url: '/pages/index/index',
            })
          }

        },
        fail: function (res) {
        },
      })
    }

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