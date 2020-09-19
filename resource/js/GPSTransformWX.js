class GPSTransformWX {


  constructor(param) {
    //  this.ak = param["ak"];
  }

  transform(wgLat, wgLon) {

    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    if (this.outOfChina(wgLat, wgLon)) {
      return [wgLat, wgLon];
    }

    var dLat = this.transformLat(wgLon - 105.0, wgLat - 35.0);
    var dLon = this.transformLon(wgLon - 105.0, wgLat - 35.0);
    var radLat = wgLat / 180.0 * Math.PI;
    var magic = Math.sin(radLat);
    var magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);

    var mgLat = Number(wgLat) + Number(dLat);
    var mgLon = Number(wgLon) + Number(dLon);
    console.log("纬度" + dLat + "**" + wgLat + " ****" + mgLat);
    console.log("经度" + dLon + "**" + wgLon + " ****" + mgLon);
    return [mgLat, mgLon];

  }
  outOfChina(lat, lon) {

    if (lon < 72.004 || lon > 137.8347)
      return true;
    if (lat < 0.8293 || lat > 55.8271)
      return true;

    return false;

  }

  transformLat(x, y) {
    console.log("x=" + x + " y=" + y);
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;

    return ret;

  };

  transformLon(x, y) {

    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;

    return ret;

  };


}
module.exports.GPSTransformWX = GPSTransformWX;