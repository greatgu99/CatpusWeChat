// pages/catalogue/catalogue.js
// const DB = wx.cloud.database().collection("Cat")
// const DBPC = wx.cloud.database().collection("PCLL")
// const _ = wx.cloud.database().command

let appInstance = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserId:"",
    catdata:[],
  },
  LikeCat(ind){
    if (appInstance.globalData.userInfo==null) {
      wx.navigateTo({
        url: '/pages/profile2/profile2?to=/pages/index/index',
      })
    } else{
      let id = ind.currentTarget.dataset.ind;
      console.log(id);
      let catdatat = this.data.catdata

      let PersonId = this.data.UserId
      if (catdatat[id].catlike == false){
        catdatat[id].catlike = true
        let data = {
          catid:catdatat[id].id,
          personid:appInstance.globalData.userInfo.personid
        }
        data = util.dataAddHash(data)
        wx.request({
          url: appInstance.globalData.URL+'/Catpus/likes/',
          method:"POST",
          data:{
            action:'likecat',
            data
          }
        })
      }
      else{
        catdatat[id].catlike=false
        let data = {
          catid:catdatat[id].id,
          personid:appInstance.globalData.userInfo.personid
        }
        data = util.dataAddHash(data)
        wx.request({
          url: appInstance.globalData.URL+'/Catpus/likes/',
          method:"DELETE",
          data:{
            action:'unlikecat',
            data 
          }
        })
      }
      
      this.setData({
        catdata:catdatat
      })
    }
  },
  navigateToAddCat(){
    if (appInstance.globalData.userInfo==null) {
      wx.navigateTo({
        url: '/pages/profile2/profile2?to=/pages/addCat/addCat',
      })
    }else{
      wx.navigateTo({
        url: '/pages/addCat/addCat',
      })
    }
  },
  navigatorToCatIndex(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url:'/pages/catIndex/catIndex?catid='+e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    wx.request({
      // url: appInstance.globalData.URL+'/Catpus/cat?page=1',
      url: appInstance.globalData.URL+'/Catpus/cat/',
      method:"GET",
      data:{
        action:'getcat'
      },
      success:res=>{
        console.log(res.data.cat_list[2])
        let promiseList=[];
        console.log(appInstance.globalData.userInfo)
        for (let i=0;i<res.data.cat_list.length;i++){
          if (appInstance.globalData.userInfo==null) {
            res.data.cat_list[i].catlike=false;
          }
          else{
            console.log('else')
            promiseList.push(new Promise((resolve,reject)=> {
              let data = {
                personid:appInstance.globalData.userInfo.personid,
                catid:res.data.cat_list[i].id
              }
              data = util.dataAddHash(data)
              wx.request({
                url:appInstance.globalData.URL+'/Catpus/likes/',
                method:"POST",
                data:{
                  action:'getlikecat',
                  data
                },
                success:(res)=>{
                  console.log(res.data)
                  // res.data=JSON.parse(res.data)
                  resolve([i,res.data.catlike])
                }
              })
            }))
          }
        }
        console.log('010718010718')
        console.log(res.data)
        Promise.all(promiseList).then((rspList)=>{
          rspList.map((val)=>{
            // console.log(val)
            res.data.cat_list[val[0]].catlike=val[1];
          })
        }).then(()=>{
          this.setData({
            catdata:res.data.cat_list,
          })
        })
      }
    })
    // let promiseList = [];
    // DB.orderBy('Catlike','desc').get({
    //   success:res=>{
    //     console.log(res.data)
        
    //     for (let i=0;i<res.data.length;i++){
    //       if (appInstance.globalData.userInfo==null) {
    //         res.data[i].CatLike=false;
    //       }
    //       else{
    //         promiseList.push(new Promise((resolve,reject)=> {
    //           let val;
    //           wx.cloud.callFunction({
    //             name:'getOpenId',
    //             data:{
    //               message:'getOpenId',
    //             }
    //           }).then(res1=>{
    //             let PersonId1 = res1.result.OPENID
    //             console.log(PersonId1)
    //             this.setData({
    //               UserId:PersonId1,
    //             })
    //             DBPC.where({
    //               PersonId:PersonId1,
    //               CatId:res.data[i]._id,
    //             })
    //             .get({
    //               success:res=>{
    //                 if (res.data.length==0){
    //                   resolve([i,false]);
    //                 }
    //                 else{
    //                   resolve([i,true]);
    //                 }
    //               }
    //             })
                
    //           });
              
              
    //         }));
    //       }
    //     }
    //     Promise.all(promiseList).then((rspList)=>{
    //       rspList.map((val)=>{
    //         res.data[val[0]].CatLike=val[1];
    //       })
    //       this.setData({
    //         catdata:res.data,
    //       })
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {

  // },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})