// pages/user/markeMoney/index.js
import * as mClient from '../../../utils/requestUrl';
import * as api from '../../../config/api';
let that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabTit: ['月份', '销售金额', '分账金额', '状态'],
    isFlag: false,
    AccountSharingProportion: '',
    progress: 0,
    sub_accountList: [{
        date: '2020.4',
        price: '500',
        sub_account: '400',
        status: '已转账'
      },
      {
        date: '2020.5',
        price: '400',
        sub_account: '400',
        status: '已转账'
      },
      {
        date: '2020.6',
        price: '600',
        sub_account: '500',
        status: '已转账'
      },
      {
        date: '2020.7',
        price: '80000',
        sub_account: '70000',
        status: '已转账'
      },
      {
        date: '2020.8',
        price: '700',
        sub_account: '500',
        status: '已转账'
      },
      {
        date: '2020.9',
        price: '200',
        sub_account: '100',
        status: '未转账'
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let sub_accountList = that.data.sub_accountList.sort(function (a, b) {
      console.log(a.date < b.date)
      return a.date < b.date ? 1 : -1
    });
    that.setData({
      sub_accountList: sub_accountList
    })
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('.custom').boundingClientRect(function (res) {
      const customHeight = res[0].height;
      that.setData({
        customHeight: customHeight
      })
    }).exec()
  },

  userInfoFn: () => {
    let data = {
      username: wx.getStorageSync('username')
    }
    let p1 = mClient.wxGetRequest(api.Info, data)
      .then(resp => {
        console.log('分账返回', resp);
        if (resp.data.code == 200) {
          resp.data.data.AccountSharingProportion.sharing_price = parseFloat(resp.data.data.AccountSharingProportion.sharing_price).toFixed(2);
          that.setData({
            AccountSharingProportion: resp.data.data.AccountSharingProportion
          });
        } else {
          that.setData({
            isFlag: true
          })
          wx.showToast({
            title: resp.data.message,
            icon: 'none',
            duration: 2000
          })
        }
        wx.hideLoading();
      });
    return p1
  },

  //测试
  userInfoFn1: () => {
    let data = {
      // username: wx.getStorageSync('username')
    }
    let p2 = mClient.wxGetRequest(api.Info, data)
      .then(resp => {
        // console.log('分账返回', resp);
        if (resp.data.code == 200) {
          // that.setData({
          //   AccountSharingProportion: resp.data.data.AccountSharingProportion
          // });
        } else {
          that.setData({
            isFlag: true
          })
          wx.showToast({
            title: resp.data.message,
            icon: 'none',
            duration: 2000
          })
        }
        wx.hideLoading();
      });
    return p2
  },

  // 刷新
  refresh() {
    // let current = '1';
    // that.setData({
    //   current: '1',
    //   orderList: []
    // })
    that.setData({
      'pull.isLoading': true,
      'pull.loading': '/resource/img/pull_refresh.gif',
      'pull.pullText': '正在刷新',
      'push.pullText': '',
    })
    that.userInfoFn();
    setTimeout(() => {
      if (that.data.AccountSharingProportion) {
        that.setData({
          'pull.loading': '../../resource/img/finish.png',
          'pull.pullText': '刷新完成',
          'pull.isLoading': false
        })
      } else {
        that.setData({
          'pull.loading': '/resource/img/finish.png',
          'pull.pullText': '刷新失败',
          'pull.isLoading': false
        })
      }
    }, 1500)
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
    const p1 = that.userInfoFn();
    // const p2 = that.userInfoFn1();
    // console.log(p1, p2)
    // mClient.myPromiseall(p1, p2).then(v => {
    //   console.log(v)
    // }).catch(e => {
    //   console.log(e)
    // })
    // that.timer();
  },
  timer: () => {
    setTimeout(() => {
      let val = that.data.progress;
      if (val < 100) {
        that.setData({
          progress: val > 100 ? val : val + 10
        })
        that.timer();
        console.log(that.data.progress)
      }
    }, 2000)
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