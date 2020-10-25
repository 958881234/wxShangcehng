//引入封装请求地址方法（现在可以不用，因为不需要授权可以直接获取用户地址）
import {getSetting,chooseAddress,openSetting,showModal,showToast} from '../../utils/asyncWx.js';
import regeneratorRuntime from '../../lib/runtime/runtime';//es7异步方法
Page({
  // 1、点击收货地址
  async _handleChooseAddress(){
    try{
      //1、获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2 判断权限状态,用户以前拒绝过授权，在打开授权界面方法
      if(scopeAddress === false){
        await openSetting();
      }
      // 4、调用 获取收货地址 api
      const address = await chooseAddress();
      wx.setStorageSync('address', address)
      console.log(address)
    } catch(error){console.log(error)}
  },
  // 2、商品选中,拿到选中id，获取购物车数组，找到要修改的对象，选中取反，在把数据放大data和缓存中,在重新计算价格
  _handeItemChange(e){
    const goods_id=e.currentTarget.dataset.id;
    let {cart}=this.data;
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    cart[index].checked=!cart[index].checked;

   this._setCart(cart);
  },
  // 3、封装购物车不同状态，重新计算，底部工具栏数据，全选，总价，价格
  _setCart(cart){
    let allChecked=true;  
      let totalPrice=0;
      let totalNum=0;
      cart.forEach(v=>{
        if(v.checked){
          totalPrice+=v.num*v.goods_price;
          totalNum+=v.num;
        }else{
          allChecked=false
        }
      })
      allChecked=cart.length!=0?allChecked:false;//判断数组是否为空
    this.setData({
      cart,allChecked, totalPrice,totalNum
    })
    wx.setStorageSync('cart', cart)
  },
  //4、 商品全选功能：获取数据，修改值，循环修改cart数组商品选中状态
  _handleItemAllCheck(){
    let {cart,allChecked}=this.data;
    allChecked=!allChecked;
    cart.forEach(v=>v.checked=allChecked);
    this._setCart(cart);//修改状态后填充回data或缓存
  },
  // 5、商品数量编辑功能:获取传参，获取购物车数组，找到要修改商品的索引，进行修改
  async _hanleItemNameEdit(e){
    const {operation,id}=e.currentTarget.dataset;
    let {cart}=this.data;
    let index=cart.findIndex(v=>v.goods_id===id);
    // 判断是否要删除,弹窗提示
    if(cart[index].num===1 && operation===-1){
    //  封装的弹窗提示
      const res = await showModal({content:"是否确定删除？"})
      if(res.confirm){
          cart.splice(index,1);
          this._setCart(cart);
        }
    }else{
      cart[index].num+=operation;//进行数量修改
      this._setCart(cart);
    }
  },
  // 5、结算:判断收货地址，判断有没有选择商品，跳转支付页面
  async _handlePay(){
    const {address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:"请选择收货地址！"});
      return;
    }
    if(totalNum===0){
      await showToast({title:"请选择选购商品！"});
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false, //全选
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
    const cart=wx.getStorageSync('cart') || [];
    this.setData({address})
    this._setCart(cart);

    // // 3 计算全选,every数组方法，会遍历接收一个回调，都是true才返回true,注意：空数组调用也返回true，要处理下
    // // *const allChecked=cart.length?cart.every(v=>v.checked):false;
    // let allChecked=true;  
    // // 4、总价格，总数量,循环，如果选中了的
    //   let totalPrice=0;
    //   let totalNum=0;
    //   cart.forEach(v=>{
    //     if(v.checked){
    //       totalPrice+=v.num*v.goods_price;
    //       totalNum+=v.num;
    //     }else{
    //       allChecked=false
    //     }
    //   })
    //   allChecked=cart.length!=0?allChecked:false;//判断数组是否为空
    // this.setData({address, cart,allChecked, totalPrice, totalNum})
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