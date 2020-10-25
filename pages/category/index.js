import { request } from "../../request/index.js";//封装请求
import regeneratorRuntime from '../../lib/runtime/runtime';//es7异步方法
Page({
  async _getCates() {
    //1、 使用 es7 的 async 和await 来发送请求
    const res = await request({url: '/categories'});

        this.Cates = res
        console.log(res)
        // 把数据存到本地存储中(时间戳和数据)
        wx.setStorageSync("cates", {time: Date.now(),data: this.Cates})
        // 构造左侧大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        // 构造右侧商品数据,初始化的时候拿到第1个的
        let rightContent = this.Cates[0].children;
        console.log(rightContent)
        this.setData({
          leftMenuList,
          rightContent
        })
//     -------- ↑ --------- 用上面方法 --------
    // request({ url: '/categories' })
    //   .then(res => {
    //     this.Cates = res
    //     console.log(res)
    //     // 把数据存到本地存储中(时间戳和数据)
    //     wx.setStorageSync("cates", {time: Date.now(), data: this.Cates})
    //     // 构造左侧大菜单数据
    //     let leftMenuList = this.Cates.map(v => v.cat_name);
    //     // 构造右侧商品数据,初始化的时候拿到第1个的
    //     let rightContent = this.Cates[0].children;
    //     console.log(rightContent)
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })
  },
  // 点击左侧菜单
  _handleItemTap(e) {
    console.log(e.currentTarget.dataset)
    const {
      index
    } = e.currentTarget.dataset
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop:0 //从新设置 右侧scroll-top到顶部距离
    })
  },
  // 接口的返回数据
  Cates: [],
  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [], // 左侧菜单数据
    rightContent: [], //  右侧商品数据
    currentIndex: 0, //被点击菜单
    scrollTop:0//右侧内容据顶部距离
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // web 存储和小程序存储区别，web： localStorage.setItem('key','value'),localStorage.getItem('key'),存储时先要用toString()转成字符串再存，小程序不用，是什么数据就存什么
    // 小程序：wx.setStorageSync('key','value'),wx.getStorage('key')

    // **做下缓存，先判断本地有没有旧数据，有就用，没有就发请求，缓存的是时间戳和数据
    const Cates = wx.getStorageSync('cates');
    if (!Cates) {
      this._getCates()//第一次请求
    } else {
      // 有旧数据就用旧的，定义过期时间，5分钟
      if (Date.now() - Cates.time > 30000 * 10) {
        this._getCates() //重新发送请求
        console.log(2)
      } else {
        console.log(1)
        this.Cates = Cates.data; //使用旧数据
        // 构造左侧大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        // 构造右侧商品数据,初始化的时候拿到第1个的
        let rightContent = this.Cates[0].children;
        console.log(rightContent)
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
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