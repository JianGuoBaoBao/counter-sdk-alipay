var X2JS = require('./we-x2js')
let XML = require('./ObjTree');
let id = null
var islogin = false;
const btoa = require('./base64.min').btoa

const app = getApp()

function json2xml(jsonstring) {
  console.log(jsonstring)
  var xotree = new XML.ObjTree();
  var xml = xotree.writeXML(jsonstring);
  //使用jkl-dumper.js中的formatXml方法将xml字符串格式化
  //var xmlText = formatXml(xml);
  return xml;
}
//xml转json
function xml2json(xmlstring) {
  //将xml字符串转为json
  var x2js = new X2JS();
  var json = x2js.xml2js(xmlstring);
  console.log('转换成json', json)
  return json;
}

export default class OpenfireController {
  constructor(headers) {
    this.to = app.globalData.wsServer //"47.103.46.201"; // ws服务器地址
    this.xmlns = "urn:ietf:params:xml:ns:xmpp-framing";
    this.version = "1.0";
    this.xmllang = "zh";
    this.resource = "appClient";
    this.from = headers.userId;
    this.username = headers.userId
    this.password = 'Lm!@#$%^An' // 密码



    this.socketTask = my.connectSocket({
      url: app.globalData.socketUrl,
      protocols: ['xmpp'],
      multiple : true,
      success: function (res) {
        console.log('connectSocket: 创建connectSocket成功', res)
      }
    })

    this.socketTask.onOpen((res) => {
      console.log('触发socketTask onOpen方法', res)
      this.connwsopen()
    })

    this.socketTask.onMessage( (res) =>{
      console.log('触发socketTask onMessage方法', res)
      this.onMessage(res)
    })

    this.socketTask.onError(function (res) {
      my.alert({
        title: '提示',
        content: 'nError --- socketTask错误'
      })

    })
    this.socketTask.onClose(function (res) {
      my.alert({
        title: '提示',
        content: 'onClose --- socketTask关闭'
      })
    })


    my.onSocketError(function (res) {
      console.log('onError', res)
    })

    this.onConnectOK = headers.success
  }

  connwsopen() {
    let from = this.from + "@" + this.to;
    var temp = {
      "open": {
        "-to": this.to,
        "-from": from,
        "-xmlns": this.xmlns,
        "-xml:lang": this.xmllang,
        "-version": this.version
      }
    };
    //转化为xml
    var loginXml = null
    // loginXml = `<?xml version="1.0" encoding="UTF-8" ?>
    //   <open to="win10-2020bwunu" from="fizz@win10-2020bwunu" xmlns="urn:ietf:params:xml:ns:xmpp-framing" xml:lang="zh" version="1.0" />`

    loginXml = json2xml(temp)
    this.socketTask.send({
      data: loginXml,
      success: function (res) {
        console.warn("socketSend触发，我发送了：", loginXml);
        console.log('socketTask.send成功', res)
      }
    });
  }

  // 收到消息的处理函数
  onMessage(event) {
    console.warn("onMessage接收到的", event);
    var jsondata = xml2json(event.data.data);

    if (undefined != jsondata.message) {

      if (undefined != jsondata.message.body) {
        console.log("收到的消息：", jsondata.message.body);
        app.globalData.emitter.emit('customSysMsg', jsondata.message.body);
        // app.globalData.emitter.emit('customSysMsgPOC', jsondata.message.body);
      } else if (undefined != jsondata.message.composing) {

      } else if (undefined != jsondata.message.gone) {

      } else if (undefined != jsondata.message.file) {
        console.log("收到的文件：", jsondata.message);
      } else {

      }
    } else if (undefined != jsondata.open) {
      //记录id
      id = jsondata.open["_id"];
      console.log(id);
    } else if (undefined != jsondata["features"]) {
      if (undefined != jsondata["features"].mechanisms) {
        //获取登录验证方式
        this.auth(jsondata["features"].mechanisms.mechanism[0]);
      } else if (undefined != jsondata["features"].bind) {
        this.bind();
      } else {
        //Do-nothing
      }
    } else if (undefined != jsondata.failure) {
      islogin = false;
      // document.getElementById("isloginsuccess").innerHTML = "登录失败，用户名或者密码错误";
      console.log("登录失败，用户名或者密码错误");
    } else if (undefined != jsondata.success) {
      islogin = true;
      // document.getElementById("isloginsuccess").innerHTML = "登录成功";
      console.log("登录成功！");
      //发起新的流
      this.newopen();
      // this.onConnectOK(); // 登陆成功回调
    } else if (undefined != jsondata.iq) {
      if (undefined != jsondata.iq.bind) {
        //获取session会话
        this.getsession();
      } else {
        this.presence();
      }
    } else {
      //Do-nothing
    }//if(undefined != jsondata["stream:features"])
  }

  //获取session
  getsession() {
    //<iq xmlns="jabber:client" id="ak014gz6x7" type="set"><session xmlns="urn:ietf:params:xml:ns:xmpp-session"/></iq>
    var temp = {
      "iq": {
        "-xmlns": "jabber:client",
        "-id": id,
        "-type": "set",
        "session": { "-xmlns": "urn:ietf:params:xml:ns:xmpp-session" }
      }
    };
    //转化为xml
    var steam = json2xml(temp);
    this.socketTask.send({ data: steam })
    console.warn("socketSend触发: 获取session");
  }
  // 上线
  presence() {
    var temp = {
      "presence": {
        "-id": id,
        "status": "online",
        "priority": "1"
      }
    };
    //转化为xml
    var steam = json2xml(temp);
    this.socketTask.send({ data: steam })
    console.warn("socketSend触发: 上线");
  }

  //发起新的流
  newopen() {
    let self = this;
    var temp = {
      "open": {
        "-xmlns": "jabber:client",
        "-to": this.to,
        "-version": this.version,
        "-from": this.from,
        "-id": id,
        "-xml:lang": this.xmllang
      }
    };

    var steam = json2xml(temp);

    this.socketTask.send({
      data: steam,
      success: function (res) {
        console.warn("socketSend触发: 发起新的流", res);
        setTimeout(() => {
          self.onConnectOK();
        }, 300);
      }
    })
  }


  //bind操作
  bind() {
    console.log('bind')
    var temp = {
      "iq": {
        "-id": id,
        "-type": "set",
        "bind": {
          "-xmlns": "urn:ietf:params:xml:ns:xmpp-bind",
          "resource": this.resource
        }
      }
    };
    //转化为xml
    var steam = json2xml(temp);
    // websocket.send(steam);
    this.socketTask.send({
      data: steam,
      success: function (res) {
        console.warn("socketSend触发: bind操作", res);
      }
    })

  }


  //登录验证
  auth(authentication) {
    console.log('auth(authentication)', authentication)
    //字符串格式是：jid+password，以\0作为分隔符
    // var temp = username + "@" + to + "\0" + password;
    var temp = this.username + '@' + this.to + '\0' + this.password
    //Base64编码
    // var token = temp;
    var token = btoa(temp);
    console.log(token)
    // Zml6eiU0MHdpbjEwLTIwMjBid3VudSUyMCUwMDEyMzQ1Ng == 不可以
    // var token = 'Zml6ekB3aW4xMC0yMDIwYnd1bnUAMTIzNDU2' 可以
    // var token = 'Zml6ekB3aW4xMC0yMDIwYnd1bnUgADEyMzQ1Ng==' 不可以
    // var message = "<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>" + token + "</auth>";
    var message = {
      "auth": {
        "-xmlns": "urn:ietf:params:xml:ns:xmpp-sasl",
        "-mechanism": authentication,
        "#text": token
      }
    };
    this.socketTask.send({
      data: json2xml(message),
      success: function (res) {
        console.warn("socketSend触发: 登录验证", res);
      }
    })
  }

  // // 发送消息  to---接收者id，from---发送者id，type---消息类型（chat--单聊，groupchat--群聊）。message--发送的消息
  sendMessage(data) {
    // to, from, type, message 为json，success
    console.log('发送聊天信息', data.to, data.from, data.type, data.message)
    if (islogin) {
      var temp = {
        "message": {
          "-type": data.type || 'groupchat',
          "-from": data.from || this.from,
          "-to": data.to,
          "subject": "标题",
          "body": data.message
        }
      };
      //转化为xml
      var steam = json2xml(temp);
      // websocket.send(steam);
      this.socketTask.send({
        data: steam,
        success: function (res) {
          console.warn("socketSend触发: 发送消息", res);
          console.warn("我发送了:", steam);
          if (data.success){
            data.success()
          }
        }
      })
    } else {
      // alert('请先登录！')
    }
  }


  // 加入群  from---加入群的人的jid，to--群名称
  joinChatRoom(from, to) {
    // 发送<presence>元素，加入房间
    if (islogin) {
      var temp = {
        "presence": {
          "-from": from,
          "-id": id,
          "-to": to + '/' + from.substring(0, from.indexOf('@')),
          "x": {
            "-xmlns": "http://jabber.org/protocol/muc"
          }
        }
      }
      //转化为xml
      var steam = json2xml(temp);

      this.socketTask.send({
        data: steam,
        success: function (res) {
          console.log('socketTask.send: joinChatRoom加入群', res);
          console.warn("我发送了:", steam);

        }
      })
    } else {
      // alert("请先登录！");
    }
  }

  disconnect() {
    var temp = {
      "close": {
        "-xmlns": "urn:ietf:params:xml:ns:xmpp-framing"
      }
    };
    var steam = json2xml(temp);
    this.socketTask.send({
      data: steam,
      success: function (res) {
        console.log('socketTask.send,断开连接', res);
        console.warn("我发送了:", steam);
      }
    })
  }

}

