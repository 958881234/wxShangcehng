// components/x_tabs/x_tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _handleItemTap(e){
      console.log(e.currentTarget.dataset)
      const {index}=e.currentTarget.dataset
      // 触发父组件自定义事件，传参
      this.triggerEvent("tabsItemChange",{index});
    }
  }
})
