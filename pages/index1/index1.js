// index.js
// const DB = wx.cloud.database().collection("Cat")
// const DB2 = wx.cloud.database().collection("CatPost")
// const DB3 = wx.cloud.database().collection("User")
// const DBPP = wx.cloud.database().collection("PPLL")
// const DBPC = wx.cloud.database().collection("PCLL")
// const _ = wx.cloud.database().command

let appInstance = getApp();

Page({
  data: {

    catdata:[],
    Dyndata:[],
    UserId:"",
  },
  // getopenid(){
  //   wx.cloud.callFunction({
  //     name:'getOpenId',
  //     data:{
  //       message:'getOpenId',
  //     }
  //   }).then(res=>{
  //     console.log(res.result.OPENID)//res就将appid和openid返回了
  //       //做一些后续操作，不用考虑代码的异步执行问题。
  //   })
  // },
  navigateToRankList(){
    wx.navigateTo({
      url: '/pages/rank/rank',
    })
  },

  navigateToSquare(){
    wx.navigateTo(
      {
        url:'/pages/index1/index1',
      }
    )
  },
  navigateToMyLike(){
    wx.navigateTo({
      url: '/pages/index2/index2',
    })
  },
  
  LikeCat(ind){
    if (appInstance.globalData.userInfo==null) {
      wx.navigateTo({
        url: '/pages/profile2/profile2?to=/pages/index/index',
      })
    } else{
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
    }
  },
  LikeDyn(ind){
    console.log('77777777')
    if (appInstance.globalData.userInfo==null) {
      wx.navigateTo({
        url: '/pages/profile2/profile2?to=/pages/index/index',
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
  onShow() {
    let tempDyn=[];
    wx.request({
      url: appInstance.globalData.URL+'/Catpus/cat/',
      method:'GET',
      data:{
        action:'getcat'
      },
      success:(res)=>{
        console.log(res.data.cat_list)
        this.setData({
          catdata:res.data.cat_list
        })
      }
    })
    wx.request({
      url: appInstance.globalData.URL+'/Catpus/moments/',
      method:'GET',
      data:{
        action:'getmoments'
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
    // DB2.orderBy('CreatedTime','desc').get({
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
    //             console.log(243243)
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
    //                 temp.CatLikeUser=res1.data[0].Catlike
    //                 // console.log("solveLikesolveLikesolveLike");
    //                 // let that=this;
    //                 // new Promise(function(res1,rej){
    //                 //   temp = that.solveLike(temp);
    //                 //   res1();
    //                 // }).then(()=>{
    //                 //   
    //                 //   console.log(temp)
    //                 // })



    //                 if (appInstance.globalData.userInfo==null) {
    //                   console.log("!@#$%^&*(@#$%^&*(#$%^&*")
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
    //                           success:(res)=>{
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
    //                           },
    //                           fail:(res)=>{
    //                             console.log(res)
    //                           }
    //                         })
    //                       },
    //                       fail:(res)=>{
    //                         console.log(res)

    //                       }
    //                     })
    //                   })
    //                 }






    //                 // temp = this.solveLike(temp);
    //                 // resolve([i,temp]);
                    
    //                 console.log(temp)
    //                 // console.log("solveLikesolveLikesolveLike")
                    
                    
    //               },
    //               fail:(res)=>{
    //                 console.log(res)
    //                 console.log('failfail')
    //               }
    //             })
                
    //           },
    //           fail: res1 => {
    //           }
    //         })
            
    //       }));
    //     }
    //     console.log(promiseList)
    //     Promise.all(promiseList).then((rspList)=>{
    //       console.log(rspList)
    //       rspList.map((val)=>{
    //         tempDyn.push(val[1]);
    //       })
    //       this.setData({
    //         Dyndata:tempDyn,
    //       })
    //     })

    //   }
      
    // })
  },
  showDyn(){
    console.log(this.data.Dyndata)
  },
  
  navigatorToCatIndex(e){
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    // console.log("进入")
    wx.navigateTo({
      url:'/pages/catIndex/catIndex?catid='+e.currentTarget.dataset.id,
    })
  }

})

