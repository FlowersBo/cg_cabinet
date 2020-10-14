// pages/orderList/index.js
const app = getApp();
let that;
import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
import * as util from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    current: '1',
    pageCount: 1,
    isFlag: false,
    pull: {
      isLoading: false,
      loading: '../../resource/img/pull_refresh.gif',
      pullText: '正在刷新'
    },
    push: {
      isLoading: false,
      loading: '../../resource/img/pull_refresh.gif',
      pullText: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let current = '1';
    let open_id = wx.getStorageSync('open_id');
    if (open_id) {
      that.orderListFn(current);
    } else {
      that.wxLogin();
    }
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('.custom').boundingClientRect(function (res) {
      const customHeight = res[0].height;
      that.setData({
        customHeight: customHeight
      })
    }).exec()
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
                // wx.setStorageSync('sessionKey', resp.data.data.sessionKey);
                that.orderListFn();
                //用户已点击;授权
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

  // 订单列表
  orderListFn: (current) => {
    that.setData({
      isFlag: false
    })
    const data = {
      openid: wx.getStorageSync('open_id'),
      size: "10",
      current: current
    }
    mClient.wxRequest(api.OrderList, data)
      .then(res => {
        console.log("订单列表", res);
        if (res.code == "0") {
          let orderList = res.data.orderInfoList;
          orderList.forEach(element => {
            if (element.finishDate) {
              element.orderDate = util.intervalTime(element.startDate,element.finishDate);
              element.finishDate = util.timestampToTimeLong(element.finishDate);
            }
            element.startDate = util.timestampToTimeLong(element.startDate);
            if (element.orderStatus == '1') {
              element.orderStatus = '使用中'
            } else if (element.orderStatus == '2') {
              element.orderStatus = '已完成'
            } else {
              element.orderStatus = '已取消'
            }

          });
          orderList = that.data.orderList.concat(orderList);
          if (orderList.length >= 10) {
            const pullText = '- 上拉加载更多 -'
            that.setData({
              'push.pullText': pullText,
            })
          }
          if (orderList.length <= 0) {
            that.setData({
              isFlag: true
            })
          }
          console.log('修改后订单列表', orderList)
          that.setData({
            orderList: orderList,
            current: current,
            pageCount: res.data.pageCount,
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1000
          })
          that.setData({
            isFlag: true
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
        that.setData({
          isFlag: true
        })
      })
  },


  // 刷新
  refresh() {
    let current = '1';
    that.setData({
      current: '1',
      orderList: []
    })
    if (that.data.orderList.length <= 0) {
      that.setData({
        'pull.isLoading': true,
        'pull.loading': '../../resource/img/pull_refresh.gif',
        'pull.pullText': '正在刷新',
        'push.pullText': '',
      })
      that.orderListFn(current);
      if (that.data.orderList) {
        setTimeout(() => {
          that.setData({
            'pull.loading': '../../resource/img/finish.png',
            'pull.pullText': '刷新完成',
            'pull.isLoading': false
          })
        }, 1500)
      }
    }
  },

  //加载
  toload() {
    let current = that.data.current;
    let pageCount = that.data.pageCount;
    if (current < pageCount) {
      that.setData({
        'push.isLoading': true,
        'push.pullText': '正在加载',
        'push.loading': '../../resource/img/pull_refresh.gif',
      })
      current++;
      current = String(current);
      console.log(current)
      that.orderListFn(current);
      setTimeout(() => {
        that.setData({
          current: current,
          'push.isLoading': false,
          'push.pullText': '- 上拉加载更多 -',
          'push.loading': '../../resource/img/finish.png',
        })
      }, 1500)
    } else {
      that.setData({
        // 'push.isLoading': false,
        'push.pullText': '- 我也是有底线的 -'
      })
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
  // 点击跳转订单详情
  clickOrder: (e) => {
    console.log(e);
    const orderId = e.currentTarget.dataset.id;
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
    // that.orderListFn();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('触底了')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})