// pages/info/info.js
const db = wx.cloud.database({});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.init();
    this.getPhotoTweets();
  },

  onShow: function () {
    var that = this
    that.getPhotoTweets()
  },

  /**
   * 从云开发数据库中获取推文
   */
  getPhotoTweets: function () {
    var that = this
    db.collection('photoTweets').get({
      success(res) {
        that.setData({
          photoTweets: res.data.reverse(),  // 使最新推文在上面
        })
      }
    })
  },
  /**
   * 公众号推文跳转
   */
  toPhotoTweets: function (e) {
    var id = e.currentTarget.dataset.id;  // 获取点击的推文的数组下标
    var url = this.data.photoTweets[id].url;  // 通过id判断是哪个推文的链接
    //跳转并传参
    wx.navigateTo({
      url: '/pages/showTweets/showTweets?name=photoTweets&url=' + url,
    })
  },

})