import Box from '../models/Box';
import { Coordinates } from '../models/Coordinates';
import { Field } from '../models/Field';
import { MapFieldSign, MapTemplate } from '../models/MapTemplate';

export function getPlayerField(mapTemplate: MapTemplate): Field {
    const coordinates: Coordinates = getPlayerLocation(mapTemplate) || {x: 0, y: 0};
    return new Field(coordinates);
}

export function getPlayerLocation(mapTemplate: MapTemplate): Coordinates | undefined {
    let rowCount: number = mapTemplate.length;
    for (let y = 0; y < rowCount; y++) {
        let x: number = mapTemplate[y].findIndex((field) => field === 'p');
        if (~x) {
            return {x, y};
        }
    }
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
