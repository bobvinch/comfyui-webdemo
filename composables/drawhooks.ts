import {blobtoFile, ImageUrlToBlob} from "~/utils/FileUtils";
import {Sprite, type Container} from "pixi.js";

/**
 * socket初始化，页面状态响应
 */
export const socketInit = () => {

    const {$socket} = useNuxtApp()
    // const $socket:Socket|undefined=inject("socket")
    const sdStore = useStableDiffusionStore()
    const snackbarStore = useSnackbarStore()
    if ($socket?.connected) {
        //已连接
        // snackbarStore.showSuccessMessage("服务器本身处于链接状态！")
        sdStore.isGernateDisable = false
    } else {
        //重新链接
        socketConnect().then((res: any) => {
            // console.log("socketInit收到的promiserace的链接结果是"+res)
            if (res) {
                sdStore.isGernateDisable = false
            } else {
                snackbarStore.showErrorMessage("连接错误，请重试或联系管理人员！")
                sdStore.isGernateDisable = false
            }
        }).catch(() => {
            // snackbarStore.showErrorMessage("连接错误，请重试或联系管理人员")
        })
    }

}

export const socketConnect = async () => {
    const snackbarStore = useSnackbarStore()
    const {$socket} = useNuxtApp()
    // const $socket:Socket|undefined=inject("socket")
    return Promise.race([
        new Promise(resolve => {
            //如果链接状态不成立
            console.log($socket?.connected)
            if (!$socket?.connected) {
                $socket?.connect()
                //监听链接状态
                $socket?.on('connect', () => {
                    console.log(`Connected: ${$socket.id}`);
                    if ($socket.connected) {
                        //防止缓冲发送大量消息
                        $socket.emit('message', "this a message from client ")
                        // snackbarStore.showSuccessMessage("链接绘画服务器成功！")
                        resolve(true)
                    }
                });
            } else {
                // snackbarStore.showSuccessMessage("服务器本身处于链接状态！")
                resolve(true)
            }
        }),
        new Promise((resolve, reject) => {
            setTimeout(() => {
                // snackbarStore.showErrorMessage("连接错误，请重试或联系管理人员！")
                resolve(false)
            }, 5000)
        })
    ])
}
/**
 * 将当前cavans画布图片转为blob
 */
export const usePixiCanvasToBlob = async (): Promise<Blob> => {
    const {$pixiApp} = useNuxtApp()
    const [mainContainer]=$pixiApp.stage.children
    const base64 = await $pixiApp.renderer.extract.base64(mainContainer)
    return  await ImageUrlToBlob(base64)
}



/**
 * 选中元素转blob
 * @param selectTarget
 */
export const useSelectTargetToblob = async (selectTarget: Sprite): Promise<Blob | any> => {
    if (!selectTarget) {
        return null
    }
    const {$pixiApp} = useNuxtApp()
    const src = await $pixiApp.renderer.extract.base64(toRaw(selectTarget).texture)
    return await ImageUrlToBlob(src)

}
export const useSelectTargetTofile = async (selectTarget: any): Promise<Blob | any> => {
    const blob= await useSelectTargetToblob(selectTarget)
    return new File([blob],"pixi_selectTarget.png")
}



/**
 * 文生图参数类
 */
export class txt2imgParams implements Txt2imgParams {
    public positive = "一个女孩";
    public negative = '丑陋的';
    public height = 768;
    public width = 512;
    public seed: number = 1

    toJSON() {
        return {...this} // here I make a POJO's copy of the class instance
    }
}

export interface Image {
    url?: string;
    name?: string;
    subfolder?: string;
    originFileObj?: any;
    base64?: string;
    size?: number;
    type?: string;
    uid?: string;
    source?: string;
    generateParams?: any;
    onhandleprocess?: boolean
}

export interface OutputImage extends Image {
    promptsNegative: string;
    promptsPositive: string;
    isUpscaled: boolean
}


//文生图参数接口
export interface Txt2imgParams {
    positive: string
    negative: string
    height: number
    width: number
    seed: number
}

//图生图参数
export interface Img2imgParams extends Txt2imgParams {
    denoise: number
    inputRefrenceImage: Image

}

/**
 * AI模特参数接口
 */
export interface AimodelParams extends Txt2imgParams {
    denoise: number;
    inputDemoModelImage: Image;
    recogPart: number;  //选择制片组的序号
}

/**
 * AI写真参数接口
 */
export interface AistudioParams extends Txt2imgParams {
    denoise: number;
    inputFaceRefrenceImage: Image;
    inputStyleRefrenceImage: Image;
}


/**
 * 图片接口
 */
export class image implements Image {
    onhandleprocess = false;
    generateParams: any = null;
    originFileObj: any = null;
    size: number = 0;
    type: string = "";
    uid: string = "";
    url: string = "";
    name: string = "";
    subfolder: string = "";
    base64 = "";
    // @ts-ignore
    source = "";


    public getPath() {
        if (this.url) {
            return this.url
        }
        if (this.subfolder != "") {
            return "./ComfyUI/" + this.subfolder + "/" + this.name
        } else {
            return "./ComfyUI/" + "output" + "/" + this.name
        }

    }
}

export class outputImage extends image implements OutputImage {
    isUpscaled: boolean = false;
    promptsNegative: string = "";
    promptsPositive: string = "";
}

/**
 *AI模特参数类
 */
export class aimodelParams extends txt2imgParams implements AimodelParams {
    inputDemoModelImage!: Image;
    recogPart: number = 0;
    denoise: number = 0.3;
    declare height: number;
    declare negative: string;
    declare positive: string;
    declare seed: number;
    declare width: number;
}

// @ts-ignore
/**
 * 图生图参数类
 */
export class img2imgParams extends txt2imgParams implements Img2imgParams, AistudioParams, AimodelParams {
    // @ts-ignore
    inputFaceRefrenceImage: Image;
    // @ts-ignore
    inputStyleRefrenceImage: Image;

    denoise: number = 0.3;
    inputRefrenceImage!: Image;
    // @ts-ignore
    inputDemoModelImage: Image;
    // @ts-ignore
    recogPart: string = "person";
    // toJSON(){
    //     return JSON.parse(JSON.stringify(this))
    // }
}

export class aistudioParams extends txt2imgParams implements AistudioParams {
    denoise: number = 0.25;
    inputFaceRefrenceImage!: Image;
    inputStyleRefrenceImage!: Image;

}