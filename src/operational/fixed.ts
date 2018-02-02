import throttle from 'lodash.throttle';
import Dragging from './dragging';
import {insertShape, shiftBy, getCords, findPolygon, getDist} from '../lib';
import {Optional, IDragging} from '../types';

class Fixed extends Dragging {
    protected pending: Optional<IDragging> = null;

    constructor(id, initDoc) {
        super(id, initDoc);
    }

    protected bindEvents() {
        super.bindEvents();
        const handleMouseMove = throttle(e => {
            this.handleMouseMove(getCords(e, this.canvas));
            return false;
        }, 16);
        this.canvas.addEventListener('mousemove', handleMouseMove);
    }

    protected handleMouseDown(cords) {
        const shape = findPolygon(this.doc, cords);
        if (shape) {
            this.pending = { // pending'setting get discarded;
                shape,
                startPos: cords
            };
        }
        return null;
    }

    protected handleMouseMove(cords) {
        if (this.pending === null) {
            return null;
        }

        const dist = getDist(cords.x, cords.y, this.pending.startPos.x, this.pending.startPos.y);
        if (this.pending === null || dist <= 5) {//Potential source of bugs: explicit state check
            return null;
        }
        this.dragging = this.pending; // two property get the same reference!
        const dx = cords.x - this.dragging.startPos.x;
        const dy = cords.y - this.dragging.startPos.y;
        this.doc = insertShape(this.doc, shiftBy(this.dragging.shape, dx, dy));
        return null;
    }

    protected handleMouseUp(cords) {
        super.handleMouseUp(cords);
        this.pending = null; // pending'setting get discarded;
        return null;
    }
}

export default Fixed;
