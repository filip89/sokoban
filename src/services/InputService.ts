import { Coordinates } from "../models/Coordinates";

export function getDirectionFromInputKey(inputKey: string): Coordinates {
    const direction: Coordinates = {
        y: 0,
        x: 0,
    };
    switch (inputKey) {
        case 'ArrowRight':
            direction.x++;
            break;
        case 'ArrowLeft':
            direction.x--;
            break;
        case 'ArrowUp':
            direction.y--;
            break;
        case 'ArrowDown':
            direction.y++;
            break;
    }
    return direction;
}