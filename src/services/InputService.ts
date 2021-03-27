import { Position } from "../models/Position";

export function getMovementFromInputKey(inputKey: string): Position {
    const movement: Position = {
        row: 0,
        column: 0,
    };
    switch (inputKey) {
        case 'ArrowRight':
            movement.column++;
            break;
        case 'ArrowLeft':
            movement.column--;
            break;
        case 'ArrowUp':
            movement.row--;
            break;
        case 'ArrowDown':
            movement.row++;
            break;
    }
    return movement;
}