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
      "name": "更新会员身高"
    },
    myhigh:0,
    // UI_Height:0
  },
  gethigh: function (e) {
   
    this.setData({
      myhigh:e.detail.value
    })
  },
  
  sethigh() {
var  that = this
    if (this.data.myhigh > 250 || this.data.myhigh < 50 ){
       wx.showToast({
         title: '身高不正确,请重新输入',
         icon:"none"
       })
    }else{
      that.setData({
        UI_Height: that.data.myhigh
      })
      that.setheight().then(function(){
        setTimeout(()=>{
// wx.navigateBack({

//       })
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.setData({
            userInbodyheight: that.data.UI_Height
          })
          wx.navigateBack({
            delta: 1,
          })
        },1500)
      })
      
    }
    

  },
  // 身高设置
  setheight(){
    var that = this
    return new Promise(function(resolve,rej){
      // server.request('UserInfoSave', {
      //   userid: that.data.userid,
      //   height: that.data.UI_Height
      // }, function (res) {
      //   console.log(res)
      //   if (res.data.code == 1) {
      //     wx.showToast({
      //       title: '身高更新成功',
      //       icon: "none"
      //     })
      //     resolve()
      //   }
      // }
      // )
      wx.request({
        url: "http://47.111.150.151:8011/MobileCoach.asmx/UserInfoSave",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          coachname:"ruyujl",
          password:888888,
             userid: that.data.userid,
        height: that.data.UI_Height,
          key: "BD687B66ECDBED4E12C4320B0ABB3BB111"
        },
        method: 'POST',
        success: function (res) {
        
          if(res.data.code == 1){
     wx.showToast({
            title: '身高更新成功',
            icon: "none"
          })
          resolve()
          }
        },
        fail: function () {
          wx.showToast({
            title: '注册失败，请重试',
            icon: 'none'
          })
        },
      })
    })
    
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.userid)
    this.setData({
      userid: options.userid
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
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log(this.data.UI_Height)
    // this.setheight()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // this.onLoad();
    // wx.stopPullDownRefresh()
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