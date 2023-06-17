import {IM_TYPE_ID} from "../../utils/dict";

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    x: 400,
    y: 350,
    client_config : '',
    user_config : '',
    client_userID : '',
    user_userID : '',

    userID:'',
    imRoomId:'',
    sessionId:''
  },
  onLoad(options) {
    const config = Object.assign({}, app.globalData.atcroomConfig)
    config.userId = app.globalData.users[1]
    this.setData({
      user_config: app.globalData.atcroomConfig,
      client_config: config,
      client_userID: app.globalData.users[1],
      user_userID: app.globalData.users[0],

      userID: options.userID,
      imRoomId: options.imRoomId,
      sessionId: options.sessionId
    })
  },
  sendBack() {
    let content = {
      typeId: IM_TYPE_ID.RISK_WARNING,
      senderId: this.data.userID,
      content: '已阅读',
      sessionId: this.data.sessionId
    };
    app.globalData.socket.sendMessage({
      type: 'groupchat',
      from: this.data.userID,
      to: this.data.imRoomId,
      message: JSON.stringify(content),
      success: function () {
        my.navigateBack(); // 返回上一页
      }
    })
  },

  onShow () {

  },
  onUnload() {
    // app.globalData.emitter.off('customSysMsg');
  }
})
