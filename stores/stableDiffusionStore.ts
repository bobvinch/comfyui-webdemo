import {useTokenUtilgenerateRandomNumber} from "@/utils/tokenUtils"
import type {AimodelParams} from "~/composables/drawhooks";


export const useStableDiffusionStore = defineStore({
    id: "stableDiffusion",
    state: () => ({
        ckpt_id:0,  //大模型id
        currentSteps: 0,
        totalSteps: 10,
        isFixSeed: false,
        excutingApi:"",
        //API
        txt2imgParams: {
            positive: "一个女孩",
            negative: "丑陋的",
            seed:0,
            width: 512,
            height: 768,
            ckpt_name_id: 0,
            filename_prefix: "",
            upscale_by: 1,
        },
        img2imgParams: {} as Img2imgParams,
        aimodelParams: {} as AimodelParams,
        aistudioParams: {} as AistudioParams,
        ouputimgList: [] as Array<Image>,
        //图生图
        imageParam_img2img: [] as Array<Image>,
        //AI写真
        imageParam_aistudio: [] as Array<Image>,
        imageParam2_aistudio: [] as Array<Image>,
        //AI模特
        imageParam_aimodel: [] as Array<Image>,
        outputImage_Mask: {} as Image,

        //模型清单
        modelList: [],
        currentModel: "",
        isGernateDisable: true,
        btnStatus: "AI绘图中",//按钮显示的消息状态
        node: ""//节点名称

    }),

    persist: [{
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: persistedState.localStorage,
        // state 中的字段名，按组打包储存
        paths: ["ouputimgList", "txt2imgParams", "img2imgParams","aistudioParams", "aimodelParams"]
    }
    ],
    getters: {
        getShowList: (state) => {
            return state.ouputimgList.slice(0, 4)
        },
        getProcess: (state) => {
            return state.currentSteps / state.totalSteps * 100
        }

    },
    actions: {
        init() {
            if (Object.keys(this.txt2imgParams).length === 0) {
                console.log("初始化sdstore pinia仓库")
                this.txt2imgParams = JSON.parse(JSON.stringify(new txt2imgParams()))
            }
            if (Object.keys(this.img2imgParams).length === 0) {
                this.img2imgParams = JSON.parse(JSON.stringify(new img2imgParams()))
            }
            if (Object.keys(this.aimodelParams).length === 0) {
                this.aimodelParams = JSON.parse(JSON.stringify(new aimodelParams()))
            }
            if (Object.keys(this.aistudioParams).length === 0) {
                this.aistudioParams = JSON.parse(JSON.stringify(new aistudioParams()))
            }
        },
        addImage(url:string){
            const image = {
                url
            } as Image
            this.ouputimgList.unshift(image)
        },
        getSeed() {
            if (!this.isFixSeed) {
                this.txt2imgParams.seed = useTokenUtilgenerateRandomNumber(15)
            }
            return this.txt2imgParams.seed
        },
        deleteAll() {
            this.ouputimgList = []
        },
        deleteByIndex(index: any) {
            this.ouputimgList.splice(index, 1)
        },
        deleteByImageName(filename:string) {
            console.log(filename)
            this.ouputimgList.splice(this.ouputimgList.findIndex((item:OutputImage)=>item.name===filename),1)

        },
        addImageList(output: Image) {
            this.ouputimgList.unshift(output)

        },
        addOutputImage_Mask(filename: string, subfolder: string) {
            const image_mask = new image()
            if (subfolder) {
                image_mask.subfolder = subfolder

            } else {
                image_mask.subfolder = "output"
            }
            this.outputImage_Mask = image_mask

        },
    },
});
