// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env:"env-4g9exouzd255b5c3"
    })
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    URL:'https://catpus.top'
    // URL:'http://127.0.0.1:8080'
  }
})
