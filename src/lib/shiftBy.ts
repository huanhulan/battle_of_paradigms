import {IShape} from '../types';

export default function (shape: IShape, dx: number, dy: number, axisLock = false) {
    if (axisLock) {
        if (Math.abs(dx) < Math.abs(dy)) {
            dx = 0;
        }
        if (Math.abs(dy) < Math.abs(dx)) {
            dy = 0;
        }
    }

    return {
        id: shape.id,
        cords: shape.cords.map(
            ({x, y}) => {
                return {x: x + dx, y: y + dy};
            }
        )
    };
}
