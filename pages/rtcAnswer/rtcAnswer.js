const app = getApp();
const { rtc, EventType } = requirePlugin('rtc');
import { baseurl} from '../../api/app.config'
import {
  finish,
  getTeller,
  sendMsg,
  getSig
} from '../../api/chat.js'

import {
  quit
} from '../../api/third.js'


import {
  SEND_MSG_TYPE,
  MSG_TYPE
} from '../../utils/dict';
import utils from '../../utils/utils'

const WAIT_MUSIC_PATH = "XNTk2MTc0NjM0OA=="; // 音频码值，上传发布优酷后获取

const innerAudioContext = my.createInnerAudioContext();


//
// innerAudioContext.onPlay(() => {
//   console.log("innerAudioContext onPlay 开始播放")
//   my.alert({ content:'innerAudioContext 前景音频播放事件 onPlay' });
// });
//
// innerAudioContext.onStop(() => {
//   console.log("innerAudioContext onStop 停止播放")
//   my.alert({ content:'innerAudioContext 前景音频停止事件 onStop' });
// });



Page({
  /**
   * 页面的初始数据
   */
  data: {
    webrtcroomComponent: null,
    animationLeft: null,
    playerBackgroundImg: '/assets/images/bg.png',
    userId: '',
    tellerId: '',
    userSig: '',
    aliSig: '',
    roomId: '', // 房间id
    sessionId: '',
    timer: "",
    timerSecond: 0,
    isErrorModalShow: false,

    startplay: false, //是否开始播放

    IMmsgList: [], //消息列表

    leftpanelScrolltop: 0, //聊天面板滚动高度

    IMinput: false,
    IMmsg: "",
    IMinputFocus: true,
    // 计时器
    timercountTimer: null,

    // 是否已经分配柜员
    connectTeller: false,
    muted: false,

    isVisible: false,
    canvasTip: true,
    apFilePath: ''
  },
  /**
   * 滚动聊天列表到底部
   */
  scrollPanel() {
    // 获取并设置滚动高度
    my.createSelectorQuery().select('#msgList').boundingClientRect(rect => {
      const height = rect ? (rect.height || 0) : 0
      this.setData({
        leftpanelScrolltop: height
      })
    }).exec()
  },

  /**
   * 设置聊天列表
   */
  setMsgList(_msgList) {
    this.setData({
      IMmsgList: _msgList
    })

    // 滚动列表到底部

    setTimeout(()=>{
      this.scrollPanel();
    },500)
  },

  // 输入文字
  toggleInput() {
    this.setData({
      IMinput: !this.data.IMinput,
    })
  },
  closeInput() {
    this.setData({
      IMinput: false
    })
  },

  /**
   * 计时
   */
  doTimer: function () {
    let timerSecond = this.data.timerSecond++
    let hour = parseInt(timerSecond / 3600)
    hour = hour >= 10 ? hour : `0${hour}`
    let min = parseInt(timerSecond % 3600 / 60)
    min = min >= 10 ? min : `0${min}`
    let second = parseInt(timerSecond % 60)
    second = second >= 10 ? second : `0${second}`
    if (hour !== '00') {
      this.setData({
        timer: `${hour}:${min}:${second}`
      })
    } else {
      this.setData({
        timer: `${min}:${second}`
      })
    }

    this.data.timercountTimer = setTimeout(this.doTimer.bind(this), 1000)
  },
  /**
   * 手动返回页面
   */
  callDown() {
    this.onLeavePage();
    my.navigateBack();
  },
  // 发送消息
  sendIMmsg() {
    const _msg = this.data.IMmsg;
    // 发送消息
    this.data.webrtcroomComponent.sendText(this.data.tellerId, _msg,
      e => {
        // 发送消息请求
        sendMsg(this.data.userId, this.data.sessionId, SEND_MSG_TYPE.TEXT, _msg);
        // 加入消息列表
        this.data.IMmsgList.push({
          type: MSG_TYPE.SEND,
          content: _msg
        })
        // 设置消息列表
        this.setMsgList(this.data.IMmsgList)
        // 重置输入框文本
        this.setData({
          IMmsg: ""
        })
      },
      e => {
        my.alert({
          title: '提示',
          content: '发送失败'
        })
      })

  },
  onIMEvent(e) {
    let msg = {
      type: MSG_TYPE.RECEIVE
    }
    if (e.content) msg.content = e.content
    if (e.imgUrl) msg.imgUrl = e.imgUrl
    if (e.imgUrl) msg.url = e.url

    this.data.IMmsgList.push(msg)
    // 设置消息列表
    this.setMsgList(this.data.IMmsgList)
    // 震动
    my.vibrateLong()
  },
  /**
   * 初始化音乐
   */
  initWaitMusic(){
      innerAudioContext.src = WAIT_MUSIC_PATH;
      innerAudioContext.loop = true;
      innerAudioContext.autoplay = true;

      console.log(innerAudioContext);
  },
  /**
   * 播放等待音乐
   */
  playWaitMusic() {
    if (this.data.startplay) return;
    console.log("播放音乐");
    innerAudioContext.play();
  },
  /**
   * 停止播放
   */
  stopWaitMusic() {
    innerAudioContext.stop();
  },
  /**
   * 暂停等待音乐
   */
  pauseWaitMusic() {
    innerAudioContext.pause();
  },
  setFatherDataUpdate({name, value}){
    this.setData({
      [name]: value,
    })
  },
  connectDone(){
    this.waitCall()
  },
  error(){
    my.alert({
      title: '提示',
      content: 'error',
      success: ()=> {
        this.callDown();
      }
    });
  },
  callreject(){
    my.alert({
      title: '业务繁忙，请稍后再拨',
      content: 'error',
      success: (res)=> {
        this.callDown();
      }
    })
  },

  /**
   * 等待时间 保持呼叫
   */
  waitCall() {
    console.log("发起呼叫");
    let callFn = ()=>{
      getTeller(
          this.data.userId,
          this.data.orgId,
          this.data.businessNo,
          this.data.channelNo
      ).then(
        res => {
          console.info('get/Teller')
          if (res.data.uid || res.data.userId) {
            this.setData({
              tellerId: res.data.tellerId || res.data.uid || res.data.userId,
              connectTeller: true
            })
          }
        },
        (err) => {
          // 进入排队
          if((err.code == 10001 || err.code == 10006 ) && err.data.tellerId ){
            // 保存分配到的tellerId，调用取消呼叫finish接口时需要传入
            this.setData({
              tellerId: err.data.tellerId
            })
          }
        }
      )
    }
    callFn();
  },
  /**
   * 离开页面时的操作
   * 非生命周期函数
   */
  onLeavePage() {
    // 如果来自第三方小程序跳转，返回原小程序
    let self = this
    finish(
        this.data.userId,
        this.data.sessionId || '',
        this.data.orgId,
        this.data.tellerId,
        this.data.skillType)

    rtc.hangup(app.globalData.roomId);

    if(this.data.appKey){
      // 小程序退出时候，reqID不为空的时候调用服务端
      if(self.data.reqID && self.data.startplay){
        quit(self.data.reqID)
      }
      my.navigateBackMiniProgram({
        complete: (res) => {
          this.setData({
            appKey: null
          })

          my.navigateBack({
            fail: (err) => {
              my.redirectTo({
                url: '/pages/index/index',
              })
            }
          })
        },
      })
    }
    // 停止音乐
    this.stopWaitMusic()
    // 清除计时器
    clearTimeout(this.data.timercountTimer);
    // 结束视频组件
    try{
      this.data.webrtcroomComponent.stop()
    }catch(e){}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.q) {
      //获取二维码的携带的链接信息
       let qrUrl = decodeURIComponent(options.q)
       console.log(qrUrl)
       this.setData({
        reqID: utils.getQueryString(qrUrl, 'reqID') || '',
        userSig: utils.getQueryString(qrUrl, 'sign') || '',
        userId: utils.getQueryString(qrUrl, 'userId') ,
        appKey: utils.getQueryString(qrUrl, 'appKey') || '',
        orgId: utils.getQueryString(qrUrl, 'orgId') || '',
        businessType: utils.getQueryString(qrUrl, 'businessType') || '',
        source: utils.getQueryString(qrUrl, 'source') || 'czbank',
        channelValue: utils.getQueryString(qrUrl, 'channelValue'),
        skillType: utils.getQueryString(qrUrl, 'skillCode') || '',
        businessNo: utils.getQueryString(qrUrl, 'businessNo') || '',
        channelNo: utils.getQueryString(qrUrl, 'channelNo') || ''
       })
    }else{
      this.setData({
        orgId: options.orgId,
        source: options.source,
        userId: options.userId,
        userSig: options.userSig || '',
        businessType: options.businessType || '000',
        channelId: options.channelId || '',
        channelValue: options.channelValue,
        appKey: options.appKey || '',
        reqID: options.reqID || '',
        aliSig: app.globalData.sign || '',
        // skillType: options.skillType || '000',
        skillType: options.skillType || 'zz',
        show: app.globalData.showContent,
        businessNo:options.businessNo,
        channelNo: options.channelNo
      })
    }

    if(this.data.userId && (this.data.appKey || !this.data.userSig)){
      this.getUserSig().then(()=>{
        this.start()
      }).catch((err)=>{
        my.alert({
            title: '小贴士',
            content: err,
            buttonText: '确认',
            success: (res) => {
              my.navigateBack({
                fail:()=>{
                  my.navigateTo({
                    url: '/pages/welcome/welcome',
                  })
                }
              })
            }
          })
      })
    }else{
      this.start()
    }

      this.createCanvas();
  },
  getUserSig(){
    return new Promise((resolve, reject) => {
      getSig(this.data.userId, '0', '2', '00000')
      .then(res => {
        this.setData({
          userSig: res.data.sig,
          userId: res.data.userId,
          aliSig: res.data.mpsSig
        })
        app.globalData.sign = res.data.mpsSig

        resolve()
        my.hideLoading()
      }).catch((err)=>{
        reject(err.msg||'服务器请求异常')
      })
    })
  },
  start(){
    setTimeout(()=>{
      this.data.webrtcroomComponent = this.$selectComponent("#webrtcroom");
      this.data.webrtcroomComponent.start();

      // 等待计时
      this.doTimer()

      //播放等待音乐
      this.initWaitMusic()

      setTimeout(()=>{
        this.playWaitMusic()
      },500)


    },300)
  },

  bindinput(e) {
    this.setData({
      IMmsg: e.detail.value
    })
  },

  onShow () {
    // 保持屏幕常亮
    my.setKeepScreenOn({
      keepScreenOn: true
    })
    // 恢复播放音乐
    this.playWaitMusic();

  },
  onUnload() {
    // 页面被关闭
    rtc.hangup(app.globalData.roomId);
  },
  fatherMethod(name,data1,data2) {
    this[name](data1, data2)
  },
  changeCamera(){
    rtc.switchCamera(app.globalData.roomId);
  },
  changeMute(){
    console.info(this.muted);
    this.data.muted = !this.data.muted;
    if(this.data.muted){
      rtc.mute(app.globalData.roomId);
    }else{
      rtc.unmute(app.globalData.roomId);
    }
  },

  subMit() {
    const self = this;
    my.showLoading({
      content: "正在上传"
    })
    console.info(this.data.apFilePath)
    console.info( baseurl + '/file/upload');
    my.uploadFile({
      url: baseurl + '/file/upload',
      name: 'file',
      filePath: this.data.apFilePath,
      formData: {
        'file': this.data.apFilePath,
         sessionId: this.data.sessionId,
         type: 1
      },
      success(result){
        // const data = JSON.parse(result.data);
        // console.info(data);
        // const imgUrl = data.data[0]


        self.sendMsg(result.code);


        my.hideLoading();
        my.showToast({
          content: '上传成功',
        })

        self.setData({
          isVisible: false
        })

      },
      fail(res) {
        console.info(res)
        my.showToast({
          content: '上传失败',
        })
        my.hideLoading();
      }
    })

  },

  sendMsg(resultCode){
    let content = {
      typeId : 1,
      autographResult: resultCode==200? 'true' : 'false',
      sessionId: this.data.roomId,
    };
    let self = this
    app.globalData.socket.sendMessage({
      type: 'groupchat',
      // to: this.data.toAccount || '',
      to: this.data.tellerId || '',
      message: JSON.stringify(content),
      done: function(){
        self.setData({
          isFinish: true
        })
      }
    });
  },

  cancel() {
    this.setData({
      isVisible: false
    })
    this.initCanvas();
  },

  modelClick(){
    this.setData({
      isVisible: false
    })
  },

  /*
     canvas
   */
  createCanvas() {
    // 获取画布上下文
    this.context = my.createCanvasContext('my-canvas');
    this.initCanvas()
  },

  initCanvas(){
    this.setData({
      canvasTip: true
    });
    this.context.setFillStyle('#F2F2F2')
    this.context.fillRect(0,0,696,360)
    this.context.draw()
  },

  touchStart(e){
   this.setData({
     canvasTip: false
   })

    console.info(this.data.canvasTip)
    // 获取触摸点坐标
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y

    console.info(this.startX, this.startY);

    // 画笔配置
    this.context.setStrokeStyle('black');  // 颜色
    this.context.setLineWidth(3);        // 粗细
    this.context.setLineCap('round');    // 线头形状
    this.context.setLineJoin('round');   // 交叉处形状
  },

  // 开始移动
  touchMove(e) {
    // 移动时坐标
    var moveX = e.changedTouches[0].x
    var moveY = e.changedTouches[0].y

    console.info(moveX, moveY)

    this.context.moveTo(this.startX, this.startY);  // 找到起点
    this.context.lineTo(moveX, moveY);              // 找到终点
    this.context.stroke();                          // 描绘路径

    // 改变起点坐标
    this.startX = moveX;
    this.startY = moveY;
    this.context.draw(false, ()=>{
      my.canvasToTempFilePath({
        canvasId: 'my-canvas',
        success:(res) =>{
          // console.log('success');
          this.data.apFilePath = res.apFilePath;
        }
      })
    })
  },

  // 重置画板
  clear() {
    this.context.clearRect(0, 0, 696, 360)
    this.context.draw()
    this.initCanvas()
  }
})
