// pages/wxPay/index.js
const app = getApp();
let that;
import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
const md5 = require('../../resource/js/md5');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true,
    extraData: '',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    checked: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },
  //规则查询
  billingFn: () => {
    // orderinfo_id = '1310520658144264192';
    let orderinfo_id = wx.getStorageSync('orderinfo_id');
    const data = {
      orderinfo_id
    }
    mClient.wxGetRequest(api.chargingRules, data)
      .then(res => {
        console.log("计费规则", res);
        if (res.data.code == '0') {
          const billing = res.data.data;
          that.setData({
            billing: billing
          })
        } else {
          // wx.showToast({
          //   title: res.message,
          //   icon: 'none',
          //   duration: 1000
          // })
        }
      })
      .catch(rej => {
        console.log(rej)
        // wx.showToast({
        //   title: rej.error,
        //   icon: 'none',
        //   duration: 2000
        // })
      })
  },

  // 免押金开门
  wxPayFn: (current) => {
    that.setData({
      disabled: true
    })
    let [customer_id, FactoryNO, specifications] = wx.getStorageSync('pathPart');
    console.log(customer_id, FactoryNO, specifications);
    // const customer_id = '1309405954739011584';
    // const FactoryNO = "cw100086003";
    // const specifications = '0';
    if (that.data.checked) {
      let orderinfo_id = wx.getStorageSync('orderinfo_id');
      const data = {
        openid: wx.getStorageSync('open_id'),
        orderinfo_id,
        customerId: customer_id,
        FactoryNO,
        specifications
      }
      mClient.wxRequest(api.paymentAuthorization, data)
        .then(res => {
          console.log('下单返回', res)
          if (res) {
            wx.redirectTo({
              url: '/pages/bagClaim/index?orderinfo_code=' + res.code
            })
          }
        })
        .catch(rej => {
          console.log(rej)
        })
    } else {
      wx.showToast({
        title: '请先同意勾选委托扣款授权书',
        icon: 'none',
        duration: 2000
      })
    }



    // if (wx.openBusinessView) {
    //   const mch_id = '1602794611';
    //   const service_id = '00004000000000160085954950194673';
    //   const out_order_no = '1234323JKHDFE1243252';
    //   const timestamp = '1530097563';
    //   const nonce_str = 'zyx53Nkey8o4bHpxTQvd8m7e92nG5mG2';
    //   const sign_type = 'HMAC-SHA256';
    //   const beforMD5 = mch_id + service_id + out_order_no + timestamp + nonce_str + sign_type;
    //   const sign = md5(beforMD5);
    //   console.log(sign)
    //   wx.openBusinessView({
    //     businessType: 'wxpayScoreUse',
    //     extraData: {
    //       mch_id: mch_id,
    //       service_id: service_id,
    //       out_order_no: out_order_no,
    //       timestamp: timestamp,
    //       nonce_str: nonce_str,
    //       sign_type: sign_type,
    //       sign: sign
    //     },
    //     envVersion: 'release',
    //     success(e) {
    //       // debugger
    //       console.log("111")
    //       wx.redirectTo({
    //         url: '/pages/bagClaim/index'
    //       })
    //       //dosomething
    //     },
    //     fail(e) {
    //       // debugger
    //       console.log("222")
    //       //dosomething
    //     },
    //     complete() {
    //       //dosomething
    //     }
    //   });
    // } else {
    //   //引导用户升级微信版本
    // }

  },

  // 服务协议授权
  checkboxChange(e) {
    var choice = e.detail.value;
    if (choice.length > 0) {
      that.setData({
        checked: true
      });
    } else {
      that.setData({
        checked: false
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
    that.billingFn();
    that.startusQueryFn();
    that.setData({
      disabled: false
    })
    // const userTouch = app.globalData.userTouch;
    // console.info('小程序跳转回来', userTouch);
    // if (userTouch == 1) {

    // }
  },

  // 授权查询
  startusQueryFn: () => {
    let orderinfo_id = wx.getStorageSync('orderinfo_id');
    const data = {
      orderinfo_id,
      openid: wx.getStorageSync('open_id')
    }
    mClient.wxGetRequest(api.permissionsToken, data)
      .then(res => {
        console.log("获取token，授权状态", res);
        if (res) {
          const token = res.data.data.token;
          const user_service_state = res.data.data.user_service_state;
          console.log(user_service_state)
          if (!user_service_state) {
            // 拉起支付分小程序
            wx.navigateToMiniProgram({
              appId: 'wxd8f3793ea3b935b8',
              path: 'pages/use/enable',
              extraData: {
                apply_permissions_token: token,
              },
              success(e) {
                console.log('跳转支付分成功');
              },
              fail() {
                //dosomething
              },
              complete() {
                //dosomething
              }
            });
          } else {

          }
        } else {
          // wx.showToast({
          //   title: res.message,
          //   icon: 'none',
          //   duration: 1000
          // })
        }
      })
      .catch(rej => {
        console.log(rej)
        // wx.showToast({
        //   title: rej.error,
        //   icon: 'none',
        //   duration: 2000
        // })
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

  // 支付分授权
  // getextraData: () => {
  //   const app = getApp();
  //   var extraDataValue = {
  //     appid: app.globalData.baseInfo.appId,
  //     mch_id: app.globalData.baseInfo.mchId,
  //     sub_mch_id: app.globalData.baseInfo.subMchId,
  //     notify_url: app.globalData.baseInfo.notifyUrl,
  //     contract_code: config.contractCode,
  //     contract_display_account: app.globalData.baseInfo.contractDisplayAccount,
  //     plan_id: app.globalData.baseInfo.planId,
  //     request_serial: config.requestSerial,
  //     timestamp: config.timestamp,
  //     sub_appid: app.globalData.baseInfo.subAppId
  //   };
  //   var extraDataSortValue = getSort(extraDataValue);
  //   var signValue = getSign(extraDataSortValue, app.globalData.baseInfo.appSecret);
  //   extraDataValue['sign'] = signValue;
  //   log(TAG, "signSign=[" + signValue + "]length=" + String(signValue).length);
  //   return extraDataValue;
  // },
})