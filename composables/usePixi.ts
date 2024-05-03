import {
    Assets,
    type BlurFilter,
    Container,
    Filter,
    Rectangle,
    Sprite,
    Texture,
    TextStyle,
    Graphics,
    RenderTexture,
    Point
} from "pixi.js";
// @ts-ignore
import {saveAs} from "file-saver";
import {usePixiCanvasToBlob, useSelectTargetTofile} from "~/composables/drawhooks";
import axios from "axios";
import { nanoid } from "nanoid";

export interface PixiContainer {
    label: string
    index: number
    visible?: boolean
}

export type EditType = "text2img" | "img2img" | "hdfix" | "img2img_canvas" | "matting" | "impainting" | "removebg"

/**
 * 基础配置
 */
export interface PixiBaseConfig {
    width: number
    height: number
    editType: EditType
    color: string
    backgroundAlpha?: number
    positive: string
    denoise: number
    segpart: string
    enableBrush: boolean
    brushColor: string
    brushSize: number
    indexOfSelect: number//选中的图像的index
    maxIndex: number//容器最大index
}

/**
 * 创建容器，并加载到stage，可定义的name
 */
export const usePixiCreatContainer = (name?: string) => {
    const {$pixiApp} = useNuxtApp()
    const container = new Container()
    if (name) {
        container.label = name
    }
    $pixiApp.stage.addChild(container)
    return container
}

/**
 * 加载单个资源
 * @param alias
 * @param resUrl
 */
export const usePixiLoadAssets = async (alias: string, resUrl: string) => {
    // const id=nanoid()
    Assets.add({alias, src: resUrl});
    return await Assets.load([alias]);
}

/**
 * 废弃！尝试从精灵表中获取多个精灵
 * @param resUrl
 * @param options
 */
const wait = async (resUrl: string, options?: { frame?: { x: number, y: number, width: number, height: number } }) => {
    // const id=nanoid()
    Assets.add({alias: "image1", src: resUrl});
    const {image1} = await Assets.load(['image1']);
    if (options) {
        return new Texture({
            source: image1,
            frame: new Rectangle(options.frame?.x, options.frame?.y, options.frame?.width, options.frame?.height)
        })
    } else {
        return new Texture(image1)
    }
}

/**
 * 创建普通仅供，默认设置anchor 0.5
 * @param texture
 */
export const usePixiCreateSprite = (texture: Texture) => {
    //放大按钮
    const sprite = Sprite.from(texture)
    sprite.anchor.set(0.5)
    return sprite
}

/**
 * 创建交互式的精灵,默认设置anchor 0.5
 * @param texture
 */
export const usePixiCreateReativeSprite = (texture: Texture) => {
    //放大按钮
    const sprite = usePixiCreateSprite(texture)
    sprite.eventMode = 'static'
    return sprite
}

/**
 * 获取所有的容器label,返回一个数组
 */
export const usePixiUpdateLayers = () => {
    const {$pixiApp} = useNuxtApp()
    const layers = [] as PixiContainer[]
    $pixiApp.stage.children[0].children.forEach((item, index) => {
        layers.push({
            label: item.label,
            index: index
        })
    })
    // console.log(layers)
    return layers
}
type CallbackFn = (item?: any) => void
let timer: any = null
/**
 * 防抖函数
 * @param Callback
 * @param delay
 */
export const useDebounce = (Callback: CallbackFn, delay = 1000) => {
    timer != null ? clearTimeout(timer) : null
    timer = setTimeout(() => {
        Callback && Callback() //当有值才会执行
    }, delay)
}
/**
 * 将当前canvas导出视频
 * @param options
 */
export const usePixiExportCanvasVideo = (options?: { fps?: number, duration?: number }) => {
    if (!options) {
        options = {
            fps: 20,
            duration: 5
        }
    }
    const {fps = 20, duration = 5} = options
    const {$pixiApp} = useNuxtApp()

    const mediaStream = $pixiApp.canvas.captureStream(20)
    const mediaRecord = new MediaRecorder(mediaStream, {
        videoBitsPerSecond: 8500000,
    });
    const chunks = [] as any[];
    mediaRecord.onstop = (e) => {
        // 结束录屏
        console.log("录屏结束")
        const blob = new Blob(chunks, {type: "video/mp4"});
        saveAs(blob, "video.mp4");
    };
    mediaRecord.ondataavailable = (e) => {
        // 接收数据
        chunks.push(e.data);
    };
    mediaRecord.start(); // 开始录屏
    let num = 0;

    setTimeout(() => {
        mediaRecord.stop(); // 结束录屏
    }, (Number(duration) + 1) * 1000);
}

/**
 * 从9位16位颜色值并且带alpha的字符串中获取alpha值
 * @param hexColor
 */
export const useAlphaFromHexColor = (hexColor: string): number => {
    // 假设输入是一个有效的16进制颜色代码，并且它已经包含了#前缀
    // const r = hexColor.substring(1, 3);
    // const g = hexColor.substring(3, 5);
    const alpha = hexColor.substring(7, 9);
    if (hexColor.length === 7) {
        return 1
    }
    // 默认alpha值为1（不透明）
    const defaultAlpha = 0;
    // 返回RGBA格式的字符串
    // return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${alpha})`;
    return parseInt(alpha, 16) / 255 || defaultAlpha
}

/**
 * 复制选中目标的属性到文本配置文件上，对象拷贝存在问题，不能直接使用
 * @param textStyle
 * @param selectTarget
 */
export const usePixiCopySelectProperty = (textStyle: Ref<TextStyle>, selectTarget: any) => {
    textStyle.value.fontFamily = selectTarget.style.fontFamily
    textStyle.value.fontSize = selectTarget.style.fontSize
    textStyle.value.fill = selectTarget.style.fill
    textStyle.value.fontWeight = selectTarget.style.fontWeight
    textStyle.value.fontStyle = selectTarget.style.fontStyle
    textStyle.value.stroke = selectTarget.style.stroke
    textStyle.value.dropShadow = selectTarget.style.dropShadow
    textStyle.value.wordWrap = selectTarget.style.wordWrap
    textStyle.value.wordWrapWidth = selectTarget.style.wordWrapWidth
    textStyle.value.lineHeight = selectTarget.style.lineHeight
    textStyle.value.letterSpacing = selectTarget.style.letterSpacing
    textStyle.value.align = selectTarget.style.align
    textStyle.value.breakWords = selectTarget.style.breakWords
    textStyle.value.padding = selectTarget.style.padding
    textStyle.value.textBaseline = selectTarget.style.textBaseline
    textStyle.value.trim = selectTarget.style.trim
    textStyle.value.whiteSpace = selectTarget.style.whiteSpace
    textStyle.value.leading = selectTarget.style.leading
}

/**
 * 隐藏选中框
 */
export const usePixiHandleSelectBorderVisibility = (status: boolean) => {
    const {$pixiApp} = useNuxtApp()
    const handleContainer = $pixiApp.stage.getChildByName('handleContainer')
    const selectBorder = handleContainer!.getChildByLabel('selectBorder')
    if (selectBorder) {
        selectBorder.visible = status
    }
}
/**
 *
 * 移除选中目标的背景
 */
export const usePixiRemoveBg = async () => {
    const {selectTarget} = storeToRefs(usePixiStore())
    //Todo
}
/**
 * 针对画布操作，局部重绘
 */
export const usePixiImPaiting = async () => {
    const handleContainer = usePixiCreatContainer('handleContainer')
    const {baseConfig} = storeToRefs(usePixiStore())
    // const maskFilename = await _usePixiMaskUploadToServer()
    // console.log(maskFilename)
    const image_path_mask = await usePixiMaskContainerUploadOSS()
    // const filename = await usePixiCavansUploadToServer()
    const image_path = await usePixiCavansUploadOSS()
    handleContainer.visible = true
    const api = ComfyUI.impainting({
        image_path,
        image_path_mask,
        positive: baseConfig.value.positive,
        denoise: baseConfig.value.denoise,
    })
    //Todo

}

/**
 * AI抠图
 */
export const usePixiMatting = async () => {
    // const fileName = await useDrawUploadImageToServer()
    const {selectTarget, baseConfig} = storeToRefs(usePixiStore())
    // const fileName = await useSelectUploadImageToServer(selectTarget.value)
    // 上传到OSS
    const file=await useSelectTargetTofile(selectTarget.value)
    const  image_path= await useUtilsUploadFileToOSS(file,'image')
    // if (fileName) {
    //     submitDrawTask(ComfyUI.API_ImageMatting(fileName, baseConfig.value.segpart), useAuthStore().userInfo._id, "抠像")
    // }
    const {data} =await axios.post('/api/draw/removebg',{
        client_id: "your client id",
        params: {
            image_path,
        },
    })
    await usePixiLoadOutputImage(data,`${selectTarget.value.label}_抠图`)
    // console.log("生成的图像路径是",data)
}
/**
 * 针对选中目标进行操作，高清修复
 */
export const usePixiHdfix = async () => {
    const {selectTarget} = storeToRefs(usePixiStore())
    const imagePath = await usePixiSelectUploadOSS(selectTarget.value)
    return await ComfyUI.imageUpscale(imagePath)
}
/**
 * 文生图,默认以画板的大小来生成
 */
export const usePixiText2Image = async () => {
    const {baseConfig} = storeToRefs(usePixiStore())
    const _output= await ComfyUI.text2img({
        positive: baseConfig.value.positive,
        width: baseConfig.value.width,
        height: baseConfig.value.height,
    })
    await usePixiLoadOutputImage(_output)
}

/**
 * 重绘当前的画板
 */
export const usePixiCavansToImage = async () => {
    const fileName = await usePixiCavansUploadOSS()   //同时会隐藏遮罩层
    if (!fileName) {
        return
    }
    await _usePixiImage2Image(fileName)
}
/**
 * 将当前主容器不含遮罩内容转换为文件，上传到OSS,不含遮罩
 */
export const usePixiMainContainerUploadOSS=async ():Promise<string>=>{
    const {$pixiApp} = useNuxtApp()
    // 影藏mainContainer以外的所有的容器
    $pixiApp.stage.children.forEach(container=>{
        container.label==='mainContainer'?container.visible=true:container.visible=false
    })
    return usePixiCavansUploadOSS()
}
/**
 * 重绘当前选中的元素
 */
export const usePixiSelectToImage = async () => {
    const {selectTarget} = storeToRefs(usePixiStore())
    if (!selectTarget.value) {
        useSnackbarStore().showWarningMessage("没有选中任何元素")
        return
    }
    const fileName = await usePixiSelectUploadOSS(selectTarget.value)
    if (!fileName) {
        return
    }
    await _usePixiImage2Image(fileName)
}
/**
 * 基础图生图
 */
const _usePixiImage2Image = async (fileName: string) => {
    const {baseConfig} = storeToRefs(usePixiStore())
    const output= await ComfyUI.img2img({
        denoise: baseConfig.value.denoise,
        image_path: fileName,
    })
    await usePixiLoadOutputImage(output)
}
/**
 * 图层上移，默认上移动一层
 */
const usePixiHandleLayer = (options?: { type: "up" | "down" | "top" | "bottom" }) => {
    const {selectTarget} = storeToRefs(usePixiStore())
    const {$pixiApp} = useNuxtApp()
    const container = $pixiApp.stage.getChildByName('mainContainer')
    if (!container) {
        return
    }
    if (selectTarget.value) {
        const child = container.getChildByName(selectTarget.value?.label)
        if (child) {
            let beforeIndex = container.getChildIndex(child)
            if (!options || options.type === "up" && beforeIndex < container.children.length - 1) {
                beforeIndex += 1
                container.setChildIndex(child, beforeIndex)
            }
            if (options && options.type === "down" && beforeIndex > 0) {
                beforeIndex -= 1
                container.setChildIndex(child, beforeIndex)
            }
            if (options && options.type === "top") {
                beforeIndex = container.children.length - 1
                container.setChildIndex(child, beforeIndex)
            }
            if (options && options.type === "bottom") {
                beforeIndex = 0
                container.setChildIndex(child, beforeIndex)
            }
            // container.sortChildren()
        }
    }
}
/**
 * 当前画布，除去mask其余内容上传至服务
 */

/**
 * 移除当前选中的目标，并将最上层的目标设置为选中,返回新选中的目标
 */
export const usePixiRemoveSelect = (): Sprite | undefined => {
    const {selectTarget} = storeToRefs(usePixiStore())
    const {$pixiApp} = useNuxtApp()
    const container = $pixiApp.stage.getChildByName('mainContainer')
    if (!container) {
        return
    }
    if (selectTarget.value) {
        container.removeChild(toRaw(selectTarget.value))
        selectTarget.value = container.children[container.children.length - 1]
        usePixishowSelect()
        if (container.children.length === 0) {
            _usePixiHideSelectBorder()
        }
    }
}

/**
 * 显示选中状态
 */
export const usePixishowSelect = () => {
    const {selectTarget, baseConfig, scaleRate} = storeToRefs(usePixiStore())
    const {$pixiApp} = useNuxtApp()
    const handleContainer = $pixiApp.stage.getChildByName('handleContainer')
    if (!handleContainer) {
        return
    }
    // console.log(dragTarget.value)
    if (selectTarget.value) {
        const selectBorder = handleContainer.getChildByLabel('selectBorder') as Graphics
        selectBorder.clear()
        selectBorder.visible = true
        selectBorder.rect(-selectTarget.value.width / 2, -selectTarget.value.height / 2, selectTarget.value.width, selectTarget.value.height)
        selectBorder.position = selectTarget.value.position
        selectBorder.stroke({width: 4, color: 'white'});
        handleContainer.setChildIndex(selectBorder, handleContainer.children.length - 1)
        // handleContainer.addChild(strechButton)
        // 添加拉伸按钮
        scaleRate.value = selectTarget.value.scale.x  //同步缩放比例
        baseConfig.value.maxIndex = selectTarget.value.parent.children.length - 1
        baseConfig.value.indexOfSelect = selectTarget.value.parent.getChildIndex(selectTarget.value)
    }
}
/**
 * 隐藏选中框
 */
const _usePixiHideSelectBorder=()=>{
    const {$pixiApp} = useNuxtApp()
    const handleContainer = $pixiApp.stage.getChildByName('handleContainer')
    const selectBorder = handleContainer!.getChildByLabel('selectBorder') as Graphics
    selectBorder.visible = false
}
/**
 * 清楚自由绘制的画布的内容，注意需要添加新的纹理和精灵
 */
export const usePixiClearBrushDraw = () => {
    const {baseConfig} = storeToRefs(usePixiStore())
    const {$pixiApp} = useNuxtApp()
    const maskContainer = $pixiApp.stage.getChildByName('maskContainer')
    if (!maskContainer) {
        return
    }
    // 移除所有的元素
    maskContainer.removeChildren(0, maskContainer.children.length)
    const stageSize = {width: baseConfig.value.width, height: baseConfig.value.height};
    const renderTexture = RenderTexture.create(stageSize);
    const renderTextureSprite = new Sprite(renderTexture);
    renderTextureSprite.label = 'renderTextureSprite'
    renderTextureSprite.anchor.set(0.5)
    maskContainer.addChild(renderTextureSprite)

}
/**
 * 启动画笔自由绘制
 */
export const usePixiEnableFreeDraw = () => {
    console.log("usePixiEnableFreeDraw")
    const {baseConfig, toolbarConfig} = storeToRefs(usePixiStore())
    const {$pixiApp} = useNuxtApp()
    const maskContainer = $pixiApp.stage.getChildByName('maskContainer')
    if (!maskContainer) {
        return
    }
    maskContainer.visible = true
    const stageSize = {width: $pixiApp.renderer.width, height: $pixiApp.renderer.height};
    const renderTexture = RenderTexture.create(stageSize);
    const renderTextureSprite = new Sprite(renderTexture);
    renderTextureSprite.label = 'renderTextureSprite'
    // renderTextureSprite.setSize(baseConfig.value.width,baseConfig.value.height)
    renderTextureSprite.anchor.set(0.5)
    maskContainer.addChild(renderTextureSprite)
    maskContainer
        .on('pointerdown', pointerDown)
        .on('pointerup', pointerUp)
        .on('pointerupoutside', pointerUp)
        .on('pointermove', pointerMove);
    baseConfig.value.enableBrush = true
    toolbarConfig.value.show = false //隐藏工具栏
}
/**
 * 停用自由绘制功能
 */
export const usePixiDisEnableFreeDraw = () => {
    const {$pixiApp} = useNuxtApp()
    const {baseConfig, toolbarConfig} = storeToRefs(usePixiStore())
    const maskContainer = $pixiApp.stage.getChildByName('maskContainer')
    if (!maskContainer) {
        return
    }
    maskContainer.visible = false
    baseConfig.value.enableBrush = false
    maskContainer.off('pointerdown', pointerDown)
        .off('pointerup', pointerUp)
        .off('pointerupoutside', pointerUp)
        .off('pointermove', pointerMove)
    toolbarConfig.value.show = true //显示工具栏
}
let dragging = false;
let lastDrawnPoint = null as any;

function pointerMove(event: any) {
    const {$pixiApp} = useNuxtApp()
    const maskContainer = $pixiApp.stage.getChildByName('maskContainer')
    const {baseConfig} = storeToRefs(usePixiStore())
    // console.log("鼠标移动点", event)
    const {global: {x, y}} = event
    // selectTarget.value.toLocal(event.global, null, selectTarget.value.position);
    // const {client: {x, y}}=event
    if (dragging) {
        const brush = new Graphics()
        brush.circle(0, 0, baseConfig.value.brushSize).fill({color: baseConfig.value.brushColor});
        brush.position.set(x, y);
        // selectTarget.value.toLocal(event.global, null, brush.position);
        console.log("dragging", brush)
        const renderTextureSprite = maskContainer!.getChildByLabel('renderTextureSprite') as Sprite
        const renderTexture = renderTextureSprite!.texture as RenderTexture
        $pixiApp.renderer.render({
            container: brush,
            target: renderTexture,
            clear: false,
        });
        // Smooth out the drawing a little bit to make it look nicer
        // this connects the previous drawn point to the current one
        // using a line
        if (lastDrawnPoint) {
            const line = new Graphics();
            line.clear().moveTo(lastDrawnPoint.x, lastDrawnPoint.y).lineTo(x, y).stroke({
                width: baseConfig.value.brushSize / 2,
                color: baseConfig.value.brushColor
            });
            $pixiApp.renderer.render({
                container: line,
                target: renderTexture,
                clear: false,
            });
        }
        lastDrawnPoint = lastDrawnPoint || new Point();
        lastDrawnPoint.set(x, y);
    }
}

function pointerDown(event: any) {
    console.log("pointerDown")
    dragging = true;
    pointerMove(event);
}

function pointerUp(event: any) {
    dragging = false;
    lastDrawnPoint = null;
}

/**
 * 鼠标选中事件
 * @param event
 */
export function usePixiOnSelect(event: any) {
    const {
        toolbarConfig,
        adjustmentFilter,
        selectTarget,
        inputText,
        textStyle,
        rightDrawerwindow
    } = storeToRefs(usePixiStore())
    console.log("鼠标选中事件", event)
    selectTarget.value = this
    // 判断选择的对象图像还是文本
    const name = selectTarget.value.constructor.name
    if (name === "Text") {
        // 选中文字是
        rightDrawerwindow.value = 1
        // textConfig.textStyle = cloneDeep(selectTarget.value.style)
        // @ts-ignore
        usePixiCopySelectProperty(textStyle, selectTarget.value)
        inputText.value = selectTarget.value.text
    } else {
        //根据选中对象，同步滤镜参数
        if (toRaw(selectTarget.value).filters) {
            toRaw(selectTarget.value).filters.forEach((item: Filter) => {
                if (item.constructor.name === '_AdjustmentFilter2') {
                    Object.getOwnPropertyNames(item.constructor.prototype).forEach((key: string) => {
                        // @ts-ignore
                        adjustmentFilter.value[key] = item[key]
                    })
                    console.log(item)
                    // adjustmentFilter.value=cloneDeep(item)
                }
                // if (item.constructor.name === "AdjustmentFilter"){}
            })
        }
        // 显示操作工具条

        rightDrawerwindow.value = 0
    }

    //设置悬浮操作菜单的位置
    const {originalEvent: {clientX: pageX, clientY: pageY}} = event
    toolbarConfig.value.positionX = pageX + 50
    toolbarConfig.value.positionY = pageY + 50
    toolbarConfig.value.show = true

    const {$pixiApp} = useNuxtApp()
    const handleContainer = $pixiApp.stage.getChildByName('handleContainer')
    if (!handleContainer) {
        return
    }
    const selectBorder = handleContainer.getChildByLabel('selectBorder') as Graphics
    if (selectBorder) {
        usePixishowSelect()
    }
}

let dragTarget = null as any | Sprite
let dragBegin = {x: 0, y: 0}

function _usePixiOnDragMove(event: any) {
    const {globalX: newX, globalY: newY} = event
    console.log('onDragMove', newX, newY, dragTarget)
    if (dragTarget) {
        const {$pixiApp} = useNuxtApp()
        const handleContainer = $pixiApp.stage.getChildByName('handleContainer')
        if (!handleContainer) {
            return
        }
        const selectBorder = handleContainer.getChildByLabel('selectBorder') as Graphics
        dragTarget.position.set(dragTarget.position.x + newX - dragBegin.x, dragTarget.position.y + newY - dragBegin.y)
        // dragTarget.parent.toLocal(event.global, null, dragTarget.position);
        selectBorder.position = dragTarget.position
        // console.log("拖动目标的位置 ",dragTarget.value.position)
        dragBegin.x = newX
        dragBegin.y = newY
    }
}

export function _usePixiOnDragStart(event: any) {
    console.log("onDragStart", this)
    // Store a reference to the data
    // * The reason for this is because of multitouch *
    // * We want to track the movement of this particular touch *
    // this.alpha = 0.8;
    dragTarget = this;
    dragBegin.x = event.globalX
    dragBegin.y = event.globalY
    const {$pixiApp} = useNuxtApp()
    const container = $pixiApp.stage.getChildByName('mainContainer')
    container!.on('pointermove', _usePixiOnDragMove);
}

function _usePixiOnDragEnd() {
    console.log("onDragEnd", this, dragTarget)
    if (dragTarget && dragTarget.position) {
        const {$pixiApp} = useNuxtApp()
        //自动吸附
        if (Math.abs(dragTarget.position?.x) < 20) {
            dragTarget.position.x = 0
        }
        if (Math.abs(dragTarget.position?.y) < 20) {
            dragTarget.position.y = 0
        }
        const handleContainer = $pixiApp.stage.getChildByName('handleContainer')
        if (!handleContainer) {
            return
        }
        const selectBorder = handleContainer.getChildByLabel('selectBorder') as Graphics
        if (selectBorder.position) {
            selectBorder.position = dragTarget.position
        }
        $pixiApp.stage.off('pointermove', _usePixiOnDragMove);
        dragTarget.alpha = 1;
        dragTarget = null;
    }
}

/**
 * 容器初始化
 */
export const usePixiContainerInit = () => {
    const {$pixiApp} = useNuxtApp()
    const [container, handleContainer, maskContainer] = $pixiApp.stage.children
    container.x = $pixiApp.renderer.width / 2
    container.y = $pixiApp.renderer.height / 2
    $pixiApp.stage.on('pointerdown', _usePixiOnDragStart)
    $pixiApp.stage.on('pointerup', _usePixiOnDragEnd);
    $pixiApp.stage.on('pointerout', _usePixiOnDragEnd);
    handleContainer.x = $pixiApp.renderer.width / 2
    handleContainer.y = $pixiApp.renderer.height / 2
    //选中的图形显示外边框
    const selectBorder = new Graphics();
    selectBorder.label="selectBorder"
    handleContainer.addChild(selectBorder)
    maskContainer.x = $pixiApp.renderer.width / 2
    maskContainer.y = $pixiApp.renderer.height / 2
}
/**
 * 上传图片
 * @param file
 * @param name
 */
export const usePixiUploadImage = async (file: any, name?: string) => {
    const {$pixiApp} = useNuxtApp()
    const [container] = $pixiApp.stage.children
    const {promise} = useBase64(file)
    const base64 = await promise.value
    const texture = await Assets.load(base64)
    const sprite = usePixiCreateReativeSprite(texture)
    sprite.anchor.set(0.5)
    if (name) {
        sprite.label = name
    }
    // sprite.on("pointerdown", usePixiOnSelect)
    // sprite.on("pointerdown", usePixiOnDragStart)
    container.addChild(sprite)
    const {selectTarget} = storeToRefs(usePixiStore())
    selectTarget.value = sprite
    usePixishowSelect()
    return sprite
}
/**
 * 图片产出以后，加载图片
 * @param url
 * @param name 可选，保存的精灵名称
 */
export const usePixiLoadOutputImage = async (url: string, name?: string) => {
    const base64 = await ImageUrlToBase64(url)
    const texture = await Assets.load(base64)
    // const texture=await usePixiLoadAssets(testImageurl)
    const sprite = usePixiCreateReativeSprite(texture)
    sprite.anchor.set(0.5)
    const {selectTarget} = storeToRefs(usePixiStore())
    if (selectTarget.value) {
        sprite.scale.set(selectTarget.value.scale.x, selectTarget.value.scale.y)
    }
    if (name) {
        sprite.label = name
    }
    // sprite.on("mousedown", usePixiOnSelect)
    // sprite.on("mousedown", usePixiOnDragStart)
    const {$pixiApp} = useNuxtApp()
    const [container] = $pixiApp.stage.children
    container.addChild(sprite)
    selectTarget.value = sprite
    usePixishowSelect()
    return sprite
}

/**
 * 将选中目标转换为文件，并且上传到OSS
 * @param selectTarget
 */
export const usePixiSelectUploadOSS = async (selectTarget: any) => {
    const blob = await useSelectTargetToblob(selectTarget)
    const file=await blobtoFile(blob,   `pixi_select_${selectTarget.label}`) as File
    return await useUtilsUploadFileToOSS(file,"image")

}

/**
 * 将当前绘制的遮罩转换为文件，上传到OSS
 */
export const usePixiMaskContainerUploadOSS=async ():Promise<string>=>{
    const {$pixiApp} = useNuxtApp()
    // 影藏maskContainer以外的所有的容器
    $pixiApp.stage.children.forEach(container=>{
        container.label==='maskContainer'?container.visible=true:container.visible=false
    })
    return usePixiCavansUploadOSS()
}
/**
 * 将当前画板上传到OSS
 */
export const usePixiCavansUploadOSS=async ()=>{
    const blob=await usePixiCanvasToBlob()  //画板转blob
    const file=await blobtoFile(blob,`cavans_${nanoid()}`)   //blob转文件
    return await useUtilsUploadFileToOSS(file,'image')  //文件上传OSS
}