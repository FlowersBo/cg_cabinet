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
        var path = decodeURIComponent(res.result);
        // var path = res.result;
        console.log(path)
        const pathPart = path.split('vd/')[1].split('|');
        console.log(pathPart);
        // var pathPart = path.substring(0, 6);
        if (pathPart) {
          wx.setStorageSync('pathPart', pathPart);
          wx.navigateTo({
            url: '/pages/wxlogin/index',
          })
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