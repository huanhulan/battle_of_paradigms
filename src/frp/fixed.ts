import {CellLoop, Stream, StreamSink, Transaction} from 'sodiumjs';
import {findPolygon, insertShape, shiftBy} from '../lib';
import {DOCUMENT, IDragging, IPos, Optional} from '../types';

/**
 * Only start dragging when mouse moves more than 5 pixels.
 */
export default (sMouseDown: StreamSink<IPos>,
                sMouseMove: StreamSink<IPos>,
                sMouseUp: StreamSink<IPos>,
                document: DOCUMENT) => {
    const cDocument = new CellLoop<DOCUMENT>();
    const cDragging = new CellLoop<Optional<IDragging>>();
    // merge with sEnd
    const sDrop: Stream<Optional<IDragging>> = sMouseUp.snapshot(cDragging, (u, d) => {
        if (d) {
            return d;
        }
        return null;
    }).filterNotNull();
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
    const sStartDrag: Stream<Optional<IDragging>> = (sMouseMove.snapshot(cPending, (pos, dragging) => {
        if (dragging === null) {
            return null;
        }
        const dist = Math.sqrt(Math.pow((pos.x - dragging.startPos.x), 2)
            + Math.pow((pos.y - dragging.startPos.y), 2));
        if (dist <= 5) {
            return null;
        }
        const dx = pos.x - dragging.startPos.x;
        const dy = pos.y - dragging.startPos.y;
        return {
            shape: shiftBy(dragging.shape, dx, dy),
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

    // add .orElse(sDragging)
    cDragging.loop(sStartDrag.orElse(sDrop.map(d => null)).hold(null));
    return cDocument;
}