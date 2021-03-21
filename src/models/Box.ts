import { Position } from "./Position";

export default class Box {
    id: string;
    position: Position;

    constructor(position: Position) {
        this.id = `${position.row}${position.column}`;
        this.position = position;
    }
}