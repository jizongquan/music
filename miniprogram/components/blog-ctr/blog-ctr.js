// components/blog-ctr/blog-ctr.js
let userInfo = {}
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId:String,
    blog:Object
  },
  externalClasses:["iconfont","icon-fenxiang","icon-pinglun"],
  /**
   * 组件的初始数据
   */
  data: {
    //登陆组件是否显示 属于组件内部组件，所以写在data中
    loginlShow:false,
    //底部弹出层是否显示
    modalShow:false,
    content:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event){
      this.setData({
        content:event.detail.value
      })
    },
    //当被form包裹后 发送的时候 会得到参数event，目前form方式已经被弃用
    onSend(event){
      console.log(event)
       //form废弃
      // let formId = event.detail.formId 
      //首先把评论的信息插入云数据库
      let content = this.data.content
      // let content = event.detail.value.content
      if(content.trim() == ''){
        wx.showModal({
          title:"评论不能为空",
          content:""
        })
        return
      }
      wx.showLoading({
        title:"评价中",
        mask:true
      })
      db.collection('blog-comment').add({
        data:{
          content,
          createTime:db.serverDate(),
          blogId:this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then((res)=>{
        console.log(2323,res)
        //插入后推送订阅消息
        wx.cloud.callFunction({
          name:"sendMessage",
          data:{
            content,
            blogId:this.properties.blogId
          }
        }).then((res)=>{
          console.log("推送成功",res)
        })
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          modalShow:false,
          content:""
        })
        //父元素刷新评论页面
        this.triggerEvent("refreshCommentList")
      })
      
    },
    onComment(){
      this.setData({
        loginlShow:true
      })
    },
    //判断用户是否授权
    onLoginSuccess(event){
      userInfo = event.detail
      console.log(userInfo)
      //显示评论弹出层
      this.setData({
        loginlShow:false
      },()=>{
        this.setData({
          modalShow:true
        })
      })
    },
    onLoginFail(){
      wx.showModal({
        title: '授权用户才能进行评价',
        content: '',
      })
    },
    //调起客户端小程序订阅消息界面
    subscribeMsg(){
      const tmlId = "e3wIvBgn957yVkRdWHfbG-zByrH4QPZcWqR7LWA9CZ0"
      wx.requestSubscribeMessage({
        tmplIds: [tmlId],
        success:(res)=>{
          console.log(res)
          if(res[tmlId] == "accept"){
            this.onComment()
          }else{
            wx.showToast({
              icon:'none',
              title: '订阅失败，无法评论',
            })
          }
        }
      })
    }
  }
})
