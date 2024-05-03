export interface Profile {
    id: string;
    name: string;
    avatar: string;
    created: boolean;
}
//用户信息
export interface UserInfo {
    _id: string,
    wx_openid: {
        mp: string,
        web: string
    },
    role:Array<string>,//j角色
    mobile:number,//手机号吗
    wx_unionid: string
    username: string,
    mail: string,
    nickname: string,
    password: string,
    register_date: number
    last_login_date: number,
    token: Array<string>,
    avatar_file: {
        url: string,
        name: string,
        extname: string
    },
    my_invite_code: string
}
//微信登录授权信息
export interface WechatAuth {
    access_token: string,
    expires_time: number,
    refresh_token: string,
    openid: string,
    scope: string,
    unionid: string
}