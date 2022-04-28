// pages/catIndex/catIndex.js
const DB = wx.cloud.database().collection("Cat")
const DB2 = wx.cloud.database().collection("CatPost")
const DB3 = wx.cloud.database().collection("User")
const DBPP = wx.cloud.database().collection("PPLL")
const DBPC = wx.cloud.database().collection("PCLL")
const _ = wx.cloud.database().command

let appInstance = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    catid:'',
    Dyndata:[],
    catdata:{},
    UserId:"",
  },



  LikeCat(ind){
    if (appInstance.globalData.userInfo==null) {
      wx.navigateTo({
        url: '/pages/profile2/profile2?to=/pages/catIndex/catIndex%3Fcatid%3D' + this.data.catid,
      })
    } else{
      // let id = ind.currentTarget.dataset.ind;
      // console.log(id);
      let catdatat = this.data.catdata
      console.log(catdatat)
      if (catdatat.iflike == false){
        catdatat.iflike = true
        catdatat.catlike=catdatat.catlike+1
        wx.request({
          url: appInstance.globalData.URL+'/Catpus/likes/',
          method:"POST",
          data:{
            action:'likecat',
            data:{
              catid:catdatat.id,
              personid:appInstance.globalData.userInfo.personid
            }
          }
        })
      }
      else{
        catdatat.iflike = false
        catdatat.catlike=catdatat.catlike-1
        wx.request({
          url: appInstance.globalData.URL+'/Catpus/likes/',
          method:"DELETE",
          data:{
            action:'unlikecat',
            data:{
              catid:catdatat.id,
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

  LikeDyn(ind){
    console.log('77777777')
    if (appInstance.globalData.userInfo==null) {
      wx.navigateTo({
        url: '/pages/profile2/profile2?to=/pages/catIndex/catIndex%3Fcatid%3D' + this.data.catid,
      })
    } else{
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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.catid)
    let catid = options.catid
    this.setData({
      catid:catid,
    })
    // cat
    wx.request({
      url: appInstance.globalData.URL+'/Catpus/cat/?catid='+catid,
      method:'GET',
      data:{
        action:'getonecat'
      },
      success:(res)=>{
        let temp=res
        console.log(temp.data.cat)
        if (appInstance.globalData.userInfo==null) {
          res.data.cat.iflike=false
          this.setData({
            catdata:res.data.cat,
          })
        } else{
          wx.request({
            url:appInstance.globalData.URL+'/Catpus/likes/',
            method:"POST",
            data:{
              action:'getlikecat',
              data:{
                personid:appInstance.globalData.userInfo.personid,
                catid:catid
              }
            },
            success:(res)=>{
              console.log(res.data.catlike)
              temp.data.cat.iflike=res.data.catlike
              this.setData({
                catdata:temp.data.cat,
              })
            }
          })
        }
      }
    })
    wx.request({
      url: appInstance.globalData.URL+'/Catpus/moments/',
      method:'POST',
      data:{
        action:'getmoments',
        data:{
          catid:catid,
        }
      },
      success:(res)=>{
        console.log(res.data.moments_list)



        if (appInstance.globalData.userInfo==null){
          for (let i =0;i<res.data.moments_list.length;i++){
            res.data.moments_list[i].iflike=false
            // res.data.moments_list[i].cat.catlike=false;
          }
          this.setData({
            Dyndata:res.data.moments_list
          })
        } else {
          let promiseList=[]
          for (let i =0;i<res.data.moments_list.length;i++){

            promiseList.push(new Promise((resolve,reject)=> {
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
          Promise.all(promiseList).then((rspList)=>{
            console.log(rspList)
            rspList.map((val)=>{
              res.data.moments_list[val[0]].iflike=val[1]
            })
            this.setData({
              Dyndata:res.data.moments_list
            })
          })

        }
      }
    })
    // catdyn
    // let tempDyn=[];
    // let tempCat={};
    // DB.where({
    //   _id:_.eq(options.CatId)
    // })
    // .get({
    //   success:res=>{
    //     tempCat=res.data[0];
    //     console.log(tempCat)
    //     if (appInstance.globalData.userInfo==null) {
    //       tempCat.CatLike=false;
    //       this.setData({
    //         catdata:tempCat,
    //       })
    //     }else{
    //       console.log("@@@@@@@@@@@@@@@@@@@@")
    //       wx.cloud.callFunction({
    //         name:'getOpenId',
    //         data:{
    //           message:'getOpenId',
    //         }
    //       }).then(res=>{
    //         let PersonId1 = res.result.OPENID
    //         console.log(PersonId1)
    //         this.setData({
    //           UserId:PersonId1,
    //         })
    //         DBPC.where({
    //           PersonId: _.eq(PersonId1),
    //           CatId:_.eq(options.CatId),
    //         })
    //         .get({
    //           success:res=>{
    //             if (res.data.length==0){
    //               tempCat.CatLike=false;
    //             }
    //             else{
    //               tempCat.CatLike=true;
    //             }
    //             this.setData({
    //               catdata:tempCat,
    //             })
    //           }
    //         })
    //       })
    //     }
    //   }
    // })
    // DB2.orderBy('CreatedTime','desc').where({
    //   CatId:_.eq(options.CatId)
    // })
    // .get({
    //   success:res=>{
    //     console.log(res.data)
    //     console.log(res.data.length);
    //     let promiseList = [];
    //     for (let i=0;i<res.data.length;i++){
    //       promiseList.push(new Promise((resolve,reject)=> {
    //         let temp = new Object();
    //         console.log("##########");
    //         console.log(res.data[i]);
    //         temp.DynId=res.data[i]._id;
    //         temp.DynCont=res.data[i].Content;
    //         temp.DynPic=res.data[i].CatPicUrl;
    //         temp.DynlikeUser=res.data[i].LikeUser;
    //         temp.PersonId=res.data[i].PersonId;
    //         temp.CatId=res.data[i].CatId;
    //         temp.PostId=res.data[i]._id;
    //         console.log(temp)
    //         DB3.where({
    //           PersonId: _.eq(res.data[i].PersonId)
    //         })
    //         .get({
    //           success: res1 => {
    //             temp.PersonPic=res1.data[0].userInfo.avatarUrl
    //             temp.PersonName=res1.data[0].userInfo.nickName
    //             DB.where({
    //               _id:_.eq(res.data[i].CatId)
    //             })
    //             .get({
    //               success: res1 => {
    //                 console.log("!!!!!!!!!!!")
    //                 console.log(res1);
    //                 temp.CatColor=res1.data[0].CatColor;
    //                 temp.CatName=res1.data[0].CatName;
    //                 temp.CatPicUrl=res1.data[0].CatPicUrl;
    //                 temp.CatLikeUser=res1.data[0].Catlike;
    //                 temp.CatLocation=res1.data[0].Location;
    //                 if (appInstance.globalData.userInfo==null) {
    //                   console.log("^^^^^^^^^^^^^^^^^^^")
    //                   temp.PostLike=false;
    //                   temp.CatLike=false;
    //                   resolve([i,temp]);
    //                 }else{
    //                   console.log("@@@@@@@@@@@@@@@@@@@@")
    //                   wx.cloud.callFunction({
    //                     name:'getOpenId',
    //                     data:{
    //                       message:'getOpenId',
    //                     }
    //                   }).then(res=>{
    //                     let PersonId1 = res.result.OPENID
    //                     console.log(PersonId1)
    //                     this.setData({
    //                       UserId:PersonId1,
    //                     })
    //                     console.log("solveLikesolveLikesolveLike")
    //                     DBPP.where({
    //                       PersonId: _.eq(PersonId1),
    //                       PostId:_.eq(temp.PostId),
    //                     })
    //                     .get({
    //                       success:res=>{
    //                         console.log(res);
    //                         console.log("{{{{{{{{{{{{{{{{{{")
    //                         console.log(res.data.length);
    //                         if (res.data.length==0){
    //                           temp.PostLike=false;
    //                         }
    //                         else{
    //                           temp.PostLike=true;
    //                         }
    //                         DBPC.where({
    //                           PersonId: _.eq(PersonId1),
    //                           CatId:_.eq(temp.CatId),
    //                         })
    //                         .get({
    //                           success:res=>{
    //                             console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}")
    //                             console.log(res);
    //                             if (res.data.length==0){
    //                               temp.CatLike=false;
    //                             }
    //                             else{
    //                               temp.CatLike=true;
    //                             }
    //                             console.log(temp);
    //                             resolve([i,temp]);
    //                           }
    //                         })
    //                       }
    //                     })
    //                   })
    //                 }
    //               }
    //             })
    //           },
    //           fail: res1 => {
    //           }
    //         })
    //       }));
    //     }
    //     Promise.all(promiseList).then((rspList)=>{
    //       rspList.map((val)=>{
    //         console.log(val);
    //         tempDyn.push(val[1]);
    //       })
    //       console.log(tempDyn)
    //       this.setData({
    //         Dyndata:tempDyn,
    //       })
    //       console.log(this.data.Dyndata)
    //     })
    //   }
    // })
  },
  showDyn(){
    console.log(this.data.catdata);
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