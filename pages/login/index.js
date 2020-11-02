// pages/login/index.js
let that;
import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verificationControlText: '获取验证码',
    verificationTimeTotal: 60,
    isRepeatClick: false, //是否重复按下获取验证码
    isVerifyOutTime: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    mClient.refreshToken()
      .then(resp => {
        console.log('授权验证', resp);
        if (resp.data.code == 200) {
          wx.switchTab({
            url: '../user/index',
          });
          console.log('登录信息未过期，自动登录');
        }
      })
  },

  // 获取手机号
  bindInputPhoneNumber: (e) => {
    const phoneNumber = e.detail.value;
    console.log('手机号', phoneNumber);
    that.setData({
      phoneNumber: phoneNumber
    })
  },

  // 获取验证码
  bindInputVerificationCode: (e) => {
    let verificationCode = e.detail.value;
    that.setData({
      verificationCode: verificationCode
    });
  },

  // 点击获取验证码并验证手机号是否可用
  getVerificationCode: function () {
    let phoneNumber = that.data.phoneNumber;
    let isVerifyOutTime = that.data.isVerifyOutTime;
    let verificationTimeTotal = that.data.verificationTimeTotal;
    let startVerificationCountDown = that.startVerificationCountDown;
    let isRepeatClick = that.data.isRepeatClick;
    this.setData({
      isRepeatClick: true
    })
    if (isRepeatClick == true) {
      return;
    }
    if (!(/^1[3456789]\d{9}$/.test(phoneNumber)) || phoneNumber.length < 11) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    let data = {
      username: parseInt(phoneNumber)
    }

    if (isVerifyOutTime == true) {
      // wx.showLoading({
      //   title: '验证码获取中',
      // })
      mClient.getVerificationCode(data)
        .then((resp) => {
          console.log(resp);
          if (resp.data.code == '200') {
            startVerificationCountDown(verificationTimeTotal);
            wx.showToast({
              title: '发送成功',
              icon: 'none',
              duration: 1000
            });
          } else {
            wx.showToast({
              title: resp.data.message,
              icon: 'none',
              duration: 2000
            });
            that.setData({
              isRepeatClick: false
            })
          }
          wx.hideLoading();
        })
        .catch((e) => {
          wx.showToast({
            title: '网络错误，请稍后重试',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            isRepeatClick: false
          })
        })

    } else {
      wx.showToast({
        title: '请稍后重新获取验证码',
        icon: 'none',
        duration: 1000
      });
    }
  },

  // 获取验证码
  startVerificationCountDown: function (count) {
    if (count == 0) {
      this.setData({
        verificationControlText: '重新获取',
        isVerifyOutTime: true,
        isRepeatClick: false,
        isRepeatGetNum: ''
      });
      return;
    } else {
      this.setData({
        isRepeatClick: true,
        verificationControlText: count,
        isRepeatGetNum: 'repeatGetNum'
      });
      count = count - 1;
      setTimeout(() => {
        this.startVerificationCountDown(count)
      }, 1000);
    }
  },

  //登录
  formSubmit: function (e) {
    const phoneNumber = e.detail.value.phoneNumber;
    const verificationCode = e.detail.value.verificationCode;
    if (phoneNumber.length == 0) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    if (verificationCode.length == 0) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    if (!(/^1[3456789]\d{9}$/.test(phoneNumber)) || phoneNumber.length < 11) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (verificationCode.length < 6) {
      wx.showToast({
        title: '验证码有误',
        icon: 'none',
        duration: 2000
      })
      return;
    } else {
      let loginInfo = {
        username: parseInt(phoneNumber),
        smscode: verificationCode
      };
      mClient.loginPhone(loginInfo)
        .then((resp) => {
          console.log('登录返回', resp);
          if (resp.data.code == 200) {
            wx.switchTab({
              url: '../user/index'
            });
          } else {
            wx.showToast({
              title: resp.data.message,
              icon: 'none',
              duration: 1000
            });
          }
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