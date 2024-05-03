export class ComfyUI {
    private static Object_info = null as any;
    public static ckpt_names = [] as string[];
    static Initalize = async () => {
        if (!this.Object_info) {
            //初始化获取ComfyUI的节点信息
            this.Object_info = await this.GET('/draw/getObjectinfo')
            if (this.Object_info) {
                this.ckpt_names = this.Object_info['CheckpointLoaderSimple'].input.required.ckpt_name[0]
                console.log("@ComfyUI 初始化获取ComfyUI的节点信息", this.ckpt_names)
            }
        }
    };

    /**
     * 上传图片到OSS，返回图片url
     * @param file
     */
    static uploadImageToOSS = async (file: File): Promise<string> => {
        return await useUtilsUploadFileToOSS(file, 'image')
    };

    static removebg = async (image_path: string) => {
        return await this.POST('/draw/removebg', {
            client_id: useAuthStore().user?._id,
            socket_id: useAuthStore().user?.socket_id,
            params: {
                image_path
            },
            options: {
                source: "web",
                lifo: false
            }
        })
    }
    /**
     * 具备重绘
     * @param params
     */

    static impainting = async (params: {
        image_path: string,
        image_path_mask: string,
        ckpt_name_id?: number,
        denoise?: number,
        positive?: string,
        nagative?: string
    }) => {
        return await this.POST('/draw/inpainting', {
            client_id: useAuthStore().user?._id,
            socket_id: useAuthStore().user?.socket_id,
            params: {
                image_path: params.image_path,
                image_path_mask: params.image_path_mask,
                ckpt_name_id: params.ckpt_name_id || 0,
                denoise: params.denoise || 0.5,
                positive: params.positive || "",
                nagative: params.nagative || ""
            },
            options: {
                source: "web",
                lifo: false
            }
        })
    }
    /**
     * 图片高清放大加细节修复，必须参数一个，图片路径，可选参数2个，降噪和放大倍数
     * @param imagepath 必须，图片路径
     * @param multiple 可选，放大倍数
     * @param denoise 可选，降噪幅度
     * @returns 返回绘图的API
     */
    static imageUpscaleAndDetailFix = async (imagepath: string, multiple?: number, denoise?: number):Promise<string> => {

        //todo
        return ""
    }
    /**
     * 图片高清放大，默认放大4倍
     * @returns
     */
    static imageUpscale = async (image_path: string): Promise<string> => {
        return await this.POST('/draw/hdfix', {
            client_id: useAuthStore().user?._id,
            socket_id: useAuthStore().user?.socket_id,
            params: {
                image_path
            },
            options: {
                source: "web",
                lifo: false
            }
        }) as string
    }
    /**
     * 抠像
     * @param url
     * @param segParts 分割部分
     */
    static segmentAnything = async (url: string, segParts: string): Promise<string> => {
        //调用API之前初始化参数
        return await this.POST('/draw/segmentAnything', {
            client_id: useAuthStore().user?._id,
            socket_id: useAuthStore().user?.socket_id,
            params: {
                image_path: url,
                segmentparts: segParts
            },
            options: {
                source: "web",
                lifo: false
            }
        }) as string
    }


    /**
     * 普通文生图
     * @returns
     */
    static text2img = async (params: {
        positive: string,
        negative?: string,
        seed?: number,
        width?: number,
        height?: number
        ckpt_name_id?: number
        filename_prefix?: string | number  //文件名前缀
        upscale_by?: number
        sd3_aspect_ratio?:string
        sd3_style_preset?:string
    },options?:{
        apisource:string   //sd3 || default
    }): Promise<string> => {
        return await this.POST('/draw/text2img', {
            client_id: useAuthStore().user?._id,
            socket_id: useAuthStore().user?.socket_id,
            params: {
                positive: params.positive,
                negative: params.negative,
                seed: params.seed || useTokenUtilgenerateRandomNumber(15),
                width: params.width || 512,
                height: params.height || 768,
                ckpt_name_id: params.ckpt_name_id || 0,
                filename_prefix: params.filename_prefix || "",
                upscale_by: params.upscale_by || 1,
                sd3_aspect_ratio:params.sd3_aspect_ratio,
                sd3_style_preset:params.sd3_style_preset
            },
            options
        }) as string
    }

//img2img
    static img2img = async (params: {
        image_path: string,
        denoise?: number,
        noise_seed?: number,
        ckpt_name_id?: number,
        filename_prefix?: string,
        upscale_by?: number
    }): Promise<string> => {
        await this.Initalize()
        return await this.POST('/draw/img2img', {
            client_id: useAuthStore().user?._id,
            socket_id: useAuthStore().user?.socket_id,
            params: {
                image_path: params.image_path,
                denoise: params.denoise || 0.5,
                noise_seed: params.noise_seed || useTokenUtilgenerateRandomNumber(15),
                ckpt_name_id: params.ckpt_name_id || 0,
                filename_prefix: params.filename_prefix || "",
                upscale_by: params.upscale_by || 1
            },
            options: {
                source: "web",
                lifo: false
            }
        }) as string
    };
    /**
     * 图片生成视频
     */
    static image2video = async (params: {
        image_path: string,
        video_frames?: number,
        fps?: number,
        motion_bucket_id?: number,
        augmentation_level?: number,
        filename_prefix?: string,
        cfg?: number,
        steps?: number,
        min_cfg?: number
    }): Promise<string> => {
        return await this.POST('/draw/img2video', {
            client_id: useAuthStore().user?._id,
            socket_id: useAuthStore().user?.socket_id,
            params: {
                image_path: params.image_path,
                video_frames: params.video_frames || 14,
                fps: params.fps || 8,
                motion_bucket_id: params.motion_bucket_id || 127,
                augmentation_level: params.augmentation_level || 0,
                filename_prefix: params.filename_prefix || "图生视频",
                cfg: params.cfg || 3,
                steps: params.steps || 20,
                min_cfg: params.min_cfg || 1
            },
            options: {
                source: "web",
                lifo: false
            }
        }) as string
    }

    /**
     *
     * @param params
     */
    static aimodel = async (params: {
        parts?: string,
        image_path_model: string,
        image_path_mask?: string,
        positives?: string,
        negatives?: string,
        ckpt_name_id?: number
    }): Promise<string> => {
        return await this.POST('/draw/model', {
            client_id: useAuthStore().user?._id,
            socket_id: useAuthStore().user?.socket_id,
            params: {
                parts: params.parts || "dress",
                image_path_model: params.image_path_model,
                image_path_mask: params.image_path_mask,
                positives: params.positives || "8k",
                negatives: params.negatives || "",
                ckpt_name_id: params.ckpt_name_id || 0
            },
            options: {
                source: "web",
                lifo: false
            }
        }) as string
    }
    /**
     * AI写真
     * @param params
     * @constructor
     */
    static faceswap = async (params: {
        image_path_face: string,
        image_path_refer: string
    }): Promise<string> => {
        //调用API之前初始化参数
        return await this.POST('/draw/faceswap', {
            client_id: useAuthStore().user?._id,
            socket_id: useAuthStore().user?.socket_id,
            params: {
                image_path_face: params.image_path_face,
                image_path_refer: params.image_path_refer
            },
            options: {
                source: "web",
                lifo: false
            }
        }) as string
    }
    /**
     * 图片反推提示词
     */
    static image2tagger = async (image_path: string) => {
        //调用API之前初始化参数
        return await this.POST('/draw/image2tagger', {
            client_id: useAuthStore().user?._id,
            socket_id: useAuthStore().user?.socket_id,
            params: {
                image_path,
            },
            options: {
                source: "web",
                lifo: false
            }
        }) as string
    }
    /**
     * 验证图片的文件大小和宽高不超过1024，文件大小不超过4M
     * @param file
     * @returns
     */
    static validateImage = async (file: any): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            console.log(file.size)
            if (!file.size || file.size > 4048000) {
                resolve(false)
            }
            const _URL = window.URL || window.webkitURL;
            const image = new Image();
            image.src = _URL.createObjectURL(file)
            console.log(_URL.createObjectURL(file))
            image.onload = function () {
                // console.log(image.width>1024||image.height>1024)
                if (image.width > 1200 || image.height > 1200) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            }
        })
    }
    public static POST = async (url: string, body: any) => {
        // console.log("@SSR POST发送的数据",body)
        const data = await $fetch(url, {
            method: 'post',
            baseURL: useRuntimeConfig().public.baseApiurl as string,
            body: body
        }).catch(err => {
            useSnackbarStore().showErrorMessage('绘画服务器发生错误！')
            //将绘画状态调整为false
            // useStableDiffusionStore().isGernateDisable=false
        });
        console.log("@ComfyUI_POST 获取的data数据", data)
        return data
    }
    public static GET = async (url: string) => {
        // console.log("@SSR POST发送的数据",body)
        const data = await $fetch(url, {
            method: 'get',
            // baseURL: '/api',
            baseURL: useRuntimeConfig().public.baseApiurl as string,
        });
        console.log("@ComfyUI_GET 获取的data数据", data)
        return data
    }

}


export interface DrawTask {
    client_id: string,
    socket_id: string,
    params: Object,
    options: {
        source: "web" | "wechat",
        lifo: boolean
    }
}





