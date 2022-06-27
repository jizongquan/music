// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()


// const rp = require('request-promise')
const axios = require('axios')

const URL = 'https://apis.imooc.com/personalized?icode=E846F4AE559FAF1D'

const playlistCollection = db.collection('playlist')
//云函数在小程序中最大能取出100条
const MAX_LIMIT = 10
// 云函数入口函数
exports.main = async (event, context) => {
    // 先读取数据库的信息 db.collection('playlist').get() 取到当前playlist集合里面所有的数据
    // 但是对于云函数来说取数据是有一定的限制的，在小程序中最多获取20条
    // const list = await playlistCollection.get()
    //db.collection('playlist').count() 获取playlist集合的总条数 获取到的是一个对象
    const countResult = await playlistCollection.count()
    const total = countResult.total
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    const tasks = []
    for(let i = 0;i <batchTimes; i++){
      // skip()方法从当前第几条开始
      let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    let list = {
      data:[]
    }
    if(tasks.length > 0){
      list = (await Promise.all(tasks)).reduce((acc,cur) => {
        // acc是之前的值 cur是当前的值
        return {
          data:acc.data.concat(cur.data)
        }
      })
    }
    // 云数据库插入只能单条插入
    // const plRes = await axios.get(URL)
    const {data} = await axios.get(URL)
    if(data.code >= 1000){
      console.log(data.msg)
      return 0
    }
    const playlist = data.result
    const newData = []
    for(let i=0,len1=playlist.length;i<len1;i++){
        let flag = true;
        for(let j = 0,len2=list.data.length;j<len2;j++){
          if(playlist[i].id === list.data[j].id){
            flag = false
            break
          }
        }
        if(flag){
          // 更新代码: 给每个歌单信息增加createTime属性
          let pl = playlist[i]
          pl.createTime = db.serverDate()
          // newData.push(playlist[i])
          newData.push(pl)
        }
    }

    if(newData.length >0){
      await playlistCollection.add({
        // 一次批量插入多条数据
        data:newData
      }).then((res)=>{
        console.log('插入成功')
      }).catch((err)=>{
        console.log('插入失败')
      })
    }
    return newData.length
}