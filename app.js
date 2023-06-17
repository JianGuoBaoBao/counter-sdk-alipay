import Emitter from './utils/emitter.js'
import { envConfig } from './utils/ArtvcEnvConfig.js'
const env = 'pro' // sit/ uat / pro
App({
  globalData: {
    users: [], // 房间用户列表
    emitter: new Emitter(),
    globalConfig:{},
    openid:'',
    showContent: false, // 用于审核时期信息隐藏
    atcroomConfig:'', // 全局音视频配置
    env: env,
    appId: envConfig[env].appId,
    workspaceId: envConfig[env].workspaceId,
    // server_url: 'wss://cn-hangzhou-mrtc.cloud.alipay.com/ws',
    server_url: 'wss://mrtc.mpaas.cn-hangzhou.aliyuncs.com/ws',
    bizName: envConfig[env].bizName,
    subBiz: envConfig[env].appId,
    wsServer: envConfig[env].wsServer,
    socketUrl: envConfig[env].socketUrl,
  },
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch');

    const updateManager = my.getUpdateManager();


    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      my.alert({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
