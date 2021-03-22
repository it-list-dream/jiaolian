
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aa: {
      "bg_color": "white",
      "color": "#000",
      "flag": 1,
      "name": "设置"
    },
  },
  cancelled() {
    wx.showModal({
      title: '',
      content: '确认注销登录吗？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('phone')
          // wx.removeStorageSync('meminfo')
          wx.removeStorageSync('interval')
          wx.redirectTo({
            url: '/pages/guidePage/guidePage',
          })
        }
      }
    })
  },
  tochangepwd(){
    wx.navigateTo({
      url: '/thirdly_pages/changepwd/changepwd',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(wx.getStorageSync("meminfo"))
    wx.getSystemInfo({
      success(res) {
        console.log(res)
        that.setData({
          "commonHeadHeight.titleHeight": res.statusBarHeight * 2 + 16,
          meminfo: wx.getStorageSync("meminfo")
        });
        console.log(res.statusBarHeight + 16)
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

})