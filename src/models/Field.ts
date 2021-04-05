import { Coordinates } from './Coordinates';

export class Field {
    readonly id: string;
    readonly coordinates: Coordinates;

    constructor(coordinates: Coordinates) {
        this.id = `${coordinates.x}${coordinates.y}`;
        this.coordinates = coordinates;
    }

    getAdjacentField(direction: Coordinates): Field {
        return new Field({
            x: this.coordinates.x + direction.x,
            y: this.coordinates.y + direction.y,
        })
    }

}
