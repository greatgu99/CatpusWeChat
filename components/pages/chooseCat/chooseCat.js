// pages/chooseCat/choooseCat.js
// const DB = wx.cloud.database().collection("Cat")
let appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catdate:[],
  },
  returnCat(e){
    var id = e.currentTarget.dataset.id;
    id=this.data.catdate[id].id
    console.log(id);


    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', {data: id});



    wx.navigateBack({
      delta: 1,
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: appInstance.globalData.URL+'/Catpus/cat/',
      mathod:'GET',
      data:{
        action:"getcat"
      },
      success:(res)=>{
        console.log(res.data.cat_list)
        this.setData({
          catdate:res.data.cat_list,
        })
      }
    })
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