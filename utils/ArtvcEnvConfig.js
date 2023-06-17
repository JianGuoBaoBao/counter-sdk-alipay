export const envConfig = {
  // 苏州sit（已废弃）
  sit: {
    appId: 'ONEXDCF7B35172312',
    bizName: '7C14F2624A8176E7C78315C9BEFFB361',
    workspaceId: 'default'
  },
  // 苏州uat
  uat: {
    appId: 'ONEXE6A96DE172329',
    bizName: '8BC9409A663B591B966B24E144849175',
    workspaceId: 'default',
    Origin: 'http://zuul-uat.leimondata.cn:8082',
    wsServer: '47.103.46.201', // ws服务器地址
    socketUrl: 'wss://openfire2.leimondata.cn:7443/ws/'
  },
  // 苏州回归
  pro: {
    appId: 'ONEX8B33929301548',
    bizName: 'DA5FF993C4CD691B7F78BAAE4BBF87FF',
    workspaceId: 'default',
    Origin: 'http://zuul-pro.leimondata.cn:8082',
    wsServer: 'openfire.leimondata.cn', // ws服务器地址
    socketUrl: 'wss://openfire.leimondata.cn:17443/ws/'
  },
}