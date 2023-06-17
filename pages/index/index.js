const app = getApp()
import {
  getSig,
} from '../../api/chat.js'
Page({
  onLoad(query) {
    // 页面加载
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },

  // 视频柜员
  data: {
   // user
   userId: `test1`,
   orgId: 'ICBC',
   source: 'czbank',
   channelNo: 'applet',
   businessNo: '1000',
    //加入房间
    userID:'9530',
    config : {
      userId: '9530',
      appId: "default",
      roomId: "683880784247717",
      token: "123",
      streamInfo: { // 根据不同通道传入不同的参数，目前只支持 mPaaS 通道
        signature: 'signature',
        bizName: 'demo',
        subBiz: 'default',
        workspaceId: 'default',
        // serverUrl: 'wss://cn-hangzhou-mrtc.cloud.alipay.com/ws'
        serverUrl: 'wss://mrtc.mpaas.cn-hangzhou.aliyuncs.com/ws'
      },
      displayInfo: {
        answer: {
          pusher: {
            isMini: true,
            isVisible: true
          },
          player: {
            isMini: false,
            isVisible: true
          },
          actions: {
            hangup: {
              visible: false
            },
            mute: {
              visible: false
            },
            screenshot: {
              visible: false
            },
            enableCamera: {
              visible: false
            },
            switchCamera: {
              visible: false
            },
            switchScreenCapture: {
              visible: false
            }
          },
          users: {
            visible: false
          }
        },
      }
    }
  },
  joinRoom(){
    const {
      userId,
      orgId,
      source
    } = this.data
    getSig(userId,'0', '2', '00000',orgId)
      .then(res =>{
        app.globalData.sign = res.data.mpsSig
        let url = `${'/pages/rtcAnswer/rtcAnswer'}?userId=${res.data.userId}&orgId=${orgId}&source=${source}&userSig=${res.data.mpsSig}&aliSig=${app.globalData.sign}&businessNo=${this.data.businessNo}&channelNo=${this.data.channelNo}`;
          my.hideLoading()
          setTimeout(() => {
            my.navigateTo({
              url
          })
        }, 100);
      })
  },

  bindinput1(e) {
    this.setData({
      userId: e.detail.value
    })
  },
  bindinput2(e) {
    this.setData({
      orgId: e.detail.value
    })
  },
  bindinput3(e) {
    this.setData({
      channelNo: e.detail.value
    })
  },
  bindinput4(e) {
    this.setData({
      businessNo: e.detail.value
    })
  },

    // 处理收到websocket消息
    OnError(data) {
      console.log(`这是在 join 页面 onError 中收到的消息 data=${JSON.stringify(data)}`);
      let code = data.code;
      let msg = data.msg;
      my.alert({
        title: '小贴士',
        content: msg,
        buttonText: '确认',
        success: (res) => {

        }
      })
    }
});
