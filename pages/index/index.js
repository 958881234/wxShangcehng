// 封装异步请求
import{request} from "../../request/index.js";
Page({
  _getSwiperList(){
    request({url: '/home/swiperdata'})
    .then(res=>{
      console.log(res)
      this.setData({
        swiperList : res
      })
    })
  },
  _getCateList(){
    request({url: '/home/catitems'})
    .then(res=>{
      this.setData({
        catesList : res
      })
    })
  },
  _getFloorList(){
    request({url: '/home/floordata'})
    .then(res=>{
      console.log( res)
      this.setData({
        floorList : res
      })
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[],
    catesList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success:(res)=>{
    //     console.log(res)
    //     this.setData({
    //       swiperList : res.data.message
    //     })
    //   }
    // })
    // 使用reques 封装异步请求，promise
    this._getSwiperList()
    this._getCateList()
    this._getFloorList()
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