// pages/deviceList/index.js
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
    deviceList: [],
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let current = '1';
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('.custom').boundingClientRect(function (res) {
      const customHeight = res[0].height;
      that.setData({
        customHeight: customHeight
      })
    }).exec()
    that.deviceListFn(current);
    // that.device_signalListFn(current);
  },


  // 设备列表
  async deviceListFn(current, serchContent) {
    that.setData({
      isFlag: false
    })
    const data = {
      pagesize: that.data.pageSize,
      pageindex: current,
      id: wx.getStorageSync('userID'),
      deviceno: serchContent
    }
    try {
      const res = await mClient.wxGetRequest(api.DeviceList, data);
      console.log("设备列表", res);
      if (res.data.code == '200') {
        let deviceList = res.data.data.data;
        console.log("设备列表", deviceList);
        if (deviceList) {
          if (deviceList.length >= 10) {
            const pullText = '- 上拉加载更多 -'
            that.setData({
              'push.pullText': pullText,
            })
          }
          if (deviceList.length <= 0) {
            that.setData({
              isFlag: true
            })
          }
          // for(let key in deviceList){
          //   if(deviceList[key].isonline==='0'){//信号

          //   }else if(deviceList[key].isbad==='0'){

          //   }
          // }
          deviceList = that.data.deviceList.concat(deviceList);
          console.log('修改后列表', deviceList);
          that.setData({
            deviceList: deviceList,
            current: current,
            total: res.data.data.total,
          })
        } else {
          that.setData({
            isFlag: true
          })
        }
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
    } catch (err) {
      that.setData({
        isFlag: true
      })
      console.log(err);
    }
    // return res;
  },

  // 设备信号列表
  // async device_signalListFn(current, serchContent) {
  //   that.setData({
  //     isFlag: false
  //   })
  //   const data = {
  //     pagesize: that.data.pageSize,
  //     pageindex: current,
  //     id: wx.getStorageSync('userID'),
  //     deviceno: serchContent
  //   }
  //   const res = await mClient.wxGetRequest(api.AlarmList, data);
  //   if (res.data.code == '200') {
  //     console.log('报警返回', res);
  //     // const mergedArray = deviceList.reduce((merge, cur) => {
  //     //   const target = merge.find(e => {
  //     //     return e.id === cur.id;
  //     //   });
  //     //   if (target) {
  //     //     Object.assign(target, cur);
  //     //   } else {
  //     //     merge.push(cur);
  //     //   }
  //     //   return merge;
  //     // }, arr);
  //     // console.log(mergedArray)
  //   } else {
  //     wx.showToast({
  //       title: res.data.message,
  //       icon: 'none',
  //       duration: 1000
  //     })
  //     that.setData({
  //       isFlag: true
  //     })
  //   }
  //   return res;
  // },


  //设备搜索
  bindPointSerch: function (e) {
    let serchContent = e.detail.value;
    console.log('搜索', serchContent);
    that.setData({
      serchContent: serchContent,
      'push.pullText': ''
    })
    let current = '1';
    that.setData({
      current: '1',
      deviceList: []
    })
    that.deviceListFn(current, serchContent);
  },


  refresh() { //利用promiseAll来判断是否刷新完成
    let current = '1';
    that.setData({
      current: '1',
      deviceList: []
    })
    if (that.data.deviceList.length <= 0) {
      that.setData({
        'pull.isLoading': true,
        'pull.loading': '../../resource/img/pull_refresh.gif',
        'pull.pullText': '正在刷新',
        'push.pullText': '',
      })
      const p1 = that.deviceListFn(current);
      // const p2 = that.device_signalListFn(current);
      // console.log(p1)
      // console.log(p2)
      // mClient.myPromiseall(p1, p2).then(v => {
      //   console.log(v)
      // }).catch(e => {
      //   console.log(e)
      // })



      console.log('当前orderList', Boolean(that.data.deviceList));
      console.log(that.data.deviceList.length > 0)
      setTimeout(() => {
        if (that.data.deviceList.length > 0) {
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
    if (that.data.deviceList.length < total) {
      that.setData({
        'push.isLoading': true,
        'push.pullText': '正在加载',
        'push.loading': '../../resource/img/pull_refresh.gif',
      })
      current++;
      current = String(current);
      console.log(current)
      that.deviceListFn(current);
      setTimeout(() => {
        that.setData({
          current: current,
          'push.isLoading': false,
          'push.pullText': '- 上拉加载更多 -',
          'push.loading': '../../resource/img/finish.png',
        })
      }, 1500)
    } else if ((current * that.data.pageSize) > that.data.total) {
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
    // that.deviceListFn();
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