import { MapTemplate } from '../components/Map';
import Box from '../models/Box';
import { Position } from '../models/Position';

export function getPlayerPosition(mapTemplate: MapTemplate): Position {
    let position: Position = {
        row: 0,
        column: 0,
    };
    let lastRowIndex = mapTemplate.length;
    for (let rowIndex = 0; rowIndex <= lastRowIndex; rowIndex++) {
        let c = mapTemplate[rowIndex].findIndex((field) => field === 'p');
        if (~c) {
            position.row = rowIndex;
            position.column = c;
            break;
        }
    }
    return position;
}

function getEntities<T>(mapTemplate: MapTemplate, entitySign: string, entityCreator: (position: Position) => T): T[] {
    return mapTemplate.reduce<T[]>((items, row, rowIndex) => {
        row.forEach((field, columnIndex) => {
            if (field === entitySign) {
                items.push(entityCreator({ row: rowIndex, column: columnIndex }));
            }
        });
        return items;
    }, []);
}

export function getBoxes(mapTemplate: MapTemplate): Box[] {
    return getEntities<Box>(mapTemplate, 'b', (position: Position) => new Box(position));
}

export function getDestinations(mapTemplate: MapTemplate): Position[] {
    return getEntities<Position>(mapTemplate, 'd', (position: Position) => position);
}
