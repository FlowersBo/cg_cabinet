// pages/wxPay/index.js
const app = getApp();
let that;
import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true,
    extraData: '',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  that.getextraData();
  },
  getextraData: () => {
    const app = getApp();
    var extraDataValue = {
      appid: app.globalData.baseInfo.appId,
      mch_id: app.globalData.baseInfo.mchId,
      sub_mch_id: app.globalData.baseInfo.subMchId,
      notify_url: app.globalData.baseInfo.notifyUrl,
      contract_code: config.contractCode,
      contract_display_account: app.globalData.baseInfo.contractDisplayAccount,
      plan_id: app.globalData.baseInfo.planId,
      request_serial: config.requestSerial,
      timestamp: config.timestamp,
      sub_appid: app.globalData.baseInfo.subAppId
    };
    var extraDataSortValue = getSort(extraDataValue);
    var signValue = getSign(extraDataSortValue, app.globalData.baseInfo.appSecret);
    extraDataValue['sign'] = signValue;
    log(TAG, "signSign=[" + signValue + "]length=" + String(signValue).length);
    return extraDataValue;
  },

  // 授权
  wxPayFn: (current) => {
    const data = {
      openid: wx.getStorageSync('open_id'),
      FactoryNO: "7001000002",
      orderinfo_id: "1305779810890416128",
      customerId: "1",
      specifications: "0"
    }
    mClient.wxRequest(api.paymentAuthorization, data)
      .then(res => {
        console.log("测试授权返回", res);
        if (res.code == "0") {} else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1000
          })
        }
      })
      .catch(rej => {
        console.log(rej)
        wx.showToast({
          title: rej.error,
          icon: 'none',
          duration: 2000
        })
      })
  },


  // 服务协议授权
  checkboxChange(e) {
    var choice = e.detail.value;
    var isShow = '';
    if (choice.length > 0) {
      isShow = true;
      that.setData({
        isShow: isShow
      });
    } else {
      isShow = false;
      that.setData({
        isShow: isShow
      });
    }
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