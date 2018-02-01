import {IPos} from '../types';

export default (e: MouseEvent, canvas: HTMLCanvasElement) => {
    return {
        x: e.offsetX,
        y: e.offsetY
    } as IPos;
}