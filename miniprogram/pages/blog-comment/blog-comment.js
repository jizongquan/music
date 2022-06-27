// pages/blog-comment/blog-comment.js
import formatTime from "../../utils/formatTime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog:{},
    commentList:[],
    blogId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      blogId:options.blogId
    })
    this._getBlogDetail()
  },
  _getBlogDetail(){
    console.log(this.data.blogId)
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      wx.cloud.callFunction({
        name:"blog",
        data:{
          blogId:this.data.blogId,
          $url:"detail"
        }
      }).then((res)=>{
        console.log(res)
        let commentList = res.result.commentList.data
        for(let i = 0,len=commentList.length;i<len;i++){
          commentList[i].createTime = formatTime(new Date(commentList[i].createTime))
        }
        this.setData({
          commentList,
          blog:res.result.detail[0],
        })
        wx.hideLoading()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const blog = this.data.blog
    return{
      title:blog.content,
      path:`/pages/blog-comment/blog-comment?blogId=${blog._id}`
    }
  }
})