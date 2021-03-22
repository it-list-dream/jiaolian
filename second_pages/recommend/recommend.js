var server = require("../../utils/server.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showroul: false,
    inp7: null,
    inp1: null,
    AI_Name: '',
    AI_Tel: ''
  },
  showroul() {

    this.setData({
      showroul: true
    })
  },
  closeroul() {
    this.setData({
      showroul: false
    })
  },
  back1() {
    wx.navigateBack({})
  },
  // 得到场馆类型
  radiog(e) {
    this.setData({
      inp: e.detail.value
    })
  },
  // 得到推荐的信息
  getinp1(e) {
    this.setData({
      inp1: e.detail.value
    })
  },
  getinp2(e) {
    this.setData({
      inp2: e.detail.value
    })
  },
  getinp3(e) {
    this.setData({
      inp3: e.detail.value
    })
  },
  getinp4(e) {
    this.setData({
      inp4: e.detail.value
    })
  },
  getinp5(e) {
    this.setData({
      inp5: e.detail.value
    })
  },
  getinp6(e) {


    this.setData({
      // inp6: this.data.AI_Tel ? this.data.AI_Tel : e.detail.value
      inp6: e.detail.value
    })
  },
  getinp7(e) {
    this.setData({
      inp7: e.detail.value
    })
  },
  // 提交推荐信息
  sub() {
    console.log(this.data.inp6)
    var that = this
    this.setData({
      col1: this.data.inp ? 'black' : 'red',
      col2: this.data.inp2 ? 'black' : 'red',
      col3: this.data.inp3 ? 'black' : 'red',
      col4: this.data.inp4 ? 'black' : 'red',
      col5: this.data.inp5 ? 'black' : 'red',
      col6: this.data.inp6 ? 'black' : 'red'
    })

    if (this.data.col1 != "black" || this.data.col2 != "black" || this.data.col3 != "black" || this.data.col4 != "black" || this.data.col5 != "black" || this.data.col6 != "black") {
      wx.showToast({
        title: '推荐失败，请填写完整信息',
        icon: 'none'
      })
    } else {
      server.request('RecommendReward', {
        GymType: this.data.inp,
        GymName: this.data.inp1,
        GymContacts: this.data.inp2,
        GymJob: this.data.inp3,
        GymPhone: this.data.inp4,
        ProviderName: this.data.inp5,
        ProviderPhone: this.data.inp6,
        Remarks: this.data.inp7,
        sign: wx.getStorageSync("prifid"),
        FK_GB_ID: wx.getStorageSync("meminfo").FK_GB_ID
      }, function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '推荐成功,感谢您的推荐',
            icon: 'none'
          })
          setTimeout(function () {
            wx.navigateBack({

            })
          }, 1500)
        } else {
          wx.showToast({
            title: '推荐失败，该信息已被提供！！！',
            icon: 'none'
          })
        }
      })
    }

    //  wx.navigateBack({})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      high1: wx.getMenuButtonBoundingClientRect().height,
      top1: wx.getMenuButtonBoundingClientRect().top,
      top2: wx.getMenuButtonBoundingClientRect().top + (wx.getMenuButtonBoundingClientRect().top - 15) / 2,
      AI_Name: wx.getStorageSync("meminfo").AI_Name,
      AI_Tel: wx.getStorageSync("meminfo").AI_Tel,
      inp6: wx.getStorageSync("meminfo").AI_Tel,
      inp5: wx.getStorageSync("meminfo").AI_Name
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

  },
  onPageScroll: function (e) { // 获取滚动条当前位置

    this.setData({
      col: e.scrollTop < 286 ? 'rgba(93,61,202,1)' : (e.scrollTop >= 530 ? '#5952D4' : '#594CD0')

    })
  },
})