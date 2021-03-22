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
      "name": "用户协议"
    },


  },
  convertHtmlToText: function convertHtmlToText(inputText) {
    var returnText = "" + inputText;
    returnText = returnText.replace(/<\/div>/ig, '\r\n');
    returnText = returnText.replace(/<\/li>/ig, '\r\n');
    returnText = returnText.replace(/<li>/ig, ' * ');
    returnText = returnText.replace(/<\/ul>/ig, '\r\n');
    //-- remove BR tags and replace them with line break
    returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

    //-- remove P and A tags but preserve what's inside of them
    returnText = returnText.replace(/<p.*?>/gi, "\r\n");
    returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

    //-- remove all inside SCRIPT and STYLE tags
    returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
    //-- remove all else
    returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

    //-- get rid of more than 2 spaces:
    returnText = returnText.replace(/ +(?= )/g, '');

    //-- get rid of html-encoded characters:
    returnText = returnText.replace(/ /gi, " ");
    returnText = returnText.replace(/&/gi, "&");
    returnText = returnText.replace(/"/gi, '"');
    returnText = returnText.replace(/</gi, '<');
    returnText = returnText.replace(/>/gi, '>');

    return returnText;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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