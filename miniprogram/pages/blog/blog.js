// pages/blog/blog.js
//搜索的关键字
let keyword = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //控制底部弹出层是否显示
    modalShow:false,
    blogList:[]
  },
  //发布功能
  onPublish(){
    this.setData({
      modalShow:true
    })
    // 首先判断用户是否授权 下面的已废弃
    // wx.getSetting({
    //   success:(res)=>{
    //     if(res.authSetting['scope.userInfo']){
    //       wx.getUserInfo({
    //         success(res){
    //           console.log(res)
    //         }
    //       })
    //     }else {
    //       this.setData({
    //         modalShow:true
    //       })
    //     }
    //   }
    // })
   
  },
  onLoginSuccess(event){
    console.log(11,event)
    const detail = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  onLoginFail(){
    wx.showModal({
      title:"授权用户才能发布博客",
      content: '',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this._loadBlogList()
  },
  _loadBlogList( start=0){
    wx.showLoading({
      title:"加载中"
    })
    wx.cloud.callFunction({
      name:"blog",
      data:{
        keyword,
        start,
        count:10,
        $url:"list"
      }
    }).then((res)=>{
      console.log(55,res.result)
      this.setData({
        blogList:this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  goComment(event){
    wx.navigateTo({
      url: '../../pages/blog-comment/blog-comment?blogId='+event.target.dataset.blogid,
    })
  },
  onSearch(event){
    console.log(1,event.detail.keyword)
    this.setData({
      blogList:[]
    })
    keyword = event.detail.keyword
    this._loadBlogList(0)
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
    //开启下拉刷新，别忘了在对应json里面设置enablePullDownRefresh 为true
    this.setData({
      blogList:[]
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(event) {
    console.log(event)
    let blogObj = event.target.dataset.blog
    //分享方法固定api，必须return
    return{
      title:blogObj.content,
      path:`/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      // imageUrl:"" 可以自定义图片
    }
  }
})