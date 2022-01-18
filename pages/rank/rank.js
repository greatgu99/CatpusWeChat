// pages/rank/rank.js

const DB = wx.cloud.database().collection("Cat")

const _ = wx.cloud.database().command

let appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    catdata:[],
    catdata1:[],
  },
  showdata(){
    console.log(this.data.catdata)
    console.log(this.data.catdata1)
  },
  navigatorToCatIndex(e){
    console.log(e.currentTarget.dataset.id)
    // console.log("进入")
    wx.navigateTo({
      url:'/pages/catIndex/catIndex?catid='+e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let temp=[]
    wx.request({
      // url: 'http://127.0.0.1:8080/Catpus/cat?page=1',
      url: 'http://127.0.0.1:8080/Catpus/cat/',
      method:"GET",
      data:{
        action:'getcat'
      },
      success:(res)=>{
        temp=res.data.cat_list;
        temp = temp.slice(3)
        this.setData({
          catdata:res.data.cat_list,
          catdata1:temp,
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
  onLoad: function () {

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