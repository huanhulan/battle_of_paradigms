import throttle from 'lodash.throttle';
import Minimal from './minimal';
import {getCords, insertShape, shiftBy} from '../lib';

class Dragging extends Minimal {
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


    // this method does more than one job
    protected handleMouseMove(cords) {
        if (this.dragging === null) {//Potential source of bugs: explicit state check
            return null;
        }
        const dx = cords.x - this.dragging.startPos.x;
        const dy = cords.y - this.dragging.startPos.y;
        this.doc = insertShape(this.doc, shiftBy(this.dragging.shape, dx, dy));// doc is set in different place
        return null;
    }
}

export default Dragging;
