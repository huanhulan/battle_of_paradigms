import {DEFAULT_CANVAS_WIDTH, DEFAULT_ANVAS_HEIGHT} from '../consts';

export default id => {
    const $container = document.getElementById(id);
    if ($container === null) {
        return null;
    }
    const $canvas = document.createElement('canvas');
    $canvas.setAttribute('width', ($container.offsetWidth || DEFAULT_CANVAS_WIDTH).toString());
    $canvas.setAttribute('height', ($container.offsetHeight || DEFAULT_ANVAS_HEIGHT).toString());
    $container.appendChild($canvas);
    return {
        ctx: $canvas.getContext('2d'),
        canvas: $canvas
    }
}