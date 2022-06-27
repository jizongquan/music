// pages/demo/demo.js
import regeneratorRuntime from '../../utils/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr:["aa","bb","ccc","ddd"],
    arrObj:[
      {id:1,name:"aa"},
      {id:2,name:"bb"},
      {id:3,name:"cc"},
      {id:4,name:"dd"}
    ]
  },
  sort(){
    const length = this.data.arr.length;
    for(let i = 0;i<length;i++){
      const x = Math.floor(Math.random()*length)
      const y = Math.floor(Math.random()*length)
      const tmp = this.data.arr[x];
      this.data.arr[x] = this.data.arr[y];
      this.data.arr[y] = tmp
      this.setData({
        arr:this.data.arr
      })
    }
  },
  sortObj(){
    const length = this.data.arrObj.length;
    for(let i = 0;i<length;i++){
      const x = Math.floor(Math.random()*length)
      const y = Math.floor(Math.random()*length)
      const tmp = this.data.arrObj[x];
      this.data.arrObj[x] = this.data.arrObj[y];
      this.data.arrObj[y] = tmp
      this.setData({
        arrObj:this.data.arrObj
      })
    }
  },

  async Foo(){
    console.log('foo')
  },
  getMusicInfo(){
    // 调用云函数
    wx.cloud.callFunction({
      name:"tcbRouter",
      data:{
        $url:'music'
      }
    }).then((res)=>{
      console.log(1,res)
    })
  },
  getMovieInfo(){
    wx.cloud.callFunction({
      name:"tcbRouter",
      data:{
        $url:'movie'
      }
    }).then((res)=>{
      console.log(2,res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.Foo()
    wx.getUserInfo({
      success:(res)=>{
        console.log(111, res)
      }
    })
  },
  onGetUserInfo(event){
    console.log(event)
  },
  onGetUserInfo1(){
    wx.getUserProfile({
      desc: '获取用户信息',
      success:(res)=>{
        console.log(res)
      }
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

  }
})