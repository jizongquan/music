// pages/profile-bloghistory/profile-bloghistory.js
const MAX_LIMIT = 10
//小程序端查询数据库初始化
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      //调用云函数读取博客列表
      this._getListByCloudFn()
      //直接小程序读取数据库查询博客列表，两者都可以
      // this._getListByMiniprogram()
  },
  _getListByCloudFn(){
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name:"blog",
        data:{
          $url:"getListByOpenId",
          start:this.data.blogList.length,
          count:MAX_LIMIT
        }
      }).then((res)=>{
        console.log(res)
        this.setData({
          blogList:this.data.blogList.concat(res.result)
        })
        wx.hideLoading()
      })
  },

  _getListByMiniprogram(){
    wx.showLoading({
      title: '加载中',
    })
    db.collection('blog').skip(this.data.blogList.length)
    .limit(MAX_LIMIT).orderBy('createTime','desc').get().then((res)=>{
      let _blogList = res.data
      for(let i = 0,len=_blogList.length;i<len;i++){
        _blogList[i].createTime = _blogList[i].createTime.toString()
      }
      // this.setData({
      //   blogList:this.data.blogList.concat(_blogList)
      // })
      wx.hideLoading()
      console.log(11,res)
    })
  },
  goComment(event){
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogId=${event.target.dataset.blogid}`,
    })
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
    this._getListByCloudFn()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(event) {
    const blog = event.target.dataset.blog
    return{
      title:blog.content,
      path:`../blog-comment/blog-comment?blogId=${blog._id}`
    }
  }
})