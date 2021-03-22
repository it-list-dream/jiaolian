//app.js
App({
  onLaunch: function () {
    // 版本更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)//res.hasUpdate返回boolean类型
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启当前应用？',
              success(res) {
                if (res.confirm) {
                   wx.clearStorage()
            wx.reLaunch({
              url: "/pages/log_in/log_in",
            })
                  // 新的版本已经下载好，调用applyUpdate应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          // 新版本下载失败时执行
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '发现新版本',
              content: '请删除当前小程序，重新搜索打开...',
            })
          })
        }
      })
    } else {
      //如果小程序需要在最新的微信版本体验，如下提示
      wx.showModal({
        title: '更新提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    
  },
  // globalData: {
  //   menuTop: wx.getMenuButtonBoundingClientRect().top,
  //   menuHeight: wx.getMenuButtonBoundingClientRect().height,
  // },
onShow:function(){
  wx.setStorageSync("dateActive", true)
  // console.log(wx.getMenuButtonBoundingClientRect().height)
},

  globalData: {
    userInfo: null
  }
})