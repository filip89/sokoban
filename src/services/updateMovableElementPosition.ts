import { Coordinates } from '../models/Coordinates';

function updateMovableElementPosition(elem: HTMLDivElement, coordinates: Coordinates): void {
    elem.style.left = `${coordinates.x * 40}px`;
    elem.style.top = `${coordinates.y * 40}px`;
}

export default updateMovableElementPosition;
