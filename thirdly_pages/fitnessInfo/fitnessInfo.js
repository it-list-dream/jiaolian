const app = getApp()
var server = require("../../utils/server.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userBodyShow:true,
    fatBodyShow:true,
    info:{},
    userInbodyImg:'',
    userInbodyfirstname:''
  },
  bodyShow(){
    this.setData({
      userBodyShow: !this.data.userBodyShow
    })
  },
  fatShow() {
    this.setData({
      fatBodyShow: !this.data.fatBodyShow
    })
  },
  goback(){
     wx.navigateBack({
       
     })
  },
  // 计算差值
  differNum(namepro,numpro,unit,num_max,num_min,arrayObj){
    var obj1 = { name: namepro, num: numpro+unit }
    if (numpro > num_max) {
      obj1.differ = ((numpro * 100 - num_max * 100) / 100).toFixed(2)
      obj1.bol = 1
    } else if (numpro < num_min) {
      obj1.differ = (Math.abs((numpro * 100 - num_min * 100) / 100)).toFixed(2) 
      obj1.bol = -1
    } else {
      obj1.bol = 0
      obj1.differ=0
    }
    arrayObj.push(obj1)
  },
  // 得到详情
  getInBodyInfo(idinfo){
    console.log(idinfo)
    var that =this
    
    wx.request({
      url: "https://user.360ruyu.cn/Inbody.asmx/tf_testResult_uuid",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        testid: idinfo,
        key: "BD687B66ECDBED4E12C4320B0ABB3BB111",
        GymUrl: wx.getStorageSync("url").replace("MobileCoach", "inbody")
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
       new Promise(function(resolve,rej){
         for (let i in res.data.data[0]) {
           if (!isNaN(Number(res.data.data[0][i]))) {  // 数字
             res.data.data[0][i] = Number(res.data.data[0][i]).toFixed(2)
           }
         }
         res.data.data[0].pbf_min = (res.data.data[0].pbf_min*100).toFixed(2)
         res.data.data[0].pbf_max = (res.data.data[0].pbf_max * 100).toFixed(2)
         res.data.data[0].vfidiffer = res.data.data[0].vfi > 10 ? (res.data.data[0].vfi - 10).toFixed(2):0
         res.data.data[0].condition=[]
         that.differNum("体重", res.data.data[0].weight,"kg", res.data.data[0].weight_max, res.data.data[0].weight_min, res.data.data[0].condition)
         that.differNum("蛋白质", res.data.data[0].protein,"kg", res.data.data[0].protein_max, res.data.data[0].protein_min, res.data.data[0].condition)
         that.differNum("骨骼肌", res.data.data[0].smm,"kg", res.data.data[0].smm_max, res.data.data[0].smm_min, res.data.data[0].condition)
         that.differNum("体脂肪", res.data.data[0].fat,"kg", res.data.data[0].fat_max, res.data.data[0].fat_min, res.data.data[0].condition)
         that.differNum("水分", res.data.data[0].water,"kg", res.data.data[0].water_max, res.data.data[0].water_min, res.data.data[0].condition)
         that.differNum("体脂率", res.data.data[0].pbf,"%", res.data.data[0].pbf_max, res.data.data[0].pbf_min, res.data.data[0].condition)
         that.differNum("腰臀比", res.data.data[0].whr,"", res.data.data[0].whr_max, res.data.data[0].whr_min, res.data.data[0].condition)
         that.differNum("体质指数", res.data.data[0].bmi,"", res.data.data[0].bmi_max, res.data.data[0].bmi_min, res.data.data[0].condition)
         that.differNum("水肿系数", res.data.data[0].edema,"", res.data.data[0].edema_max, res.data.data[0].edema_min, res.data.data[0].condition)
        
         resolve();
       }).then(()=>{
    
       
         that.setData({
           info: res.data.data[0],
           testdate: res.data.data[0].testdate
         })
         console.log(res.data.data[0])
       })
        
  
      },
      fail: function () {
        wx.showToast({
          title: '注册失败，请重试',
          icon: 'none'
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      menuTop: wx.getMenuButtonBoundingClientRect().top,
      menuHeight: wx.getMenuButtonBoundingClientRect().height,
      ewmTop: wx.getMenuButtonBoundingClientRect().top + (wx.getMenuButtonBoundingClientRect().height - 20) / 2,
      uiName: wx.getStorageSync("userInbodyname"),
      userInbodyImg: wx.getStorageSync("userInbodyImg"),
      userInbodyfirstname: wx.getStorageSync("userInbodyfirstname")
    })
    this.getInBodyInfo(options.info)

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