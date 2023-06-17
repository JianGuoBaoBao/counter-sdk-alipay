//发送消息类型
export const SEND_MSG_TYPE = {
  TEXT: '0', //文字
  IMAGE: '1', //图片
  FILE: '2', //文件
  CUSTOM: '3' //自定义
}

// IM通知类型
export const IM_TYPE_ID = {
  TEXT: 1003, //文字
  IMAGE: 1004, //图片
  START: 1007, //进房间通知
  FINISH: 1008, //退出房间通知
  PAUSE_TELLER: 1011, //柜员暂停
  AUDIO_TELLER: 1012, //柜员切换音视频
  AUDIO_USER: 3005,//客户切换音频
  AUDIO_USER_CANCEL: 3006,//客户取消音频
  WHITE_BOARD: 2000, //电子白板
  PPT: 2003, //播放ppt通知
  PASSWORD_RESET: 2004, //重置密码-柜员确认银行卡号，进行重置密码
  SCREEN: 2005, //投屏
  PASSWORD:2006, //修改密码
  CREATE_ACCOUNT:2007, //手机银行签约（原开户）
  TRANSFER: 2008, //柜员发起转账
  TRANSFER_INPUT: 20081, //柜员输入转账信息
  MODIFY_INFO: 2010, // 修改完善用户信息
  CREDIT_CARD: 2011, //5.	xy卡面签激活
  EVALUATION: 2012,// 6.	理财首次风险测评
  LOAN:20131,//7.	dai远程视频面签
  LOAN_REPLENISH:20132,//7.	dai远程视频面签 补充资料
  CORPORATION_SIGN:2014,//8.	法人面签
  CORPORATION_SIGN_CONFIRM:2014,//8.	法人面签告知书
  CORPORATION_SIGN_RESULT:20141 ,//8.	法人面签审核结果
  REPAYMENT: 2015,// 9.	dai还款
  DEPOSIT: 2016, // 协定存kuan登记
  FACE: 2017, // 发起人脸识别
  INFORM: 2019, // 结果通知
  SHARE_SCREEN: 2030, // 共享屏幕
  LOCATION: 4000, // 经纬度信息
  CARLOAN: '30031', // 车贷面签信息录入
  CARLOAN_INPUT: '30032', // 车贷面签信息输入
  CARLOAN_CONFIRM: '30033', // 车贷面签信息确认
  CARLOAN_FINISH: '30034', // 车贷面签业务办理完成
  OPEN_ACCOUNT: 'tj30021', // 对公开户信息录入
  OPEN_ACCOUNT_INPUT: 'tj30022', // 对公开户信息录入
  OPEN_ACCOUNT_KEYBOARD: 'tj30023', // 密码键盘
  OPEN_ACCOUNT_CONFIRM: 'tj30025', // 对公开户信息确认
  OPEN_ACCOUNT_FINISH: 'tj30026', // 对公开户办理完成
  OPEN_ACCOUNT_IMAGE: 'tj30027', // 对公开户协议图片
  OPEN_ACCOUNT_SIGN: 'tj30028', // 对公开户签名

  RISK_WARNING: 3089 // 风险提示
}

// 播放器状态
export const PLAYER_FIT = {
  CONTAIN: 'contain', //图像长边填满屏幕，短边区域会被填充⿊⾊
  FILLCROP: 'fillCrop' //图像铺满屏幕，超出显示区域的部分将被截掉
}

// 消息类型
// 消息类型 接收还是发送
export const MSG_TYPE = {
  RECEIVE: 'receive',
  SEND: 'send'
}
