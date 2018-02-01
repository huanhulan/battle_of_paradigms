import {makeCanvas, getCords, paint, makeColor} from '../lib';
import {IPos, DOCUMENT} from '../types';
import throttle from 'lodash.throttle';

class BaseDragNDrop {
    public colors: string[];
    protected ctx: CanvasRenderingContext2D;
    protected canvas: HTMLCanvasElement;
    protected doc: DOCUMENT;

    constructor(id, initDoc) {
        const $canvas = makeCanvas(id);
        if ($canvas === null) {
            return;
        }
        this.ctx = $canvas.ctx as CanvasRenderingContext2D;
        this.canvas = $canvas.canvas as HTMLCanvasElement;
        this.doc = initDoc;
        this.colors = [0, 1].map(i => makeColor());
        this.bindEvents();
        this.render();
    }

    protected bindEvents() {
        const handleResize = throttle(e => {
            this.render();
            return false;
        }, 16);
        const handleMouseDown = throttle(e => {
            this.handleMouseDown(getCords(e, this.canvas));
            return false;
        }, 16);
        const handleMouseUp = throttle(e => {
            this.handleMouseUp(getCords(e, this.canvas));
            return false;
        }, 16);
        window.addEventListener('resize', handleResize);
        this.canvas.addEventListener('mousedown', handleMouseDown);
        this.canvas.addEventListener('mouseup', handleMouseUp);
    }

    protected handleMouseDown(cords: IPos) {
    }

    protected handleMouseUp(cords: IPos) {
    }

    protected render() {
        paint(this.doc, this.ctx, this.colors);
    }
}

export default BaseDragNDrop;
