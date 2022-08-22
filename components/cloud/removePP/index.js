// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const DBPP = cloud.database().collection("PPLL")
const _ = cloud.database().command
// 云函数入口函数
exports.main = async (event, context) => {
  let PersonId1 = event.PersonId;
  console.log("//////////////////")
  console.log(PersonId1)
  return await DBPP.where({
    PostId:_.eq(PersonId1)
  })
  .remove()

}