const clipImage = (src, imgW, imgH, cb) => {
  // ‘canvas’为前面创建的canvas标签的canvas-id属性值
  let ctx = wx.createCanvasContext('canvas');
  let canvasW = 640,
    canvasH = imgH;
  if (imgW / imgH > 5 / 4) {
    canvasW = imgH * 5 / 4;
    console.log("imgW / imgH > 5 / 4");
  } else if (imgW / imgH < 5 / 4) {
    canvasH = imgW * 4 / 5;
    console.log("imgW / imgH < 5 / 4");
  }else {
    canvasW = imgW;
    console.log("imgW / imgH = 5 / 4");
  }
  // 将图片绘制到画布
  ctx.drawImage(src, (imgW - canvasW) / 2, 0, canvasW, canvasH, 0, 0, canvasW, canvasH)
  // draw()必须要用到，并且需要在绘制成功后导出图片
  ctx.draw(false, () => {
    // setTimeout(() => {
    //  导出图片
    wx.canvasToTempFilePath({
      width: canvasW,
      height: canvasH,
      destWidth: canvasW,
      destHeight: canvasH,
      canvasId: 'canvas',
      fileType: 'jpg',
      success: (res) => {
        // res.tempFilePath为导出的图片路径
        typeof cb == 'function' && cb(res.tempFilePath);
      }
    })
    // }, 1);
  })
}
module.exports = clipImage