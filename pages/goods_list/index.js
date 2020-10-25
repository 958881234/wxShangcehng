import { request } from "../../request/index.js";//封装请求
import regeneratorRuntime from '../../lib/runtime/runtime';//es7异步方法
Page({
  // 1、从子组件传递过来的
  _handleTabsItemChange(e){
    console.log(e)
    const {index}=e.detail;
    const {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({tabs})
  },
  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
     { id:0,value:"综合",isActive:true},
     { id:1,value:"销量",isActive:false},
     { id:2,value:"价格",isActive:false},
    ],
    goodsList:[]
  },
  // 2、接口要的参数-全局参数
  QueryParams:{
    query:"",
    cid:'',
    pagenum:1,
    pagesize:10
  },
  totalPages:1,// 全局参数-总页数
  // 搜索请求列表
  async _getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams});
    console.log(res)  
    const total=res.total;//总条数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);//计算总页数=总条/一页条数

    this.setData({
      goodsList:[...this.data.goodsList,...res.goods] // 上拉加载新数据和数据拼接-合并数组
    })
    wx.stopPullDownRefresh();//关闭下拉刷新窗口
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.QueryParams.cid=options.cid||'';//拿到上一个页面传来的分类id
    this.QueryParams.query=options.query||'';//这个首页传关键字
    this._getGoodsList()
  },
// 2、上拉加载，1、获取总页数，2、获取当前页数，3、判断当前页大于总页，没有弹提示，有加载数据
  onReachBottom: function () {
    if(this.QueryParams.pagenum>=this.totalPages){
      console.log('上拉没数据了')
      wx.showToast({title:'上拉没数据了'})
    }else{
      console.log('上拉加载..')
      this.QueryParams.pagenum++; // 有数据页码++，在请求接口
      this._getGoodsList();
    }
  },
  // 3 下拉刷新-清空数组，重置页码，发送请求**注意：需要在json文件中开启下拉刷新
  onPullDownRefresh: function () {
    this.setData({ goodsList:[]});
    this.QueryParams.pagenum=1;
    this._getGoodsList();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})