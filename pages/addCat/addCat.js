// pages/addCat/addCat.js
const DB = wx.cloud.database().collection("Cat")
let appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HasPic: false,
    tempFilePaths: "",

    catname:"",
    CatPicUrl:"",
    catcolor:-1,
    catlocation:'十宿',
    ShowWarning1:false,
    ShowWarning2:false,
    ShowWarning3:false,
    ShowWarning4:false,
    ShowWarning5:false,

    checkedColor:'',

    shows: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectDatas: ['十宿', '一宿', '凉亭','一食堂门口','中主','一教','四宿','校门','三教','其他'], //下拉列表的数据
    indexs: 0, //选择的下拉列 表下标,

    items:[
      { name: '白', checked: 0, src:'../../images/catColor/white.png',selected_src:'../../images/catColor/_white.png',color:0},
      { name: '狸花', checked: 0,src:'../../images/catColor/huablack.png',selected_src:'../../images/catColor/_huablack.png',color:1},
      { name: '黑白', checked: 0,src:'../../images/catColor/blackwhite.png',selected_src:'../../images/catColor/_blackwhite.png',color:2},
      { name: '狸花加白', checked: 0,src:'../../images/catColor/sanblack.png',selected_src:'../../images/catColor/_sanblack.png',color:3},
      { name: '三花', checked:0, src:'../../images/catColor/YBW.png', selected_src:'../../images/catColor/_YBW.png',color:4},
      

      { name: '黑', checked: 0, src:'../../images/catColor/black.png',selected_src:'../../images/catColor/_black.png',color:5},
      { name: '虎皮橘', checked:0, src:'../../images/catColor/huayellow.png', selected_src:'../../images/catColor/_huayellow.png',color:6},
      { name: '橘白', checked:0, src:'../../images/catColor/YW.png', selected_src:'../../images/catColor/_YW.png',color:7},
      { name: '虎皮橘加白', checked: 0,src:'../../images/catColor/YOW.png',selected_src:'../../images/catColor/_YOW.png',color:8},
      { name: '空白', checked: 0,src:"",selected_src:"",color:9},//加个空白

      { name: '橘', checked: 0,src:'../../images/catColor/yellow.png',selected_src:'../../images/catColor/_yellow.png',color:10},
      { name: '空白', checked: 0,src:"",selected_src:"",color:11},//加个空白

      { name: '橘黑', checked: 0,src:'../../images/catColor/blackyellow.png', selected_src:'../../images/catColor/_blackyellow.png',color:12},

      
      
      
    ],
  },

  ChooseImage(){
    console.log("6666666666666666")
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        

        //this.check(res.tempFilePaths).then(()=>{
          this.setData({
            tempFilePaths:res.tempFilePaths[0],
            HasPic:true,
            showWarning1:false,
            showWarning5:false,
          })
        // }).catch(()=>{
        //   this.setData({
        //     showWarning1:false,
        //     showWarning5:true,
        //   })
        // })  
      }
    })
  },
  
  addName(event) {
    console.log(event.detail.value)
    this.setData({
      catname:event.detail.value,
    })
  },
  // 点击下拉显示框
  selectTaps() {
    this.setData({
      shows: !this.data.shows,
    });
  },
  // 点击下拉列表
  optionTaps(e) {
    let Indexs = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    console.log(Indexs)
    let Catlocation = this.data.selectDatas[2]
    // console.log(this.showWarning1)
    // console.log(selectDatas)
    // console.log(this.data.selectDatas[2])
    this.setData({
      indexs: Indexs,
      shows: !this.data.shows,
      catlocation:Catlocation
    });
  },
  // 处理猫毛色的点击事件
  imageclick:function(e){
    var dataset = e.currentTarget.dataset;
    var dataid = dataset.id;            //index  (color) color属性即 color index
    console.log(dataid);  //comsole打印选中id
    if (dataid==9 || dataid==11) return ;
    console.log(this.data.items[dataid].name)
    this.setData({
      ShowWarning3:false,
      catcolor:this.data.items[dataid].name,
    })

    var items = this.data.items; //items itself 之后用于改变

    //只有选中的checked是true
    for (var i = 0; i < items.length; i++) {
        items[i].checked = 0;  
    }
    items[dataid].checked = 1;
    
   //返回新状态的颜色数组
    this.setData({
      items:items
    })
  },
  submit_cat(){
    console.log(this.data.selectDatas[this.data.indexs])
    if (!this.data.HasPic){
      this.setData({
        ShowWarning1:true,
      })
    }
    else{
      this.setData({
        ShowWarning1:false,
      })
    }
    if (this.data.catname==""){
      this.setData({
        ShowWarning2:true,
      })
    }
    else{
      this.setData({
        ShowWarning2:false,
      })
    }
    if (this.data.catcolor==-1){
      this.setData({
        ShowWarning3:true,
      })
    }
    else{
      this.setData({
        ShowWarning3:false,
      })
    }
    //this.check2(this.data.catname).then(()=>{
      this.setData({
        showWarning4:false,
      })
      if (this.data.ShowWarning1==false && this.data.ShowWarning2==false && this.data.ShowWarning3==false && this.data.ShowWarning5==false ){
        console.log("go_if")
        wx.uploadFile({
          filePath: this.data.tempFilePaths,
          name: 'file',
          url: appInstance.globalData.URL+'/Catpus/cat/addpic',
          success:(res)=>{
            console.log('res.data')
            res.data=JSON.parse(res.data)
            console.log(res.data.tmp_file)
            wx.request({
              url: appInstance.globalData.URL+'/Catpus/cat/',
              method:"POST",
              data:{
                action:'addcat',
                data:{
                  catlocation:this.data.catlocation,
                  catcolor:this.data.catcolor,
                  catname:this.data.catname,
                  catpic:res.data.tmp_file
                }
              },
              success:(res)=>{
                console.log(res.data.ret)
                // res.data=JSON.parse(res.data)
                if (res.data.ret==0){
                  wx.reLaunch({
                    url: '/pages/catalogue/catalogue',
                  })
                }

              }
            })
            console.log(this.data.catname)
            console.log(this.data.catcolor)
            console.log(this.data.catlocation)
          },
          fail:res=>{
            console.log("fail")
            console.log(res)
          }
        })
        // wx.showLoading({
        //   title: '上传中...',
        // })
        // wx.cloud.uploadFile({
        //   cloudPath:Date.now()+".jpg",
        //   filePath:this.data.tempFilePaths,
        // }).then(res=>{
        //   console.log(res)
        //   this.setData({
        //     CatPicUrl:res.fileID,
        //   })
        //   DB.add({
        //     data:{
        //       catname:this.data.catname,
        //       CatPicUrl:this.data.CatPicUrl,
        //       catcolor:this.data.items[this.data.catcolor].name,
        //       Catlike:0,
        //       Location:this.data.selectDatas[this.data.indexs],
        //     },
        //     success: (res)=>{
        //       console.log("添加成功", res);
        //       wx.reLaunch({
        //         url: '/pages/catalogue/catalogue',
        //       })
        //       wx.hideLoading()
        //     },
        //     fail: (res)=>{
        //       console.log("添加失败", res);
        //     }
        //   })
        // }) 
      }
    // }).catch(()=>{
    //   this.setData({
    //     ShowWarning4:true,
    //     ShowWarning2:false,
    //   })
    // })
    
  },
  check2(testinfo){
    // console.log(this.data.text_content)
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name:"checkStr",
        data:{
          inputText:testinfo
        },
        success:res=>{
          console.log("成功",res)
          resolve();
        },
        fail:res=>{
          console.log("失败",res)
          reject();
        }
      })
    })
  },
  /**
   * checkImg
   */
  check(tempFilePaths){
    
    let checkList = tempFilePaths;
    let imageList = this.imageList;
    let i = 0; // 用于递归计数
    //let path = checkList[0];
    let temp=tempFilePaths[0];
    console.log("调用处理敏感图片");
    console.log(temp);
    // let cloudCheck = (temp, origin) => {
    return new Promise((resolve,reject)=>{
      wx.getFileSystemManager().readFile({
        filePath: temp,
        success: buffer => {
          console.log("执行到buffer")
            wx.cloud.callFunction({
                name: 'checkImg', //云函数的名称
                data: {
                    img: buffer.data
                },
            }).then(res => {
                console.log(res);
                if (res.result.errCode == 87014) {

                  console.log("敏感图片嘿嘿嘿")
                  reject();
                    // 发现敏感照片后所做的处理
                // 下面的imageR是云函数中定义的返回值
                } else if (res.result.imageR.errCode == 0) {
                  console.log("不敏感图片吼吼吼")
                  resolve();
                    //imageList.push(origin); // 将检查通过的照片添加至imageList，以便其他方法调用
                }
            })
        },
        fail:res=>{
          console.log(res)
        }
      });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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