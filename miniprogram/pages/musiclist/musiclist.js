// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist:[],
    listInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        playlistId:options.playlistId,
        $url:'musiclist'
      }
    }).then((res)=>{
      console.log(res)
      const pl = res.result.playlist
      this.setData({
        musiclist:pl.tracks,
        listInfo:{
          coverImgUrl:pl.coverImgUrl,
          name:pl.name
        }
      })
      this._setMusiclist()
      wx.hideLoading()
    })
  },
  _setMusiclist(){
    wx.setStorageSync('musiclist', this.data.musiclist)
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