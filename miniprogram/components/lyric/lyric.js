// components/ lyric/lyric.js
let lyricHeight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow:{
      type:Boolean,
      value:false
    },
    lyric:String
  },
  //属性监听器
  observers:{
    lyric(lrc){
      if(lrc == '暂无歌词'){
        this.setData({
          lrcList:[{
            lrc,
            time:0
          }],
          nowLyricIndex:-1
        })
      }else{
        this._parseLyric(lrc)
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lrcList:[],
    nowLyricIndex:0, //当前选中的歌词索引
    scrollTop:0 //滚动条滚动的高度
  },
  lifetimes:{
    ready(){
      //px 与rpx的换算 所有手机750rpx
      wx.getSystemInfo({
        success(res){
          console.log(22,res)
          //求出1rpx的大小，64事先设定的最小高度
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    update(currentTime){
      console.log(11111, currentTime)
      let lrcList = this.data.lrcList
      if(lrcList.length == 0){
        return
      }
      if(currentTime > lrcList[lrcList.length -1].time){
        if(this.data.nowLyricIndex != -1){
          this.setData({
            nowLyricIndex:-1,
            scrollTop:lrcList.length * lyricHeight
          })
        }
      }
      for(let i = 0,len = lrcList.length;i< len;i++){
        if(currentTime <= lrcList[i].time){
            this.setData({
              nowLyricIndex: i - 1,
              scrollTop:(i - 1) * lyricHeight
            })
            break
        }
      }
    },
    _parseLyric(sLyric){
      //一行一行分割，换行\n
      let line = sLyric.split('\n')
      let _lrcList = []
      line.forEach((elem)=>{
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if(time != null){
          console.log(time)
          let lrc = elem.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          //把时间转化成秒
          let time2Second = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          _lrcList.push({
            lrc,
            time:time2Second
          })
        }
      })
      this.setData({
        lrcList:_lrcList
      })
    }
  }
})
