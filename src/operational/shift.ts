import Fixed from './fixed';
import {insertShape, shiftBy} from '../lib';

class Shift extends Fixed {
    private holdShift: boolean = false;

    constructor(id, initDoc) {
        super(id, initDoc);
    }

    protected bindEvents() {
        super.bindEvents();
        document.body.addEventListener('keydown', e => {
            if (e.shiftKey) {
                this.holdShift = true;
            }
            return false;
        });
        document.body.addEventListener('keyup', e => {
            if (e.keyCode === 16) {
                this.holdShift = false;
            }
            return false;
        });
    }

    protected handleMouseMove(cords) {
        if (this.pending === null) {
            return null;
        }
        const dist = Math.sqrt(Math.pow((cords.x - this.pending.startPos.x), 2)
            + Math.pow((cords.y - this.pending.startPos.y), 2));
        if (this.pending === null || dist <= 5) {//Potential source of bugs: explicit state check
            return null;
        }
        this.dragging = this.pending; // two property get the same reference!
        const dx = cords.x - this.dragging.startPos.x;
        const dy = cords.y - this.dragging.startPos.y;
        this.doc = insertShape(this.doc, shiftBy(this.dragging.shape, dx, dy, this.holdShift));
        return null;
    }
}

export default Shift;
