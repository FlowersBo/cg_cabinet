// pages/destination/index.js
let that;
import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
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
    that = this;
  },

  qrCordFn: () => {
    wx.navigateTo({
      url: '/pages/wxlogin/index',
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

  //扫码
  scanCode() {
    wx.scanCode({
      success(res) {
        console.log("扫码", res)
        var path = decodeURIComponent(res.path);
        // var path = res.path;
        console.log(path)
        // var pathPart1 = path.split('&');
        // console.log(pathPart1)
        // var pathPart = path.substring(0, path.lastIndexOf('='));
        var pathPart = path.substring(0, 6);
        console.log("截取后", pathPart);
        if (path) {
          if (pathPart == 'source') {
            wx.navigateTo({
              url: '/pages/merchant/verificationQRcode/index?' + path,
            })
          } else {
            var memberCardId = res.path;
            wx.navigateTo({
              url: "/pages/merchant/verification/index?memberCardId=" + memberCardId
            })
          }
        } else {
          wx.showToast({
            title: '扫码失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  // 跳转附近
  nearbyMapFun: () => {
    wx.navigateTo({
      url: '/pages/nearbyMap/index',
    })
  },
  // 跳转订单
  orderFun: () => {
    wx.navigateTo({
      url: '/pages/orderList/index',
    })
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
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    that.onShow();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
    }
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