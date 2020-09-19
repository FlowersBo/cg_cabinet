// pages/index/index.js
var that;
var wxRequest = require('../../utils/requestUrl.js');
var wxLogin = require('../../utils/wxLogin.js');
var QQMapWX = require('../../resource/js/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isAuthor: false, //是否已授权
    current: 1,
    indicatorDots: true,
    vertical: false,
    circular: true,
    interval: 3000,
    autoplay: true,
    duration: 500,
    cityName: '北京市',
    // screenWidth: app.globalData.screenWidth, //屏幕宽度
    // screenHeight: app.globalData.screenHeight,
    // windowWidth: app.globalData.windowWidth,
    // showThis: true,
    // showIcon: true,
    // text: '加载更多',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.setData({
      // screenWidth: app.globalData.screenWidth
    })
    wx.setStorageSync('city', '110000');
    wx.setStorageSync('cityName', '北京市');
    var isAuthor = wx.getStorageSync('isAuthor');
    if (isAuthor) {
      that.authorization();
    }
    // var isAuthor = app.data.isAuthor;//是否已授权
    // console.log(isAuthor);
    // 腾讯地图实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'EYHBZ-JMN6V-7UQPS-UAZSQ-MHISS-FJF6Q'
    });
    var isAuthor = wx.getStorageSync('isAuthor');
    console.log(isAuthor)
    that.setData({
      isAuthor: isAuthor
    });
    //二次登录
    wxLogin().then(res => {
      console.log('二次确认登录', res)
    })
  },


  //组件授权
  likesClick(e) {
    console.log("组件返回", e);
    var isAuthor = e.detail.isAuthor;
    that.setData({
      isAuthor: isAuthor
    })
    that.authorization();
  },
  //组件取消授权
  offBtn(e) {
    console.log(e)
    that.setData({
      isAuthor: true
    })
    that.authorization();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    that.homeSwiper();
    that.classifyFun();
    that.faddishFun();
    that.cardList();
    let cityName = wx.getStorageSync('cityName');
    that.setData({
      cityName: cityName
    })
  },
  //获取当前位置的经纬度
  authorization() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.loadInfo();
            },
            fail() {
              console.log(res)
              if (res.authSetting['scope.userLocation'] == false) {
                wx.showModal({
                  title: '位置授权提示',
                  content: '若不授权，将无法使用定位功能',
                  cancelText: '不授权',
                  cancelColor: '#999',
                  confirmText: '授权',
                  confirmColor: '#f94218',
                  success(res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success(res) {
                          console.log(res.authSetting)
                        }
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
            }
          })
        } else {
          that.loadInfo();
        }
      }
    })
  },

  //位置信息
  loadInfo() {
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude //维度
        var longitude = res.longitude //经度
        console.log(latitude, longitude);
        wx.setStorageSync('longitude', longitude);
        wx.setStorageSync('latitude', latitude);
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            var city = res.result.address_component.city;
            console.log('城市', city);
            wx.setStorageSync('locationCity', city);
            that.cityFunction(city);
          },
          fail: function(res) {
            console.log(res);
          },
          complete: function(res) {
            // console.log(res);
          }
        });
      }
    })
  },
  //获取城市
  cityFunction: function(city) {
    console.log(city)
    var dataUrl = '/communal/config/openCityList';
    var param = {};
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log("城市返回", res);
        if (res.code == "0000") {
          var cityList = res.data;
          for (var i = 0; i < cityList.length; i++) {
            if (city == cityList[i].cityName) {
              wx.setStorageSync('city', cityList[i].cityCode);
              that.setData({
                cityName: cityList[i].cityName
              });
              return false;
            } else {
              wx.showToast({
                title: '当前城市没有开通，默认为北京市',
                icon: 'none',
                duration: 2000
              })
            }
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
      .catch(function(res) {
        console.log(res);
        wx.showToast({
          title: res.error,
          icon: 'none',
          duration: 1000
        })
        return false
      })
  },
 

  //轮播列表
  homeSwiper() {
    var dataUrl = "/market/carouselList";
    var param = {};
    wxRequest(dataUrl, param).then(res => {
      console.log("轮播图", res);
      if(res.code=='0000'){
        var homeSwiper = res.data;
        that.setData({
          homeSwiper: homeSwiper
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  //轮播跳转
  shopPurchase: function(e) {
    console.log('轮播', e);
    var linkUrl = e.currentTarget.dataset.linkurl;
    if (linkUrl) {
      wx.navigateTo({
        url: linkUrl,
      })
    }
  },

  //分类
  classifyFun:function(){
    var dataUrl = "/market/marketData";
    var param = {};
    wxRequest(dataUrl, param).then(res => {
      console.log("卡分类", res);
      if (res.code == "0000") {
        var classify = res.data.navList;
        var ad = res.data.ad;
        that.setData({
          classify: classify,
          ad:ad
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  //分类跳转
  gotoClassify:function(e){
    console.log('分类跳转',e);
    var linkPage = e.currentTarget.dataset.linkpage;
    var navName = e.currentTarget.dataset.navname;
    console.log('分类跳转路径', linkPage);
    wx.navigateTo({
      url: linkPage + '&navName=' + navName,
    })
  },
  //城市选择
  cityFun: function() {
    wx.navigateTo({
      url: 'cityList/index',
    })
  },

  //爆款列表
  faddishFun: function () {
    var dataUrl = "/product/productList";
    var param = {
      page: {
        size: 6,
        current: 1
      },
      productType: '1'
    };
    wxRequest(dataUrl, param).then(res => {
      console.log("爆款卡列表", res);
      if (res.code == "0000") {
        var faddish = res.records;
        that.setData({
          faddish: faddish,
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  //爆款详情跳转
  faddishDetailFun: function (e) {
    console.log(e);
    var productId = e.currentTarget.dataset.productid;
    wx.navigateTo({
      url: '/pages/faddishDetail/index?productId=' + productId
    })
  },

  //二手卡列表
  cardList: function() {
    var dataUrl = "/card/resellList";
    var param = {
      page: {
        size: 10,
        current: 1
      },
    };
    wxRequest(dataUrl, param).then(res => {
      console.log("卡列表", res.records);
      if (res.code == "0000") {
        var records = res.records;
        that.setData({
          records: records,
          current: 1
        });
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  //二手卡详情跳转
  cardParticulars: function(e) {
    console.log(e);
    var memberCardId = e.currentTarget.dataset.membercardid;
    wx.navigateTo({
      url: '/pages/cardParticulars/index?memberCardId=' + memberCardId
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    that.homeSwiper();
    that.cardList();
    that.classifyFun();
    that.faddishFun();
    // 停止下拉动作  
    if (that.data.classify) {
      // 隐藏导航栏加载框  
      that.data.current = 1;
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 页数+1  
    let current = that.data.current;
    current = current + 1;
    var dataUrl = "/card/resellList";
    var param = {
      page: {
        size: 10,
        current: current
      },
    };
    console.log("页数", param)
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages; //服务器总页数
      console.log("卡列表", res.records);
      if (pages < current) {
        console.log("暂时没有更多了")
        wx.showLoading({
          title: '暂时没有更多了',
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 500)
      } else {
        console.log("玩命加载中")
        wx.showLoading({
          title: '玩命加载中',
        })
        if (res.code == "0000") {
          var moment_list = that.data.records;
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            records: moment_list,
            current: current
          })
          // 隐藏加载框  
          setTimeout(function() {
            wx.hideLoading()
          }, 500)
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
          // 隐藏加载框  
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        }
      }
    });
    // wx.request({
    //   success: function (res) {
    //     // 回调函数  
    //     var moment_list = that.data.moment;

    //     for (var i = 0; i < res.data.data.length; i++) {
    //       moment_list.push(res.data.data[i]);
    //     }
    //     // 设置数据  
    //     that.setData({
    //       moment: that.data.moment
    //     })
    //     // 隐藏加载框  
    //     wx.hideLoading();
    //   }
    // })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})