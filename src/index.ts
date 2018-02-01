import makeFrpCanvas from './makeFrpCanvas';
import {INIT_DOC} from './consts';
import './style/index.scss';
import {minimal_frp, dragging_frp, fixed_frp, shift_frp} from './frp';

const initDoc = Array.prototype.slice.call(INIT_DOC);

// minimal frp;
makeFrpCanvas('minimal_frp', initDoc, minimal_frp);
makeFrpCanvas('dragging_frp', initDoc, dragging_frp);
makeFrpCanvas('fixed_frp', initDoc, fixed_frp);
makeFrpCanvas('shift_frp', initDoc, shift_frp);
