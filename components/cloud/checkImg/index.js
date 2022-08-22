// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
      let imageR = false;
      //  检查图像内容是否违规
      if (event.img) {
          imageR = await cloud.openapi.security.imgSecCheck({
              media: {
                  header: {
                      'Content-Type': 'application/octet-stream'
                  },
                  contentType: 'image/jpg',
                  value: Buffer.from(event.img) // 官方文档这里是个坑
              }
          });
      };
      return {
          //msgR,
          imageR,
          //"lalal":123456789,
      };
  } catch (e) {
      return e
  }
};