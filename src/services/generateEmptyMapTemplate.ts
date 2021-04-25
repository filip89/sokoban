import { MapTemplate } from "../models/MapTemplate";

const mapHeight: number = 15;
const mapWidth: number = 30;

export function generateEmptyMapTemplate(): MapTemplate {
    let map: 'e'[][] = [];
    for (let row = 1; row <= mapHeight; row++) {
        let row: 'e'[] = [];
        for (let column = 1; column <= mapWidth; column++) row.push('e');
        map.push(row);
    }
    return map;
}