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

export function getBoxes(mapTemplate: MapTemplate): Box[] {
    return mapTemplate.reduce<Box[]>((boxes, row, rowIndex) => {
        row.forEach((field, columnIndex) => {
            if (field === 'b') {
                boxes.push(
                    new Box({
                        row: rowIndex,
                        column: columnIndex,
                    })
                );
            }
        });
        return boxes;
    }, []);
}
