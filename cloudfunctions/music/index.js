// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const axios = require('axios')
const Base_URL = 'https://apis.imooc.com'
const ICODE = 'icode=E846F4AE559FAF1D'
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})
  app.router('playlist',async(ctx,next)=>{
    ctx.body = await cloud.database().collection('playlist')
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime','desc')
    .get()
    .then((res)=>{
      return res
    })
  })

  app.router('musiclist',async(ctx,next)=>{
    const res = await axios.get(`${Base_URL}/playlist/detail?id=${parseInt(event.playlistId)}&${ICODE}`)
    ctx.body = res.data
  })

  app.router('musicUrl',async(ctx,next)=>{
    const res = await axios.get(`${Base_URL}/song/url?id=${event.musicId}&${ICODE}`)
    ctx.body = res.data
  })

  app.router('lyric',async(ctx,next)=>{
    const res = await axios.get(`${Base_URL}/lyric?id=${event.musicId}&${ICODE}`)
    ctx.body = res.data
  })

  return app.serve()
}