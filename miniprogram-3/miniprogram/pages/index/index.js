Page({
  data: {
    upload_button_message: "上传图片",
    disable_upload_button: false,
    ocr_result: "请上传图片以展示识别结果",
    translate_result: "请上传图片以展示翻译结果",
    imgSrc: ""
  },

  uploadImg() {
    let _this = this;
    _this.setData({
      upload_button_message: "正在处理...",
      disable_upload_button: true
    })
    // 让用户选择一张图片
    wx.chooseImage({
      count: 1,
      success: chooseResult => {
        var filePaths = chooseResult.tempFilePaths[0].split("/");
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: filePaths[filePaths.length-1],
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
        
        }).then(res => {
            console.log(chooseResult.tempFilePaths[0])
          var _res = res
          wx.serviceMarket.invokeService({
            service: 'wx79ac3de8be320b71',
            api: 'OcrAllInOne',
            data: {
              img_url: new wx.serviceMarket.CDN({
                type: "filePath",
                filePath: chooseResult.tempFilePaths[0]
              }),
              data_type: 3,
              ocr_type: 8
            }
          })
          .then(res => {
              console.log(res.data.ocr_comm_res.items.length)
            let ocr_result = ""
            for(let i=0; i<res.data.ocr_comm_res.items.length; i++) {
              ocr_result += res.data.ocr_comm_res.items[i].text;
              ocr_result += "\n"
            }
            console.log(ocr_result),
            wx.serviceMarket.invokeService({
            
              service: "wxf5c22ebbe4ed811e",
              api: "multilingualMT",
            data:{
              q: ocr_result,
              toLang: "en",
              fromLang: "zh_CN",
            }
            })
            
            .then(translate => {
                console.log(translate),
                console.log(_res)
              wx.cloud.callFunction({
                name: "ocr_history_controller",
                data: {
                  type: "add_history",
                  file_id: _res.fileID,
                  ocr_result: ocr_result,
                  translate_result: translate.data.Result
                }
              })
              
              .then(resp => {
                console.log(resp)
              })
              .catch(call_function_error => {

                console.log("添加记录错误", call_function_error);
                wx.showToast({
                  title: '添加记录出错啦！请重新上传',
                  icon: 'none'
                })
                _this.setData({
                  upload_button_message: "上传图片",
                  disable_upload_button: false
                });
                return;
              })
              _this.setData({
                imgSrc: _res.fileID,
                translate_result: translate.data.Result,
                ocr_result: ocr_result,
                upload_button_message: "上传图片",
                disable_upload_button: false
              });
            })
            .catch(translate_error => {
              console.log("翻译错误", translate_error);
              wx.showToast({
                title: '出错了T_T，请重新上传',
                icon: 'none'
              })
              _this.setData({
                upload_button_message: "上传图片",
                disable_upload_button: false
              });
            })
          })
          .catch(ocr_error => {
            console.log("识别错误", ocr_error);
            wx.showToast({
              title: '出错了T_T，请重新上传',
              icon: 'none'
            })
            _this.setData({
              upload_button_message: "上传图片",
              disable_upload_button: false
            });
          })
        }).catch(upload_error => {
          console.log("上传错误", upload_error);
          wx.showToast({
            title: '出错了T_T，请重新上传',
            icon: 'none'
          })
          _this.setData({
            upload_button_message: "上传图片",
            disable_upload_button: false
          });
        });
      },
      fail: choose_error => {
        console.log("选择照片错误", choose_error);
        wx.showToast({
          title: '出错了T_T，请重新上传',
          icon: 'none'
        })
        _this.setData({
          upload_button_message: "上传图片",
          disable_upload_button: false
        });
      }
    });
  },

  jumpPage(e) {
    wx.navigateTo({
      url: '/pages/history/index',
    });
  },

  //预览图片，放大预览
  preview(event) {
    let currentUrl = event.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: [currentUrl] // 需要预览的图片http链接列表
    })
  },
});