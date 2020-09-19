//const ApiRootUrl = 'https://w3.morninggo.cn/';
const ApiRootUrl = 'http://192.168.31.104:8080/';
module.exports = {
    Login: ApiRootUrl + 'morninggo_app_http_war/applets/checkUserByOpenid', //登录授权code

    PhoneNumber: ApiRootUrl + 'morninggo_app_http_war/applets/obtainPhone', //授权手机号，获取扫码信息

    paymentAuthorization: ApiRootUrl + 'morninggo_app_http_war/applets/paymentAuthorization', //授权免密支付

    Location: ApiRootUrl + 'morninggo_app_http_war/applets/queryNearbyPoints', //位置信息

    OrderList: ApiRootUrl + 'morninggo_app_http_war/applets/queryOrderList', //订单列表
    OrderDetail: ApiRootUrl + 'morninggo_app_http_war/applets/queryOrderById', //订单详情

    Info: ApiRootUrl + 'app/user/info', //用户信息

    VerificationCode: ApiRootUrl + 'app/user/smscode', //验证码

    RefreshAuth: ApiRootUrl + 'app/user/refresh_auth', //刷新授权

}