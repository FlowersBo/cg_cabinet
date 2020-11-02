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
    pageSize: '10',
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
    date: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let current = '1';
    let date = util.customFormatTime(new Date());
    that.setData({
      date: date
    })
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('.custom').boundingClientRect(function (res) {
      const customHeight = res[0].height;
      that.setData({
        customHeight: customHeight
      })
    }).exec()
    that.orderListFn(current);
  },

  // 订单列表
  orderListFn: (current, orderdate) => {
    that.setData({
      isFlag: false
    })
    const data = {
      pagesize: that.data.pageSize,
      pageindex: current,
      id: wx.getStorageSync('userID'),
      orderdate: orderdate
    }
    mClient.wxGetRequest(api.OrderList, data)
      .then(res => {
        console.log("订单列表", res);
        if (res.data.code == "200") {
          let orderList = res.data.data.list;
          orderList.forEach(element => {
            if (element.finishDate) {
              element.orderDate = util.intervalTime(element.startDate, element.finishDate);
              element.finishDate = util.timestampToTimeLong(element.finishDate);
            }
            element.startDate = util.timestampToTimeLong(element.startDate);
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
          console.log('修改后订单列表', orderList);
          that.setData({
            orderList: orderList,
            current: current,
            total: res.data.data.total,
          })
        } else {
          wx.showToast({
            title: res.data.message,
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

  //日期选择
  bindDateChange: (e) => {
    console.log(e);
    let date = e.detail.value;
    that.setData({
      date: date,
      'push.pullText': ''
    })
    let current = '1';
    that.setData({
      current: '1',
      orderList: []
    })
    that.orderListFn(current, date);
  },


  refresh() {
    let current = '1';
    let date = util.customFormatTime(new Date());
    that.setData({
      current: '1',
      orderList: [],
      date: date
    })
    if (that.data.orderList.length <= 0) {
      that.setData({
        'pull.isLoading': true,
        'pull.loading': '../../resource/img/pull_refresh.gif',
        'pull.pullText': '正在刷新',
        'push.pullText': '',
      })
      that.orderListFn(current);
      console.log('当前orderList', Boolean(that.data.orderList));
      console.log(that.data.orderList.length > 0)
      setTimeout(() => {
        if (that.data.orderList.length > 0) {
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
    }
  },


  toload() {
    let current = that.data.current;
    let total = that.data.total;
    if (that.data.orderList.length < total) {
      that.setData({
        'push.isLoading': true,
        'push.pullText': '正在加载',
        'push.loading': '../../resource/img/pull_refresh.gif',
      })
      current++;
      console.log(current)
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
    } else if ((current * that.data.pageSize) > total) {
      that.setData({
        'push.isLoading': false,
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