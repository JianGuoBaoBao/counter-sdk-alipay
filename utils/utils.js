/**
 * 获取url地址中的参数
 * @param {*} url url地址
 * @param {*} name 键名
 */
let getQueryString = function (url, name) {
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
    var r = url.substr(1).match(reg)
    if (r != null) {
        // console.log("r = " + r)
        // console.log("r[2] = " + r[2])
        return r[2]
    }
    return null;
}
/**
 * 格式化时间字符串
 * @param {时间Date} date 
 * @param {年月日分隔符，默认'-'} separator 
 */
const formatTime = (date, separator = '-') => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    // if(day==new Date().getDate()){
    //   return [hour, minute, second].map(formatNumber).join(':')
    // }else{
    //   return [year, month, day].map(formatNumber).join(separator)
    // }
    return [year, month, day].map(formatNumber).join(separator) + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
/**
 * 金额转换为中文大写格式
 * @param {金额，number|string} money 
 */
function changeMoneyToChinese(money) {
    if (typeof money == 'string') {
        money = parseFloat(money.replace(',', ''))
    }
    var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
    var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
    var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
    var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
    //var cnInteger = "整"; //整数金额时后面跟的字符
    var cnIntLast = "圆整"; //整型完以后的单位
    var maxNum = 999999999999999.9999; //最大处理的数字

    var IntegerNum; //金额整数部分
    var DecimalNum; //金额小数部分
    var ChineseStr = ""; //输出的中文金额字符串
    var parts; //分离金额后用的数组，预定义
    var zeroCount;
    var IntLen;
    if (money == "") {
        return "";
    }
    money = parseFloat(money);
    if (money >= maxNum) {
        return "";
    }
    if (money == 0) {
        //ChineseStr = cnNums[0]+cnIntLast+cnInteger;
        ChineseStr = cnNums[0] + cnIntLast
        //document.getElementById("show").value=ChineseStr;
        return ChineseStr;
    }
    money = money.toString(); //转换为字符串
    if (money.indexOf(".") == -1) {
        IntegerNum = money;
        DecimalNum = '';
    } else {
        parts = money.split(".");
        IntegerNum = parts[0];
        DecimalNum = parts[1].substr(0, 4);
    }
    if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
        zeroCount = 0;
        IntLen = IntegerNum.length;
        for (let i = 0; i < IntLen; i++) {
            let n = IntegerNum.substr(i, 1);
            let p = IntLen - i - 1;
            let q = p / 4;
            let m = p % 4;
            if (n == "0") {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    ChineseStr += cnNums[0];
                }
                zeroCount = 0; //归零
                ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                ChineseStr += cnIntUnits[q];
            }
        }
        ChineseStr += cnIntLast;
        //整型部分处理完毕
    }
    if (DecimalNum != '') { //小数部分
        let decLen = DecimalNum.length;
        for (let i = 0; i < decLen; i++) {
            let n = DecimalNum.substr(i, 1);
            if (n != '0') {
                ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (ChineseStr == '') {
        //ChineseStr += cnNums[0]+cnIntLast+cnInteger;
        ChineseStr += cnNums[0] + cnIntLast;
    }
    /* else if( DecimalNum == '' ){
          ChineseStr += cnInteger;
          ChineseStr += cnInteger;
      } */
    return ChineseStr;
}
/**
 * 每隔4位分隔银行卡号
 * @param {银行卡号} account 
 */
function bankAccountFormat(account) {
    if (typeof account == 'number') {
        account = account + ''
    }
    account = account.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 "); //四位数字一组，以空格分割
    return account;
}
/**
 * 只显示前4位和后4位卡号，其余*号
 * @param {银行卡号}} account 
 */
function bankAccountEncrypt(account) {
    if (typeof account == 'number') {
        account = account + ''
    }
    let stars = ''
    for (let i = 0; i < account.length - 8; i++) {
        stars += '*'
    }
    return account.slice(0, 4) + stars + account.slice(-4);
}

/**
 * 千分位格式化金额
 * @param {{金额字符串}} val
 */
function formatMoney(val) {
    if(!val){
        return 0
    }
    var n = 2;
    var s = val;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    var t = "";
    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split('').reverse().join('') + "." + r;
}

/**
 * 金额最高位大写
 * @param {{金额字符串}} money
 */
function getMoneyTopChinese(money) {
    let ChineseArr = ['个', '十', '百','千','万','十万','百万','千万','亿','十亿','百亿','千亿'];
    let moneyLength = money.split('.')[0].length - 1;
    return ChineseArr[moneyLength];
}

module.exports = {
    getQueryString: getQueryString,
    changeMoneyToChinese,
    bankAccountFormat,
    bankAccountEncrypt,
    formatTime,
    formatMoney,
    getMoneyTopChinese
}