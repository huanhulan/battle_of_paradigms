import {SHAPE_BG} from '../consts'

const paint = (doc, ctx: CanvasRenderingContext2D, colors?: string[]) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    doc.forEach((shape, idx) => {
        ctx.beginPath();
        shape.cords.forEach(({x, y}, index) => {
            index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = Array.isArray(colors) ? colors[idx] || SHAPE_BG : SHAPE_BG;
        ctx.fill();
    });
};

export default paint;
