// const ApiRootUrl = 'https://w3.morninggo.cn/';
const ApiRootUrl = 'http://192.168.31.104:8080/morninggo_app_http_war/';
// const ApiRootUrl = 'http://192.168.126.228:8080/morninggo_app_http_war/';//中划线
module.exports = {
    RefreshAuth: ApiRootUrl + 'chuwugui/user/refresh_auth', //刷新授权
    Login: ApiRootUrl + 'chuwugui/user/auth', //登录授权
    VerificationCode: ApiRootUrl + 'chuwugui/user/smscode', //验证码

    Info: ApiRootUrl + 'chuwugui/user/info', //用户信息


    DeviceList: ApiRootUrl + 'chuwugui/device/devicelist', //设备列表
    AlarmList: ApiRootUrl + 'chuwugui/device/alarmlist', //设备报警

    OrderList: ApiRootUrl + 'chuwugui/order/orderlist', //订单列表
    OrderDetail: ApiRootUrl + 'chuwugui/order/orderdetail', //订单详情


    NearlySevendaysEchart: ApiRootUrl + 'chuwugui/report/7daysdata',
    NearlyMonthsEchart: ApiRootUrl + 'chuwugui/report/monthdata',
    NearlyThreeMonthsEchart: ApiRootUrl + 'chuwugui/user/info',
    LastTwelveMonthsEchart: ApiRootUrl + 'chuwugui/user/info',

    PointDataByDay: ApiRootUrl + 'chuwugui/report/pointdatabydate',
    PointDataByMonth: ApiRootUrl + 'chuwugui/report/pointdatabymonth',
    PointDataByHour: ApiRootUrl + 'chuwugui/report/pointdatahours',
    PointToday: ApiRootUrl + 'chuwugui/report/pointdatatoday',

    PointSummarybydate: ApiRootUrl + 'chuwugui/report/summarybydate',
    PointTransactionSummation: ApiRootUrl + 'chuwugui/report/pointdatasummary',

    GoodsCategroy: ApiRootUrl + '/chuwugui/goods/gettype',
    ShelvesGoodsInfo: ApiRootUrl + '/chuwugui/goods/getgoods',
    GoodsDetaillyInfo: ApiRootUrl + '/chuwugui/goods/getgoodsdetail',
    GoodsDescriptivePicture: ApiRootUrl + '/chuwugui/goods/getgoodsdetailpics',

    ShoppingCart: ApiRootUrl + "/chuwugui/goods/getshoppingcart",
    AppendShoppingCart: ApiRootUrl + "/chuwugui/goods/addshoppingcart",
    RemoveShoppingCart: ApiRootUrl + "/chuwugui/goods/removeshoppingcart",
    ModificationShoppingCart: ApiRootUrl + "/chuwugui/goods/updateshoppingcart",

    userContactInfo: ApiRootUrl + "/chuwugui/goods/getcontacts",
    UserAddContactInfo: ApiRootUrl + "/chuwugui/goods/addcontact",
    UserUpdateContactInfo: ApiRootUrl + "/chuwugui/goods/updatecontact",
    UserRemoveContactInfo: ApiRootUrl + "/chuwugui/goods/removecontact",

    CreatGoodsOder: ApiRootUrl + "/chuwugui/goods/generateorder",
    GetGoodsOder: ApiRootUrl + "/chuwugui/goods/getorders",
    Getshipfee: ApiRootUrl + "/chuwugui/goods/getshipfee",
    GetGoodsDetail: ApiRootUrl + "/chuwugui/goods/getorderdetail",

    UserPayment: ApiRootUrl + "/chuwugui/pay/wx_pay",
    UpdateOrderStatus: ApiRootUrl + "/chuwugui/goods/updateorder",
}