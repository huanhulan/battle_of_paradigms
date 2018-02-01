export default function (pos, coords) {
    const x = pos.x;
    const y = pos.y;
    let inside = false;
    let v = coords[coords.length - 1];
    let x1 = v.x;
    let y1 = v.y;
    for (let i = -1; v = coords[++i];) {
        let x2 = v.x, y2 = v.y;
        if (( y1 < y && y2 >= y ) || ( y2 < y && y1 >= y )) {
            if (x1 + ( y - y1 ) / ( y2 - y1 ) * ( x2 - x1 ) < x) {
                inside = !inside;
            }
        }
        x1 = x2, y1 = y2;
    }
    return inside;
}