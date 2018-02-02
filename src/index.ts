import makeFrpCanvas from './makeFrpCanvas';
import {INIT_DOC} from './consts';
import './style/index.scss';
import {minimal_frp, dragging_frp, fixed_frp, shift_frp, refined_shift_frp} from './frp';
import {Minimal, Dragging, Fixed, Shift} from './operational';

const initDoc = Array.prototype.slice.call(INIT_DOC);

// minimal frp;
makeFrpCanvas('minimal_frp', initDoc, minimal_frp);
makeFrpCanvas('dragging_frp', initDoc, dragging_frp);
makeFrpCanvas('fixed_frp', initDoc, fixed_frp);
makeFrpCanvas('shift_frp', initDoc, shift_frp);
makeFrpCanvas('refine_shift_frp', initDoc, refined_shift_frp);

// operational
new Minimal('minimal_op', initDoc);
new Dragging('dragging_op', initDoc);
new Fixed('fixed_op', initDoc);
new Shift('shift_op', initDoc);