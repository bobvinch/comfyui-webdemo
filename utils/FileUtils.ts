// @ts-ignore
import OSS from "ali-oss";
import {nanoid} from "nanoid";
export  const ImageViewToBase64WithMark=async (viewUrl: string):Promise<any> =>{
    const watermark_file = await ImageViewTofileWithMark(viewUrl);
    return await blobToBase64(watermark_file)
}

export  const ImageViewTofileWithMark=async (viewUrl: string)=> {
    //1.view转为blod
    const orign_image_blob = await ImageUrlToBlob(viewUrl)
    //2.blob转为图片元素
    const origin_image_element: unknown = await blobToImage(orign_image_blob)
    //3.图片元素转cavans
    const watermark_canvas = await imgToCanvas(origin_image_element)
    //4.添加水印
    const watermark_blob = await watermark(watermark_canvas, "WATER MARK")
    //5 blob转文件
    return await blobtoFile(watermark_blob, "test001")

}

//下载blod
export const download = (blob: Blob | any) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'image.jpg');
    document.body.appendChild(link);
    link.click();
}

export const ImageUrlToBase64=async (url: string):Promise<any>=> {
    return new Promise((resolve, reject) => {
        fetch(url).then(r => r.blob()).then(blob => {
            resolve(blobToBase64(blob))
        })
    })
}

export const ImageUrlToBlob=async (url: string):Promise<Blob>=> {
    return new Promise((resolve, reject) => {
        fetch(url).then(r => r.blob()).then(blob => {
            resolve(blob)
        })
    })
}
/**
 * 传入一个blob或者file,转换为base64
 * @param blob
 */
export  const blobToBase64=async (blob: Blob | any):Promise<string> =>{
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onloadend = function (result) {
                // console.log("blobToBase64正常转换，结果是",reader.result)
                resolve(reader.result+ "")
            }
        } catch (error) {
            // console.log("blobToBase64过程异常")
            resolve("")
        }

    })
}

//blob专为file
export const blobtoFile=async (blob: any, name: string):Promise<File> =>{
    return new Promise((resolve) => {
        const files = new window.File([blob], name, {type: blob.type});
        resolve(files)
    })
}

export  const blobToImage=async (blob: any)=> {
    return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.addEventListener('load', () => {
            let img: any = new Image()
            img.src = reader.result
            img.addEventListener('load', () => resolve(img))
        })
        reader.readAsDataURL(blob)
    })
}

export  const imgToCanvas=(img: any)=> {
    let canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx: any = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    return canvas
}

export const watermark=async (canvas: HTMLCanvasElement, text: string): Promise<string>=> {
    return new Promise((resolve, reject) => {
        let ctx = canvas.getContext('2d')
        // 设置填充字号和字体，样式
        // @ts-ignore
        ctx.font = "30px 宋体"
        // @ts-ignore
        ctx.fillStyle = "#FFFFFF"
        // 设置右对齐
        // @ts-ignore
        ctx.textAlign = 'right'
        // 在指定位置绘制文字，这里指定距离右下角20坐标的地方
        for (let i = 1; i < 10; i++) {
            // @ts-ignore
            ctx.fillText(text, canvas.width - 100, canvas.height - 100 * i)
        }

        // @ts-ignore
        canvas.toBlob(blob => resolve(blob))
        // const src=canvas.toDataURL('image/png')
        // resolve(src)
    })
}

/**
 * 上传文件到OSS,返回上传成功的文件名
 *
 * @param file
 * @param type
 */
export const  useUtilsUploadFileToOSS=async (file:File,type:"audio"|"image"|"video"|"other"):Promise<string>=> {
    // 创建OSS客户端实例

    const client = new OSS({
        region: useRuntimeConfig().public.ossRegion, // 替换为你的OSS区域
        accessKeyId: useRuntimeConfig().public.ossKey, // 替换为你的AccessKeyId
        accessKeySecret: useRuntimeConfig().public.ossSecret, // 替换为你的AccessKeySecret
        bucket: useRuntimeConfig().public.ossBucket, // 替换为你的Bucket名称
    });
    const filename=nanoid(15)
    let targetPath='';
    switch (type) {
        case "audio":
            targetPath = `aidraw/audio/${filename}.wav`;
            break;
        case "image":
            targetPath = `aidraw/image/${filename}.png`;
            break;
        case "video":
            targetPath = `aidraw/video/${filename}.mp4`;
            break;
        case "other":
            targetPath = `aidraw/others/${filename}.png`;
            break;
    }
    try {
        // 上传文件
        const {url} = await client.put(targetPath, file);
        console.log('File uploaded to OSS:', url);
        return url;
    } catch (e) {
        console.error('Error uploading file to OSS:', e);
        throw e;
    }
}