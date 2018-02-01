import Base from './base';
import {findPolygon, insertShape, shiftBy} from '../lib';
import {Optional, IDragging} from '../types';

class Minimal extends Base {
    private dragging: Optional<IDragging>;

    constructor(id, initDoc) {
        super(id, initDoc);
    }

    bindEvents() {
        super.bindEvents();
    }

    protected handleMouseDown(cords) {
        const shape = findPolygon(this.doc, cords);
        if (shape) {
            this.dragging = {
                shape,
                startPos: cords
            };
        }
    }

    protected handleMouseUp(cords) {
        if (this.dragging === null) {//Potential source of bugs: explicit state check
            return null;
        }
        const dx = cords.x - this.dragging.startPos.x;
        const dy = cords.y - this.dragging.startPos.y;
        this.doc = insertShape(this.doc, shiftBy(this.dragging.shape, dx, dy));
        this.render();

        // potential bug source: update the internal state
        this.dragging = null;
    }
}

export default Minimal;