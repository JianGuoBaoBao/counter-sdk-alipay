import { envConfig } from './ArtvcEnvConfig.js'
export function request(url, method, data = {}) {
  const app = getApp()
  const env = app.globalData.env
  return new Promise((resolve, reject) => {
    my.request({
      url: url,
      method: method,
      data: data,
      header: {
        Origin: envConfig[env].Origin
      },
      dataType: 'json',
      timeout: 10000,
      success: function (res) {
        if (res.data.code != 0 && res.data.code != 200)
          reject(res.data)
        else
          resolve(res.data)
      },
      fail: function (err) {
        if(err.errMsg == 'request:fail timeout'){
          reject('TIMEOUT')
        }else{
          reject(`${method} ${url} fail`)
        }
      }
    })
  })
}