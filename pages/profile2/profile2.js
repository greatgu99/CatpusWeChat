// pages/profile2/profile2.js
let appInstance = getApp();
const util = require('../../utils/util.js')
// const DB = wx.cloud.database().collection("User")
// const _ = wx.cloud.database().command
let PersonId;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    url_to: "",
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: "123123123",
      success: (res) => {
        appInstance.globalData.userInfo = res.userInfo;
        wx.login({
          success: (res) => {
            console.log(res.code);
            wx.request({
              url: appInstance.globalData.URL + "/Catpus/user/",
              method: "GET",
              data: {
                action: "getOpenid",
                code: res.code,
              },
              success: (res) => {
                console.log(res.data.openid);
                PersonId = res.data.openid;
                console.log(res);
                console.log(PersonId); //res就将appid和openid返回了

                let ret = { personid: PersonId };
                appInstance.globalData.userInfo = Object.assign(
                  { personid: PersonId },
                  appInstance.globalData.userInfo
                );
                console.log(appInstance.globalData.userInfo);
                ret = appInstance.globalData.userInfo;
                ret = util.dataAddHash(ret)
                wx.request({
                  url: appInstance.globalData.URL + "/Catpus/user/",
                  method: "POST",
                  data: {
                    action: "login",
                    data: ret,
                  },
                  success: (res) => {
                    console.log("!!!!!!!!");
                    console.log(res);
                    //------------------------------------------
                    //跳转
                    wx.reLaunch({
                      url: this.data.url_to,
                    });
                  },
                });
              },
            });
          },
        });

        // wx.cloud.callFunction({
        //   name:'getOpenId',
        //   data:{
        //     message:'getOpenId',
        //   }
        // }).then(res=>{
        //   PersonId = res.result.OPENID
        //   console.log(res)
        //   console.log(PersonId)//res就将appid和openid返回了

        //   let ret={personid:PersonId}
        //   appInstance.globalData.userInfo=Object.assign({personid:PersonId},appInstance.globalData.userInfo)
        //   console.log(appInstance.globalData.userInfo)
        //   ret = appInstance.globalData.userInfo
        //   wx.request({
        //     url: appInstance.globalData.URL+'/Catpus/user/',
        //     method:"POST",
        //     data:{
        //       action:'login',
        //       data:ret
        //     },
        //     success:res=>{
        //       console.log("!!!!!!!!")
        //       console.log(res)
        //       //------------------------------------------
        //       //跳转
        //       // wx.reLaunch({
        //       //   url: this.data.url_to,
        //       // })
        //     }
        //   })
        //     //做一些后续操作，不用考虑代码的异步执行问题。
        // })
      },
      fail: (res) => {
        wx.navigateBack({
          delta: 1,
        });
      },
    });
  },
  testlogin(e) {
    console.log(e);
    console.log("testlogin");
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: appInstance.globalData.URL + "/test/",
            data: {
              text: "🌿🌿🌿🙋😙🤣🤪",
            },
            method: "GET",
            success: (res) => {
              console.log("success", res);
            },
            fail: (res) => {
              console.log(res);
            },
          });
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.to = options.to.replace("%3F", "?");
    options.to = options.to.replace("%3D", "=");

    console.log(options);
    this.setData({
      url_to: options.to,
    });
    console.log(options.to);
    if (appInstance.globalData.userInfo != null) {
      wx.reLaunch({
        url: "/pages/profile/profile",
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
