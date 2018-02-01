import {DOCUMENT, IShape} from '../types';
export default function (doc: DOCUMENT, shape: IShape) {
    doc = doc.slice();
    for (let i = 0; i < doc.length; i++) {
        if (doc[i].id == shape.id) {
            doc[i] = shape;
        }
    }
    return doc;
}