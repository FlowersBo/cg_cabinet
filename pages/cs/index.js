// pages/cs/index.js
let that;
import * as echarts from '../../component/ec-canvas/echarts';
// function initChart(chart, data_item) {
//   // const chart = echarts.init(canvas, null, {
//   //   width: width,
//   //   height: height,
//   //   devicePixelRatio: dpr // new
//   // });
//   // canvas.setChart(chart);
// };
// 初始化图表
function initChart(chart,data_item) {
  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    title: {
      show: true,
      text: "这是标题",
      subtext: "Sub Title",
      left: "center",
      top: "center",
      textStyle: {
        fontSize: 30,
        textBorderColor: "rgba(54, 25, 238, 1)"
      },
      subtextStyle: {
        fontSize: 20
      },
    },
    series: [{
      label: {
        normal: {
          fontSize: 12 //图显示字体大小
        },
        lessonLine: {
          lazyLoad: true
        }
      },
      data: data_item,
      type: 'pie',
      radius: '50%',
      center: ['50%', '50%'],
      // radius: ['40%', '60%'],//设置环状图
    }]
  };
  chart.setOption(option);
  return chart;
};

// 折线图
function getLineOption(chart) {
  var option = {
    title: {
      text: '营业趋势'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    toolbox: {
      show: true,
      feature: {
        mark: {
          show: true
        },
        dataView: {
          show: true,
          readOnly: false
        },
        restore: {
          show: true
        },
        saveAsImage: {
          show: true
        }
      }
    },
    legend: {
      data: ['营业趋势']
    },
    grid: {
      left: '3%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      show: true,
      feature: {
        mark: {
          show: true
        },
        dataView: {
          show: true,
          readOnly: false
        },
        magicType: {
          show: true,
          type: ['line', 'bar', 'stack', 'tiled']
        },
        restore: {
          show: true
        },
        saveAsImage: {
          show: true
        }
      }
    },
    calculable: true,
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [820, 932, 801, 434, 1290, 830, 1320],
      type: 'line'
    }]
    // xAxis: [{
    //   type: 'category',
    //   boundaryGap: false,
    //   // data: this.data.consumeDay,//此处为数组
    //   axisLabel: {
    //     // interval: this.data.interval, //x轴间隔多少显示刻度
    //     interval: 0,
    //     fontSize: 8,
    //   }
    // }],
    // yAxis: [{
    //   type: 'value',
    //   axisLine: {
    //     show: true
    //   },
    //   axisTick: {
    //     show: true
    //   },
    // }],
    // series: [{
    //   name: '营业趋势',
    //   type: 'line',
    //   smooth: true,
    //   center: ['100%', '100%'],
    //   itemStyle: {
    //     normal: {
    //       color: '#56cbff',
    //       fontSize: '80',
    //       lineStyle: {
    //         color: '#56cbff'
    //       },
    //       areaStyle: {
    //         color: 'rgb(230,249,252)'
    //       },
    //     }
    //   },
    //   // data: this.data.consumeAmount,//此处为数组
    //   data: [1,2,3,4,5,6,7,8],//此处为数组
    // }]
  };
  chart.setOption(option);
  return chart;
  // return option;
};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    openSetting: 'open',
    ec: {
      onInit: getLineOption,
      lazyLoad: true //初始化加载
    },
    data_item: [{
      value: 55,
      name: '北京'
    }, {
      value: 20,
      name: '武汉'
    }, {
      value: 10,
      name: '杭州'
    }, {
      value: 20,
      name: '广州'
    }, {
      value: 38,
      name: '上海'
    }]
  },

  // 模拟请求数据
  simulateRequest: () => {
    that.initGraph(that.data.data_item);
  },

  initGraph: function (data_item) {
    this.oneComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      chart.on('click', function(handler, context) {
        // var handlerValue = handler.name + ' :  ' + handler.value
        var handlerValue = 'handler.name' + ' :  ' + 'handler.value'
        wx.showToast({
          title: handlerValue,
          icon: 'none',
          duration: 1200,
          mask: true
        })
      });
      // return chart;
      // canvas.setChart(chart);
      // initChart(chart, data_item);
      //  this.chart = chart;
      //  return chart;
    // initChart(chart,data_item);
    getLineOption(chart);
    });
  },




  // 弹窗组件
  statusNumberFn: function (e) {
    console.log(e.detail.status);
    this.setData({
      status: e.detail.status
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // this.mask = this.selectComponent('#mask');
    this.oneComponent = this.selectComponent('#mychart-dom-bar');
    // this.mask.util('open');
    that.simulateRequest();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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