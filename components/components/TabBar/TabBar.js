// components/TabBar/TabBar.js
let appInstance = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    page_num:{
      type: Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    JumpIndex(){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    JumpCatalogue(){
      // console.log(this.data.page_num)
      wx.reLaunch({
        url: '/pages/catalogue/catalogue',
      })
    },
    JumpAddPost(){
      if (appInstance.globalData.userInfo!=null) {
        wx.reLaunch({
          url: '/pages/addPost/addPost',
        })
      }else{
        wx.navigateTo({
          url: '/pages/profile2/profile2?to=/pages/addPost/addPost',
        })
      }
    },
    JumpInfo(){
      wx.reLaunch({
        url: '/pages/info/info',
      })
    },
    JumpProfile2(){
      if (appInstance.globalData.userInfo!=null) {
        wx.reLaunch({
          url: '/pages/profile/profile',
        })
      }else{
        wx.navigateTo({
          url: '/pages/profile2/profile2?to=/pages/profile/profile',
        })
      }
    }
  }
})
