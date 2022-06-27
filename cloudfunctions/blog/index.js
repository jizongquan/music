// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const TcbRouter = require('tcb-router')
const db = cloud.database()
const blogCollection = db.collection('blog')
const MAX_LIMT = 100


// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
      event
  })

  app.router('list',async (ctx,next)=>{
    const keyword = event.keyword
    let w = {}
    if(keyword.trim() != ''){
      w = {
        //db.RegEx({regexp:后面是规则，前面固定写法}) 是小程序中提供的 正则表达式和数据库关联写法
        content: new db.RegExp({
          regexp:keyword,
          options:'i' //options 是小程序中国呢正则表达式的规则，i表示忽略大小写
        })
      }
    }
    // orderBy排序
    let blogList = await blogCollection.where(w).skip(event.start).limit(event.count)
    .orderBy('createTime','desc').get().then((res)=>{
      return res.data
    })
    ctx.body = blogList
  })
  app.router('detail',async(ctx,next) =>{
      const blogId = event.blogId
      //详情查询
      let detail = await blogCollection.where({
        _id:blogId
      }).get().then((res)=>{
        return res.data
      })
      //评论查询
      const countResult =await blogCollection.count() //得到总数，返回的一个对象
      const total = countResult.total
      let commentList = {
          data:[]
      }
      if(total > 0){
        //计算出几次查询完
        const batchTimes = Math.ceil(total/ MAX_LIMT)
        const tasks = []
        for(let i = 0;i<batchTimes;i++){
          let promise = db.collection('blog-comment').skip(i * MAX_LIMT)
          .limit(MAX_LIMT).where({
            blogId
          }).orderBy('createTime','desc').get()
          tasks.push(promise)
        }
        if(tasks.length >0){
        commentList = (await Promise.all(tasks)).reduce((acc,cur)=>{
           return {
             data: acc.data.concat(cur.data)
           }
         })
        }
      }
      ctx.body = {
        commentList,
        detail
      }
  })
  
  const wxContext = cloud.getWXContext()
  app.router('getListByOpenId',async(ctx,next)=>{
     ctx.body = await blogCollection.where({
       _openid:wxContext.OPENID
     }).skip(event.start).limit(event.count).orderBy('createTime','desc').get()
     .then((res)=>{
        return res.data
     })
  })
  return app.serve()
}