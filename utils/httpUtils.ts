import axios from "axios";
// const unicloud_baseUrl = 'https://unicloudapi.gptpro.ink'
// const baseUrl = 'http://127.0.0.1:4399/api'
// 将API的端口全部转发到服务器，解决跨域问题

/**
 * 向当前路径的/api接口，发送$fetch请求
 * @param url
 * @param body
 * @constructor
 */
export const Client_POST = async (url: string, body: any) => {
    console.log("@SSR POST发送的数据", body)
    const data = await $fetch(url, {
        method: 'post',
        baseURL: useRuntimeConfig().public.baseApiurl as string,
        body: body,
        mode: 'cors',
        // headers:{
        //   'Content-Type': 'application/json',
        //   "allow-control-allow-origin": "*"
        // }
    }).catch(error => {
        useSnackbarStore().showErrorMessage(error.message)
    });
    console.log("@SSR POST获取的data数据", data)
    return data
}
/**
 * 向当前路径的/api接口，发送$fetch请求
 * @param url
 * @constructor
 */
export const Client_GET = async (url: string): Promise<any> => {
    const data = await $fetch(url, {
        method: 'get',
        baseURL: useRuntimeConfig().public.baseApiurl as string,
        mode: 'cors'
    }).catch(error => {
        useSnackbarStore().showErrorMessage(error.message)
    });
    console.log("Client_GET求情的数据", data)
    return data
}


//请求阿里云服务器
export const GET = async (url: string) => {
    const result = await axios({
        method: 'get',
        url: useRuntimeConfig().public.baseApiurl + url,
    })
    console.log("请求的结果是：" + JSON.stringify(result.data))
    return result.data
}

export const POST = async (url: string, data: any) => {
    const result = await axios({
        method: 'post',
        url: useRuntimeConfig().public.baseApiurl + url,
        data: data
    })
    console.log("请求的结果是：" + JSON.stringify(result.data))
    return result.data
}