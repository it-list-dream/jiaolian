const server = require('../../utils/server.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aa: {
      "bg_color": "white",
      "color": "#000",
      "flag": 1,
      "name": ""
    },
    index: 0,
    modelshow: false,
    clear: 1,
    clear1: 1,
    botEnd: false,
    botEnd1: false,
    inputValue: "",
    inputValue1: "",
    inputValueNumS: "",
    inputValueNumE: "",
    inputValueClassS: "",
    listinfo1: [],
    listinfo3: [],
    navbar: ["普通会员", "私教会员"],
    listinfo: [],
    listinfo2: [],
    currentTab: 0,
    bg: "bg0",
    bgOne: "bg0",
    phonemodel: false,
    nofind: false,
    nofind1: false,
    pageindex: 1,
    pageindex1: 1,
    floorstatus: false
  },

  //返回顶部
  // 获取滚动条当前位置
  onPageScroll: function(e) {
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
  goTop: function(e) { // 一键回到顶部
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


//
  tapClassS:function(){
    this.setData({
      bg: "bg3"
    })
  },
  tapNumS:function(){
    this.setData({
      bgOne: "bg2"
    })
  },

  chose_follow: function(e) {
    this.setData({
      bg: e.currentTarget.dataset.inx
    })
  },

  chose_followOne: function(e) {
    this.setData({
      bgOne: e.currentTarget.dataset.inx
    })
  },
  // 跳转详情页

  toinfomation: function(e) {
    this.setData({
      phonemodel: false
    })
    if (e.currentTarget.dataset.info.UI_Face.indexOf('http')) {
      delete e.currentTarget.dataset.info.UI_Face
    }
    console.log(e.currentTarget.dataset.info)
    wx.navigateTo({
      url: '/thirdly_pages/Member_information/Member_information?info=' + JSON.stringify(e.currentTarget.dataset.info) + "&id=" + this.data.currentTab,
    })
  },
 
  navbarTap: function(e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
    if (this.data.currentTab != e.currentTarget.dataset.idx) {
      this.setData({
        modelshow: false
      })
    }
    if (e.currentTarget.dataset.idx == 0 && this.data.listinfo.length == 0) {
      this.setData({
        nofind: true
      })
    } else if (e.currentTarget.dataset.idx == 1 && this.data.listinfo2.length == 0) {
      this.setData({
        nofind1: true,
      })
    } else {
      this.setData({
        nofind: false,
        nofind1: false,
      })
    }
    if (e.currentTarget.dataset.idx == 0 && this.data.inputValue != "") {
      this.setData({
        clser: 0
      })
    } else if (e.currentTarget.dataset.idx == 1 && this.data.inputValue1 != "") {
      this.setData({
        clser1: 0
      })
    }
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  orderUser: function(e) {
    this.setData({
      phonemodel: false
    })
    console.log(e.currentTarget.dataset.name)
    wx.addPhoneContact({
      firstName: this.data.name, 
      mobilePhoneNumber: this.data.phone, 
      success(res) {
        
      }
    })


  },
  // 打电话
  closemo2: function() {
    this.setData({
      phonemodel: false
    })
  },
  clo: function() {
    this.setData({
      phonemodel: false
    })
  },
  copy: function() {
    this.setData({
      phonemodel: false
    })

    wx.setClipboardData({
      data: this.data.phone,
      success: function(res) {}
    })
  },


  //搜索
  clickWord: function() {
    this.setData({
      modelshow: false
    })
  },
  watchPassWord: function(e) {
    var inp = e.detail.value
    if (inp.length == 0) {
      this.clearValue()
    } else if (this.data.currentTab == 0) {
      this.setData({
        inputValue: inp,
        clear: 0,
      })
      this.request('UserNoCoachList', "1", "0", "1")
    } else if (this.data.currentTab == 1) {
      this.setData({
        inputValue1: inp,
        clear1: 0,
      })
      this.request('UserCoachList', "4", "1", "1")
    }
  },

  //输入框清除
  clearValue: function() {
    var index = this.data.currentTab
    if (index == 0) {
      if (this.data.listinfo1.length == 0) {
        this.setData({
          clear: 1,
          inputValue: "",
          listinfo: this.data.listinfo1,
          nofind: true
        })
      } else {
        this.setData({
          clear: 1,
          inputValue: "",
          listinfo: this.data.listinfo1,
          nofind: false
        })
      }
    } else if (index == 1) {
      if (this.data.listinfo3.length == 0) {
        this.setData({
          clear1: 1,
          inputValue1: "",
          listinfo2: this.data.listinfo3,
          nofind1: true
        })
      } else {
        this.setData({
          clear1: 1,
          inputValue1: "",
          listinfo2: this.data.listinfo3,
          nofind1: false
        })
      }
    }
  },
  call: function() {
    this.setData({
      phonemodel: false
    })
    var _this = this
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
      success: function() {
        wx.navigateTo({
          url: '/thirdly_pages/Member_information/Member_information?info=' + JSON.stringify(_this.data.tomeminfo) + "&pageidx=" + _this.data.currentTab + "&fromup=" + 1,
        })
      },
      fail: function() {}
    })
  },


  callphone: function(e) {
    let AD_ID = e.currentTarget.dataset.id
    this.setData({
      AD_ID: AD_ID,
      phonemodel: true,
      phone: e.currentTarget.dataset.phone,
      name: e.currentTarget.dataset.name,
      tomeminfo: e.currentTarget.dataset.info
    })
  },
  watchNumS: function(e) {
    this.setData({
      inputValueNumS: e.detail.value,
    })
  },
  watchNumE: function(e) {
    this.setData({
      inputValueNumE: e.detail.value,
    })
  },
  watchClassS: function(e) {
    this.setData({
      inputValueClassS: e.detail.value,

    })
  },

  request: function(url, type, mold, onload) {
    console.log("a")
    var textr = ""
    if (mold == 0 && type == 2) {
      if (this.data.inputValueNumS == "" || this.data.inputValueNumE == "") {
        wx.showToast({
          title: '请输入搜索次数',
          icon: "none"
        })
        textr = "a"
      }
      var text = {
        searchText1: this.data.inputValueNumS,
        searchText2: this.data.inputValueNumE,
      }
    } else if (mold == 1 && type == 3) {
      if (this.data.inputValueClassS == "") {
        wx.showToast({
          title: '请输入搜索次数',
          icon: "none"
        })
        textr = "a"
      } else {
        var text = {
          searchText: this.data.inputValueClassS
        }
      }
    } else if (mold == 0 && type == "1") {
      if (onload == 0) {
        var text = {
          searchText1: "",
          searchText2: ""
        }
      } else {
        var text = {
          searchText1: this.data.inputValue,
          searchText2: ""
        }
      }

    } else if (mold == 1 && type == "4") {
      if (onload == 0) {
        var text = {
          searchText: ""
        }
      } else {
        var text = {
          searchText: this.data.inputValue1
        }
      }
    } else {
      if (mold == 0) {
        var text = {
          searchText1: "",
          searchText2: "",
        }
      } else if (mold == 1) {
        var text = {
          searchText: ""
        }
      }
      var textr = ""
    }
    if (onload == 2) {
      if (mold == 0) {
        var type = this.data.type
        this.setData({
          pageindex: this.data.pageindex + 1
        })
        var index = this.data.pageindex
      } else if (mold == 1) {
        var type = this.data.type1
        this.setData({
          pageindex1: this.data.pageindex1 + 1
        })
        console.log(this.data.pageindex1)
        var index = this.data.pageindex1
      }
    } else {
      var index = 1
    }
    var that = this
    if (textr != "a") {
      text = Object.assign(text, {
        type: type,
        PageIndex: index,
        PageSize: 20
      })

      server.request(url, text, function(res) {
        console.log(res.data.data)
        if (mold == 0) {
          that.setData({
            type: type,
            pageindex: index,
          })
        } else if (mold == 1) {
          that.setData({
            type1: type,
            pageindex1: index,
          })
        }
        that.sub(res.data.data, 'UI_Name')
        var code = res.data.code
        if (code == 1) {
          if (mold == 0) {
            if (onload == 0) {
              that.setData({
                listinfo1: res.data.data,
                listinfo: res.data.data,
              })
            } else if (res.data.data.length == 0 && onload != 2) {
              that.setData({
                nofind: true
              })
            } else if (res.data.data.length != 0) {
              that.setData({
                nofind: false
              })
            }
            if (type == "1") {
              if (onload == 2) {
                that.setData({
                  listinfo: that.data.listinfo.concat(res.data.data)
                })
              } else {
                that.setData({
                  listinfo: res.data.data,
                })
              }
            } else if (onload == 2) {
              that.setData({
                listinfo: that.data.listinfo.concat(res.data.data)
              })
            } else {
              that.setData({
                inputValue: "",
                listinfo: res.data.data,
                listinfo1: res.data.data,
                clear: 1
              })
            }
          } else if (mold == 1) {
            if (onload == 0) {
              that.setData({
                listinfo2: res.data.data,
                listinfo3: res.data.data,
              })
            } else if (res.data.data.length == 0 && onload != 2) {
              that.setData({
                nofind1: true
              })
            } else if (res.data.data.length != 0) {
              that.setData({
                nofind1: false
              })
            }
            if (type == "4") {
              if (onload == 2) {
                var list = that.data.listinfo2.concat(res.data.data)
                that.setData({
                  listinfo2: list
                })
              } else {
                that.setData({
                  listinfo2: res.data.data,
                })
              }
            } else if (onload == 2) {
              var list = that.data.listinfo2.concat(res.data.data)
              that.setData({
                listinfo2: list
              })
            } else {
              that.setData({
                inputValue1: "",
                listinfo2: res.data.data,
                listinfo3: res.data.data,
                clear1: 1
              })
            }
          }
        }
        that.setData({
          botEnd1: res.data.data.length == 0 && that.data.pageindex1 > 2 ? true : false,
          botEnd: res.data.data.length == 0 && that.data.pageindex > 2 ? true : false,
        })
      })
    }

  },
  //意向会员筛选
  inquire: function() {
    this.setData({
      modelshow: false
    })
    if (this.data.bgOne == "bg0") {
      var type = "5"
    } else if (this.data.bgOne == "bg2") {
      var type = "2"
    } else if (this.data.bgOne == "bg1") {
      var type = "3"
    }
    this.request('UserNoCoachList', type, "0", "1")
  },
  inquire1: function() {
    var that = this
    this.setData({
      modelshow: false,
    })
    if (this.data.bg == "bg3") {
      var type = "3"
    } else if (this.data.bg == "bg2") {
      var type = "2"
    } else if (this.data.bg == "bg1") {
      var type = "1"
    } else if (this.data.bg == "bg0") {
      var type = "5"
    }
    this.request('UserCoachList', type, "1", "1")
  },
  closemo: function() {
    this.setData({
      modelshow: false
    })
  },
  purpose_chose: function() {
    this.setData({
      modelshow: !this.data.modelshow
    })
  },
  // // 截取字符串
  sub: function(arr, U_name) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].firstname = arr[i][U_name].substring(0, 1)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */


  onLoad: function(options) {
    var that = this
    let isIphoneX = getApp().globalData.isIphoneX;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          "commonHeadHeight.titleHeight": res.statusBarHeight * 2 + 16,
          "high": res.statusBarHeight + 140
        });
      }
    })
    // 办卡会员
    

    if (options.id == 0) {
      this.setData({
        currentTab: 0,

      })
    } else {
      this.setData({
        currentTab: 1,
      })
    }

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
    this.request('UserCoachList', "4", "1", "0")
    this.request('UserNoCoachList', "1", "0", "0")
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(e) {
    console.log(this.data.currentTab)
    if (this.data.currentTab == 0) {
      this.request("UserNoCoachList", this.data.type, this.data.currentTab, "2")
    } else if (this.data.currentTab == 1) {
      this.request("UserCoachList", this.data.type1, this.data.currentTab, "2")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})