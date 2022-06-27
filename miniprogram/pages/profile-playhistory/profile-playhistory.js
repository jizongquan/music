// pages/profile-bloghistory/profile-bloghistory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
   const playHistory = wx.getStorageSync(app.globalData.openid)
   if(playHistory.length == 0){
      wx.showModal({
        title:"播放历史为空",
        cancelColor: '',
      })
   }else{
     //storage里面存储的musiclist替换成播放历史的歌单
     wx.setStorage({
       key:'musiclist',
       data:playHistory
     })
      this.setData({
        musiclist:playHistory
      })
      console.log(this.data.musiclist)
   }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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