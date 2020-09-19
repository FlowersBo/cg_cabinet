// pages/cx/index.js
var app = getApp()
Page({
  data: {
    isshow: true,
    showCompass: true,
    // polyline: [{
    //   points: [{
    //     longitude: 113.3245211,
    //     latitude: 23.10229
    //   }, {
    //     longitude: 113.324520,
    //     latitude: 23.21229
    //   }],
    //   color: '#FF0000DD',
    //   width: 2,
    //   dottedLine: true
    // }],
    // controls: [{
    //   id: 1,
    //   iconPath: '../../resource/img/map.png',
    //   position: {
    //     left: 0,
    //     top: 300 - 1,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }]
  },


  onLoad: function (option) {
    var that = this
    console.log(option)
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        console.log(res)
        var latitude = res.latitude;
        var longitude = res.longitude;
        //console.log(res.latitude);
        that.setData({
          latitude: latitude,
          longitude: longitude,
          markers: [{
              id: 0,
              iconPath: "../../resource/img/map.png",
              latitude: 39.9239,
              longitude: 116.44565,
              width: 30,
              height: 30
            },
            {
              id: 1,
              latitude: 39.9169,
              longitude: 116.44605,
              iconPath: "../../resource/img/map.png",
              width: 30,
              height: 30
            },
          ]
        })
      }
    })
  },

  //显示弹框
  showModal: function (event) {
    var that = this;
    console.log(event);
    var markerId = event.markerId;

    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  //跳转导航
  navigationFn: () => {
    wx.openLocation({
      latitude: 39.9169,
      longitude: 116.44605,
      name: "朝阳公园", //目的地定位名称
      scale: 15, //缩放比例
      address: "朝阳区日坛北路" //导航详细地址
    })
  },

  // 跳转点位列表
  nearbyFn: () => {
    wx.navigateTo({
      url: '/pages/nearbyMap/index',
    })
  },
  // opendetail: function (event) {
  //   console.log('-----跳转商品-----');
  //   //console.log(event);
  //   var id = event.currentTarget.dataset.id;
  //   this.setData({
  //     id: id
  //   });
  //   wx.navigateTo({
  //       url: "/pages/detail/detail?id=" + id
  //     }),
  //     console.log(id);
  // },

  // calling: function (event) {
  //   var tel = event.currentTarget.dataset.id.tel;
  //   this.setData({
  //     tel: tel
  //   });
  //   wx.makePhoneCall({
  //     phoneNumber: tel,
  //     success: function () {
  //       console.log("拨打电话成功！")
  //     },
  //     fail: function () {
  //       console.log("拨打电话失败！")
  //     }
  //   })
  // },

  regionchange: () => {}
})