// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      // playlist:Object
      playlist:{
        type:Object
      }
  },
  /**
   * 监听
   */
  observers:{
    ['playlist.playCount'](count){
      console.log(this._tranNumber(count,2))
      this.setData({
        _count:this._tranNumber(count,2)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _count:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToMusiclist(){
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
      })
    },
    _tranNumber(num,point){
      let numStr = num.toString().split('.')[0]
      if(numStr.length < 6){
        return numStr 
      } else if(numStr >= 6 && numStr.length <= 8){
        let decimal = numStr.substring(numStr -4,numStr.length -4 + point)
        return parseFloat(parseInt(num /10000) + '.' + decimal) + '万'
      } else if(numStr.length>8){
        let decimal = numStr.substring(numStr - 8,numStr - 8 +point)
        return parseFloat(parseInt(num / 10000000) + '.' + decimal) + '亿'
      }
    }
  }
})
