var server = require("../../utils/server.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aa: {
      "bg_color": "white",
      "color": "#000",
      "flag": 0,
      "name": "登录"
    },
    Del: "",
    isShow: true,
    show: true,
    logDisabled: false
  },
  logDisabled() {
    this.setData({
      logDisabled: !this.data.logDisabled
    })
  },
  bindGetUserInfo(e) {
    var that = this
    if (e.detail.userInfo) {
      if (that.data.logDisabled) {
        if (!that.data.prefix) {
          wx.showToast({
            title: '请输入正确的健身房前缀',
            icon: "none",
            duration: 1500
          })
        } else {

          wx.request({
            url: 'https://user.360ruyu.cn/MobileCoach.asmx/GetUrlBySign',
            data: {
              sign: that.data.prefix,
              key: 'BD687B66ECDBED4E12C4320B0ABB3BB111'
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function(res) {
              if (res.data.data.length == 0) {
                wx.showToast({
                  title: '抱歉，未找到对应的健身房',
                  icon: "none",
                  duration: 1500
                })
              } else {
                wx.setStorageSync('url', res.data.data[0].MobileCoach)
                if (that.data.Del.length == 0) {
                  wx.showToast({
                    title: '输入的手机号为空',
                    icon: "none",
                    duration: 1500
                  })
                  return false;
                } else {
                  new Promise(function(resolve, reject) {
                    wx.login({
                      success: res => {
                        resolve(res.code)
                      }
                    })
                  }).then(logincode => {
                    console.log(logincode)
                    server.request('CoachLoginV2', {
                      code: logincode
                    }, function(res) {
                      console.log(res)
                      wx.setStorageSync("meminfo", res.data.data[0])
                      var code = res.data.code
                      if (code == -1) {
                        wx.showToast({
                          title: '手机号或密码有误！',
                          icon: "none",
                          duration: 1500
                        })
                      } else if (code == 0) {
                        wx.showToast({
                          title: '验证失败',
                          icon: "none",
                          duration: 1500
                        })
                      } else {
                        var cocachnames = []
                        for (var i = 0; i < res.data.data.length; i++) {
                          cocachnames.push(res.data.data[i].GB_Name)
                        }
                        wx.setStorageSync("meminfo", res.data.data[0])
                        if (res.data.data.length > 1) {

                          var arr = res.data.data
                          wx.showActionSheet({
                            itemList: cocachnames,
                            success: function(res) {
                              wx.setStorageSync("phone", arr[res.tapIndex].AI_Username)
                              wx.redirectTo({
                                url: '/pages/index/index',
                              })
                            }
                          })
                        } else {
                          wx.redirectTo({
                            url: '/pages/index/index',
                          })
                        }
                      }
                    })
                  })
                }
              }
            }
          })
        }
      } else {
        wx.showToast({
          title: '请同意ucan用户协议',
          icon: "none"
        })
      }
    } else {
      wx.showToast({
        title: '请同意微信协议',
        icon: "none"
      })
    }
  },
  showPassword: function() {
    if (this.data.isShow) {
      this.setData({
        isShow: false,
        show: false
      })
    } else {
      this.setData({
        isShow: true,
        show: true
      })
    }
  },
  getPhone(e) {
    var val = e.detail.value;
    var a = []
    wx.setStorageSync("phone", val)
    wx.setStorageSync("IDlist", a)
    wx.setStorageSync("IDlist1", a)
    wx.setStorageSync("IDlist2", a)
    wx.setStorageSync("IDlist3", a)
    this.setData({
      Del: val
    });
  },
  getprifidx(e) {
    var that = this
    var val = e.detail.value;
    wx.setStorageSync("prifid", val)
    this.setData({
      prefix: val
    });
  },
  getPassWord(e) {
    var val = e.detail.value;
    wx.setStorageSync("pwd", val)
    this.setData({
      pwd: val
    });
  },
  //删除手机号
  del() {
    this.setData({
      Del: ""
    });
  },
  onLoad: function(options) {
    // 判断是否已经登录
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
        success: function(res) {

          if (res.data.code == 1) {
            wx.navigateTo({
              url: '/pages/index/index',
            })
          }

        },
        fail: function(res) {},
      })
    }
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },
})