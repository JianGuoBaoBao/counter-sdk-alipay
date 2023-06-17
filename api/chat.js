import { baseurl } from './app.config'
import { request } from '../utils/request.js'

// 获取sig
export let getSig = (userId, type, equipmentType, equipmentNo,orgId) => {
  const app = getApp()
  return request(`${baseurl}/app/sig`, 'POST', {
    userId: userId,
    account: userId,
    type: type.toString(),
    equipmentType: equipmentType.toString(),
    equipmentNo: equipmentNo.toString(),
    orgId: orgId,
    // workspaceId: app.globalData.workspaceId,
    // bizName: app.globalData.bizName,
    appId: app.globalData.appId
  })
}

// 获取渠道列表
export let getChannelList = () => request(`${baseurl}/app/queryAllChannelList`, 'POST');

// 获取业务 POST /app/getSkillAll
export let getSkillAll = () => request(`${baseurl}/app/getSkillAll`, 'POST')

// 结束通话
export let finish = (userId, sessionId, orgId, tellerId, skillCode) => request(`${baseurl}/app/finish`, 'POST',{
  userId:userId,
  sessionId:sessionId,
  orgId:orgId,
  tellerId: tellerId,
  skillCode: skillCode
})

//开卡签名 POST /app/bank/updateAutograph
export let updateAutograph = (id, autograph) => request(`${baseurl}/app/bank/updateAutograph`, 'POST',{
  id:id,
  autograph:autograph
})

// 获取视频柜员
export let getTeller = (userId, orgId,businessNo,channelNo) => {
  return request(`${baseurl}/app/get/teller`, 'POST',{
    userId,
    orgId,
    businessNo,
    channelNo
  })
}

// 发送消息
export let sendMsg = (userId, sessionId, type, text, $url, downName, downUrl) => {
  let _url = `${baseurl}/app/send/msg`;
  var data = {
    userId: userId,
    sessionId: sessionId,
    type: type
  }
  if (text){
    data['text'] = text
  }
  if ($url){
    data['url'] = $url
  }
  if (text){
    data['downName'] = downName
  }
  if (downUrl){
    data['downUrl'] = downUrl
  }
  return request(_url, 'POST',data)
}
