// thirdly_pages/Vip-dossier/Vip-dossier.js
var server = require("../../utils/server.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showToast: false,
    msg: "操作成功",
    status: true,
    stopSrcol: true,
    aa: {
      "bg_color": "linear-gradient(90deg,rgba(75,95,255,1) 0%,rgba(87,41,231,1) 100%)",
      "color": "rgba(255,255,255,1)",
      "flag": 0,
      "name": "添加会员信息"
    }, 
    vall: 0,
    vall1: 0,
    vall2: 0,
    vall3: 0,
    baseData: [{
        name: "体重:",
        placeholder: "0kg",
        unit: "kg",
      },
      {
        name: "大腿:",
        placeholder: "0cm",
        unit: "cm",
      },
      {
        name: "腰围:",
        placeholder: "0cm",
        unit: "cm",
      },
      {
        name: "小腿:",
        placeholder: "0cm",
        unit: "cm",
      },
      {
        name: "臀围:",
        placeholder: "0cm",
        unit: "cm",
      },
      {
        name: "腰臀比:",
        placeholder: "0%",
        unit: "%",
      },
      {
        name: "臂围:",
        placeholder: "0cm",
        unit: "cm",
      },
      {
        name: "肌肉:",
        placeholder: "0kg",
        unit: "kg",
      },
      {
        name: "胸围:",
        placeholder: "0cm",
        unit: "cm",
      },
      {
        name: "脂肪:",
        placeholder: "0kg",
        unit: "kg",
      },
    ],
    name: ["BodyWeight", "Thigh", "Waistline", "Calf", "Hips", "WaistHipRatio", "ArmCirc", "Muscle", "Bust", "Fat", "SquatCount", "PushUpsCount", "BellyCount", "FlatSupport", "BMI", "BasalMetab", "Remarks"],
    areaValue: 0,
    otherValue: "",
    otherValue1: "",
    focusindex: 0,
  },
  //确定添加
  addVip() {
    var that = this
    var obj = {}
    if (this.data.vall == 0 || this.data.vall1 == 0 || this.data.vall2 == 0 || this.data.vall3 == 0) {
      wx.showToast({
        title: '请填写体态信息',
        icon: "none"
      })
    } else {
      obj["SquatCount"] = this.data.vall
      obj["PushUpsCount"] = this.data.vall1
      obj["BellyCount"] = this.data.vall2
      obj["FlatSupport"] = this.data.vall3
      var strf = this.data.otherValue ? this.data.otherValue : 0
      obj["BMI"] = strf == 0 ? 0 : strf.substring(0, strf.length - 4)
      var strf1 = this.data.otherValue1 ? this.data.otherValue1 : 0
      obj["BasalMetab"] = strf1 == 0 ? 0 : strf1.substring(0, strf1.length - 4)
      obj["Remarks"] = this.data.areaValue
      var aa = false
      for (var i = 0; i < this.data.baseData.length; i++) {
        var name = this.data.name[i]

        if (!this.data.baseData[i].value || this.data.baseData[i].value == undefined) {
          aa = true
        } else {
          var str = this.data.baseData[i].value
          if (name == "WaistHipRatio") {
            obj[name] = str.substring(0, str.length - 1)
          } else {
            obj[name] = str.substring(0, str.length - 2)
          }

        }
      }
      aa ? wx.showToast({
        title: '请填写基础信息',
        icon: "none"
      }) : wx.showModal({
        title: '确定添加？',
        showCancel: true, //是否显示取消按钮
        cancelText: "取消", //默认是“取消”
        confirmText: "确定", //默认是“确定”
        success: function (res) {
          if (res.cancel) {
          } else {
            server.request('MemberProfileSave', {
              userid: wx.getStorageSync("userid"),
              archives: JSON.stringify(obj)
            }, function (res) {
              console.log(res)
              if (res.data.code == 1) {
                that.setData({
                  showToast: true,
                })
                setTimeout(() => {
                  
                  wx.navigateBack({})
                }, 1000);
             
              } else if(res.data.code == -1){
                that.setData({
                  showToast: true,
                  msg: res.data.msg
                })
              }else{

              }
              setTimeout(() => {
                that.setData({
                  showToast: false
                })
              }, 1000);

            })
          }
        },

      })
    }

  },
  blurdata(e) {
    let data = this.data.baseData
    if (data[e.currentTarget.dataset.idx].value) {
      data[e.currentTarget.dataset.idx].value = e.detail.value + data[e.currentTarget.dataset.idx].unit
      this.setData({
        baseData: data
      })
    } else {}
  },
  focuedata(e) {
    let data = this.data.baseData
    if (data[e.currentTarget.dataset.idx].value) {
      let data = this.data.baseData
      var str = data[e.currentTarget.dataset.idx].value
      str = str.substring(0, str.length - 2)
      data[e.currentTarget.dataset.idx].value = str
      this.setData({
        baseData: data
      })
    } else {}
  },
  basedata(e) {
    let data = this.data.baseData
    data[e.currentTarget.dataset.idx].value = e.detail.value == 0 ? "" : e.detail.value
    this.setData({
      baseData: data
    })
  },
  inputin(e) {
    this.setData({
      focusindex: e.currentTarget.dataset.idx
    })
  },
  inputVal(e) {
    this.setData({
      vall: e.detail.value,
      val: e.detail.value
    })

  },
  inputVal1(e) {
    this.setData({
      val1: e.detail.value,
      vall1: e.detail.value,
    })

  },
  inputVal2(e) {
    this.setData({
      val2: e.detail.value,
      vall2: e.detail.value,
    })
  },
  inputVal3(e) {
    this.setData({
      val3: e.detail.value,
      vall3: e.detail.value,
    })

  },
  slideTrigger(e) {
    var that = this;
    that.setData({
      vall: e.detail.curVal
    });
  },
  slideTrigger1(e) {
    var that = this;
    that.setData({
      vall1: e.detail.curVal
    });
  },
  slideTrigger2(e) {
    var that = this;
    that.setData({
      vall2: e.detail.curVal
    });
  },
  slideTrigger3(e) {
    var that = this;
    that.setData({
      vall3: e.detail.curVal
    });
  },

  //其他信息输入
  blurother(e) {
    if (e.currentTarget.dataset.idx == 1) {
      if (this.data.otherValue) {
        this.setData({
          otherValue: e.detail.value + "kg/㎡"
        })
      }
    } else {
      if (this.data.otherValue1) {
        this.setData({
          otherValue1: e.detail.value + "Kcal"
        })
      }
    }


  },
  otherdata(e) {
    if (e.currentTarget.dataset.idx == 1) {
      this.setData({
        otherValue: e.detail.value == 0 ? e.detail.value = "" : e.detail.value
      })
    } else {
      this.setData({
        otherValue1: e.detail.value == 0 ? e.detail.value = "" : e.detail.value
      })
    }
  },
  focueother(e) {
    if (e.currentTarget.dataset.idx == 1) {
      if (this.data.otherValue) {
        this.setData({
          otherValue: this.data.otherValue.substring(0, this.data.otherValue.length - 4)
        })
      }
    } else {
      if (this.data.otherValue1) {
        this.setData({
          otherValue1: this.data.otherValue1.substring(0, this.data.otherValue1.length -4)
        })
      }
    }

  },
  areaInput(e) {
    this.setData({
      areaValue: e.detail.value ? e.detail.value : 0
    })
  },
  goback() {
    wx.navigateBack({})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({
      menuTop: wx.getMenuButtonBoundingClientRect().top + (wx.getMenuButtonBoundingClientRect().height - 30) / 2,
      userid:  wx.getStorageSync("userid")
    })
    if (options.id == 2) {
      var data = this.data.aa
      data.name = "查看会员信息"
      var Vdossier = wx.getStorageSync("Vdossier")
      Vdossier.SquatCount=Math.floor(Vdossier.SquatCount)
      Vdossier.PushUpsCount =Math.floor(Vdossier.PushUpsCount)
      Vdossier.BellyCount=Math.floor(Vdossier.BellyCount)
      Vdossier.FlatSupport=Math.floor(Vdossier.FlatSupport)
      var baseData = this.data.baseData
   
      for (var i = 0; i < baseData.length; i++) {
        var name = this.data.name[i]
        baseData[i].placeholder = Number(Vdossier[name]) 
             }
      this.setData({
        baseData: baseData,
        aa: data,
        status: false,
        areaValue:Vdossier.Remarks,
        otherValue: Number(Vdossier.BMI) ,
        otherValue1: Number(Vdossier.BasalMetab) ,
        Vdossier:Vdossier,
        stopSrcol: false,
      })

      var baseData = this.data.baseData
      for (var i = 0; i < baseData.length; i++) {
        var name = this.data.name[i]
        baseData[i].placeholder = Vdossier[name]
      }
     
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