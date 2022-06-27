// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    openShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
  _loging(){
    wx.getUserProfile({
      desc: '获取用户信息',
      success:(res)=>{
        this.setData({
          userInfo:res.userInfo,
          openShow:false
        })
       
        console.log(res)
      }
    })
  },
  onTapQrCode(){
    wx.showLoading({
      title: '生成中',
    })
    wx.cloud.callFunction({
      name: "getQrCode"
    }).then((res)=>{
      console.log("file",res)
       //图片预览 previewImage
       const fileId = res.result
       wx.previewImage({
         urls: [fileId],
         current:fileId
       })
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})