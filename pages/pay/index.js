//引入封装请求地址方法（现在可以不用，因为不需要授权可以直接获取用户地址）
import {getSetting,chooseAddress,openSetting,showModal,showToast,requestPayment} from '../../utils/asyncWx.js';
import regeneratorRuntime from '../../lib/runtime/runtime';//es7异步方法
import { request } from "../../request/index.js";//封装请求
Page({
  // 封装购物车不同状态，重新计算，底部工具栏数据，全选，总价，价格
  _setCart(cart){
      let totalPrice=0;
      let totalNum=0;
      cart.forEach(v=>{
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      })
    this.setData({
      cart, totalPrice,totalNum
    })
  },
  // 点击支付按钮
  async _handleOrderPay(){
    try {
      // 1、判断缓存中有没有token
    const token=wx.getStorageSync("token");
    // 2 判断，没有token就去获取，有就创建订单
    if(!token){
      wx.navigateTo({
        url: '/pages/auto/index',
      });
    }else{//2.1创建订单,准备请求参数
      // const header={Authorization:token};//请求头---封装了已经
      const order_price=this.data.totalPrice;//订单总价格
      const consignee_addr=this.data.address.all;//收货地址
      // 3、订单数组：商品id，够买数量，单价
      const cart = this.data.cart;
      let goods=[];
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }))
      const orderParams={order_price,consignee_addr,goods}
      //4、拿到支付订单res
      const {order_number}=await request({url:"/my/orders/create",method:"POST",data:orderParams});
      //  4.1、发起 预支付接口
      const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}}); 
      // 5、发起微信支付
      await requestPayment(pay);
      // 6、查询后台 订单状态
      const res=await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}}); 
    }
      // 7 、手动删除缓存中 已经支付的商品,留下来未被选中的
      let newCart=wx.getStorageSync("cart");
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync('cart', newCart);

       await showToast({title:"支付成功"})
      //  7、支付成功 跳到订单页面
      wx.navigateTo({
        url: '/pages/order/index',
      })
    } catch (error) {
      await showToast({title:"支付失败"})
      console.log(error)
    }
    
  },
  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    totalPrice:0, //总价格，总数量
    totalNum:0
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 1 获取缓存的收货地址
    const address=wx.getStorageSync('address');
    // 2、获取缓存的购物车数据并渲染
    let cart=wx.getStorageSync('cart') || [];
    // 过滤后的购物车数组
    cart=cart.filter(v=>v.checked);
    this.setData({address})
    this._setCart(cart);
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