import { baseurl } from './app.config.js'

import { request } from '../utils/request.js'

/**
 * 获取第三方视频柜员 /app/third/get/teller
 * @param {*} reqID 唯一标识，由第三方提供在调起小程序的时候传过来,如果是资讯类的就没有reqID
 * @param {*} appKey 第三方小程序在我们平台注册的appKey(oauth),后续替换为acccessToken字段
 * @param {*} userId 客户ID，用户的唯一标识，第三方小程序调用会有授权，通过授权获取到
 * @param {*} orgId 开户行机构号
 * @param {*} source 客户请求来源(总行/网点),应该是台行和村镇标识,台行:tzbank,村镇:czbank
 * @param {*} businessType 业务类型
 * @param {*} channelValue 渠道定义
 */
export let getThirdTeller = (reqId,appKey,userId, orgId, source,businessType,channelValue) => request(`${baseurl}/app/third/get/teller`, 'GET',{
    reqId:reqId,
    appKey:appKey,
    userId:userId,
    orgId:orgId,
    source:source,
    businessType:businessType,
    channelValue:channelValue
})

/**
 * 退出调用服务端 /app/notify/after/quit
 * 小程序退出时候，reqID不为空的时候调用服务端，服务端查询当前的回调状态，如果回调过，就不用再调用第三方接口；如果没有回调过，并且当前审核状态是审核通过/审核未通过，回调第三方接口，将审核结果给到第三方。
 */
export let quit = (reqId) => request(`${baseurl}/app/notify/after/quit`, 'POST',{
    reqId:reqId
})
