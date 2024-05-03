import CryptoJS from "crypto-js"
import {Base64} from 'js-base64';

// 
const passwordSecret = useGlobalConfig.Auth.passwordSecret //
const tokenSecret = useGlobalConfig.Auth.tokenSecret //


//验证密码
export const useTokenUtilverifyPwd = (inputpwd: string, pwdToken: string) => {
    return useTokenUtilencryptPassword(inputpwd) === pwdToken
}
/**
 * 生成token,携带用户id,角色和权限
 * @param uid
 * @param options  expireTime:过期时间
 */
export const useTokenUtilgenerateToken = (uid: string,options?:{
    expireTime?:number
}) => {
    const token_1 = { "alg": "HS256", "typ": "JWT" }
    const token_2 = {
        "uid": uid,
        "role": [],
        "permission": [],
        "uniIdVersion": "1.0.16",
        "iat": Math.floor(Date.now() / 1000),
        "exp": Math.floor(Date.now() / 1000) + (options?.expireTime || 2)*24*3600,//默认2个小时
    }
    const token_3 = { code: CryptoJS.HmacSHA1(`${JSON.stringify(token_1)}.${JSON.stringify(token_2)}`,tokenSecret) }
    console.log('加密时候的第三部分：'+JSON.stringify(token_3))
    const t1_e = Base64.encode(JSON.stringify(token_1))
    const t2_e = Base64.encode(JSON.stringify(token_2))
    const t3_e = Base64.encode(JSON.stringify(token_3))
    // console.log("@@@@@@@generate token:" + t1_e + t2_e + t3_e)
    return t1_e + '.' + t2_e + '.' + t3_e
}
//从token中获取uid
export const useTokenUtilgetUidfromToken = (token: string) => {

    const l = token.split(".")
    if (l.length != 3) {
        return null
    }
    let [a, b, c] = l
    const b1 = _useTokenUtilformateTokenString(b)
    return b1.uid ? b1.uid : null

}
//验证token
export const useTokenUtilverifyToken = (token: string) => {
    const l = token.split(".")
    if (l.length != 3) {
        return false
    }
    let [a, b, c] = l
    const a1 = _useTokenUtilformateTokenString(a)
    console.log("token第一部分",a1)
    // if ("HS256" !== a1.alg || "JWT" !== a1.typ) {
    //     return false
    // }
    // if(!_useTokenUtildecodeTokenHash(token)){
    //     // hash校验不过，token人为修改
    //     return false
    // }
    const b1 = _useTokenUtilformateTokenString(b);
    console.log("token第二部分",b1,(1e3 * b1.exp - Date.now()/1000))
    // return 1e3 * b1.exp >= Date.now();
    return true
}

//格式化token中的字符串
const _useTokenUtilformateTokenString = (e: string) => {
    const str = Base64.decode(e)
    // console.log("@@@@@@解码出来的字符串" + str)
    return JSON.parse(str)
}
/**
 * 密码散列
 * @param str
 */
export const useTokenUtilencryptPassword = (str: string) => {
    return CryptoJS.HmacSHA1(str, passwordSecret) + ''
    // console.log("@@@@@@result"+result)
}

//解码token
function _useTokenUtildecodeTokenHash(token:string) {
    // const tokenTest = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NWIzYmIzY2YwODIxMGIwN2RiNGUyYmYiLCJyb2xlIjpbXSwicGVybWlzc2lvbiI6W10sInVuaUlkVmVyc2lvbiI6IjEuMC4xNiIsImlhdCI6MTcwNjI3NzY5MiwiZXhwIjoxNzA2NTM2ODkyfQ.NjEvo1mXGT-bCi7Jh22ZGXJh1-hokxg1SXFY1-pxWnk'
    const _l = token.split(".")
    const r1 = Base64.decode(_l[0])
    // console.log("result:"+result)
    const r2 = Base64.decode(_l[1])
    // console.log("result2:"+result2)
    const r3 = _l[2]
    // console.log("result3:"+result3)
    const str ={ code: CryptoJS.HmacSHA1(`${r1}.${r2}`,tokenSecret) }
    console.log("str的base64加密:",Base64.encode(JSON.stringify(str)))
    return  Base64.encode(JSON.stringify(str))==r3

    // console.log("@@@@@@result" + result + result2 + result3 + "@@@@@" + result5)
    // var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // console.log("解码结果是："+decryptedData)
}

//生成一个随机数字
export const useTokenUtilgenerateRandomNumber = (length: number) => {
    let min = Math.pow(10, length - 1);
    let max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min);
}
/**
 * 推文模块校验授权
 * @param id
 */
export const useTokenTweetAuth=(id:string)=>{
    //如果是第一次登录，发放体验token,过期天数为7天
    const {tweetToken}=useAuthStore()
    if(!tweetToken){
        console.log('token不存在校验，首次登录')
        return false
    }else {
        //校验token是否过期
        console.log('校验token是否过期',useTokenUtilverifyToken(tweetToken))
        if(useTokenUtilverifyToken(tweetToken)) {
            console.log('token存在，token校验通过')
            return true
        }else {
            console.log('token存在，token校验失败,跳转到首页')
            navigateTo(useGlobalConfig.APP.homepage)
            return false
        }
    }
}
/**
 * 推文根据用户id和对应的密钥激活token
 */
export const useTokenTweetActivateToken=(id:string,key:string)=>{
    //根据id计算密钥
    const  _key=CryptoJS.HmacSHA1(id, "key")+''
    // console.log(CryptoJS.HmacSHA1('6618e941d0f70d7223017266', "key")+'')
    return key == _key;
}
/**
 * 设置试用token,过期时间为30天
 */
export const useTokenTweetSetTrialToken=(id:string)=>{
    const {tweetToken}=storeToRefs(useAuthStore())
    if(!tweetToken.value){
        tweetToken.value=useTokenUtilgenerateToken(id, {expireTime: 30})
    }
}
/**
 * 设置永久token
 */
export const useTokenTweetSetPermanentToken=(id:string)=>{
    const {tweetToken}=storeToRefs(useAuthStore())
    tweetToken.value=useTokenUtilgenerateToken(id, {expireTime: 3650})
}
/**
 * 从token中获取剩余天数
 *
 */
export const useTokenTweetGetRemainDays=(token:string)=>{
    //判断token的type是否为string
    const l = token.split(".")
    if (l.length != 3) {
        return 0
    }
    let [a, b, c] = l
    const b1 = _useTokenUtilformateTokenString(b)
    const expireTime=b1.exp
    const nowTime=Math.floor(Date.now() / 1000)
    return Math.floor((expireTime-nowTime)/24/3600)
}




// const hashDigest = sha256(nonce + message);
// const hmacDigest = Base64.stringify(hmacSHA512(path + hashDigest, privateKey));





// function h(e) {
// 	return JSON.parse((t = function(e) {
// 		var t = 4 - (e = e.toString()).length % 4;
// 		if (4 !== t)
// 			for (var n = 0; n < t; ++n) e += "=";
// 		return e.replace(/-/g, "+").replace(/_/g, "/")
// 	}(e), Buffer.from(t, "base64").toString("utf-8")));
// 	var t
// }

// function p(e, n) {
// 	return l(t.createHmac("sha256", n).update(e).digest("base64"))
// }
// //
// const checkToken = function(e, tokeSeceret) {
// 		if ("string" != typeof e) throw new Error("Invalid token");
// 		const n = e.split(".");
// 		if (3 !== n.length) throw new Error("Invalid token");
// 		const [i, r, o] = n;
// 		if (p(i + "." + r, tokeSeceret) !== o) throw new Error("Invalid token");
// 		const s = h(i);
// 		if ("HS256" !== s.alg || "JWT" !== s.typ) throw new Error("Invalid token");
// 		const c = h(r);
// 		if (1e3 * c.exp < Date.now()) {
// 			const e = new Error("Token expired");
// 			throw e.name = "TokenExpiredError", e
// 		}
// 		return c
// 	}