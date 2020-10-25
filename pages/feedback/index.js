// pages/feedback/index.js
Page({
  _handleTabsItemChange(e){
    console.log(e)
    const {index}=e.detail;
    const {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({tabs})
  },
  //1、点击+ 选择图片
  _handleChooseImg(){
    // 调用小程序选择图片api
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],//图片格式，原图，压缩
      sourceType: ['album','camera'],//图片来源，相册，相机
      success: (result) => {
        console.log(result)
        this.setData({
          // 客户传多次，咱们拼接,拿到数组图片 给子组件展示
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  // 2、点击自定义图片组件 -- 删除图片
  _handleRemoveImg(e){
    // 获取点击的索引，获取data图片数组，删除元素
    const {index}=e.currentTarget.dataset;
    let {chooseImgs}=this.data;
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },
  // 文本输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  // 提交按钮
  handleFormSubmit(){
    // 1、获取文本内容，并验合法性
    const {textVal,chooseImgs}=this.data;
    if(!textVal.trim()){
      wx.showToast({
        title: '输入不合法',icon:'none',mask:true
      });
      return;
    }
    wx.showLoading({
      title: '正在上传中..',mask:true
    })

// 判断有没有图片上传
    if(chooseImgs.length!=0){
         // 2、准备上传图片，到专门的图片服务器
    chooseImgs.forEach((v,i)=>{ //微信只能一个个上传，所以就遍历下
      wx.uploadFile({
        filePath: v,//上传文件路径
        name: 'file',//上传文件名称，后台获取
        url: 'https://images.ac.cn/Home/Index/UploadAction/',//上传到哪里（暂时用 新浪图床
        formData:{}, //顺带上传文本 信息
        success:(res)=>{
          console.log(res)
          let url = JSON.parse(res.data) //拿到外网路径，并把json解析
          this.UpLoadImgs.push(url); //把外网地址存起来
          //所有图片都上传成功才触发，把文本内容和外网图片数组提交到后台
          if(i===chooseImgs.length-1){
            wx.hideLoading();
            this.setData({
              textVal:'',
              chooseImgs:[]
            })
            wx.navigateBack({delta:1}) //清空图片和文字，返回上一层
          }
        }
      })
    })
    }else{
        wx.hideLoading();
        wx.navigateBack({delta:1}) 
        console.log('只提交了文本..')
    }



   
    
  },
  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      { id:0,value:"体验问题",isActive:true},
      { id:1,value:"商品，商家投诉",isActive:false},
     ],
     chooseImgs:[], // 被选中的图片路径数组
     textVal:'' //定义文本域
  },
  UpLoadImgs:[], // 外网的图片路径数组，在上传哪里用
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})