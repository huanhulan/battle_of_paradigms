import {CellLoop, Stream, StreamSink, Transaction} from 'sodiumjs';
import {findPolygon, insertShape, shiftBy} from '../lib';
import {DOCUMENT, IDragging, IPos, Optional} from '../types';

export default (sMouseDown: StreamSink<IPos>,
                sMouseMove: StreamSink<IPos>,// add
                sMouseUp: StreamSink<IPos>,
                document: DOCUMENT) => {
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

    // add
    const sDragging: Stream<Optional<IDragging>> = (sMouseMove.snapshot(cDragging, (pos, dragging) => {
        if (dragging === null) {
            return null;
        }
        const dx = pos.x - dragging.startPos.x;
        const dy = pos.y - dragging.startPos.y;
        return {
            shape: shiftBy(dragging.shape, dx, dy),
            startPos: pos
        }
    }) as Stream<Optional<IDragging>>).filterNotNull() as Stream<IDragging>;

    // merge with sEnd
    const sDrop: Stream<Optional<IDragging>> = sMouseUp.snapshot1(cDragging).map(d => null);

    cDocument.loop(sDragging.snapshot(cDocument, (dragging, document) => {
        if (dragging) {
            return insertShape(document, dragging.shape)
        } else {
            return document
        }
    }).hold(document));

    // add .orElse(sDragging)
    cDragging.loop(sStartDrag.orElse(sDragging).orElse(sDrop).hold(null));
    return {cDocument};
}