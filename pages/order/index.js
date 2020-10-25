import { request } from "../../request/index.js";//封装请求
import regeneratorRuntime from '../../lib/runtime/runtime';//es7异步方法
Page({
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    const {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({tabs})
  },
  // 1、从子组件传递过来的
  _handleTabsItemChange(e){
    console.log(e)
    const {index}=e.detail;//获取被点击标题索引
    this.changeTitleByIndex(index)
    // 重新发送请求,type=1,index=0
    this._getOrders(index+1)
  },
    // 2、获取订单列表
async _getOrders(type){
  const res=await request({url:"/my/orders/all",data:{type}});
  console.log(res)
  this.setData({
    // 处理时间戳数据重构：...是先拿出来，定义个新的create_time_cn，把旧的create_time处理在放回去
    // orders:res.orders
    orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
  })
},

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      { id:0,value:"全部",isActive:true},
      { id:1,value:"待付款",isActive:false},
      { id:2,value:"代收货",isActive:false},
      { id:3,value:"退款/退货",isActive:false},
     ],
     orders:[]
  },
  onShow: function () {
    // 1、如果没有token，先去去获取
    const token=wx.getStorageSync('token');
    // if(!token){
    //   wx.navigateTo({url:'/pages/auto/index'})
    //   return;
    // }
  //1、 onShow不同于onLoad无法接受形参值，使用小程序页面栈-数组
    let pages = getCurrentPages()
    //2、数组中索引最大页面就是当前页面
    let currentPage=pages[pages.length-1];
    // 3、获取url上的type参数 并获取订单
    const {type} = currentPage.options;
    console.log(type)
    // 4、激活选中页面标题，当type=1，index=0
    this.changeTitleByIndex(type-1);
    this._getOrders(type);
  },
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