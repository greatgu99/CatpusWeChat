// pages/testPage/testPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths:''
  },
  testloading(){
    wx.showToast({
      title: '234234',
      icon:'loading'
    })
  },
  testTap(){
    console.log('测试')
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          tempFilePaths:res.tempFilePaths[0],
        })
        console.log(this.data.tempFilePaths)
        wx.uploadFile({
          filePath: this.data.tempFilePaths,
          name: 'file',
          url: 'http://127.0.0.1:8080/Catpus/cat/addpic',
          success:(res)=>{
            console.log(res)
          },
          fail:(res)=>{
            console.log(res)
          }
        })
      }
    })
    

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})