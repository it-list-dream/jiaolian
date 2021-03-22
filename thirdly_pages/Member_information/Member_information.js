var server = require("../../utils/server.js")
const util = require('../../utils/util.js')
const userHightList = []
for(let i = 50 ;i<250;i++){
  userHightList.push(i)
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    aa: {
      "bg_color": "white",
      "color": "#000",
      "flag": 1,
      "name": "会员信息"
    },
    userhight: userHightList,
    showcanvas: false,
    dossierall: ">>查看全部信息<<",
    dossierallV: [],
    dossierallC: [],
    dossier: [

    ],
    value:[120,0],
    dossierC: [

    ],
    multiArray: [
      ['2019-10-17', '2019-10-18', ],
      ['01时', '02时', "03时", '04时', '05时', '06时', '07时', '08时', "09时", '10时', '11时', '12时', '13时', '14时', "15时", '16时', '17时', '18时', '19时', '20时', "21时", "22时", "23时", "0时"],
      ['10分', '20分', '30分', '40分', '50分', '00分']
    ],
    bgimg: "/icon/bgimg.png",
    currentTab: 0,
    currentTab1: 0,
    userTab:0,
    // navbar: ["教练跟进", "会籍跟进", "备注信息", "卡种信息", "课程信息"],
    navbar: ["会员档案", "教练档案", "教练跟进", "备注信息", "卡种信息", "课程信息"],
    listinfo: [
    ],
    userNav:["教练助手",'体适能'],
    info: {
     
    },
    trans: 0,
    stateidx: 0,
    subareas: "",
    subarea: "备注信息",
    netimg: '',
    inbodydataList:[],
    inbodyStartShow:false,
    inbodyModelShow:false,
    userchooseHight:170,
    inbodyStatus:false,
    hiddenmodalput: true,
  },
  // 注册inbody
  // signInInbody(){
  //    wx.showToast({
  //      title: '注册成功，请根据测试机器提示并操作',
  //      icon:"none",
  //      duration:2500
  //    })
  //    this.setData({
  //      inbodyStartShow:false
  //    })
  // },
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function () {
    var that = this
    new Promise((reslove, rejcet) => {
      this.setData({
        hiddenmodalput: true
      })
      reslove(that.data.deviceIdNumber)
    }).then((device) => {
      if (!device || device == 'undefined') {
        wx.showToast({
          title: '请输入正确的机器编号',
          icon: 'none'
        })
        return
      }
      wx.request({
        url: "https://user.360ruyu.cn/Inbody.asmx/tf_test_deviceID",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          uuid: "ruyu",
          uid: that.data.userinfo.UI_Phone,
          deviceID: device,
          key: "BD687B66ECDBED4E12C4320B0ABB3BB111",
          GymUrl: wx.getStorageSync("url").replace("MobileCoach", "inbody")

        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data != "OK") {
            wx.showToast({
              title: '开始测试失败，请重试',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '机器已接受指令，请站在指定机器上，并按提示操作',
              icon: 'none',
              duration: 2500
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: '数据错误，请重试',
            icon: 'none'
          })
        },
      })
    })

  },
  getNumber(e) {
    this.setData({
      deviceIdNumber: e.detail.value
    })
    console.log(e.detail.value)
  },
  bindChange: function (e) {
    var  that =this
    const val = e.detail.value
    this.setData({
      userchooseHight: that.data.userhight[val[0]]
    })
  },
  closeModel(){
     this.setData({
       inbodyModelShow: false
     })
  },
  updateUserHight(){
    var that =this
    wx.request({
      url: "http://47.111.150.151:8011/MobileCoach.asmx/UserInfoSave",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        coachname: wx.getStorageSync("phone"),
        password: wx.getStorageSync("pwd"),                                                       
        userid: that.data.getinfoid,
        height: that.data.userchooseHight,
        key: "BD687B66ECDBED4E12C4320B0ABB3BB111"
      },
      method: 'POST',
      success: function (res) {

        if (res.data.code == 1) {
          that.setData({
            inbodyStatus:true
          })
          // wx.showToast({
          //   title: '身高更新成功',
          //   icon: "none"
          // })
          that.inbodyTset(that.data.userchooseHight)
          
        }
      },
      fail: function () {
        wx.showToast({
          title: '注册失败，请重试',
          icon: 'none'
        })
      },
    })
  },
  // inbody开始测试
    inbodyTset(userheight){
      var that =this
      wx.request({
        url: "https://user.360ruyu.cn/Inbody.asmx/tf_personinfo",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          uuid: "ruyu",
          uid: that.data.userinfo.UI_Phone,
          name: that.data.userinfo.UI_Name,
          phone: that.data.userinfo.UI_Phone,
          sex: that.data.userinfo.UI_Sex == "男" ? 1 : 2,
          height: userheight,
          birthYear: that.data.userinfo.UI_Birthday.split(" ")[0].split("/")[0],
          note: "ruyu",
          GymUrl: wx.getStorageSync("url").replace("MobileCoach", "inbody"),
          key: "BD687B66ECDBED4E12C4320B0ABB3BB111"
        },
        method: 'POST',
        success: function (res) {
          if (res.data != "OK") {
            wx.showToast({
              title: '注册失败，请完善个人信息后重试',
              icon: 'none'
            })
          } else {
            that.setData({
              hiddenmodalput: false,
              inbodyModelShow:false
            })
            // wx.request({
            //   url: "https://user.360ruyu.cn/Inbody.asmx/tf_test_deviceID",
            //   header: {
            //     "content-type": "application/x-www-form-urlencoded"
            //   },
            //   data: {
            //     uuid: "ruyu",
            //     uid: that.data.userinfo.UI_Phone,
            //     deviceID: "20GRT1C0255",
            //     GymUrl: wx.getStorageSync("url").replace("MobileCoach", "inbody"),
            //     key: "BD687B66ECDBED4E12C4320B0ABB3BB111"
            //   },
            //   method: 'POST',
            //   success: function (res) {
            //     if (res.data != "OK") {
            //       wx.showToast({
            //         title: '开始测试失败，请重试',
            //         icon: 'none'
            //       })
            //     } else {
            //       wx.showToast({
            //         title: '机器已接受指令，请站在机器上，并按提示操作',
            //         icon: 'none',
            //         duration: 2500
            //       })
            //       that.setData({
            //         inbodyModelShow:false
            //       })
            //     }
            //   },
            //   fail: function () {
            //     wx.showToast({
            //       title: '注册失败，请重试',
            //       icon: 'none'
            //     })
            //   },
            // })



          }
        },
        fail: function () {
          wx.showToast({
            title: '注册失败，请重试',
            icon: 'none'
          })
        },
      })
    },
  addInbody(){
    var that =this
    if (that.data.userinfo.UI_Height == 0 && that.data.inbodyStatus == false){
      that.setData({
        inbodyModelShow:true
      })
    
        return;
    }
    if (that.data.inbodyStatus == true){
      that.inbodyTset(that.data.userchooseHight)
      return
    }
    that.inbodyTset(that.data.userinfo.UI_Height)
  },
  // 测试开始
  inbodystart(){
    var that =this
    wx.request({
      url: "https://user.360ruyu.cn/Inbody.asmx/tf_personinfo",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        uuid: "ruyu",
        uid: that.data.userinfo.UI_Phone,
        name: that.data.userinfo.UI_Name,
        phone: that.data.userinfo.UI_Phone,
        sex: that.data.userinfo.UI_Sex == "男" ? 1 : 2,
        height: res.data.data[0].UI_Height,
        GymUrl: wx.getStorageSync("url").replace("MobileCoach", "inbody"),
        birthYear: res.data.data[0].UI_Birthday.split(" ")[0].split("/")[0],
        note: "ruyu",
        key: "BD687B66ECDBED4E12C4320B0ABB3BB111"
      },
      method: 'POST',
      success: function (res) {
        if (res.data != "OK") {
          wx.showToast({
            title: '注册失败，请完善个人信息后重试',
            icon: 'none'
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '注册失败，请重试',
          icon: 'none'
        })
      },
    })
    // this.setData({
    //   inbodyStartShow:true
    // })
    
  },
  toInfo(e) {
    var that = this
    wx.setStorageSync("userInbodyname", that.data.userinfo.UI_Name)
    wx.setStorageSync("userInbodyImg", that.data.userinfo.UI_Face)
    wx.setStorageSync("userInbodyfirstname", that.data.userinfo.firstname)
    wx.navigateTo({
      url: '/thirdly_pages/fitnessInfo/fitnessInfo?info=' + e.currentTarget.dataset.info,

    })
  },
  // 得到inbody数据
  inbodydata(date) {
    var that = this
    // return new Promise(function (resolv, rej) {
      wx.request({
        url: "https://user.360ruyu.cn/Inbody.asmx/tf_history_uuid_uid",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          //  uid: wx.getStorageSync("phone"),
          uid: that.data.userinfo.UI_Phone,
          GymUrl: wx.getStorageSync("url").replace("MobileCoach", "inbody"),
          testDate: date,
          key: "BD687B66ECDBED4E12C4320B0ABB3BB111"
        },
        method: 'POST',
        success: function (res) {
          if (res.data == "FAIL") {
            wx.showToast({
              title: '您还没有测试数据，请联系健身房进行测试',
              icon: "none",
              duration: 2500
            })
           
            // resolv();
          } else {

            var lastdate = res.data.slice(-1)[0].testdate
            var inbodydataChange = JSON.parse(JSON.stringify(res.data))
            for (var i = 0; i < inbodydataChange.length; i++) {
              inbodydataChange[i].testdate = inbodydataChange[i].testdate.split("-")[1] + "-" + inbodydataChange[i].testdate.split("-")[2]
              // 1相等 2 下降 3 上升
              if (i + 1 == inbodydataChange.length) {
                inbodydataChange[i].num = 1
              } else if (inbodydataChange[i].score < inbodydataChange[i + 1].score) {
                inbodydataChange[i].num = 2
              } else if (inbodydataChange[i].score == inbodydataChange[i + 1].score) {
                inbodydataChange[i].num = 1
              } else {
                inbodydataChange[i].num = 3
              }
            }
            that.setData({
              inbodydataList: inbodydataChange,
              inbodydataSave: res.data,
            })
           
          }

        },
        fail: function () {
          wx.showToast({
            title: '注册失败，请重试',
            icon: 'none'
          })
        },
      })
    // })

  },
  //添加会员档案
  addVdossier() {
    wx.navigateTo({
      url: "/thirdly_pages/Vip-dossier/Vip-dossier?id=1",
    })

  },
  todossier(e) {
    var id = e.currentTarget.dataset.idx
    wx.setStorageSync("Vdossier", this.data.dossierallV[id])
    wx.navigateTo({
      url: "/thirdly_pages/Vip-dossier/Vip-dossier?id=2",
    })

  },
  addCdossier() {
    wx.navigateTo({
      url: "/thirdly_pages/Coach-dossier/Coach-dossier",
    })

  },
  todossierC(e) {
    var id = e.currentTarget.dataset.idx
    wx.setStorageSync("Cdossier", this.data.dossierC[id])
    wx.navigateTo({
      url: "/thirdly_pages/Coach-dossier/Coach-dossier?id=2",
    })

  },
  upcanvas(e) {
    wx.showToast({
      title: '长按保存',
      icon:'none'
    })
    var idx = e.currentTarget.dataset.idx
    var info = this.data.dossierallV[idx]
    this.setData({
      showcanvas: true
    })
    var that = this
    let xw = that.data.screenWidth / 375
    let xh = xw * 592
    // 头像性别图片位置
    const ctx = wx.createCanvasContext('share');
    //背景绘制
    let bgPicturePath = "../../icon/poster.png";
    ctx.drawImage(bgPicturePath, 0, 0, that.data.screenWidth, xw * 592);
    // 会员头像
    // ctx.drawImage(that.data.netHeaderimg, 113 * xw, xh * 0.385, 30, 30);
    // 绘制文字
    ctx.setFontSize(32 * xw)
    ctx.setFillStyle('#FCD755')
    ctx.textAlign = 'center'
    var txt = that.data.userinfo.UI_Name
    ctx.fillText(txt, 181.5 * xw, xh * 0.425)
    let [headerleft, sexleft, createdate] = [that.data.screenWidth / 2 - ctx.measureText(txt).width/2 - 50, that.data.screenWidth / 2 + ctx.measureText(txt).width/2 + 5,
      info.Createdate.split(" ")[0].split("/").join("-")
    ]
    // 性别选择
    let bgPicturePath3 = that.data.userinfo.UI_Sex == '女' ? '../../icon/mrs.png' : '../../icon/mister.png';
    ctx.drawImage(bgPicturePath3, sexleft, xh * 0.3835, 23, 23);
    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.textAlign = 'start'
    ctx.fillText(Number(info.BodyWeight) + 'KG', 200 * xw, xh * 0.4610)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.textAlign = 'start'
    ctx.fillText(Number(info.Waistline) + 'CM', 200 * xw, xh * 0.4950)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.textAlign = 'start'
    ctx.fillText(Number(info.Hips) + 'CM', 200 * xw, xh * 0.5288)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.textAlign = 'start'
    ctx.fillText(Number(info.ArmCirc) + 'CM', 200 * xw, xh * 0.5624)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.textAlign = 'start'
    ctx.fillText(Number(info.Bust) + 'CM', 200 * xw, xh * 0.5964)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.textAlign = 'start'
    ctx.fillText(Number(info.Thigh) + 'CM', 200 * xw, xh * 0.63)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.textAlign = 'start'
    ctx.fillText(Number(info.Calf) + 'CM', 200 * xw, xh * 0.6638)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.textAlign = 'start'
    ctx.fillText(Number(info.WaistHipRatio) + "%", 200 * xw, xh * 0.6976)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.textAlign = 'start'
    ctx.fillText(Number(info.Muscle) + 'KG', 200 * xw, xh * 0.7314)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.textAlign = 'start'
    ctx.fillText(Number(info.Fat) + 'KG', 200 * xw, xh * 0.7654)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.textAlign = 'start'
    ctx.fillText(Number(info.BMI) +"Kg/㎡", 200 * xw, xh * 0.799)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.textAlign = 'start'

    ctx.fillText(Number(info.BasalMetab) +"Kcal", 200 * xw, xh * 0.8327)
    // 日期
    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.textAlign = 'start'
    if (that.data.platform =="android"){
      ctx.fillText(createdate, 174 * xw, xh * 0.8841)
    }else{
      ctx.fillText(createdate, 144 * xw, xh * 0.8841)
    }
    // 二维码图片
    if (that.data.netHeaderimg){
      ctx.drawImage(that.data.netHeaderimg, 242 * xw, xh * 0.8649, 50, 50);
    }else{
      ctx.drawImage("../../icon/ewm.jpg", 242 * xw, xh * 0.8649, 50, 50);
    }
    // logo
    if (that.data.netGymheight > that.data.netGymwidth){
      let gapWidth = (50 - 50 / that.data.netGymheight * that.data.netGymwidth) / 2
      ctx.drawImage(that.data.netGymimg, 83 * xw + gapWidth , xh * 0.8649, 50 / that.data.netGymheight * that.data.netGymwidth, 50);
    } else{
      let gapheight = (50 - 50 / that.data.netGymwidth * that.data.netGymheight) / 2 / xh
      ctx.drawImage(that.data.netGymimg, 83 * xw, xh * (0.8649 + gapheight), 50, 50 / that.data.netGymwidth * that.data.netGymheight);
      }
    ctx.stroke()
    // 头像
      // var imglist = [
      //   '/icon/canvasHeaderImg/circle1.png',
      //   '/icon/canvasHeaderImg/circle2.png',
      //   '/icon/canvasHeaderImg/circle3.png',
      //   '/icon/canvasHeaderImg/circle4.png',
      //   '/icon/canvasHeaderImg/circle5.png',
      // ]
      // ctx.drawImage(imglist[Math.ceil(Math.random() * 4)], headerleft, xh * 0.380, xw * 30, xw * 30);
    // 绘制成功
    ctx.draw(false, function () {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: that.data.screenWidth,
          height: that.data.screenWidth / 375 * 592,
          destWidth: that.data.screenWidth * 3,
          destHeight: that.data.screenWidth / 375 * 592 * 3,
          canvasId: 'share',
          quality: 1,
          success: function (res) {
            wx.previewImage({
              current: res.tempFilePath,
              urls: [res.tempFilePath],
              success: function () {
                // wx.hideLoading();
              }
            })
          },
          fail: function (res) { }
        })
      }, 500)
    });
  },

  getarea: function (e) {
    this.setData({
      subarea: e.detail.value,
      subareas: e.detail.value
    })
  },
  navbarTap: function (e) {
    var currentTabinfo = e.currentTarget.dataset.idx
    this.setData({
      currentTab: currentTabinfo,

    })
  },
  changeuserNav: function (e) {
    var currentTabinfo = e.currentTarget.dataset.idx
    if (currentTabinfo==1){
      this.inbodydata("")
    }
    this.setData({
      userTab: currentTabinfo,
    })
  },
  navbarTap1: function (e) {
    this.setData({
      currentTab1: e.currentTarget.dataset.idx
    })
  },
  //state选择 
  checkstate: function (e) {
    this.setData({
      subarea: "",
      subareas: "",
      checkedtime: "",
      stateidx: e.currentTarget.dataset.idx
    })
  },
  //时间选择器
  selectDate: function () {
    this.setData({
      phonemodel: false
    })
  },
  bindMultiPickerChange: function (e) {
    var Y = this.data.multiArray[0][e.detail.value[0]]
    var M = this.data.multiArray[1][e.detail.value[1]]
    var D = this.data.multiArray[2][e.detail.value[2]]
    M = M.slice(0, M.length - 1)
    D = D.slice(0, D.length - 1)
    this.setData({
      checkedtime: Y + " " + M + ":" + D,
      subarea: "预约时间为 " + Y + " " + M + ":" + D
    })
  },
  // 上传教练跟进记录
  toupinfo: function () {
    var that = this
    if (this.data.subareas == "") {
      wx.showToast({
        title: '内容不能为空',
        icon: "none"
      })
    } else if (this.data.stateidx == 0 || this.data.stateidx == 2 || this.data.stateidx == 3) {
      this.followAdd()
    } else if (this.data.stateidx == 1) {
      if (!that.data.checkedtime) {
        wx.showToast({
          title: '请选择下次预约时间',
          icon: "none"
        })
      } else {
        that.followAdd(that.data.checkedtime)
      }
    }
  },
  // 得到教练的跟进信息
  getfollow: function () {
    var that = this
    server.request('CoachFollowList', {
      userid: that.data.getinfoid
    }, function (res) {
      if (!res.data.data.length) {
        that.setData({
          One: true,
          coachlength: 0
        })
      } else {
        that.setData({
          One: false,
          coachaddlist: res.data.data,

          coachlength: res.data.data.length
        })
      }


    })
  },
  // 添加教练跟进记录
  followAdd: function (uptime) {

    if (parseInt(this.data.stateidx) + 1 == 1) {
      var result = 2
    } else if (parseInt(this.data.stateidx) + 1 == 2) {
      var result = 1
    } else {
      var result = parseInt(this.data.stateidx) + 1
    }

    var that = this
    var info = {
      Content: that.data.subarea,
      Result: result,
      userid: that.data.getinfoid,
      AppointmentTime: that.data.setuptime
    }
    server.request('CoachFollowAdd', info, function (res) {
      if (res.data.code == 1) {

        that.getfollow()
        wx.showToast({
          title: '预约成功',
          icon: "none"
        })
        that.setData({
          subareas: "",
          subarea: "备注信息"
        })
        // 同步教练跟进信息 

      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    })
  },


  onLoad: function (options) {
  
    var that=this
    var userinfo = JSON.parse(options.info)
    that.setData({
      userinfo: userinfo,
    })
    server.request('SearchGymQR', {
    }, function (res) {
    if(res.data.code== 1){
    wx.getImageInfo({
    src: res.data.data[0].wxQR,
    success: function (res) {
    that.setData({
    netHeaderimg: res.path
    })
    }
    })
    wx.getImageInfo({
    src: res.data.data[0].GymLogo,
    success: function (res) {
    that.setData({
    netGymimg: res.path,
    netGymheight:res.height,
    netGymwidth:res.width
    })
    

    }
    })
    }
    })
    var topname = 'aa.name'
    this.setData({
      navbar: options.id == 0 ? ["会员档案", "教练档案", "教练跟进", "备注信息", "卡种信息"] : ["会员档案", "教练档案", "教练跟进", "备注信息", "卡种信息", "课程信息"],
      [topname]: options.id == 0 ? '无课会员' : '会员信息',
     
      pageid: options.id,
      getinfoid: options.id == 0 ? userinfo.UI_ID : userinfo.FK_UI_ID,
      coachname: wx.getStorageSync('meminfo').AI_Name
    })

    wx.setStorageSync('userid', this.data.getinfoid)
   
    this.setData({ 

      showcanvas: false
    })
    // 得到用户的手机尺寸
    wx.getSystemInfo({
      success(res) {
      that.setData({
      screenWidth: res.screenWidth,
      screenHeight: res.screenHeight,
      "commonHeadHeight.titleHeight": res.statusBarHeight * 2 + 16,
      "high": res.statusBarHeight + 140,
      platform: res.platform
      })
      }
      })

    // 得到课程信息
    server.request('TeachUserClass', {
      userid: that.data.getinfoid
    }, function (res) {

      var listinfo1 = res.data.data
      if (!listinfo1.length) {
        that.setData({
          Four: true
        })
      } else {
        for (var i = 0; i < listinfo1.length; i++) {

          listinfo1[i].allMoney =Math.floor( listinfo1[i].allMoney)

          listinfo1[i].CO_ActiveEnd = listinfo1[i].CO_ActiveEnd.split(" ")[0].split('/').join('-')
          listinfo1[i].CO_ActiveStart = listinfo1[i].CO_ActiveStart.split(" ")[0].split('/').join('-')
        }
 
        that.setData({
          listinfo1: listinfo1
        })
      }

    })
    // 得到会籍跟进
    server.request('GetAdviserInfo', {
      userid: that.data.getinfoid
    }, function (res) {
      that.setData({
        memname: res.data.data.length ? res.data.data[0].AI_Name : ''
      })
    })
    // 得到备注信息
    server.request('RemarkAdviser', {
      userid: that.data.getinfoid
    }, function (res) {
      if (!res.data.data.length) {
        that.setData({
          Two: true
        })
      }
      that.setData({
        info2: res.data.data[0]
      })
    })
    // 得到卡种信息
    server.request('UserInfo', {
      userid: that.data.getinfoid
    }, function (res) {
      if (!res.data.data.length) {
        that.setData({
          Three: true
        })
      } else {
        var info = res.data.data[0]

        info.UI_FirstDate = info.UI_FirstDate.split(' ')[0].split('/').join('-')
        info.UI_LastDate = info.UI_LastDate.split(' ')[0].split('/').join('-')
        info.SC_TypeMsg == "日期卡" ? info.surplus = info.UI_Days + '天' : info.surplus = info.UI_Times + '次'

        that.setData({
          listinfo: info
        })
      }

    })
    // 计算高度

    let isIphoneX = getApp().globalData.isIphoneX;
    //当日日期之后一个月的日期  
    var timestamp = Date.parse(new Date())
    var date = new Date(timestamp)
    var hour = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours());
    var minute = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
    var second = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    var date = util.formatTime() + " " + hour + ":" + minute + ":" + second

    var up = "multiArray[" + 0 + "]"
    this.setData({
      [up]: util.days(),
      setuptime: date
    })
    this.getfollow()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function (options) {
    //会员教练档案
  
    var that = this
    // this.inbodydata("")
    server.request('MemberProfileByUserID', {
      userid:that.data.getinfoid
    }, function (res) {
      var resData = res.data.data
      var data = []
      for (var i = 0; i < resData.length; i++) {
        var obj = {}
        obj.BodyWeight = Number(resData[i].BodyWeight)  + "kg"
        obj.Thigh = Number(resData[i].Thigh)  + "cm"
        obj.Waistline = Number(resData[i].Waistline)  + "cm"
        obj.Calf = Number(resData[i].Calf)  + "cm"
        obj.Createdate =resData[i].Createdate.split(" ")[0].split("/").join(".")
        obj.CoachName = resData[i].CoachName
        data.push(obj)
      }
      that.setData({
        dossierallV: res.data.data,
        dossier: data
      })
    })
    server.request('CoachrProfileUserID', {
      userid:that.data.getinfoid
    }, function (res) {
      var resData = res.data.data
      for (var i = 0; i < resData.length; i++) {
   
        resData[i].Createdate = resData[i].Createdate.split(" ")[0].split("/").join(".")
      }
      that.setData({
        dossierC: resData
      })

    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      showcanvas: false
    })
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