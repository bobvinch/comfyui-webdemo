import {Client_GET, Client_POST} from "~/utils/httpUtils";
import {useTokenUtilgetUidfromToken, useTokenUtilverifyToken} from "~/utils/tokenUtils";

/**
 * 注册h或者登录结果消息接口
 */
export type RegistRes = {
    status: number;
    msg: string;
    data: User;
};

/**
 * 用户信息
 */
export interface User {
    _id?: string;
    nickname?: string;
    password?: string;
    username?: string;
    wx_openid?: string;
    wx_unionid?: string;
    avatar_url?: string;
    email?: string;
    inviter_uid?: string;
    last_login_date?: number;
    register_date?: number;
    last_login_ip?: string;
    mobile?: string;
    my_invite_code?: string;
    role?: string[];
    token?: string;
    socket_id?: string;
}
export interface WechatUser {
    openid: string;
    nickname: string;
    sex: number;
    language: string;
    city: string;
    province: string;
    country: string;
    headimgurl: string;
    privilege: any[];
    unionid: string;
}

/**
 * 验证cokie，返回boolean
 * @param cokies
 */
export const useAuthvalidateCokies = (cokies: string) => {
    return cokies && useTokenUtilverifyToken(cokies);
}
/**
 * 根据token 自动登录
 */
export const useAuthautoLoginByToken = (token: string) => {
    const uid = useTokenUtilgetUidfromToken(token)
    const authStore = useAuthStore()
    if (uid && authStore.user) {
        authStore.user._id = uid
        useAuthautoLogin().then((res: boolean) => {
            console.log("@@@@@z自动token登录" + res)
            //设置cokies
            useAuthsetCokies(token, uid)
            return res
        })
    } else {
        return false
    }

}
/**
 * 自动根据本地的token,完成自动登录
 */
export const useAuthautoLogin = async () => {
    const authStore = useAuthStore()
    if (authStore?.user?._id && authStore?.user?.token) {
        useAuthsetCokies(authStore.user.token, authStore.user._id)
        // await useAuthupdateTokenbyuid(authStore.userInfo._id)
        navigateTo(useGlobalConfig.APP.homepage)
        return true
    } else {
        // 没有token，没有uid，没有用户信息，不能自动登录,跳转到登录页面
        navigateTo(useGlobalConfig.APP.loginpage)
        return false
    }
}

/**
 * 根据用户id，从unicloud获取人员信息
 * @param uid
 */
export const useAuthgetUserinfobyId = async (uid: string) => {
    const data = {
        id: uid
    }
    // 根据id获取用户信息
   return  await Client_GET(`user/${uid}`) as User

}

/**
 * 根据账号从unicloud服务器获取用户信息，返回user对象，失败返回null
 * @param accout
 */
// const useAuthgetUserinfoByAccout = async (accout: string) => {
//     const data = {
//         username: accout
//     }
//     const res = await POST_unicloud('/aichat/getUserinfoByAccout', data)
//     return res.data.length > 0 ? res.data[0] : null
//     // 根据id获取用户信息
//     // this.userInfo=(await POST('/aichat/getUserinfoByAccout', data)).data[0]
// }
/**
 * 账号密码注册，注册到unicloud,成功之后返回用户id,失败返回null
 * @param accout 账号
 * @param email
 * @param password 密码
 */
export const useAuthUseregisterWithPassword = async (accout: string, email: string, password: string): Promise<RegistRes> => {
    return await Client_POST('/users/registerByUsername', {
        username: accout,
        email: email,
        password: password
    }) as RegistRes
    // 根据id获取用户信息
    // this.userInfo=(await POST('/aichat/getUserinfoByAccout', data)).data[0]
}

// /**
//  * 根据用户的id,生成一个token，并且更新unicloud服务器的token
//  * @param uid
//  */
// export const useAuthupdateTokenbyuid = async (uid: string) => {
//     const token: string = generateToken(uid)
//     // 保存token到本地
//     const authStore = useAuthStore()
//     authStore.userInfo.token?authStore.userInfo.token.unshift(token):authStore.userInfo.token=[token]
//     useAuthsetCokies(token,uid)
//     const data = {
//         id: uid,
//         token: token
//     }
//     const res = await POST_unicloud('/aichat/updateTokenbyuid', data)
//     return res.updated && res.updated === 1;
// }

/**
 * 账号密码登录，登录结果状态
 * @param account
 * @param inputpassword
 */
export const useAuthloginbyAccount = async (account: string, inputpassword: string) => {
    return await Client_POST('/users/loginByUsername', {
        username: account,
        password: inputpassword
    }) as RegistRes
}
/**
 * 退出登录，清空本地用户信息和cokies
 */
export const useAuthlogout = () => {

    const authStore = useAuthStore()
    authStore.user = null
    useAuthclearCokies()
    navigateTo("/auth/login");
}
/**
 * 设置cokies，格式为{token:""}
 * @param token
 * @param uid
 */
export const useAuthsetCokies = (token: string, uid: string) => {
    const cokies = useCookie('userauth')
    // @ts-ignore
    cokies.value = {token: token, uid: uid}
}
/**
 * 获取cokies中的tokie，返回字符串或者null
 */
export const useAuthgetCokies = ():string | null => {
    const cokies = useCookie('userauth')
    if (cokies.value) {
        // @ts-ignore
        const {token} = cokies.value
        return token
    } else {
        return null
    }
}
export const useAuthclearCokies = () => {
    const cokies = useCookie('userauth')
    cokies.value = undefined
}
/**
 *根据微信返回的code,获取微信的个人信息，包含openid和unionid,并保存到store的wechatAuth中
 * @param code
 */
export const useAuthgetWechatUserInfo = async (code: string): Promise<WechatUser|null> => {
    //获取用户个人信息（UnionID机制）
    const userinfo_url = "/wechatauth/getuserinfo?code=" + code
    return  await Client_GET(userinfo_url) as WechatUser
}
/**
 * 根据微信信息自动登录，如果微信注册则自动登录，没有注册则注册
 */
export const useAuthloginByWechat = async (wechatUser: WechatUser) => {
    const authStore = useAuthStore()
    //
    const user = await Client_POST("/wechatauth/loginByOpenid", wechatUser) as User
    if (user) {
        authStore.user=user
        //保存到store中
        // 保存到cokie中
        useAuthsetCokies(user.token!, user._id!)
        //自动登录
        navigateTo(useGlobalConfig.APP.homepage)
    }
}

