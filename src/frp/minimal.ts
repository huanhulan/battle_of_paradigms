import {CellLoop, Stream, StreamSink, Transaction} from 'sodiumjs';
import {findPolygon, insertShape, shiftBy} from '../lib';
import {DOCUMENT, IDragging, IPos, Optional} from '../types';

export default (sMouseDown: StreamSink<IPos>, sMouseUp: StreamSink<IPos>, document: DOCUMENT) => {
    const cDocument = new CellLoop<DOCUMENT>();
    const cDragging = new CellLoop<Optional<IDragging>>();
    const sStartDrag: Stream<Optional<IDragging>> = sMouseDown.snapshot(cDocument, (pos, doc) => {
        const shape = findPolygon(doc, pos);
        if (shape) {
            return {
                shape,
                startPos: pos
            };
        }
        return null;
    }).filterNotNull();
    const sDrop: Stream<Optional<IDragging>> = ((sMouseUp.snapshot(cDragging, (pos, dragging) => {
        if (dragging === null) {
            return null;
        }
        const dx = pos.x - dragging.startPos.x;
        const dy = pos.y - dragging.startPos.y;
        return {
            shape: shiftBy(dragging.shape, dx, dy),
            startPos: pos
        }
    }) as Stream<Optional<IDragging>>).filterNotNull() as Stream<IDragging>);
    const sEndDrag = sDrop.map(dragging => null);
    cDragging.loop(sStartDrag.orElse(sEndDrag).hold(null));
    cDocument.loop(sDrop.snapshot(cDocument, (dragging, document) => {
        if (dragging) {
            return insertShape(document, dragging.shape)
        } else {
            return document
        }
    })
        .hold(document));

    return cDocument;
}
