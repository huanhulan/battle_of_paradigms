import {Operational, StreamSink, Unit, Transaction} from 'sodiumjs';
import {makeCanvas, getCords, paint, makeColor} from './lib';
import {IPos} from './types';
import throttle from 'lodash.throttle';

export default (id, initDoc, frpLogic) => {
    return Transaction.run(() => {
        const $canvas = makeCanvas(id);
        if ($canvas === null) {
            return;
        }
        let cDoc;
        const ctx = $canvas.ctx as CanvasRenderingContext2D;
        const sMouseDown = new StreamSink<IPos>();
        const sMouseUp = new StreamSink<IPos>();
        const sResize = new StreamSink<Unit>();
        const throttledResize = throttle(e => sResize.send(Unit.UNIT));
        const throttledStream = stream => throttle((e) => stream.send(getCords(e, $canvas.canvas)), 16);
        const throttledMouseDown = throttledStream(sMouseDown);
        const throttledMouseUp = throttledStream(sMouseUp);
        const DOG_BG = makeColor();
        const CAT_BG = makeColor();

        window.addEventListener('resize', e => {
            throttledResize(e);
            return false;
        });
        $canvas.canvas.addEventListener('mousedown', e => {
            throttledMouseDown(e);
            return false;
        });
        $canvas.canvas.addEventListener('mouseup', e => {
            throttledMouseUp(e);
            return false;
        });
        if (frpLogic.length >= 4) {
            const sMouseMove = new StreamSink<IPos>();
            const throttledMouseMove = throttledStream(sMouseMove);
            $canvas.canvas.addEventListener('mousemove', e => {
                throttledMouseMove(e);
                return false;
            });
            if (frpLogic.length === 5) {
                const sShiftKey = new StreamSink<boolean>();
                document.body.addEventListener('keydown', e => {
                    if (e.shiftKey) {
                        sShiftKey.send(true);
                    }
                    return false;
                });
                document.body.addEventListener('keyup', e => {
                    if (e.keyCode === 16) {
                        sShiftKey.send(false);
                    }
                    return false;
                });
                cDoc = frpLogic(sMouseDown, sMouseMove, sMouseUp, sShiftKey, initDoc);
            } else {
                cDoc = frpLogic(sMouseDown, sMouseMove, sMouseUp, initDoc);
            }
        } else {
            cDoc = frpLogic(sMouseDown, sMouseUp, initDoc);
        }
        sResize.snapshot1(cDoc).orElse(Operational.value(cDoc)).listen((doc) => {
            paint(doc, ctx, [CAT_BG, DOG_BG]);
        });
    });
}
