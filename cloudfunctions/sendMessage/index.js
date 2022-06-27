// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({})

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    //templateMessage要在config里面配置权限
    const {OPENID} = cloud.getWXContext()
    //下面data中的参数是和模版详情参数一致，否则传递不过去，data中参数至少传两个
    const result = await cloud.openapi.subscribeMessage.send({
      touser:OPENID,//必须传，固定写法
      templateId:'e3wIvBgn957yVkRdWHfbG-zByrH4QPZcWqR7LWA9CZ0',
      page:`/pages/blog-comment/blog-comment?blogId=${event.blogId}`,//指定跳入哪个页面，
      data:{
        phrase6:{
          value:"评价完成"
        },
        thing2:{
          value:event.content
        }
      },
      miniprogramState: 'developer'
    })
  }catch(err){
    console.log(err)
  }
}