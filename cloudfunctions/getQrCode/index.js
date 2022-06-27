// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const result = await cloud.openapi.wxacode.getUnlimited({
    scene: wxContext.OPENID,
    //  page:"pages/blog/blog" //只有发布后才能生效
    // lineColor: {
    //   'r': 211,
    //   'g': 60,
    //   'b': 57
    // },//设置颜色
    // isHyaline: true //设置背景是否透明
  })
  console.log(result)
  //定义云存储cloud.uploadFile
  const upload = await cloud.uploadFile({
    cloudPath: 'qrcode/' + Date.now() + '-' + Math.random() + '.png',
    fileContent: result.buffer
  })
  return upload.fileID
}