import { MapFieldSign, MapTemplate } from '../models/MapTemplate';

const mapHeight: number = 15;
const mapWidth: number = 30;

export function generateEmptyMapTemplate(): MapTemplate {
    let map: 'e'[][] = [];
    for (let rowIndex = 1; rowIndex <= mapHeight; rowIndex++) {
        let row: 'e'[] = [];
        for (let columnIndex = 1; columnIndex <= mapWidth; columnIndex++) row.push('e');
        map.push(row);
    }
    return map;
}

export function generateMapTemplateFromContent(content: MapTemplate): MapTemplate {
    let map: MapFieldSign[][] = [];
    for (let rowIndex = 1; rowIndex <= mapHeight; rowIndex++) {
        let row: MapFieldSign[] = [];
        for (let columnIndex = 1; columnIndex <= mapWidth; columnIndex++) {
            let existingField: MapFieldSign | undefined = content[rowIndex]
                ? content[rowIndex][columnIndex]
                : undefined;
            row.push(existingField ?? 'e');
        }
        map.push(row);
    }
    return map;
}
