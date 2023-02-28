Page({

  /**
   * 页面的初始数据
   */
  data: {
    history_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showLoading({
      title: '正在加载...',
    })
    let _this = this; 
    wx.cloud.callFunction({
        name: "ocr_history_controller",
        data: {
          type: "get_history_list"
        }
      }).then(resp => {
         console.log(resp.result.data.data)
         _this.setData({
             history_list:resp.result.data.data
         })
         wx.hideLoading({
           success: (res) => {},
         })
        })
        .catch(error => {

         })
    /**
     * 代码空缺，下面这段代码应该实现调用云函数get_history_list来获取所有上传历史，
     * 并将获取的值赋予history_list变量，请补全此代码。
     * 代码可以参考以下形式完成，或按自己的风格完成，能完成功能即可
     * wx.cloud.callFunction({
     *  ......
     * })
     * .then(resp => {
     *  ......
     * })
     * .catch(error => {
     *  ......
     * })
     */
    
  },

  //预览图片，放大预览
  preview(event) {
    let currentUrl = event.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: [currentUrl] // 需要预览的图片http链接列表
    })
  },

  to_detail(e) {
    let _id = e.currentTarget.id;
    wx.navigateTo({
      url: `/pages/detail/index?id=${_id}`,
    })
  }
})