import {defineStore} from "pinia";
import {Sprite, TextStyle} from "pixi.js";
import {AdjustmentFilter} from "pixi-filters";
import type {PixiBaseConfig} from "~/composables/usePixi";

export const usePixiStore = defineStore({
    id: "Pixi",
    state: () => ({
        selectTarget: null as any | Sprite,
        enableTextMask: false,//将文字作文遮罩
        scaleRate: 1,//选中对象的缩放比例
        inputText: "",
        rightDrawerwindow: 0,//右侧抽屉窗口
        toolbarConfig: {
            show: true,
            positionX: 0,
            positionY: 0
        },//工具栏配置
        textStyle: {
            // fontFamily:string | Array<string>//字体
            fontFamily: "Arial",
            // fontSize:number | string//字体大小
            fontSize: 26,
            // fontStyle:string//字体风格
            dropShadow: false,
            // fill:string | Array<string> | number | Array<number> | CanvasGradient | CanvasPattern字体填充颜色？
            fill: 'black',
            // align:string//对齐方式
            align: 'left',
            // breakWords:boolean//是否自动换行
            breakWords: false,
            // 字体样式？
            fontStyle: 'normal',
            // fontVariant:string//字体变体
            fontVariant: 'normal',
            // fontWeight:string//字体粗细
            fontWeight: 'normal',
            // letterSpacing:number//字符间距
            letterSpacing: 0,
            // leading:number//行间距
            leading: 0,
            // lineHeight行高
            lineHeight: 0,
            //字符间距
            padding: 0,
            //描边宽度
            stroke: "0x000000",
            //
            textBaseline: 'alphabetic',
            //是否去除空格
            trim: false,
            // 空格
            whiteSpace: 'pre',
            // 斜体
            wordWrap: false,
            //斜体角度
            wordWrapWidth: 100,
        } as unknown as TextStyle,
        adjustmentFilter: {
            alpha: 1, //默认为1，透明度
            blue: 1, //蓝色
            green: 1,//绿色
            red: 1, //红色
            brightness: 1, //亮度
            contrast: 1, //对比度
            gamma: 1,//伽马
            saturation: 1 //饱和度
        } as AdjustmentFilter,
        baseConfig: {
            width: 512,
            height: 768,
            editType: 'text2img',
            color: 'white',
            backgroundAlpha: 0,
            positive: "一个女孩",
            denoise: 0.3,
            segpart: "人",
            enableBrush: false,
            brushColor: "#000000",
            brushSize: 30,
            maxIndex: 0,
            indexOfSelect: 0
        } as PixiBaseConfig,
    }),

    persist:
        [{storage: persistedState.localStorage, paths: ['inputText']}],

    getters: {},
    actions: {},
});