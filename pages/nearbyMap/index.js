// pages/nearbyMap/index.js
let that;
import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    current: '1',
    pageCount: 1,
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
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('.custom').boundingClientRect(function (res) {
      const customHeight = res[0].height;
      that.setData({
        customHeight: customHeight
      })
    }).exec()
  },
  onShow: function () {
    that.getSelfLocation();
  },
  //获取位置
  getSelfLocation: function (varSendOrgId) {
    var that = this; //用户授权过可以直接获取位置
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        const loaction = {};
        loaction.latitude = res.latitude;
        loaction.longitude = res.longitude;
        wx.setStorageSync('loaction', loaction);
        that.orderListFn(that.data.current);
      },
      fail: function (res) {
        // setTimeout(function () { //需要用户授权获取位置
        wx.getSetting({
          success: (res) => {
            if (!res.authSetting['scope.userLocation']) {
              that.util('open');
            }
          }
        })
        // }, 1000);
      }
    });
  },

  // 二次授权允许或拒绝
  gotobargainDetailFun: (e) => {
    console.log(e);
    let status = e.currentTarget.dataset.status;
    if (status == 1) {
      that.util('close');
      wx.navigateBack({
        delta: 1,
      })
    } else {
      that.util('close');
    }
  },

  // 模态动画
  util: function (currentStatu) {
    console.log('模态动画');
    /* 动画部分 */
    // 第1步：创建动画实例
    var animation = wx.createAnimation({
      duration: 300, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });
    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;
    // 第3步：执行第一组动画
    animation.opacity(0).step();
    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })
      //关闭
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      } else if (currentStatu == "open") {
        that.setData({
          showModalStatus: true
        });
      }
    }.bind(this), 300)
    // 显示
    // if (currentStatu == "open") {

    // }
  },


  // 订单列表
  orderListFn: (current) => {
    let {
      latitude,
      longitude
    } = wx.getStorageSync('loaction');
    const data = {
      size: "10",
      current: current,
      latitude: latitude,
      longitude: longitude
    }
    mClient.wxRequest(api.Location, data)
      .then(res => {
        console.log("列表", res);
        if (res.code == "0") {
          let orderList = res.data.pointList;
          orderList = that.data.orderList.concat(orderList);
          console.log('修改后列表', orderList);
          if (orderList.length >= 10) {
            const pullText = '- 上拉加载更多 -'
            that.setData({
              'push.pullText': pullText,
            })
          }
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