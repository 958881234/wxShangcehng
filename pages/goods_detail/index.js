import { request } from "../../request/index.js";//封装请求
import regeneratorRuntime from '../../lib/runtime/runtime';//es7异步方法
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect:true // 初始未收藏
  },
  // 全局商品对象
  GoodsInfo:{},

  onShow: function () {
    //1、 onShow不同于onLoad无法接受形参值，使用小程序页面栈-数组
    let pages = getCurrentPages()
    //2、数组中索引最大页面就是当前页面
    let currentPage=pages[pages.length-1];
    // 3、获取url上的type参数 并获取订单
    const {goods_id} = currentPage.options;
    this._getGoodsDetail(goods_id);
  },
  onLoad: function (options) {
    
  },
// 1、获取商品详情
  async _getGoodsDetail(goods_id){
    const res=await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo=res;
    // 1、获取缓存中商品收藏数组，
    let collect= wx.getStorageSync('collect')||[];
    // 2、判断当前商品是否被收藏
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    console.log(res)
    this.setData({
      // 优化 响应数据，只拿有用的
      goodsObj:{
        goods_price:res.goods_price,
        goods_name:res.goods_name,
        // iphone部分手机不支持webp图片格式，后台改，或前台改
        goods_introduce:res.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:res.pics
      },
      isCollect
    })
  },
  // 2、点击轮播图 放大预览功能
  _handlePrevewImage(e){
    // 1、先构造要预览的图片数组
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    })
  },
  // 3 加入购物车：绑定事件-，获取购物车数据(测试用缓存)--，判断是否已存在-，-已存在修改数据执行数量++，不存在直接给购物车数组添加新元素并带num数量属性，
  _handleCartAdd(){
    let cart=wx.getStorageSync("cart")||[];
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){//不存在，第一次添加,数量和选中
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{// 已存在购物车数据 执行 num++
      cart[index].num++;
    }
    wx.setStorageSync("cart",cart);//数据加到缓存
    wx.showToast({
      title: '加入成功',
      icon:'success',
      mask:true  //true防止用户手抖疯狂点击
    })
  },
  // 点击收藏
  _handleCollect(){
    let isCollect=false;
    // 1、获取商品收藏缓存，2、判断是否被收藏过，
    let collect=wx.getStorageSync('collect')||[];
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index!==-1){
      collect.splice(index,1);//找到在数组中删除该商品
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon:'success',
        mask:true  //true防止用户手抖疯狂点击
      })
    }else{
      collect.push(this.GoodsInfo)//没被收藏过
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon:'success',
        mask:true  //true防止用户手抖疯狂点击
      })
    }
    wx.setStorageSync('collect', collect);
    this.setData({
      isCollect
    })
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