// pages/player/player.js
let musiclist = []
//获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
//正在播放歌曲的index
let nowPlayingIndex = 0

//获取全局方法或者字段的方式 getApp() 小程序自带的
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:'',
    isPlaying:false, //false表示不播放，true表示播放
    isLyricShow: false,//表示当前歌词是否显示
    lyric:'',
    isSame:false,//表示是否为同一首歌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },
  _loadMusicDetail(musicId){
    if(musicId == app.getPlayMusicId()){
      this.setData({
        isSame:true
      })
    }else{
      this.setData({
        isSame:false
      })
    }
    //判断是否为同一首歌曲，不同首歌曲才是stop，同一首不需要stop
    if(!this.data.isSame){
      //停止上一首
      backgroundAudioManager.stop()
    }
    let music = musiclist[nowPlayingIndex]
    console.log(music)
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl:music.al.picUrl,
      isPlaying:false
    })
    app.setPlayMusicId(musicId)
    wx.showLoading({
      title: '歌曲加载中',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        musicId,
        $url:'musicUrl'
      }
    }).then((res)=>{
      console.log(res.result.data)
      let result = res.result.data
      if(result[0].url == null){
        wx.showToast({
          title: '无权限播放',
        })
        return
      }
      if(!this.data.isSame){
        backgroundAudioManager.src = result[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name
        //保存播放历史
        this.savePlayHistory()
      }
      this.setData({
        isPlaying:true
      })
      wx.hideLoading()
      //歌曲加载完在加载歌词
      wx.cloud.callFunction({
        name:'music',
        data:{
          musicId,
          $url:'lyric'
        }
      }).then((res)=>{
        let lyric = '暂无歌词'
        const lrc = res.result.lrc
        if(lrc){
          lyric = lrc.lyric
          console.log(111,lyric)
          this.setData({
            lyric
          })
        }

      })
    })
  },
  togglePlaying(){
    //正在播放
    if(this.data.isPlaying){
      backgroundAudioManager.pause()
    }else{
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying:!this.data.isPlaying
    })
  },
  onPrev(){
    nowPlayingIndex--
    if(nowPlayingIndex < 0){
      nowPlayingIndex = musiclist.length - 1
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  onNext(){
    nowPlayingIndex++
    if(nowPlayingIndex === musiclist.length){
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  onChangeLyricShow(){
    this.setData({
      isLyricShow:!this.data.isLyricShow
    })
  },
  timeUpdate(event){
    //自定义事件取参数event.detail点定义的参数，update属于自定义事件
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  onPlay(){
    this.setData({
      isPlaying:true
    })
  },
  onPause(){
    this.setData({
      isPlaying:false
    })
  },
  //保存播放历史
  savePlayHistory(){
    //当前正在播放的歌曲
    const music = musiclist[nowPlayingIndex]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    //定义一个标识位
    let bHave = false
    for(let i = 0,len = history.length;i<len;i++){
      if(history[i].id == music.id){
        bHave = true
        break
      }
    }
    if(!bHave){
      //unshift在数组的头部插入，并且返回新数组的长度
      history.unshift(music)
      wx.setStorage({
        key:openid,
        data:history
      })
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