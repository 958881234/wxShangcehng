import { request } from "../../request/index.js";//封装请求
import regeneratorRuntime from '../../lib/runtime/runtime';//es7异步方法
import {login} from '../../utils/asyncWx.js';
Page({
  // 获取用户信息
  async _handleGetUserInfo(e){
     console.log(e)
    try{
        //  1、获取用户信息和小程序登录后的code
        const {encryptedData,rawData,iv,signature}=e.detail;
        const {code}=await login()
        let loginParams = {encryptedData,rawData,iv,signature,code}
        //  2、发送post 请求，获取token ***现在接口失败，得不到TOKEN**
        const {token}=await request({url:"/users/wxlogin",data:loginParams,method:"post"})
        console.log(token)
        // 3、把token存入缓存，同时跳回上一页
        wx.setStorageSync("token",token);
        wx.navigateBack({ delta: 1 })
    }catch(err){
      console.log(err)
    }
  },
  /**
   * 页面的初始数据
   */
  data: {

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