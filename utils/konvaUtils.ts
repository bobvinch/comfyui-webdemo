import {nanoid} from "nanoid";

/**
 * Konva基础对象
 */
interface KonvaBase {
    name?: string,
    x?: number,
    y?: number,
    scaleX?: number,
    scaleY?: number,
    width?: number,
    height?: number,
    draggable?: boolean,
    stroke?: string,
    fill?: string,
    strokeWidth?: number,
    centeredScaling?: boolean,
    opacity?:number
    dragBoundFunc?:any
    visible?:boolean
    filters?:Array<any>
    noise?:number
}

interface KonvaText extends KonvaBase {
    text: string,
    fontSize?: number,
    fontFamily?: string,
    fill: string,
    padding?: 20,
    align?: 'center' | 'left' | 'right'
}

/**
 * Konva 图像对象
 */
interface KonvaImage extends KonvaBase {
    image: HTMLImageElement
    imagePath?:string
    crop?: {
        x: number,
        y: number,
        width: number,
        height: number
    }
}

interface KonvaCircle extends KonvaBase {
    radius: number,
}

class konvaBase implements KonvaBase{
    name=nanoid();
    x=0;
    y= 0;
    opacity=1;
    draggable=true
    visible=true
    width=100
    height=100
    scaleX=1
    scaleY=1
    filters=[]
    noise=0
}
class konvaImage extends konvaBase implements KonvaImage{
    image=new Image();
    imagePath="";
    crop={
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }
}

export type {KonvaBase, KonvaImage, KonvaText, KonvaCircle}
export {konvaBase, konvaImage}