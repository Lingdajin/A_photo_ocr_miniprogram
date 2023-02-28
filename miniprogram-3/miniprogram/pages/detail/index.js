Page({

  /**
   * 页面的初始数据
   */
  data: {
    file_id: "",
    ocr_result: "",
    translate_result: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _id=options.id
    console.log(options)
    wx.showLoading({
      title: '正在加载...',
    })

    let _this = this;
    wx.cloud.callFunction({
      name: "ocr_history_controller",
      data: {
        type: "get_history_detail",
        _id: _id
      }
    })
    .then(resp => {
        console.log(resp)
      _this.setData({
        file_id: resp.result.data.data.file_id,
        ocr_result: resp.result.data.data.ocr_result,
        translate_result: resp.result.data.data.translate_result
      })
      wx.hideLoading();
    })
    .catch(err => {
      console.log("获取详细信息错误", err);
      wx.showToast({
        title: '出错了T_T，请重新加载',
        icon: 'none'
      })
      wx.hideLoading();
    })
  },

  //预览图片，放大预览
  preview(event) {
    let currentUrl = event.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: [currentUrl] // 需要预览的图片http链接列表
    })
  },
})