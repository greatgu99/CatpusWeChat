// pages/addPost/addPost.js
// const DB = wx.cloud.database().collection("Cat");
// const DB2 = wx.cloud.database().collection("CatPost");
let appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text_length: 0,
    text_content: "",
    HasPic: false,
    tempFilePaths: "",
    CatPicUrl: "",
    HasCat: false,
    CatNum: -1,
    CatData: {},

    userInfo: {},

    ShowWarning1: false,
    ShowWarning2: false,
    ShowWarning3: false,
    ShowWarning4: false,
    ShowWarning5: false,
  },
  bindText: function (e) {
    var t_text = e.detail.value.length;
    var text = e.detail.value;
    // console.log(t_text)
    this.setData({
      text_length: t_text,
      text_content: text,
    });
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log("777");
        // wx.showLoading({
        //   title: '图片审核中。。。',
        // })
        // this.check(res.tempFilePaths).then(()=>{
        this.setData({
          tempFilePaths: res.tempFilePaths[0],
          ShowWarning2: false,
          HasPic: true,
          ShowWarning5: false,
        });
        //   wx.hideLoading({})
        // }).catch(()=>{
        //   this.setData({
        //     ShowWarning2:false,
        //     ShowWarning5:true,
        //   })
        //   wx.hideLoading({})
        // })
      },
      fail: (res) => {
        console.log(res);
      },
    });
  },
  showLoading(message) {
    if (wx.showLoading) {
      // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
      wx.showLoading({ title: message, mask: true });
    } else {
      // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
      wx.showToast({
        title: message,
        icon: "loading",
        mask: true,
        duration: 20000,
      });
    }
  },
  
  hideLoading() {
    console.log('调用hideLoading')
    if (wx.hideLoading) {
      // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
      wx.hideLoading();
    } else {
      wx.hideToast();
    }
  },
  
  subPost() {
    console.log(this.data.userInfo);
    console.log("!!!!!!!!!!!!");
    console.log(appInstance.globalData.userInfo);
    console.log("!!!!!!!!!!!!");
    if (this.data.text_length == 0) {
      this.setData({
        ShowWarning1: true,
      });
    } else {
      this.setData({
        ShowWarning1: false,
      });
    }
    if (this.data.HasPic == false) {
      this.setData({
        ShowWarning2: true,
      });
    } else {
      this.setData({
        ShowWarning2: false,
      });
    }

    if (this.data.HasCat) {
      this.setData({
        ShowWarning3: false,
      });
    } else {
      this.setData({
        ShowWarning3: true,
      });
    }
    // 到时候取消掉
    // this.check2(this.data.text_content).then(()=>{
    // this.setData({
    //   ShowWarning4:false,
    // })
    if (
      this.data.ShowWarning1 == false &&
      this.data.ShowWarning2 == false &&
      this.data.ShowWarning3 == false
    ) {
      this.showLoading("上传中...")
      wx.uploadFile({
        filePath: this.data.tempFilePaths,
        name: "file",
        url: appInstance.globalData.URL + "/Catpus/cat/addpic",
        success: (res) => {
          console.log("res.data");
          res.data = JSON.parse(res.data);
          if (res.data.ret == 87014) {
            this.setData({
              ShowWarning5: true,
              ShowWarning2: false,
            });
            this.hideLoading()
            return;
          }
          console.log(res.data.tmp_file);
          wx.request({
            url: appInstance.globalData.URL + "/Catpus/moments/",
            method: "POST",
            data: {
              action: "addmoments",
              data: {
                personid: appInstance.globalData.userInfo.personid,
                catid: this.data.CatData.id,
                content: this.data.text_content,
                pic: res.data.tmp_file,
              },
            },
            success: (res) => {
              console.log(res);
              if (res.data.ret == 87014) {
                this.setData({
                  ShowWarning4: true,
                  ShowWarning1: false,
                });
                this.hideLoading()
                return;
              }
              wx.reLaunch({
                url: "/pages/index/index",
              });
            },
          });
        },
      });
      // wx.cloud.uploadFile({
      //   cloudPath:Date.now()+".jpg",
      //   filePath:this.data.tempFilePaths,
      // }).then(res=>{
      //   console.log(res)
      //   this.setData({
      //     CatPicUrl:res.fileID,
      //   })
      //   wx.cloud.callFunction({
      //     name:'getOpenId',
      //     data:{
      //       message:'getOpenId',
      //     }
      //   }).then(res=>{
      //     console.log(res.result.OPENID)//res就将appid和openid返回了
      //       //做一些后续操作，不用考虑代码的异步执行问题。
      //     DB2.add({
      //       data:{
      //         PersonId:res.result.OPENID,
      //         CatId:this.data.CatNum,
      //         CatPicUrl:this.data.CatPicUrl,
      //         LikeUser:0,
      //         Content:this.data.text_content,
      //         CreatedTime:Date.now(),
      //       },
      //       success: (res)=>{
      //         console.log("添加成功", res);
      //         wx.reLaunch({
      //           url: '/pages/index/index',
      //         })
      //       },
      //       fail: (res)=>{
      //         console.log("添加失败", res);
      //       }
      //     })

      //   })

      // })
      // // wx.hideLoading()
    }
    // }).catch(()=>{
    //   if (this.data.text_content!=''){
    //     this.setData({
    //       ShowWarning1:false,
    //       ShowWarning4:true,
    //     })
    //   }
    // })
  },
  chooseCat() {
    console.log("123123");
    wx.navigateTo({
      url: "/pages/chooseCat/chooseCat",
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: (data) => {
          console.log(data.data);
          wx.request({
            url: appInstance.globalData.URL + "/Catpus/cat/?catid=" + data.data,
            method: "GET",
            data: {
              action: "getonecat",
            },
            success: (res) => {
              console.log(res.data.cat);
              this.setData({
                CatData: res.data.cat,
                HasCat: true,
              });
            },
          });
        },
      },
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        //res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      },
    });
  },
  /**
   * checkMsg
   */
  // check2(testinfo){
  //   // console.log(this.data.text_content)
  //   return new Promise((resolve,reject)=>{
  //     wx.cloud.callFunction({
  //       name:"checkStr",
  //       data:{
  //         inputText:testinfo
  //       },
  //       success:res=>{
  //         console.log("成功",res)
  //         resolve();
  //       },
  //       fail:res=>{
  //         console.log("失败",res)
  //         reject();
  //       }
  //     })
  //   })
  // },

  /**
   * checkImg
   */
  // check(tempFilePaths){

  //   let checkList = tempFilePaths;
  //   let imageList = this.imageList;
  //   let i = 0; // 用于递归计数
  //   //let path = checkList[0];
  //   let temp=tempFilePaths[0];
  //   console.log("调用处理敏感图片");
  //   console.log(temp);
  //   // let cloudCheck = (temp, origin) => {
  //   return new Promise((resolve,reject)=>{
  //     wx.getFileSystemManager().readFile({
  //       filePath: temp,
  //       success: buffer => {
  //         //wx.hideLoading({})
  //         console.log("执行到buffer")
  //           wx.cloud.callFunction({
  //               name: 'checkImg', //云函数的名称
  //               data: {
  //                   img: buffer.data
  //               },
  //           }).then(res => {
  //             console.log(res);
  //             wx.hideLoading({})
  //             if (res.result.errCode == 87014) {
  //               console.log("敏感图片嘿嘿嘿")
  //               reject();
  //                 // 发现敏感照片后所做的处理
  //             // 下面的imageR是云函数中定义的返回值
  //             } else if (res.result.imageR.errCode == 0) {
  //               console.log("不敏感图片吼吼吼")
  //               resolve();
  //                 //imageList.push(origin); // 将检查通过的照片添加至imageList，以便其他方法调用
  //             }
  //           }).catch(res=>{
  //             alert(res);
  //             wx.hideLoading({})
  //           })
  //       },
  //       fail:res=>{
  //         console.log(res)
  //       }
  //     });
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (appInstance.globalData.userInfo != null) {
      this.setData({
        userInfo: appInstance.globalData.userInfo,
      });
    } else {
      wx.navigateTo({
        url: "/pages/profile2/profile2?to=/pages/addPost/addPost",
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
