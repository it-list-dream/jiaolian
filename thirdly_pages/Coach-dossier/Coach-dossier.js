// thirdly_pages/Vip-dossier/Vip-dossier.js
var server = require("../../utils/server.js")
Page({

      /**
       * 页面的初始数据
       */
      data: {
        status: true,
        msg:"操作成功",
        showToast:false,
        aa: {
          "bg_color": "linear-gradient(90deg,rgba(75,95,255,1) 0%,rgba(87,41,231,1) 100%)",
          "color": "rgba(255,255,255,1)",
          "flag": 0,
          "name": "添加教练信息"
        },
        list: ["优秀", "良好", "一般", "较差"],
        baseData: [{
            name: "体重:",
            placeholder: "0kg",
            unit: "kg"
          },
          {
            name: "大腿:",
            placeholder: "0cm",
            unit: "cm"
          },
          {
            name: "腰围:",
            placeholder: "0cm",
            unit: "cm"
          },
          {
            name: "小腿:",
            placeholder: "0cm",
            unit: "cm"
          },
        ],
        focusindex: 0,
        Dfocusindex: 0,
        listindex: 0,
        listindex1: 0,
        listindex2: 0
      },
      goback() {
        wx.navigateBack({})
      },
  addCoach()  {
            var  that = this
            var  data  = JSON.parse(JSON.stringify( this.data.baseData))

            for  (var  i  =  0;  i  <  data.data.length;  i++)  {
                for  (var  j  =  0;  j  <  data.data[i].data.length;  j++)  {

                    if  (!data.data[i].data[j].ActionNum)  {
                        data.data[i].data[j].ActionNum  =  0
                    }  else  {
                        var  str  =  data.data[i].data[j].ActionNum
                        var  length  =  data.data[i].data[j].ActionUnit.length
                        str  =  str.substring(0,  str.length  -  length)
                        data.data[i].data[j].ActionNum  =  str

                    }
                }
            }

              wx.showModal({
                  title:  '确定添加？',
                  showCancel:  true, //是否显示取消按钮
                  cancelText:  "取消", //默认是“取消”
                  confirmText:  "确定", //默认是“确定”
                  success:  function  (res)  {
                      if  (res.cancel)  {
                      }  else  {
                          server.request('CoachrProfileSave',  {
                              userid:  wx.getStorageSync("userid"),
                              archives:  JSON.stringify(data)
                          },  function  (res)  {
                              console.log(res)
                              if (res.data.code == 1) {
                                  that.setData({
                                      showToast: true,
                                  })
                                  setTimeout(()  =>  {
                                      wx.navigateBack({})
                                  },  1000);
                                } else  if (res.data.code == -1) {
                                    that.setData({
                                        showToast: true,
                                        msg: res.data.msg
                                    })
                                } else {
                                    that.setData({
                                        showToast: true,
                                        msg: "添加失败"
                                    })

                                }
                                setTimeout(()  =>  {
                                    that.setData({
                                        showToast: false
                                    })
                                },  1000);
                          })

                      }
                  }
              })

              },
            blurdata(e) {
              
              var id = e.currentTarget.dataset.idx
              var index = e.currentTarget.dataset.ide
              var data = this.data.baseData

              if (data.data[id].data[index].ActionNum) {
                data.data[id].data[index].ActionNum = e.detail.value + data.data[id].data[index].ActionUnit
                this.setData({
                  baseData: data
                })
              }
            },
            focuedata(e) {
          
              var id = e.currentTarget.dataset.idx
              var index = e.currentTarget.dataset.ide
              console.log(id,index)
              var data = this.data.baseData
              if (data.data[id].data[index].ActionNum) {
                var str = data.data[id].data[index].ActionNum
                var length = data.data[id].data[index].ActionUnit.length
                str = str.substring(0, str.length - length)
                data.data[id].data[index].ActionNum = str
                this.setData({
                  baseData: data
                })
              } else {}
            },
            basedata(e, a) {
              console.log(e.detail.value)
              var id = e.currentTarget.dataset.idx
              var index = e.currentTarget.dataset.ide
              var data = this.data.baseData
              data.data[id].data[index].ActionNum = e.detail.value
              console.log(e.detail.value)
              this.setData({
                baseData: data
              })
              console.log(this.data.baseData)
            },
            //输入框方法
            inputin(e) {
              this.setData({
                Dfocusindex: e.currentTarget.dataset.idx,
                focusindex: e.currentTarget.dataset.ide
              })
            },

            listIndex(e) {
              var data = this.data.baseData
              data.HeartLung = e.currentTarget.dataset.idx
              if (this.data.status) {
                this.setData({
                  listindex: e.currentTarget.dataset.idx,
                  baseData: data
                })
              }
            },

            listIndex1(e) {
              var data = this.data.baseData
              data.Muscular = e.currentTarget.dataset.idx
              if (this.data.status) {
                this.setData({
                  listindex1: e.currentTarget.dataset.idx,
                  baseData: data
                })
              }
            },
            listIndex2(e) {
              var data = this.data.baseData
              data.Coordination = e.currentTarget.dataset.idx
              if (this.data.status) {
                this.setData({
                  listindex2: e.currentTarget.dataset.idx,
                  baseData: data
                })
              }
            },

            /**
             * 生命周期函数--监听页面加载
             */
            onLoad: function (options) {

              this.setData({
                userid:  wx.getStorageSync("userid"),
                menuTop: wx.getMenuButtonBoundingClientRect().top + (wx.getMenuButtonBoundingClientRect().height - 30) / 2

              })
              var that = this
              if (options.id == 2) {
                var data = this.data.aa
                data.name = "查看教练信息"
                var Cdossier = wx.getStorageSync("Cdossier")
                console.log(Cdossier)
                this.setData({
                  listindex: Cdossier.HeartLung,
                  listindex1: Cdossier.Muscular,
                  listindex2: Cdossier.Coordination,
                  baseData: Cdossier,
                  aa: data,
                  status: false
                })
              } else {
                server.request('CoachrProfileList', {}, function (res) {
                  console.log(res.data.data[0])
                  var Cdossier = res.data.data[0]
                  that.setData({
                    listindex: Cdossier.HeartLung,
                    listindex1: Cdossier.Muscular,
                    listindex2: Cdossier.Coordination,
                    baseData: Cdossier,

                  })
                })
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