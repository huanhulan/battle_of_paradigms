interface IPos {
    x: number,
    y: number
}

interface IShape {
    id: string,
    cords: IPos[]
}

interface IDragging {
    shape: IShape,
    startPos: IPos
}

type DOCUMENT = Array<IShape>;
type Optional<A> = A|null;

export {
    Optional,
    DOCUMENT,
    IDragging,
    IPos,
    IShape
}