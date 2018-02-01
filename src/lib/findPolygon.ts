import insidePolygon from './insidePolygon';
import {DOCUMENT, IPos} from '../types';

export default function (doc: DOCUMENT, pos: IPos) {
    return doc.filter((shape) => insidePolygon(pos, shape.cords) ? shape : false)[0];
}