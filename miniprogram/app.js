// app.js
App({
  onLaunch: function () {
    this.checkUpdate()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-7gr5zc8ge3173080',
        traceUser: true,
      });
    }
    //默认获取openid
    this.getOpenId()
    //全局定义完所有的 都可以取到
    this.globalData = {
      playingMusicId:-1,
      openid:-1
    };
  },
  //启动和切前台， 小程序生命周期
  onShow(){

  },
  setPlayMusicId(musicId){
    this.globalData.playingMusicId = musicId
  },
  getPlayMusicId(){
    return this.globalData.playingMusicId
  },
  getOpenId(){
    wx.cloud.callFunction({
      name:"login"
    }).then((res)=>{
      console.log(res.result.openid)
      const openid = res.result.openid
      this.globalData.openid = openid
      if(wx.getStorageSync(openid) == ''){
        wx.setStorageSync(openid, [])
      }
    })
  },
  //检查版本更新
  checkUpdate(){
    //微信更新的版本管理器
    //wx.getUpdateManager()这个下面有一些事件，通过监听下面的事件对版本进行更新
    const updateManager = wx.getUpdateManager()
    //onCheckForUpdate()检测版本更新
    updateManager.onCheckForUpdate((res)=>{
      //hasUpdate为res返回判断是否进行更新
      if(res.hasUpdate){
        updateManager.onUpdateReady(()=>{
            wx.showModal({
              title:"更新提示",
              content: '新版本已经准备好，是否重启应用',
              success:(res)=>{
                if(res.confirm){
                  //重启小程序
                  updateManager.applyUpdate()
                }
              }
            })
        })
      }
    })
  }
});
