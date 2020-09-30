// pages/wxlogin/index.js
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
    let open_id = wx.getStorageSync('open_id');
    if (!open_id) {
      that.wxLogin();
    }

    console.log('扫码拿到参数', options);
    let result = options.q;
    if (result) {
      let path = decodeURIComponent(result);
      console.log('解码',path);
      const pathPart = path.split('vd/')[1].split('|');
      console.log(pathPart);
      wx.setStorageSync('pathPart', pathPart);
    }
    // else{
    //   const path = Object.values(options)
    //   // let path = decodeURIComponent(options);
    //   console.log(path[0])
    //   const pathPart = path[0].split('|');
    //   console.log(pathPart);
    //   wx.setStorageSync('pathPart', pathPart);
    // }

    that.showModal('bottomModal');
  },
  // 授权
  authorizationFn: () => {
    // 授权订阅（需要提醒版本过低的用户）
    wx.requestSubscribeMessage({
      tmplIds: [
        'GMks3J43_oZ8TpdZMrQoOF8eUsiZtxSomCJZf1s7JEc',
        'Kj6wlvvil7tUub1fxknEfIr-hi23QqBnj5lVdvn5FKo'
      ],
      success(res) {
        console.log('成功', res);
        that.hideModal();
      },
      fail(res) { // 接口调用失败的回调函数
        console.log('失败', res);
        that.hideModal();
      }
    })
  },
  //测试Promise.all
  // p1: function () {
  // const p1 = mClient.login();
  // console.log(p1)
  // //并行请求  -- wxLogin 
  // Promise.all([p1]).then((res) => {
  //   console.log('PromiseAll', res);
  //   // wx.hideLoading()
  // })
  //   mClient.login()
  //   .then(resp => {
  //     console.log('code', resp);
  //     return resp;
  //   })
  //   .catch(rej=>{
  //     console.log(rej);
  //   })
  // },

  showModal(e) {
    this.setData({
      modalName: e
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 登录
  wxLogin: () => {
    mClient.login()
      .then(resp => {
        console.log('code', resp);
        if (resp) {
          let data = {
            js_code: resp
          }
          mClient.wxGetRequest(api.Login, data)
            .then(resp => {
              console.log("授权返回参数", resp);
              if (resp.data.code == "0") {
                wx.setStorageSync('open_id', resp.data.data.openid);
                wx.setStorageSync('sessionKey', resp.data.data.sessionKey);
              } else {
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 1000
                })
              }
            })
            .catch(rej => {
              console.log(rej)
            })
        } else {
          console.log('获取用户登录态失败！' + res);
        }
      })
      .catch(rej => {
        console.log(rej)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let pages = getCurrentPages();
    // var currPage = pages[pages.length - 2];
    // console.log("上级页面", currPage)
    // var route = currPage.route;
    // console.log("上级页面路由", route);
    // that.setData({
    //   route: route
    // });
  },

  // 授权
  getPhoneNumber: (e) => {
    let [customer_id, FactoryNO, specifications] = wx.getStorageSync('pathPart');
    console.log(customer_id, FactoryNO, specifications);
    // const customer_id = '1309405954739011584';
    // const FactoryNO = "cw100086003"
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    // encryptedData = encodeURIComponent(encryptedData);
    wx.getSetting({
      success(res) {
        console.log("已授权", res);
        // if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用
        if (e.detail.encryptedData) {
          try {
            if (wx.getStorageSync('open_id')) {
              console.log("iv", iv, '\n', "encryptedData", encryptedData)
              // 获取登录用户信息
              const data = {
                sessionKey: wx.getStorageSync('sessionKey'),
                openid: wx.getStorageSync('open_id'),
                encryptedData: encryptedData,
                iv: iv,
                customer_id,
                FactoryNO
              }

              mClient.wxRequest(api.PhoneNumber, data)
                .then(res => {
                  console.log("授权返回参数", res);
                  if (res.code == "0") {
                    let orderinfo_id = res.data.orderinfo_id;
                    wx.setStorageSync('orderinfo_id', orderinfo_id);
                    // 跳转免密授权
                    wx.redirectTo({
                      url: '/pages/wxPay/index',
                    })
                  } else {
                    wx.showToast({
                      title: res.message,
                      icon: 'none',
                      duration: 1000
                    })
                    wx.hideLoading();
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
            } else {
              console.log('获取用户手机号失败！');
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          //用户按了取消按钮
          wx.showModal({
            title: '提示',
            content: '您点击了拒绝授权，将无法使用小程序，请授权之后再进入',
            showCancel: false,
            confirmText: '返回授权',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击了“返回授权”');
              }
            }
          })
        }
        //   console.log("用户拒绝授权");
        //   wx.navigateBack({
        //     delta: 1
        //   })
        // }
      }
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
  //授权
  // onGotUserInfo: function (e) {
  //   var that = this;
  //   console.log(e)
  //   var result = e.detail.userInfo;
  //   var encryptedData = e.detail.encryptedData;
  //   var iv = e.detail.iv;
  //   console.log("result", result);
  //   if (e.detail.userInfo) {
  //     try {
  //       wx.login({
  //         success: function (res) {
  //           console.log(res);
  //           if (res.code) {
  //             var code = res.code;
  //             // 获取登录用户信息
  //             var dataUrl = '/auth/login';
  //             var param = {
  //               code: code,
  //               encryptedData: encryptedData
  //             }
  //             // wxRequest(dataUrl, param).then(res => {
  //                 console.log("登录返回参数", res);
  //                 if (code) {
  //                   // var userInfo = res.data;
  //                   // console.log("userInfo", userInfo);
  //                   // app.data.userinfo = userInfo;
  //                   // wx.setStorageSync('userInfo', userInfo);
  //                   // that.setData({ userInfo: userInfo});
  //                   //用户已经授权过
  //                   wx.navigateBack({
  //                     delta: 1
  //                   })
  //                 } else {
  //                   wx.switchTab({
  //                     url: '/index/index'
  //                   })
  //                 }
  //             // })
  //           } else {
  //             console.log('获取用户登录态失败！' + res.errMsg);
  //           }
  //         }
  //       });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   } else {
  //     //用户按了取消按钮
  //     wx.showModal({
  //       title: '提示',
  //       content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
  //       showCancel: false,
  //       confirmText: '返回授权',
  //       success: function (res) {
  //         if (res.confirm) {
  //           console.log('用户点击了“返回授权”');
  //         }
  //       }
  //     })
  //   }
  // },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})