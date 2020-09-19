var that;
var wxRequest = require('requestUrl.js');
const app = getApp();
const wxLogin = () => {
  return new Promise(function (resolve, reject) {
  wx.login({
    success(res) {
      if (res.code) {
        var code = res.code;
        var loginType = "4";
        var dataUrl = "/auth/login";
        var param = {
          code: code,
          loginType: loginType
        };
        wxRequest(dataUrl, param)
          .then(function(res) {
            console.log('二次登录返回',res);
            // token过期替换
            if (res.code == '0000') {
              var authToken = res.authToken;
              wx.setStorageSync('token', authToken);
            }
            resolve(res);
          })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
})
}
module.exports = wxLogin