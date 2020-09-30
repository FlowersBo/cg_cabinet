const ApiRootUrl = 'https://w3.morninggo.cn/';
// const ApiRootUrl = 'http://192.168.31.104:8080/morninggo_app_http_war/';
// const ApiRootUrl = 'http://192.168.31.148:8080/morninggo_app_http_war_exploded/';
module.exports = {
    Login: ApiRootUrl + 'applets/checkUserByOpenid', //登录授权code

    PhoneNumber: ApiRootUrl + 'applets/obtainPhone', //授权手机号，获取扫码信息

    chargingRules: ApiRootUrl + 'applets/chargingRules', //计费规则
    paymentAuthorization: ApiRootUrl + 'applets/paymentAuthorization', //授权免密支付
    permissionsToken: ApiRootUrl + 'applets/getApplyPermissionsToken', //拉起微信支付分

    Location: ApiRootUrl + 'applets/queryNearbyPoints', //位置信息

    OrderList: ApiRootUrl + 'applets/queryOrderList', //订单列表
    OrderDetail: ApiRootUrl + 'applets/queryOrderById', //订单详情





    Info: ApiRootUrl + 'app/user/info', //用户信息

    VerificationCode: ApiRootUrl + 'app/user/smscode', //验证码

    RefreshAuth: ApiRootUrl + 'app/user/refresh_auth', //刷新授权

}