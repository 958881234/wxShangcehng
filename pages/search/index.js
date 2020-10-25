import { request } from "../../request/index.js";//封装请求
import regeneratorRuntime from '../../lib/runtime/runtime';//es7异步方法
Page({
  // 取消按钮
  _handleCancel(){
    this.setData({
      inpValue:'',
      isFocus:false,
      goods:[]
    })
  },
  _handleInput(e){
    // 1、获得输入框值，验证合法性
    const {value}=e.detail;
    if(!value.trim()){
      this.setData({
        goods:[],isFocus:false //隐藏按钮，数组情空
      })
      return
    }
    this.setData({isFocus:true}); //显示取消按钮
    // 2、发送搜索请求，防抖功能
    clearTimeout(this.TimeId);//先清除定时器
    this.TimeId=setTimeout(()=>{
      this.qsearch(value)
    },1000)
  },
  async qsearch(query){
    console.log(query) //1
    console.log({query})// {query："1"}
    const res=await request({url:"/goods/qsearch",data:{query}});
    console.log(res)
    this.setData({
      goods:res
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    isFocus:false,//取消按钮 是否显示
    inpValue:'' //输入框的值
  },
  TimeId:-1,//定义全局定时器id
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