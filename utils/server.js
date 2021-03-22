function request(url, postData, doSuccess, dofail) {
  if (url == "AdviserLoginByPhone") {
    var fixtion = {
      key: "BD687B66ECDBED4E12C4320B0ABB3BB111",
      UserPhone: wx.getStorageSync("phone"),
      passWord: wx.getStorageSync("pwd"),
      GymUrl: wx.getStorageSync("url")
    }
  } else {
    var fixtion = {
      key: "BD687B66ECDBED4E12C4320B0ABB3BB111",
      coachname: wx.getStorageSync("phone"),
      password: wx.getStorageSync("pwd"),
      GymUrl: wx.getStorageSync("url")
    }
  }
  var UserPhone = wx.getStorageSync("phone")
  var nowurl = getCurrentPages()[0].route
  if (!UserPhone) {
    wx.showToast({
      title: '登录过期，请重新登录',
      icon: "none"
    })
    wx.navigateTo({
      url: '/pages/log_in/log_in',
    })

  } else {
    // wx.showLoading({
    //   title: '加载中···',
    // }),
      wx.request({
      url: "https://user.360ruyu.cn/MobileCoach.asmx/" + url,
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: { ...fixtion, ...postData },
        postData,
        method: 'POST',
        success: function (res) {
          // wx.hideLoading()
          doSuccess(res)
        },
        fail: function (res) {
          // dofail(res)
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          })
        },
      })
  }
}
module.exports = {
  request: request
}