// component/authorize.js
const app = getApp();
//api
import wxRequest from '../../utils/requestUrl.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {
    isAuthor: false,//是否已授权
  },
  // lifetimes: {
  //   attached() {
  //     this.setData({
  //       isAuthor: app.globalData.isAuthor
  //     })
  //   }
  // },
  methods: {
    offBtn(){
      var that = this;
      var isFlang = true;
      that.triggerEvent('offBtn', { isFlang});
    },
    //已登陆
    // goOn() {
    //   this.triggerEvent('flagEvent', {});
    // },
    bindGetUserInfo: function (e) {
      var that = this;
      console.log(e.detail);
      var iv = e.detail.iv;
      var encryptedData = e.detail.encryptedData;
      if (e.detail.encryptedData) {
        try {
          wx.login({
            success: function (res) {
              if (res.code) {
                var code = res.code;
                console.log("iv", iv, '\n', "encryptedData", encryptedData, '\n', "code", code)
                // 获取登录用户信息
                var dataUrl = '/auth/login';
                var param = {
                  code: code,
                  encryptedData: encryptedData,
                  iv: iv,
                  loginType: 5
                }
                wx.showLoading({
                  title: '登录中',
                  mask:true
                })
                wxRequest(dataUrl, param).then(res => {
                  console.log("授权返回参数", res);
                  if(res.code=="0000"){
                    var userInfo = res.wxUser;
                    app.data.isAuthor = true;
                    var isAuthor = true;
                    console.log(app.data.isAuthor);
                    that.setData({
                      isAuthor: isAuthor
                    })
                    setTimeout(function () {
                      wx.hideLoading()
                      wx.setStorageSync('userInfo', userInfo);
                      wx.setStorageSync('isAuthor', isAuthor);
                      that.triggerEvent('flagEvent', { isAuthor });
                    }, 800)
                  }else{
                    wx.showToast({
                      title: res.msg,
                      icon: 'none',
                      duration: 1000
                    })
                  }
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg);
              }
            }
          });
        } catch (e) {
          console.log(e);
        }
      } else {
        //用户按了取消按钮
        console.log("取消")
        wx.showModal({
          title: '提示',
          content: '您点击了拒绝授权，将无法小程序主要功能，请授权之后再进入',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击了“返回授权”');
            }
          }
        })
      }
    },
  }
  














 
    //授权
    // bindGetUserInfo(e) {
    //   let that = this;
    //   var userInfo = wx.getStorageSync('userInfo');
    //   wx.getSetting({
    //     success: function (res) {
    //       console.log(userInfo)
    //       if (res.authSetting['scope.userInfo'] && userInfo) {
    //       } else {
    //         that.getLoginInfo();
    //       }
    //     } 
    //   })
    //   console.log('用户点击了“拒绝授权”')
    //   }
    // },

  

    //获取登陆信息
    // getLoginInfo() {
    //   let that = this;
    //   wx.login({
    //     success(res) {
    //       if (res.code) {
    //         requestApi('user/wxOpenIdDecode', 'POST', {
    //           code: res.code
    //         }).then((res) => {
    //           app.globalData.sessionInfo = res.data;//用户sessionkey & openid
    //           that.isLogin();
    //         })
    //       }
    //     }
    //   })
    // },


    //登陆 
  //   isLogin() {
  //     let that = this;
  //     requestApi('user/login', 'POST', {
  //       // 参数：''
  //     }).then((res) => {
  //         app.globalData.userInfo = res.data; //登录成功返回用户信息
  //         app.globalData.isAuthor = true;
  //         that.setData({
  //           isAuthor: true
  //         })
  //         that.triggerEvent('flagEvent', {});//登录成功后继续执行
  //       })
  //   },
  // }
})
