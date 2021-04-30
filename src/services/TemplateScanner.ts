import Box from '../models/Box';
import { Coordinates } from '../models/Coordinates';
import { Field } from '../models/Field';
import { MapFieldSign, MapTemplate } from '../models/MapTemplate';

export function getPlayerField(mapTemplate: MapTemplate): Field {
    let coordinates: Coordinates = {
        y: 0,
        x: 0,
    };
    let lastYValue: number = mapTemplate.length;
    for (let y = 0; y < lastYValue; y++) {
        let x: number = mapTemplate[y].findIndex((field) => field === 'p');
        if (~x) {
            coordinates.y = y;
            coordinates.x = x;
            break;
        }
    }
    return new Field(coordinates);
}

function getFieldsOfSign(mapTemplate: MapTemplate, targetSign: MapFieldSign): Field[] {
    return mapTemplate.reduce<Field[]>((items, row, y) => {
        row.forEach((fieldSign, x) => {
            if (fieldSign === targetSign) items.push(new Field({ y: y, x: x }));
        });
        return items;
    }, []);
}

export function getBoxes(mapTemplate: MapTemplate): Box[] {
    return getFieldsOfSign(mapTemplate, 'b').map((field) => new Box(field));
}

export function getDestinationLocations(mapTemplate: MapTemplate): Field[] {
    return getFieldsOfSign(mapTemplate, 'd');
}

export function isTraversable(mapTemplate: MapTemplate, coordinates: Coordinates): boolean {
    let desiredRow: MapFieldSign[] = mapTemplate[coordinates.y];
    let fieldCharacter: MapFieldSign | undefined = desiredRow && desiredRow[coordinates.x];
    return !!fieldCharacter && ['g', 'd', 'b', 'p'].includes(fieldCharacter);
}
