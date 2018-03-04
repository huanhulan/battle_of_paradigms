import {CellLoop, Stream, StreamSink} from 'sodiumjs';
import {findPolygon, insertShape, shiftBy, getDist} from '../lib';
import {DOCUMENT, IDragging, IPos, Optional} from '../types';

/**
 * Only start dragging when mouse moves more than 5 pixels.
 */
export default (sMouseDown: StreamSink<IPos>,
                sMouseMove: StreamSink<IPos>,
                sMouseUp: StreamSink<IPos>,
                sShiftKey: StreamSink<boolean>,// add
                document: DOCUMENT) => {
    const cDocument = new CellLoop<DOCUMENT>();
    const cDragging = new CellLoop<Optional<IDragging>>();
    const sDrop: Stream<Optional<IDragging>> = sMouseUp.snapshot(cDragging, (u, d) => {
        if (d) {
            return d;
        }
        return null;
    }).filterNotNull();
    const cShiftKeyPressed = sShiftKey.hold(false);
    const sDragPending: Stream<Optional<IDragging>> = sMouseDown.snapshot(cDocument, (pos, doc) => {
        const shape = findPolygon(doc, pos);
        if (shape) {
            return {
                shape,
                startPos: pos
            };
        }
        return null;
    }).filterNotNull();

    const cPending = sDragPending.orElse(sMouseUp.map(() => null)).hold(null);

    // add
    const sDrag = sMouseMove.snapshot(cShiftKeyPressed, (pos, shift) => {
        return {pos, shift}
    });

    const sStartDrag: Stream<Optional<IDragging>> = (sDrag.snapshot(cPending, ({shift, pos}, dragging) => {
        if (dragging === null) {
            return null;
        }
        const dist = getDist(pos.x, pos.y, dragging.startPos.x, dragging.startPos.y);
        if (dist <= 5) {
            return null;
        }
        const dx = pos.x - dragging.startPos.x;
        const dy = pos.y - dragging.startPos.y;
        return {
            shape: shiftBy(dragging.shape, dx, dy, shift),// change
            startPos: pos
        }
    }) as Stream<Optional<IDragging>>).filterNotNull() as Stream<IDragging>;

    cDocument.loop(sStartDrag.orElse(sDrop).snapshot(cDocument, (dragging, document) => {
        if (dragging) {
            return insertShape(document, dragging.shape)
        } else {
            return document
        }
    }).hold(document));

    cDragging.loop(sStartDrag.orElse(sDrop.map(d => null)).hold(null));
    return {cDocument};
}