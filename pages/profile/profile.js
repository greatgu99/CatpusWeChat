// pages/profile/profile.js
let appInstance = getApp();

const DB = wx.cloud.database().collection("Cat")
const DB2 = wx.cloud.database().collection("CatPost")
const DB3 = wx.cloud.database().collection("User")
const DBPP = wx.cloud.database().collection("PPLL")
const DBPC = wx.cloud.database().collection("PCLL")
const _ = wx.cloud.database().command

Page({


  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: true,
    catdata:[],
    Dyndata:[],
    UserId:"",
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc:"123123123",
      success: (res) => {
        
        appInstance.globalData.userInfo=res.userInfo;
        console.log(appInstance.globalData.userInfo);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
    
  },
  showDyn(){
    console.log(this.data.Dyndata)
  },
  navigateToMyLike(){
    console.log(this.data.UserId)
    wx.navigateTo({
      url: '/pages/myLike/myLike',
    })
  },
  delDyn(ind){
    let Dyndatat=this.data.Dyndata
    let id = ind.currentTarget.dataset.ind;
    console.log(Dyndatat[id].id)
    wx.request({
      url: appInstance.globalData.URL+'/Catpus/moments/',
      method:"POST",
      data:{
        action:'delmoments',
        data:{
          momentsid:Dyndatat[id].id,
        }
      },
      success:res=>{
        console.log(res)
        
        Dyndatat.splice(id,1);
        this.setData({
          Dyndata:Dyndatat
        })
      }
    })
    

    
    // let Dyndatat = this.data.Dyndata
    // console.log(id);
    // DB2.where({
    //   _id:_.eq(Dyndatat[id].PostId)
    // })
    // .remove({
    //   success:res=>{
    //     console.log(res);
    //     wx.cloud.callFunction({
    //       name:"removePP",
    //       data:{
    //         PostId:Dyndatat[id].PostId
    //       }
    //     })
    //     .then(res=>{
    //       console.log(res)
    //       Dyndatat.splice(id,1);
        
    //       this.setData({
    //         Dyndata:Dyndatat
    //       })
    //     })

        
    //   }
    // })
  },
  LikeDyn(ind){
    let id = ind.currentTarget.dataset.ind;
    console.log(id);
    let Dyndatat = this.data.Dyndata
    
    if (Dyndatat[id].iflike == false){
      Dyndatat[id].iflike = true
      Dyndatat[id].like = Dyndatat[id].like +1
      wx.request({
        url: appInstance.globalData.URL+'/Catpus/likes/',
        method:"POST",
        data:{
          action:'likemoments',
          data:{
            momentsid:Dyndatat[id].id,
            personid:appInstance.globalData.userInfo.personid
          }
        }
      })
    }
    else{
      Dyndatat[id].iflike = false
      Dyndatat[id].like = Dyndatat[id].like -1
      wx.request({
        url: appInstance.globalData.URL+'/Catpus/likes/',
        method:"DELETE",
        data:{
          action:'unlikemoments',
          data:{
            momentsid:Dyndatat[id].id,
            personid:appInstance.globalData.userInfo.personid
          }
        }
      })
    }
    this.setData({
      Dyndata:Dyndatat
    })




    // let id = ind.currentTarget.dataset.ind;
    // console.log(id);
    // let Dyndatat = this.data.Dyndata
    // let PersonId = this.data.UserId
    // if (Dyndatat[id].PostLike==true){
    //   Dyndatat[id].PostLike=false
    //   Dyndatat[id].DynlikeUser=Dyndatat[id].DynlikeUser-1
    //   DBPP.where({
    //     PersonId:_.eq(PersonId),
    //     PostId:_.eq(Dyndatat[id].DynId),
    //   }).remove({
    //     success:res=>{
    //       console.log(res)
    //     }
    //   })
    //   DB2.where({
    //     _id:_.eq(Dyndatat[id].DynId)
    //   })
    //   .update({
    //     data:{
    //       LikeUser:_.inc(-1)
    //     },
    //   })

    // }
    // else{
    //   Dyndatat[id].PostLike=true
    //   Dyndatat[id].DynlikeUser=Dyndatat[id].DynlikeUser+1
    //   DBPP.add({
    //     data:{
    //       PersonId:PersonId,
    //       PostId:Dyndatat[id].DynId,
    //     }
    //   })
    //   DB2.where({
    //     _id:_.eq(Dyndatat[id].DynId)
    //   })
    //   .update({
    //     data:{
    //       LikeUser:_.inc(1)
    //     },
    //   })
    // }
    // this.setData({
    //   Dyndata:Dyndatat
    // })
    
  },
  LikeCat(ind){   
    let id = ind.currentTarget.dataset.ind;
    console.log(id);
    let Dyndatat = this.data.Dyndata
    if (Dyndatat[id].cat.catlike == false){
      Dyndatat[id].cat.catlike = true
      wx.request({
        url: appInstance.globalData.URL+'/Catpus/likes/',
        method:"POST",
        data:{
          action:'likecat',
          data:{
            catid:Dyndatat[id].cat.id,
            personid:appInstance.globalData.userInfo.personid
          }
        }
      })
    }
    else{
      Dyndatat[id].cat.catlike = false
      wx.request({
        url: appInstance.globalData.URL+'/Catpus/likes/',
        method:"DELETE",
        data:{
          action:'unlikecat',
          data:{
            catid:Dyndatat[id].cat.id,
            personid:appInstance.globalData.userInfo.personid
          }
        }
      })
    }
    this.setData({
      Dyndata:Dyndatat
    })








    // let id = ind.currentTarget.dataset.ind;
    // console.log(id);
    // let Dyndatat = this.data.Dyndata
    // let PersonId = this.data.UserId
    // if (Dyndatat[id].CatLike == true){
    //   Dyndatat[id].CatLike = false
    //   Dyndatat[id].CatLikeUser = Dyndatat[id].CatLikeUser-1;
    //   for (let i = 0; i < Dyndatat.length; i++) {
    //     if (Dyndatat[i].CatId == Dyndatat[id].CatId){
    //       Dyndatat[i].CatLike = false
    //     }
    //   }
    //   DBPC.where({
    //     PersonId:_.eq(PersonId),
    //     CatId:_.eq(Dyndatat[id].CatId),
    //   }).remove()
    //   DB.where({
    //     _id:_.eq(Dyndatat[id].CatId)
    //   })
    //   .update({
    //     data:{
    //       Catlike:_.inc(-1)
    //     },
    //   })
    // }
    // else{
    //   Dyndatat[id].CatLike=true
    //   Dyndatat[id].CatLikeUser=Dyndatat[id].CatLikeUser+1;
    //   for (let i = 0; i < Dyndatat.length; i++) {
    //     if (Dyndatat[i].CatId == Dyndatat[id].CatId){
    //       Dyndatat[i].CatLike = true
    //     }
    //   }
    //   DBPC.add({
    //     data:{
    //       PersonId:PersonId,
    //       CatId:Dyndatat[id].CatId,
    //     },
    //   })
    //   DB.where({
    //     _id:_.eq(Dyndatat[id].CatId)
    //   })
    //   .update({
    //     data:{
    //       Catlike:_.inc(1)
    //     },
    //   })
    // }
    // console.log(Dyndatat[id].CatLike)
    // this.setData({
    //   Dyndata:Dyndatat
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tempDyn=[];
    if (appInstance.globalData.userInfo!=null) {
      console.log(appInstance.globalData.userInfo)
      this.setData({
        userInfo:appInstance.globalData.userInfo,
        hasUserInfo: true,
        UserId:appInstance.globalData.userInfo.personid
      })

      wx.request({
        url: appInstance.globalData.URL+'/Catpus/moments/',
        method:'POST',
        data:{
          action:'getmoments',
          data:{
            personid:appInstance.globalData.userInfo.personid,
          }
        },
        success:(res)=>{
          console.log(res.data.moments_list)
          if (appInstance.globalData.userInfo==null){
            for (let i =0;i<res.data.moments_list.length;i++){
              res.data.moments_list[i].iflike=false
              res.data.moments_list[i].cat.catlike=false;
            }
            this.setData({
              Dyndata:res.data.moments_list
            })
          } else {
            let promiseList1=[],promiseList2=[]
            for (let i =0;i<res.data.moments_list.length;i++){
              promiseList1.push(new Promise((resolve,reject)=> {
                wx.request({
                  url:appInstance.globalData.URL+'/Catpus/likes/',
                  method:'POST',
                  data:{
                    action:'getlikecat',
                    data:{
                      personid:res.data.moments_list[i].person.personid,
                      catid:res.data.moments_list[i].cat.id
                    }
                  },
                  success:(res)=>{
                    console.log(res.data)
                    resolve([i,res.data.catlike])
                  }
                })
              }))
              promiseList2.push(new Promise((resolve,reject)=> {
                wx.request({
                  url:appInstance.globalData.URL+'/Catpus/likes/',
                  method:'POST',
                  data:{
                    action:'getlikemoments',
                    data:{
                      personid:res.data.moments_list[i].person.personid,
                      momentsid:res.data.moments_list[i].id
                    }
                  },
                  success:(res)=>{
                    console.log(res.data)
                    resolve([i,res.data.momentslike])
                  }
                })
              }))
            }
            let a = Promise.all(promiseList1).then((rspList)=>{
              console.log(rspList)
              rspList.map((val)=>{
                res.data.moments_list[val[0]].cat.catlike=val[1]
              })
            })
            let b = Promise.all(promiseList2).then((rspList)=>{
              console.log(rspList)
              rspList.map((val)=>{
                res.data.moments_list[val[0]].iflike=val[1]
              })
            })
            Promise.all([a,b]).then(()=>{
              this.setData({
                Dyndata:res.data.moments_list
              })
            })
          }
        },
        fail:(res)=>{
          console.log(res)
        }
      })





      
      // wx.cloud.callFunction({
      //   name:'getOpenId',
      //   data:{
      //     message:'getOpenId',
      //   }
      // }).then(res=>{
      //   let PersonId1 = res.result.OPENID
      //   console.log(PersonId1)
      //   this.setData({
      //     UserId:PersonId1,
      //   })
      //   DB2.orderBy('CreatedTime','desc').where({
      //     PersonId:_.eq(PersonId1)
      //   })
      //   .get({
      //     success:res=>{
      //       let promiseList = [];
      //       for (let i=0;i<res.data.length;i++){
      //         promiseList.push(new Promise((resolve,reject)=> {
      //           let temp = new Object();
      //           temp.DynId=res.data[i]._id;
      //           temp.DynCont=res.data[i].Content;
      //           temp.DynPic=res.data[i].CatPicUrl;
      //           temp.DynlikeUser=res.data[i].LikeUser;
      //           temp.PersonId=res.data[i].PersonId;
      //           temp.CatId=res.data[i].CatId;
      //           temp.PostId=res.data[i]._id;
      //           console.log(temp)
      //           DB3.where({
      //             PersonId: _.eq(res.data[i].PersonId)
      //           })
      //           .get({
      //             success: res1 => {
      //               temp.PersonPic=res1.data[0].userInfo.avatarUrl
      //               temp.PersonName=res1.data[0].userInfo.nickName
      //               DB.where({
      //                 _id:_.eq(res.data[i].CatId)
      //               })
      //               .get({
      //                 success: res1 => {
      //                   console.log("!!!!!!!!!!!")
      //                   console.log(res1);
      //                   temp.CatColor=res1.data[0].CatColor;
      //                   temp.CatName=res1.data[0].CatName;
      //                   temp.CatPicUrl=res1.data[0].CatPicUrl;
      //                   temp.CatLikeUser=res1.data[0].Catlike
      //                   DBPP.where({
      //                     PersonId: _.eq(PersonId1),
      //                     PostId:_.eq(temp.PostId),
      //                   })
      //                   .get({
      //                     success:res=>{
      //                       if (res.data.length==0){
      //                         temp.PostLike=false;
      //                       }
      //                       else{
      //                         temp.PostLike=true;
      //                       }
      //                       DBPC.where({
      //                         PersonId: _.eq(PersonId1),
      //                         CatId:_.eq(temp.CatId),
      //                       })
      //                       .get({
      //                         success:res=>{
      //                           if (res.data.length==0){
      //                             temp.CatLike=false;
      //                           }
      //                           else{
      //                             temp.CatLike=true;
      //                           }
      //                           console.log(temp);
      //                           resolve([i,temp]);
      //                         }
      //                       })
      //                     }
      //                   })
      //                 }
      //               })
      //             }
      //           })
      //         }))
      //       }
      //       Promise.all(promiseList).then((rspList)=>{
      //         rspList.map((val)=>{
      //           console.log(val);
      //           tempDyn.push(val[1]);
      //         })
      //         console.log(tempDyn)
      //         this.setData({
      //           Dyndata:tempDyn,
      //         })
      //         console.log(this.data.Dyndata)
      //       })
      //     }
      //   })
      // })
    }
    else {
      wx.navigateTo({
        url: '/pages/profile2/profile2?to=/pages/profile/profile',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

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