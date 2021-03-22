var server = require("../../utils/server.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    netimg:''
  },
  // 绘制图片
  upcavas() {
    var that =this
    var xw = that.data.screenWidth / 375
    var xh = xw * 592
    const ctx = wx.createCanvasContext('share');
    //背景绘制
    let bgPicturePath = "../../icon/poster.png";
    ctx.drawImage(bgPicturePath, 0, 0, that.data.screenWidth, xw*592);
    // 会员头像
    ctx.drawImage(that.data.netimg, 113 * xw, xh * 0.385, 30, 30);
   
   // 性别选择
    let bgPicturePath3 = "../../icon/crown.png";
    ctx.drawImage(bgPicturePath3, 246 * xw, xh * 0.3818, 23, 23);
   // 绘制文字
    ctx.setFontSize(32 * xw)
    ctx.setFillStyle('#FCD755')
    ctx.fillText('陈先生', 149 * xw, xh * 0.425)
   

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.fillText('58KG', 160 * xw, xh * 0.4640)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.fillText('100CM', 160 * xw, xh * 0.4980)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.fillText('111CM', 160 * xw, xh * 0.5318)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.fillText('222CM', 160 * xw, xh * 0.5654)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.fillText('333CM', 160 * xw, xh * 0.5994)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.fillText('555CM', 160 * xw, xh * 0.6330)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.fillText('666CM', 160 * xw, xh * 0.6668)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.fillText('777CM', 160 * xw, xh * 0.7006)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.fillText('888CM', 160 * xw, xh * 0.7344)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.fillText('999CM', 160 * xw, xh * 0.7684)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.fillText('888CM', 160 * xw, xh * 0.8020)

    ctx.setFontSize(12 * xw)
    ctx.setFillStyle('#FFF')
    ctx.fillText('777CM', 160 * xw, xh * 0.8357)
// 二维码图片
    ctx.drawImage(that.data.netimg, 242 * xw, xh * 0.8649, 50, 50);
    ctx.stroke()
// 绘制成功
    ctx.draw(false, function () {
      setTimeout(()=>{
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: that.data.screenWidth,
        height: that.data.screenWidth/375*592,
        destWidth: that.data.screenWidth*3,
        destHeight: that.data.screenWidth / 375 * 592*3,
        canvasId: 'share',
        quality: 1,
        success: function (res) {
          console.log(res)
          wx.previewImage({
            current: res.tempFilePath,
            urls: [res.tempFilePath]
          })
          that.setData({
            tempFilePath: res.tempFilePath,
          })
        },
        fail: function (res) {
        }

      })
      }, 500)
    });
  },
  // 返回
  goback(){
   wx.navigateBack({
     
   })
  },
  // 长按分享，保存图片，识别二维码
  saveImg(e) {
    // console.log(e)
    let url = this.data.tempFilePath;
    var current = this.data.tempFilePath;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var  that = this
// 得到网图的临时地址
    wx.getImageInfo({
      src:'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1408233282,1483083519&fm=26&gp=0.jpg',
      success:function(res){
       console.log(res.path)
        that.setData({
         netimg: res.path
       })
        that.upcavas()
      }
    })
// 得到用户的手机尺寸
    wx.getSystemInfo({
      success(res) {
        that.setData({
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight
        })
      }
    })
   
  },
  //分享功能
  onShareAppMessage: function (options) {
}
})