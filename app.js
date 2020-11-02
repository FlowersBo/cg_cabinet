//app.js
App({
  globalData: {
    // siteroot: 'http://192.168.1.129:8080',
    userTouch: 0
  },
  onShow: function (options) {
    console.log("app-onShow");
    let that = this;
    console.log('当前场景值', options.scene);
    if (options.scene === 1038 || options.referrerInfo.appId == 'wxd8f3793ea3b935b8') { // 场景值1038：从被打开的小程序返回,但安卓手机返回的是10001，所以只能根据appid去识别支付分的。
      console.log("返回小程序")
      that.globalData.userTouch = 1;
    }
  },

  onLaunch: function () {
    const that = this;
    this.autoUpdate();
    wx.getSystemInfo({
      success: e => {
        that.globalData.screenWidth = e.screenWidth;
        that.globalData.screenHeight = e.screenHeight;
        that.globalData.windowWidth = e.windowWidth;
        that.globalData.windowHeight = e.windowHeight;
        that.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          that.globalData.Custom = capsule;
          that.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          that.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },

  //纸飞机向右下滑动渐入渐出
  sliderightupshow: function (that, param, px1, px2, opacity) {
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translate(px1, px2).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },

  // 版本更新
  autoUpdate: function () {
    var self = this;
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      console.log(new Date())
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log("请求完新版本信息的回调", new Date())
          //2. 小程序有新版本，则静默下载新版本，做好更新准备
          updateManager.onUpdateReady(function () {
            console.log("有新版本", new Date())
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  //3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                } else if (res.cancel) {
                  //如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                  wx.showModal({
                    title: '温馨提示~',
                    content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                    success: function (res) {
                      self.autoUpdate()
                      return;
                      //第二次提示后，强制更新                      
                      if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                      } else if (res.cancel) {
                        //重新回到版本更新提示
                        self.autoUpdate()
                      }
                    }
                  })
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }

})