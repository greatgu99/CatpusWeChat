// pages/myLike/myLike.js

const DB = wx.cloud.database().collection("Cat")
const DBPC = wx.cloud.database().collection("PCLL")
const _ = wx.cloud.database().command

let appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserId:"",
    catdata:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  showCat(){
    console.log(this.data.catdata)
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
      console.log(catdatat[id].id)
      let PersonId = this.data.UserId
      if (catdatat[id].catlike == false){
        catdatat[id].catlike = true
        wx.request({
          url: 'http://127.0.0.1:8080/Catpus/likes/',
          method:"POST",
          data:{
            action:'likecat',
            data:{
              catid:catdatat[id].id,
              personid:appInstance.globalData.userInfo.personid
            }
          }
        })
      }
      else{
        catdatat[id].catlike=false
        wx.request({
          url: 'http://127.0.0.1:8080/Catpus/likes/',
          method:"DELETE",
          data:{
            action:'unlikecat',
            data:{
              catid:catdatat[id].id,
              personid:appInstance.globalData.userInfo.personid
            }
          }
        })
      }
      this.setData({
        catdata:catdatat
      })
    }
  },
  navigatorToCatIndex(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url:'/pages/catIndex/catIndex?catid='+e.currentTarget.dataset.id,
    })
  },
  onShow: function () {
    wx.request({
      // url: 'http://127.0.0.1:8080/Catpus/cat/?page=1',
      url: 'http://127.0.0.1:8080/Catpus/cat/?personid='+appInstance.globalData.userInfo.personid,
      method:"GET",
      data:{
        action:'getmylikecat',
      },
      success:res=>{
        console.log(res.data.cat_list)
        let promiseList=[];
        console.log(appInstance.globalData.userInfo)
        for (let i=0;i<res.data.cat_list.length;i++){
          promiseList.push(new Promise((resolve,reject)=> {
            wx.request({
              url:'http://127.0.0.1:8080/Catpus/likes/',
              method:"POST",
              data:{
                action:'getlikecat',
                data:{
                  personid:appInstance.globalData.userInfo.personid,
                  catid:res.data.cat_list[i].id
                }
              },
              success:(res)=>{
                console.log(res.data)
                resolve([i,res.data.catlike])
              }
            })
          }))
        }
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







    // let catdatat = [];
    // let promiseList=[];
    // DBPC.where({
    //   PersonId:_.eq(PersonId1)
    // })
    // .get({
    //   success:res=>{
    //     console.log(res.data)
        
    //     for (let i=0;i<res.data.length;i++){
    //       promiseList.push(new Promise((resolve,reject)=> {
    //         DB.where({
    //           _id:_.eq(res.data[i].CatId),
    //         })
    //         .get({
    //           success:res=>{
    //             console.log(res);
    //             res.data[0].CatLike=true;
    //             resolve(res.data[0])
    //           }
    //         })
    //       }))
    //     }
    //     Promise.all(promiseList).then((rspList)=>{
    //       rspList.map((val)=>{
    //         catdatat.push(val)
    //       })
    //       this.setData({
    //         catdata:catdatat,
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
  // onLoad: function () {

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