// component/console/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openSetting: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    content: '',
    showModalStatus: false
  },
  options: {
    multipleSlots: true // 启用多slot支持
  },
  /**
   * 组件的方法列表
   */
  methods: {
    gotobargainDetailFuns: function(e) {
      let status = e.currentTarget.dataset.status;
      this.util('close',status);
    },
    // 模态动画
    util: function(currentStatu,status){
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
          this.triggerEvent('statusNumber', { status: status });
        } else if (currentStatu == "open") {
          this.setData({
            showModalStatus: true
          });
        }
      }.bind(this), 300)
      // 显示
      // if (currentStatu == "open") {

      // }
    },
  }
})