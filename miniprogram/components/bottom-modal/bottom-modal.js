// components/bottom-modal/bottom-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow:Boolean
  },
  //解决样式组件隔离
  options:{
    styleIsolation:"apply-shared",
    multipleSlots:true //允许多个插槽
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
    onClose(){
      this.setData({
        modalShow:false
      })
    }
  }
})
