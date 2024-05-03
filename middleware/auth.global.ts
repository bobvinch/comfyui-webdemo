import {useAsyncData} from "#app";
import {usePinia} from "#imports";
import {useGlobalConfig} from "~/composables/globalConfig";
import {useTokenUtilverifyToken} from "~/utils/tokenUtils";

// @ts-ignore
export default defineNuxtRouteMiddleware((to, from) => {
    // isAuthenticated()是一个验证用户是否已经认证的示例方法
    //拦截登录
    if(useGlobalConfig.Auth.NotNeedLogin.includes(to.path)){
        //白名单
        console.log("@路由拦截，白名单",to.path)
        return true
    }else {
        const {$pinia} = useNuxtApp()
        const pinia = usePinia()
        const authStore = useAuthStore($pinia)
        //拦截query中的token
        const {token:queryToken} = to.query
        console.log("路由拦截，query token",queryToken)
        if (queryToken && useTokenUtilverifyToken(queryToken+'')){
            const customizeTheme = useCustomizeThemeStore($pinia)
            customizeTheme.mainSidebar = false
            useAuthautoLoginByToken(queryToken+'')
            return true
        }
        //如果不是从微信小程序过来，验证cokie,格式化为{token:"token"}
        const cokieToken=useAuthgetCokies()
        console.log("路由拦截，query cokieToken",cokieToken)
        if(cokieToken&&useAuthvalidateCokies(cokieToken)){
            return true
        }else {
            console.log("路由拦截成功，跳转到登录页面")
            return navigateTo(useGlobalConfig.APP.loginpage)
        }

    }


})