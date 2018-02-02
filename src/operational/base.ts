import {makeCanvas, getCords, paint, makeColor} from '../lib';
import {IPos, DOCUMENT, Optional, IDragging} from '../types';
import throttle from 'lodash.throttle';

class BaseDragNDrop {
    public colors: string[];
    protected ctx: CanvasRenderingContext2D;
    protected canvas: HTMLCanvasElement;
    private _doc: DOCUMENT;
    protected dragging: Optional<IDragging> = null;

    constructor(id, initDoc) {
        const $canvas = makeCanvas(id);
        if ($canvas === null) {
            return;
        }
        this.ctx = $canvas.ctx as CanvasRenderingContext2D;
        this.canvas = $canvas.canvas as HTMLCanvasElement;
        this.colors = [0, 1].map(i => makeColor());
        this.bindEvents();
        this.doc = initDoc;
    }

    set doc(newDoc: DOCUMENT) {
        this._doc = newDoc;
        this.render();
    }

    get doc() {
        return this._doc;
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
        return null;
    }

    protected handleMouseUp(cords: IPos) {
        return null;
    }

    protected render() {
        paint(this.doc, this.ctx, this.colors);
    }
}

export default BaseDragNDrop;
