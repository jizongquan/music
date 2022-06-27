// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
let currentSec = -1 //当前的秒数
let duration = 0 //当前歌曲总时常，以秒为单位
let isMoving = false //表示当前进度条是否在拖拽 解决：当进度条拖动的时候和updateTime事件有冲突的问题
const backgroundAudioManager = wx.getBackgroundAudioManager()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime:{
      currentTime:'00:00',
      totalTime:'00:00'
    },
    movableDis:0,
    progress:0
  },
  //组件中在此定义生命周期函数
  lifetimes:{
    ready(){
      if(this.properties.isSame && this.data.showTime.totalTime == '00:00'){
        this._setTime()
      }
      this._getMovableDis()
      this._bindBGMEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event){
      if(event.detail.source == 'touch'){
        this.data.progress = event.detail.x / (movableAreaWidth-movableViewWidth) * 100
        this.data.movableDis = event.detail.x
        isMoving = true
      }
    },
    onTouchEnd(){
      const currentTimeFmt = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        progress:this.data.progress,
        movableDis:this.data.movableDis,
        ['showTime.currentTime']:currentTimeFmt.min+':'+currentTimeFmt.sec
      })
      //seek()方法就是音乐拖到哪停到哪
      backgroundAudioManager.seek(duration * this.data.progress / 100)
      isMoving = false
    },
    _getMovableDis(){
      //组件中获取实例是用this.createSelectorQuery()，如果pages里面获取就是wx.createSelectorQuery()
      const query = this.createSelectorQuery()
      //boundingClientRect获取当前元素内容
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect)=>{
        //返回数组顺序就是上面定义的顺序
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },
    _bindBGMEvent(){
      //监听开始
      backgroundAudioManager.onPlay(()=>{
        isMoving = false
        this.triggerEvent('musicPlay')
      })
      //监听停止
      backgroundAudioManager.onStop(()=>{
        
      })
      //监听暂停
      backgroundAudioManager.onPause(()=>{
        this.triggerEvent('musicPause')
      })
      //监听等待
      backgroundAudioManager.onWaiting(()=>{
        
      })
      //监听背景音乐可以播放的一个状态
      backgroundAudioManager.onCanplay(()=>{
         //不同机型会出现概率事件获得duration的时候是undefined，小程序的坑,所以先判断异常情况
        if(typeof backgroundAudioManager.duratio != 'undefined'){
          this._setTime()
        }else{
          setTimeout(()=>{
            this._setTime()
          },1000)
        }
      })
      //监听进度
      backgroundAudioManager.onTimeUpdate(()=>{
        //如果当前没有在移动
        if(!isMoving){
          const currentTime = backgroundAudioManager.currentTime
          const duration = backgroundAudioManager.duration
          const sec = currentTime.toString().split('.')[0]
          if( sec != currentSec){
            const currentTimeFmt = this._dateFormat(currentTime)
            this.setData({
              movableDis:(movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress:currentTime / duration * 100,
              ['showTime.currentTime']:`${currentTimeFmt.min}:${currentTimeFmt.sec}`
            })
            currentSec = sec
            //联动歌词
            this.triggerEvent('timeUpdate',{
              currentTime
            })
          }
        }
      })
      //监听背景音乐播放完成
      backgroundAudioManager.onEnded(()=>{
        //向父组件抛出个通信方法triggerEvent
        this.triggerEvent('musicEnd')
      })
      //当前音乐播放出现错误
      backgroundAudioManager.onError((res)=>{
        console.log(res.errMsg)
        console.log(res.errCode)
        wx.showToast({
          title: '错误' + res.errcode,
        })
      })
    },
    _setTime(){
      duration = backgroundAudioManager.duration
      const durationFmt = this._dateFormat(duration)
      //给对象里面某个属性赋值
      this.setData({
        ['showTime.totalTime']:`${durationFmt.min}:${durationFmt.sec}`
      })
    },
    // 格式化时间
    _dateFormat(sec) {
      // 分钟
      const min = Math.floor(sec / 60)
      sec = Math.floor(sec % 60)
      return {
        'min': this._parse0(min),
        'sec': this._parse0(sec),
      }
    },
    // 补零
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    }
  }
})
