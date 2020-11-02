import * as echarts from '../../component/ec-canvas/echarts';
import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
import * as util from '../../utils/util';

function initChart(canvas, width, height, xsign, xdata) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    xAxis: {
      boundaryGap: false,
      type: 'category',
      data: xsign
    },
    yAxis: {
      type: 'value'
    },
    grid: {
      top: 20,
      left: 50,
      height: 100
    },
    series: [{
      data: xdata,
      type: 'line'
    }]
  };
  chart.setOption(option);
  return chart;
}

Page({

  data: {
    loadText: '加载中...',
    dateRangeindex: 0,
    info: {
      reportGenres: ['销售日报', '销售月报'],
      dateRange: [
        ['今日', '近7天'],
        ['前一个月', '前两个月'],
      ],
    },

    reportTotal: {
      '销售额': 0,
      '订单量': 0
    },
    graphGenres: [{
        title: ['近七天销售额', '近七天订单量', '近七天销售量'],
      },
      {
        title: ['近3个月销售额', '近3个月订单量', '近3个月销售量'],
      },
      {
        title: ['近6个月销售额', '近6个月订单量', '近6个月销售量'],
      },
      {
        title: ['近12个月销售额', '近12个月订单量', '近12个月销售量'],
      },
    ],

    reportDetail: {
      titles: ['点位', '销售额', '销售量', '时段'],
      titleUrls: ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', ''],
    },

    reportGenre: 0,
    dateRange: 0,

    saleroomSort: 0,
    salesVolumeSort: 0,

    isShowGraph: false,
    graphGenre: 0,

    chartsTitleGenre: 0,
    chartsData: {},
    charts: [],

    pageIndex: 1,
    pageSize: 4,

    pointsData: [],

    serchContent: '',
    // isShow: false,
    url: "../../assets/img/arrow.png",
    // iShow: true,  

    ec: {
      onInit: initChart
    },
    ecDatas: [],
    ecxsign: [
      [1, 2, 3, 4, 5, 6, 7],
      [1, 2, 3],
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    ],
    pointDetaillyDate: '',

    isSaleAmountSort: false,
    isSaleCountSort: false,
    pointSort: 1, //默认点位表排序按销售额升序
    pointTotal: 0,
  },

  onLoad: function () {
    let that = this;
    let dateRange = that.data.dateRange;
    this.renderTransactionSummation(dateRange)
    this.renderChart(dateRange);
    this.renderReport(dateRange);
  },

  selectedReportGenres: function (e) {

    let that = this;
    let index = e.currentTarget.dataset.index;
    let dateRangeindex = that.data.dateRangeindex;
    let dateRange = parseInt('' + index + dateRangeindex);
    let reportDetail = that.data.reportDetail;
    reportDetail[1] = '../../assets/img/arrow.png';
    reportDetail[2] = '../../assets/img/arrow.png';

    this.renderTransactionSummation(dateRange)
    this.renderChart(dateRange);
    this.renderReport(dateRange);

    this.setData({
      reportGenre: index,
      dateRange: dateRange,
      reportDetail: reportDetail,
    });
  },

  selectedDateRange: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let reportGenre = that.data.reportGenre;
    let dateRange = parseInt('' + reportGenre + index);
    let reportDetail = that.data.reportDetail;
    reportDetail[1] = '../../assets/img/arrow.png';
    reportDetail[2] = '../../assets/img/arrow.png';

    this.renderTransactionSummation(dateRange)
    this.renderChart(dateRange);
    this.renderReport(dateRange);

    this.setData({
      dateRange: dateRange,
      dateRangeindex: index,
      reportDetail: reportDetail,
    });
  },

  renderReportTotal: function (startDate, endDate) {
    let that = this;
    let reportTotal = that.data.reportTotal;
    let data = {
      begindate: startDate,
      enddate: endDate,
    };

    mClient.get(api.PointSummarybydate, data)
      .then(resp => {
        reportTotal['销售额'] = resp.data.data.summary.amount;
        reportTotal['订单量'] = resp.data.data.summary.count;
        reportTotal['销售量'] = resp.data.data.summary.productcount;
        console.log(reportTotal)
        this.setData({
          reportTotal: reportTotal,
        });
      });
  },

  renderTransactionSummation: function (dateRange = 0, pointName = '', pageIndex = 1, pointsData = []) {
    let that = this;
    let pointReportDate = new Date();
    let pointSummationReportDate = new Date();

    this.setData({
      loadText: '加载中...',
    })

    if (dateRange === 0 || dateRange === 2) {
      if (dateRange === 0) {
        pointReportDate.setDate(pointReportDate.getDate());
        let startDate = util.customFormatTime(pointReportDate);
        let endDate = util.customFormatTime(pointReportDate);

        let pointDetaillyDate = util.customFormatOnlyMonthDay(pointReportDate);
        this.setData({
          pointDetaillyDate: pointDetaillyDate
        });

        this.renderReportTotal(startDate, endDate);
      }

      if (dateRange === 2) {
        pointReportDate.setDate(pointReportDate.getDate() - 1);
        let endDate = util.customFormatTime(pointReportDate);
        let pointDetaillyEndDate = util.customFormatOnlyMonthDay(pointReportDate);

        pointReportDate.setDate(pointReportDate.getDate() - 30);
        let startDate = util.customFormatTime(pointReportDate);
        let pointDetaillyStartDate = util.customFormatOnlyMonthDay(pointReportDate);

        let pointDetaillyDate = pointDetaillyStartDate + '~' + pointDetaillyEndDate;
        this.setData({
          pointDetaillyDate: pointDetaillyDate
        });

        this.renderReportTotal(startDate, endDate);
      }

    } else {
      if (dateRange === 1) {
        pointReportDate.setDate(pointReportDate.getDate() - 1);
        let endDate = util.customFormatTime(pointReportDate);
        let pointDetaillyEndDate = util.customFormatOnlyMonthDay(pointReportDate);

        pointReportDate.setDate(pointReportDate.getDate() - 7);
        let startDate = util.customFormatTime(pointReportDate);
        let pointDetaillyStartDate = util.customFormatOnlyMonthDay(pointReportDate);

        let pointDetaillyDate = pointDetaillyStartDate + '~' + pointDetaillyEndDate;
        this.setData({
          pointDetaillyDate: pointDetaillyDate
        });

        this.renderReportTotal(startDate, endDate);
      }

      if (dateRange === 10) {
        pointSummationReportDate.setMonth(pointSummationReportDate.getMonth() - 1);
        let endDateReportTotal = util.customFormatTime(pointSummationReportDate);
        let pointDetaillyEndDate = util.customFormatOnlyMonth(pointSummationReportDate);

        pointSummationReportDate.setMonth(pointSummationReportDate.getMonth() - 2);
        let startDateReportTotal = util.customFormatTime(pointSummationReportDate);
        let pointDetaillyStartDate = util.customFormatOnlyMonth(pointSummationReportDate);

        let pointDetaillyDate = pointDetaillyStartDate + '~' + pointDetaillyEndDate;
        this.setData({
          pointDetaillyDate: pointDetaillyDate
        });

        this.setData({
          pointDetaillyDate: pointDetaillyDate
        });

        this.renderReportTotal(startDateReportTotal, endDateReportTotal);
      }

      if (dateRange === 11) {
        pointSummationReportDate.setMonth(pointSummationReportDate.getMonth() - 1);
        let endDateReportTotal = util.customFormatTime(pointSummationReportDate);
        let pointDetaillyEndDate = util.customFormatOnlyMonth(pointSummationReportDate);

        pointSummationReportDate.setMonth(pointSummationReportDate.getMonth() - 5);
        let startDateReportTotal = util.customFormatTime(pointSummationReportDate);
        let pointDetaillyStartDate = util.customFormatOnlyMonth(pointSummationReportDate);

        let pointDetaillyDate = pointDetaillyStartDate + '~' + pointDetaillyEndDate;
        this.setData({
          pointDetaillyDate: pointDetaillyDate
        });

        this.renderReportTotal(startDateReportTotal, endDateReportTotal);
      }

      if (dateRange === 12) {
        pointSummationReportDate.setMonth(pointSummationReportDate.getMonth() - 1);
        let endDateReportTotal = util.customFormatTime(pointSummationReportDate);
        let pointDetaillyEndDate = util.customFormatOnlyMonth(pointSummationReportDate);

        pointSummationReportDate.setMonth(pointSummationReportDate.getMonth() - 11);
        let startDateReportTotal = util.customFormatTime(pointSummationReportDate);
        let pointDetaillyStartDate = util.customFormatOnlyMonth(pointSummationReportDate);

        let pointDetaillyDate = pointDetaillyStartDate + '~' + pointDetaillyEndDate;
        this.setData({
          pointDetaillyDate: pointDetaillyDate
        });
        this.renderReportTotal(startDateReportTotal, endDateReportTotal);
      }
    }
  },

  renderReport: function (dateRange = 0, pointName = '', pageIndex = 1, pointsData = []) {
    let that = this;
    let pointReportDate = new Date();
    let pointSort = that.data.pointSort;
    let pageSize = that.data.pageSize;
    let pointTotal = 0;

    this.setData({
      loadText: '加载中...',
    })

    if (dateRange === 0 || dateRange === 2) {
      if (dateRange === 0) {
        let data = {
          pageindex: pageIndex,
          pagesize: pageSize,
          order: pointSort,
          name: pointName
        };

        mClient.get(api.PointToday, data)
          .then(resp => {
            pointsData = pointsData.concat(resp.data.data.list);
            pointTotal = resp.data.data.total
            if ((pointTotal / pageSize) < pageIndex) {
              this.setData({
                loadText: '已经到底了',
              })
            }
            this.setData({
              pointsData: pointsData,
              pageIndex: pageIndex + 1,
              pointTotal: pointTotal,
            });
          });
      }

      if (dateRange === 2) {
        pointReportDate.setDate(pointReportDate.getDate() - 1);
        let endDate = util.customFormatTime(pointReportDate);

        pointReportDate.setDate(pointReportDate.getDate() - 30);
        let startDate = util.customFormatTime(pointReportDate);


        let data = {
          start: startDate,
          end: endDate,
          pageindex: pageIndex,
          pagesize: pageSize,
          order: pointSort,
          name: pointName
        };


        mClient.get(api.PointDataByDay, data)
          .then(resp => {
            pointsData = pointsData.concat(resp.data.data.list);
            pointTotal = resp.data.data.total
            if ((pointTotal / pageSize) < pageIndex) {
              this.setData({
                loadText: '已经到底了',
              })
            }
            this.setData({
              pointsData: pointsData,
              pageIndex: pageIndex + 1,
              pointTotal: pointTotal
            });
          });
      }

    } else {
      if (dateRange === 1) {
        pointReportDate.setDate(pointReportDate.getDate() - 1);
        let endDate = util.customFormatTime(pointReportDate);

        pointReportDate.setDate(pointReportDate.getDate() - 7);
        let startDate = util.customFormatTime(pointReportDate);

        let data = {
          start: startDate,
          end: endDate,
          pageindex: pageIndex,
          pagesize: pageSize,
          order: pointSort,
          name: pointName
        };

        mClient.get(api.PointDataByDay, data)
          .then(resp => {
            pointsData = pointsData.concat(resp.data.data.list);
            pointTotal = resp.data.data.total
            if ((pointTotal / pageSize) < pageIndex) {
              this.setData({
                loadText: '已经到底了',
              })
            }
            this.setData({
              pointsData: pointsData,
              pageIndex: pageIndex + 1,
              pointTotal: pointTotal
            });
          });
      }

      if (dateRange === 10) {
        pointReportDate.setMonth(pointReportDate.getMonth() - 1);
        let endDate = util.customFormatMonth(pointReportDate);

        pointReportDate.setMonth(pointReportDate.getMonth() - 2);
        let startDate = util.customFormatMonth(pointReportDate);

        let data = {
          start: startDate,
          end: endDate,
          pageindex: pageIndex,
          pagesize: pageSize,
          order: pointSort,
          name: pointName
        };

        mClient.get(api.PointDataByMonth, data)
          .then(resp => {
            pointsData = pointsData.concat(resp.data.data.list);
            pointTotal = resp.data.data.total
            if ((pointTotal / pageSize) < pageIndex) {
              this.setData({
                loadText: '已经到底了',
              })
            }
            this.setData({
              pointsData: pointsData,
              pageIndex: pageIndex + 1,
              pointTotal: pointTotal
            });
          });
      }

      if (dateRange === 11) {
        pointReportDate.setMonth(pointReportDate.getMonth() - 1);
        let endDate = util.customFormatMonth(pointReportDate);

        pointReportDate.setMonth(pointReportDate.getMonth() - 5);
        let startDate = util.customFormatMonth(pointReportDate);

        let data = {
          start: startDate,
          end: endDate,
          pageindex: pageIndex,
          pagesize: pageSize,
          order: pointSort,
          name: pointName
        };

        mClient.get(api.PointDataByMonth, data)
          .then(resp => {
            pointsData = pointsData.concat(resp.data.data.list);
            pointTotal = resp.data.data.total
            if ((pointTotal / pageSize) < pageIndex) {
              this.setData({
                loadText: '已经到底了',
              })
            }
            this.setData({
              pointsData: pointsData,
              pageIndex: pageIndex + 1,
              pointTotal: pointTotal
            });
          });
      }

      if (dateRange === 12) {

        pointReportDate.setMonth(pointReportDate.getMonth() - 1);
        let endDate = util.customFormatMonth(pointReportDate);

        pointReportDate.setMonth(pointReportDate.getMonth() - 11);
        let startDate = util.customFormatMonth(pointReportDate);

        let data = {
          start: startDate,
          end: endDate,
          pageindex: pageIndex,
          pagesize: pageSize,
          order: pointSort,
          name: pointName
        };

        mClient.get(api.PointDataByMonth, data)
          .then(resp => {
            pointsData = pointsData.concat(resp.data.data.list);
            pointTotal = resp.data.data.total
            if ((pointTotal / pageSize) < pageIndex) {
              this.setData({
                loadText: '已经到底了',
              })
            }
            this.setData({
              pointsData: pointsData,
              pageIndex: pageIndex + 1,
              pointTotal: pointTotal
            });
          });
      }
    }
  },

  renderChart: function (dateRange = 0) {
    if (dateRange === 0 || dateRange === 2) {
      this.setData({
        isShowGraph: false
      });
      return;
    } else {
      this.setData({
        isShowGraph: false
      });

      if (dateRange === 1) {

        let echartGenre = 0;
        this.setData({
          chartsTitleGenre: echartGenre
        })
        mClient.get(api.NearlySevendaysEchart)
          .then(resp => {
            this.setData({
              chartsData: resp.data.data,
            });
            this.createChart(echartGenre);
          });
      }

      if (dateRange === 10) {

        let echartGenre = 1;
        this.setData({
          chartsTitleGenre: echartGenre
        })
        mClient.get(api.NearlyMonthsEchart)
          .then(resp => {
            this.setData({
              chartsData: resp.data.data,
            });

            this.createChart(echartGenre);
          });
      }

      if (dateRange === 11) {

        let echartGenre = 2;
        this.setData({
          chartsTitleGenre: echartGenre
        })
        mClient.get(api.NearlyMonthsEchart)
          .then(resp => {
            this.setData({
              chartsData: resp.data.data,
            });
            this.createChart(echartGenre);
          });
      }

      if (dateRange === 12) {

        let echartGenre = 3;
        this.setData({
          chartsTitleGenre: echartGenre
        })
        mClient.get(api.NearlyMonthsEchart)
          .then(resp => {
            this.setData({
              chartsData: resp.data.data,
            });
            this.createChart(echartGenre);
          });
      }
    }
  },

  createChart: function (echartGenre) {

    let that = this;
    let data = [];
    let reportCharts = [];
    let salesAmountchartObject = that.data.chartsData.salesAmount;
    let ordersCountchartObject = that.data.chartsData.ordersCount;
    let salesCountchartObject = that.data.chartsData.salesCount;
    console.log(that.data.chartsData)
    data.push(that.convertDictionaryToArray(salesAmountchartObject, echartGenre));
    data.push(that.convertDictionaryToArray(ordersCountchartObject, echartGenre));
    data.push(that.convertDictionaryToArray(salesCountchartObject, echartGenre));
    console.log(data)
    this.setData({
      ecDatas: data,
      isShowGraph: true
    });
  },

  convertDictionaryToArray: function (dirt = {}, echartGenre = 0) {
    let dataArray = [];
    for (let item in dirt) {
      dataArray.push(dirt[item]);
    }
    let arrayLength = dataArray.length;
    if (echartGenre === 1) {
      dataArray = dataArray.slice(arrayLength - 3, arrayLength)
    } else if (echartGenre === 2) {
      dataArray = dataArray.slice(arrayLength - 6, arrayLength)
    } else if (echartGenre === 3) {
      dataArray = dataArray.slice(arrayLength - 12, arrayLength)
    }

    return dataArray;
  },

  bindReportDetaill: function (e) {
    let that = this;
    let point = e.currentTarget.dataset.point;
    wx.navigateTo({
      url: '../report_details/report_details?pointid=' + point.PointID + "&pointName=" + point.PointName
    })
  },

  bindSerchContentInput: function (e) {
    this.setData({
      serchContent: e.detail.value
    })
  },

  bindPointSerch: function (e) {
    let that = this;
    let dateRange = that.data.dateRange;
    let serchContent = e.detail.value;

    this.renderReport(dateRange, serchContent);
  },

  bindPointSort: function (e) {
    let that = this;
    let isSaleAmountSort = that.data.isSaleAmountSort;
    let isSaleCountSort = that.data.isSaleCountSort;
    let index = e.currentTarget.dataset.index;
    let dateRange = that.data.dateRange;
    let reportDetail = that.data.reportDetail;

    if (index === 1) {
      reportDetail.titleUrls[2] = '../../assets/img/arrow.png';
      if (isSaleAmountSort === false) {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-h.png';
        this.setData({
          isSaleAmountSort: true,
          pointSort: 2,
          reportDetail: reportDetail
        })
      } else {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-l.png';
        this.setData({
          isSaleAmountSort: false,
          pointSort: 1,
          reportDetail: reportDetail
        })
      }
    } else if (index === 2) {
      reportDetail.titleUrls[1] = '../../assets/img/arrow.png';
      if (isSaleCountSort === false) {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-h.png';
        this.setData({
          isSaleCountSort: true,
          pointSort: 4,
          reportDetail: reportDetail
        })
      } else {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-l.png';
        this.setData({
          isSaleCountSort: false,
          pointSort: 3,
          reportDetail: reportDetail
        })
      }
    } else {
      return;
    }

    this.renderReport(dateRange);
  },

  bindLoading: function () {
    let that = this;
    let pointsData = that.data.pointsData;
    let pageIndex = that.data.pageIndex;
    let dateRange = that.data.dateRange;
    let pageSize = that.data.pageSize;
    let pointTotal = that.data.pointTotal;

    if ((pointTotal / pageSize) < pageIndex) {
      this.setData({
        loadText: '已经到底了',
      })
    }

    if (((pageIndex * pageSize) - pointTotal) > pageSize) {
      wx.showToast({
        title: '已经到底了',
        icon: 'none',
        duration: 1000
      });

      this.setData({
        loadText: '已经到底了',
      })
      return;
    };

    this.renderReport(dateRange, '', pageIndex, pointsData);
    this.setData({
      pageIndex: pageIndex + 1,
    })
  },
})