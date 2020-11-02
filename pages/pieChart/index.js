// pages/cs/index.js
let that;
import * as echarts from '../../component/ec-canvas/echarts';
import * as util from '../../utils/util'
// 饼状图
function initChart(chart, data_item) {
  var option = {
    backgroundColor: "#ffffff",
    color: ["#C23831", "#334B5C", "#61A0A8", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    title: {
      text: '测试饼状图',
      left: 'center',
    },
    legend: {
      data: ['小柜', '中柜', '大柜'],
      top: '5%',
      left: '5%',
      z: 100,
      selectedMode: true, //是否可选显示
      orient: 'vertical',
      textStyle: {
        fontStyle: 'oblique'
      }
    },
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: "销售额 \n{b} : {c} ({d}%)",
      // formatter: "{b} : {c} ({d}%)", //{a} <br/>
      // formatter: function (params) {
      //   console.log(params)
      //   var result = '';
      //   params.forEach(function (item) {
      //     result += item.marker + " " + item.seriesName + " : " + item.value + "</br>";
      //   });
      //   return result;
      // },
    },
    toolbox: {
      show: true,
      feature: {
        mark: {
          show: true
        }
      }
    },
    calculable: true,
    series: [{
      label: {
        normal: {
          fontSize: 12 //图显示字体大小
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
function getLineOption(chart, data_item1, ecDatas) {
  var option = {
    title: {
      text: '测试营业趋势',
      left: 'center'
    },
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
    legend: {
      data: ['A', 'B', 'C'],
      top: 40,
      left: 'center',
      backgroundColor: 'yellow',
      z: 100,
      selectedMode: true,
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data_item1,
      // show: false //是否显示X轴
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    grid: {
      left: '3%',
      bottom: '3%',
      containLabel: true
    },
    series: ecDatas
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
      value: 45,
      name: '小柜'
    }, {
      value: 46,
      name: '中柜'
    }, {
      value: 60,
      name: '大柜'
    }],
    data_item1: '',
    ecDatas: [{
      name: 'A',
      smooth: true,
      type: 'line',
      data: [18, 36, 65, 30, 78, 40, 33,67,66,12,99,70]
    }, {
      name: 'B',
      smooth: true,
      type: 'line',
      data: [12, 50, 51, 35, 70, 30, 20]
    }, {
      name: 'C',
      smooth: true,
      type: 'line',
      data: [10, 30, 31, 50, 40, 20, 10]
    }]
  },

  // 模拟请求数据
  simulateRequest: () => {
    that.initGraph(that.data.data_item1, that.data.ecDatas);
  },

  initGraph: function (data_item, ecDatas) {
    this.oneComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });

      // chart.on('click', function (handler, context) {
      //   // var handlerValue = handler.name + ' :  ' + handler.value
      //   var handlerValue = '北京' + ' :  ' + '55'
      //   wx.showToast({
      //     title: handlerValue,
      //     icon: 'none',
      //     duration: 1200,
      //     mask: true
      //   })
      // });

      canvas.setChart(chart);
      // initChart(chart, data_item);
      getLineOption(chart, data_item, ecDatas);
      //  this.chart = chart;
      return chart;
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
    const monthDate = util.getPreMonthDate();
    console.log(monthDate) //获取当前月份天数
    that.setData({
      data_item1: monthDate
    })
    // this.mask = this.selectComponent('#mask');
    this.oneComponent = this.selectComponent('#mychart-dom-bar');
    // this.mask.util('open');
    that.simulateRequest();
    // that.formatter();
    
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