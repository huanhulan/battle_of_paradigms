import {CellLoop, Stream, StreamSink, Transaction, Unit} from 'sodiumjs';
import {findPolygon, insertShape, shiftBy} from '../lib';
import {DOCUMENT, IDragging, IPos, Optional} from '../types';

/**
 * Only start dragging when mouse moves more than 5 pixels.
 */
export default (sMouseDown: StreamSink<IPos>,
                sMouseMove: StreamSink<IPos>,
                sMouseUp: StreamSink<IPos>,
                sShiftKey: StreamSink<boolean>,
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

    const sDrag = sMouseMove.snapshot(cShiftKeyPressed, (pos, shift) => {
        return {pos, shift}
    });

    // change
    const sStartDrag: Stream<Optional<IDragging>> = (sDrag.snapshot3(cPending, cDragging, ({shift, pos}, pending, dragging) => {
        if (pending === null) {
            return null;
        }
        const current = dragging !== null ? dragging : pending;
        const dist = Math.sqrt(Math.pow((pos.x - current.startPos.x), 2)
            + Math.pow((pos.y - current.startPos.y), 2));
        if (dist <= 5) {
            return null;
        }
        const dx = pos.x - current.startPos.x;
        const dy = pos.y - current.startPos.y;
        return {
            shape: shiftBy(current.shape, dx, dy, shift),// change
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
    return cDocument;
}