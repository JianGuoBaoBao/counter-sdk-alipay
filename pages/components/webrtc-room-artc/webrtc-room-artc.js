const app = getApp();
import {
  IM_TYPE_ID,
} from '../../../utils/dict'
import WxSocket from '../../../utils/ws/websocket2';
Component({
  options: {
    lifetimes: true,
    multipleSlots: true // 启用多slot支持
  },

  props: {
    roomId: {
      type: String,
      value: '0'
    },
    roomName: {
      type: String,
      value: ''
    },
    userID: {
      type: String,
      value: ''
    },
    userName: {
      type: String,
      value: ''
    },
    userSig: {
      type: String,
      value: ''
    },
    tellerId: {
      type: String,
      value: ''
    }
  },

  data: {
    imRoomId: "",
    hasExitRoom: true,
    members: [],

    // 阿里参数
    token: '', // 房间密码
    channelId: '',// 房间号
    config:{},
    startPlay:false,
    namespace: 'namespace',
    screenname: 'answer'
  },

  // 组件生命周期
  lifetimes: {
    detached: function () {
      // app.globalData.emitter.off('customSysMsg');
      // this.exitRoom();
    },
  },

  methods: {
    callFatherCompoentMethod(name,data1,data2){
      this.props.onCallFatherMethod(name,data1,data2)
    },

    onBack: function () {
      this.exitRoom()
      my.navigateBack({
        delta: 1
      });
    },
    start() {
      this.startSocket()
    },
    stop(){
      this.data.hasExitRoom = true;
      console.log("组件停止");
      this.exitRoom();
    },
    startSocket() {
      console.info("startSocket");
      this.socket = new WxSocket({
        userId: this.props.userID,
        success: ()=>{
          // 发起通话
          this.callFatherCompoentMethod('connectDone');
          this.onCustomSysMsg();
          // this.onCustomSysMsgPOC();
        }
      })
      app.globalData.socket = this.socket
    },
    /**
     * 系统消息
     */
    onCustomSysMsg() {
      app.globalData.emitter.on('customSysMsg', (sysMsg) => {
        let content = JSON.parse(sysMsg || "{}");
        switch (content.typeId) {
          case IM_TYPE_ID.START: // 开启视频通知
          {
            //加入群聊
            if (content.state == 0) { //柜员同意
              // 进房间操作
              this.setData({
                imRoomId: content.roomId, // 聊天室
                roomId: content.sessionId,
                sessionId: content.sessionId,
                token: content.mtoken,
                channelId: content.channelId,
              })

              // my.alert({
              //   title:'提示',
              //   content: 'rtc房间号channelId：'+ content.channelId + ', mtoken: '+ content.mtoken,
              //   success: () => {}
              // })
              console.info('rtc房间号channelId：'+ content.channelId + ', mtoken: '+ content.mtoken)

              this.callFatherCompoentMethod('setFatherDataUpdate', { name:'sessionId',value: content.sessionId });
              this.callFatherCompoentMethod('stopWaitMusic');
              this.data.members.push({userId: content.tellerId});

              this.joinRoom(); // rtc音视频

              this.socket.joinChatRoom( // 加入聊天室
                  this.props.userID
                  +'@' + app.globalData.wsServer,this.data.imRoomId);

            } else if (content.state == 1) { //柜员拒接
              this.callFatherCompoentMethod('callreject');
            }
            break;
          }

            // 发起人脸识别
          case IM_TYPE_ID.FACE: {
            console.log('发起人脸识别');
            console.log(content);
            this.startFace();
            break;
          }

          case IM_TYPE_ID.TEXT: // 其他消息通知
          case IM_TYPE_ID.IMAGE: {
            console.log('1003,1004');
            console.info(content.senderId ,this.props.userID)
            if(content.senderId !== this.props.userID){
              // 柜员消息
              this.callFatherCompoentMethod('onIMEvent', content);
            }
            break;
          }
            // 电子白板
          case IM_TYPE_ID.WHITE_BOARD: {
            console.log('发起电子白板');
            console.log(content);
            this.callFatherCompoentMethod('setFatherDataUpdate', { name:'isVisible',value:true });
            break;
          }

            // 风险提示
          case IM_TYPE_ID.RISK_WARNING: {
            console.log('风险提示');
            console.log(content);

            my.navigateTo({
              url:`../../pages/protocol-reading/protocol-reading?userID=${this.props.userID}&imRoomId=${this.data.imRoomId}&sessionId=${this.data.sessionId}`
            })

            break;
          }

          case IM_TYPE_ID.FINISH: // 结束视频通知
          {
            console.log("2003");
            console.log(content.sessionId, this.data.sessionId)
            if(content.sessionId == this.data.sessionId) {
              this.exitRoom()
              this.callFatherCompoentMethod('callDown');
            }
            break;
          }
          default:
            my.alert({
              title:'此业务正式版暂不支持',
              content: '请联系管理员使用体验版小程序进行模拟业务体验',
              success: () => {}
            })
            break;
        }
      })
    },

    onCustomSysMsgPOC(){
      // app.globalData.emitter.on('customSysMsgPOC', (sysMsg) => {
      //   let content = JSON.parse(sysMsg || "{}");
      //   console.info("customSysMsgPOC", content)
      //   if(content.typeId == IM_TYPE_ID.OPEN_ACCOUNT_FINISH){
      //     my.showToast({
      //       type: 'success',
      //       content: '业务办理成功',
      //     })
      //   }else if(content.typeId == IM_TYPE_ID.OPEN_ACCOUNT_SIGN){
      //     wx.navigateTo({
      //       url: `/pages/business/open-account/white-board?toAccount=${this.data.toAccount}&userId=${this.data.userId}&roomId=${this.data.roomId}`,
      //     })
      //   }else if(content.typeId == IM_TYPE_ID.OPEN_ACCOUNT_IMAGE){
      //     this.setData({
      //       showImage: true,
      //       imgUrl: content.imgUrl
      //     })
      //   }else if(content.typeId == IM_TYPE_ID.FINISH){
      //     my.showToast({
      //       content: '对方已结束通话',
      //       success: function(){
      //         setTimeout(() => {
      //           my.reLaunch({
      //             url: '/pages/index/index'
      //           })
      //         }, 1500);
      //       }
      //     })
      //   }
      // })
    },


    onLoad() {},

    /**
     * 发送文本消息
     */
    sendText(tellerId, msg, cb) {
      var content = {
        typeId: IM_TYPE_ID.TEXT,
        senderId: this.props.userID,
        content: msg,
        sessionId: this.data.sessionId
      };
      this.socket.sendMessage({
        type: 'groupchat',
        from: this.props.userID,
        to: this.data.imRoomId,
        message: JSON.stringify(content),
        success: function () {
          cb();
        }
      })
    },


    /**
     * 人脸识别
     */
    startFace(){
      console.log('人脸识别')
      setTimeout(() => {
        let content = {
          typeId : 3017,
          state: 1,
          data : {
            state: 1
          },
        };
        this.socket.sendMessage(
            {
              type: 'groupchat',
              from: this.props.userID,
              to: this.data.imRoomId,
              message: JSON.stringify(content)
            })
      }, 500);
    },

    /**
     * 退出房间
     */
    exitRoom: function () {
      let self = this
      if (self.data.roomId) {
        self.data.roomId = ''
        try{
          // 销毁
          console.log('断开openfire')
          self.socket.disconnect();
        }
        catch(err){
          console.log(err)
        }
        this.data.hasExitRoom = true;
      }
    },

    joinRoom() {
      let self = this
      let roomId = self.data.channelId;
      let token = self.data.token;
      app.globalData.roomId = roomId;
      app.globalData.rtoken = token;
      if (!roomId || !token) {
        my.showToast({
          title: '请提供一个有效的房间名和房间密码',
          icon: 'none',
          duration: 2000
        })
      } else {
        //加入房间
        let config = {
          userId:this.props.userID,
          appId:app.globalData.appId,
          roomId,
          token,
          streamInfo: { // 根据不同通道传入不同的参数，目前只支持 mPaaS 通道
            signature: app.globalData.sign,
            bizName: app.globalData.bizName,
            subBiz:app.globalData.subBiz,
            workspaceId:app.globalData.workspaceId,
            serverUrl: app.globalData.server_url
          },
          displayInfo:{
            answer:{
              pusher: {
                isMini: true,
                isVisible: true
              },
              player: {
                isMini: false,
                isVisible: true
              },
              actions:{
                hangup:{
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
                switchScreenCapture:{
                  visible: false
                }
              },
              users:{
                visible: false
              }
            },
          }
        };
        this.setData({
          config,
          startPlay:true
        });
        app.globalData.atcroomConfig = config
        console.info(this.data.config);
        self.callFatherCompoentMethod('setFatherDataUpdate', { name:'startplay',value: true })
      }
    },
    handlePlayerChange(e){
      console.info(e)
    },
    handleUserChange(e){
       app.globalData.users = e.users; //['us111682224436824', 'ts111682060947370'] '进入房间'
    },
    handleHangup(){
      console.info("挂断了");
      console.info("挂断了");
      console.info("挂断了");
      console.info("挂断了");
    },
    handleError(){

    }
  },

  observers: {}
})
