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

        let res;
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

        // bind events
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

        // get document
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
                res = frpLogic(sMouseDown, sMouseMove, sMouseUp, sShiftKey, initDoc);
            } else {
                res = frpLogic(sMouseDown, sMouseMove, sMouseUp, initDoc);
            }
        } else {
            res = frpLogic(sMouseDown, sMouseUp, initDoc);
        }
        let className;
        if (res.cSelected) {
            Operational.value(res.cSelected).listen(b => {
                let className;
                if (b) {
                    className = "cursor-move";
                } else {
                    className = "cursor-pointer";
                }
                $canvas.canvas.className = `canvas ${className}`;
            })
        } else {
            $canvas.canvas.className = "canvas cursor-move";
        }
        // now let's paint!
        sResize.snapshot1(res.cDocument).orElse(Operational.value(res.cDocument)).listen((doc) => {
            paint(doc, ctx, [CAT_BG, DOG_BG]);
        });
    });
}
