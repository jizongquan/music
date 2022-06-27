// pages/blog-edit/blog-edit.js
//输入文字最大个数
const MAX_WORDS_NUM = 140
//最大上传图片数量
const MAX_IMG_NUM = 9
//对数据库初始化
const db = wx.cloud.database()
//当前文字的输入内容
let content = ''
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //输入的文字个数
    wordsNum:0,
    footerBottom:0,
    images:[],
    selectPhoto:true,//添加图片元素是否显示
  },
  onInput(event){
    console.log(event.detail.value)
    let wordsNum = event.detail.value.length
    if(wordsNum >= MAX_WORDS_NUM){
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },
  onFocus(event){
    this.setData({
      footerBottom:event.detail.height
    })
  },
  onBlur(){
    this.setData({
      footerBottom:0
    })
  },
  //选择图片
  onChooseImage(){
    //还能在选几张图片
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType:['original','compressed'],//original初始值，compressed压缩过的
      sourceType:['album','camera'],//album手机相册，camera拍照
      success:(res)=>{
        console.log(res)
        this.setData({
          images:this.data.images.concat(res.tempFilePaths) 
        })
        // 还能在选几张图片，最大九张
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false:true
        })
      }
    })
  },
  //删除图片
  onDelImage(event){
    console.log(event.target.dataset.index)
    //splice 第一个参数删除对应元素的索引，第二个参数是删除几个,splice会返回被删除元素
    this.data.images.splice(event.target.dataset.index,1)
    this.setData({
      images:this.data.images
    })
    if(this.data.images = MAX_IMG_NUM -1){
      this.setData({
        selectPhoto:true
      })
    }
  },
  onPreviewImage(event){
    //小程序中预览图片的方法，有两个参数urls 表示当前要预览的列表,
    // 第二个参数current表示当前预览的这张图片的地址
    wx.previewImage({
      urls: this.data.images,
      current:event.target.dataset.imgsrc
    })
  },
  send(){
    //当点击按钮的时候判断输入文字是否为空
    if(content.trim() === ''){
      wx.showToast({
        title:"请输入内容",
        content: '',
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask:true
    })
    //数据存储到云数据库中，云数据库是非关系型数据库，以json的形式存储
    //数据库需要存的：内容、图片fileId、openid（用户标识）、昵称、头像、发布时间
    //图片 存入云存储，当上传云存储成功云存储会返回一个fileId，就是文件的唯一标识，云文件ID
    let promiseArr = []
    let fileIds = []
    //图片上传 ,云端存粗每次只能上传一张，所以多张可以通过循环来实现
    for(let i = 0,len = this.data.images.length;i < len;i++){
      let p = new Promise((resolve,reject)=>{
          //文件扩展名
          const item = this.data.images[i]
          let suffix = /\.\w+$/.exec(item)[0]
          wx.cloud.uploadFile({
            cloudPath:"blog/" + Date.now() + "-" + Math.random()*10000000 + suffix,//云端路径
            filePath:item,//临时路径
            success:(res)=>{
              console.log(res)
              fileIds = fileIds.concat(res.fileID)
              resolve()
            },
            fail:(err)=>{
              console.log(err)
              reject()
            }
          })
      })
      promiseArr.push(p)
    }
    // 将所有数据存入到云数据库当中
    Promise.all(promiseArr).then((res)=>{
      db.collection('blog').add({
        data:{
          ...userInfo,
          content,
          img:fileIds,
          createTime:db.serverDate() //取到服务器时间
        }
      }).then((res)=>{
          wx.hideLoading()
          wx.showToast({
            title: '发布成功',
          })
          //发布成功后返回博客列表。并且刷新
          wx.navigateBack()
          //子界面调用父界面方法，小程序中getCurrentPages(),可以获得当前页面，和上一个页面
          const pages = getCurrentPages()
          // console.log(pages)
          //取到上一个页面 
          const prevPage = pages[pages.length - 2]
          // const prevPage = pages[0] 与上面相等
          prevPage.onPullDownRefresh()
      })
    }).catch((err)=>{
      wx.hideLoading()
      wx.showModal({
        title: '发布失败',
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    userInfo = options
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