const app = getApp();
// const siteRoots = app.data.siteroot;
const wxRequest = (url, data = {}, method = 'POST') => {
  // wx.showLoading({
  //   mask: true,
  //   title: '加载中...',
  // })
  // let param = objectToJsonParams(data);
  console.log(data);
  let open_id = wx.getStorageSync('open_id');
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'charset': 'utf-8',
        'content-type': 'application/json', // 默认值
        'app-access-token': open_id,
      },
      success: function (res) {
        // console.log('请求数据',res);
        // wx.hideLoading();
        if (res.statusCode != 200) {
          reject({
            error: '服务器忙，请稍后重试',
            code: 500
          });
          return;
        }
        resolve(res.data);
      },
      fail: function (res) {
        // fail调用接口失败
        reject({
          error: '网络错误',
          code: 0
        });
      },
      complete: function (res) {
        // complete
      }
    })
  })
}
const wxGetRequest = (url, data = {}, method = 'GET') => {
  let param = objectToJsonParams(data);
  console.log(url + param);
  let open_id = wx.getStorageSync('open_id');
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url + param,
      method: method,
      header: {
        'charset': 'utf-8',
        'Content-Type': 'application/json',
        'app-access-token': open_id
      },
      success: function (resp) {
        console.log(resp);
        if (resp.statusCode === 200) {
          resolve(resp);
        } else {
          reject(resp.errMsg);
        }

        //Unauthorized
        if (resp.statusCode === 401) {
          refreshToken().then((resp) => {
            if (resp.data.code === 200) {
              request(url, data, method).then((resp) => {
                resolve(resp);
              });
            } else {
              reject(resp);
            }
          });
        } else {
          resolve(resp.data);
        }
      },
      fail: function (err) {
        reject(err)
        console.log("failed")
      }
    })
  });
}

//wx login
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function objectToJsonParams(data = {}) {
  var arr = Object.keys(data);
  if (arr === 0) {
    return '';
  } else {
    let params = '?' + JSON.stringify(data).replace(/{/g, '').replace(/}/g, '').replace(/:/g, '=').replace(/\"/g, '').replace(/\,/g, '&');
    return params;
  }
}
module.exports = {
  wxRequest,
  wxGetRequest,
  login
}