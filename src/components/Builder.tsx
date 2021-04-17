import { useState } from 'react';
import { Coordinates } from '../models/Coordinates';
import { MapFieldSign } from '../models/MapTemplate';
import BuildArea from './BuildArea';
import './Builder.scss';
import FieldPicker from './FieldPicker';

const mapHeight: number = 15;
const mapWidth: number = 30;

function generateEmptyMap(): 'e'[][] {
    let map: 'e'[][] = [];
    for (let row = 1; row <= mapHeight; row++) {
        let row: 'e'[] = [];
        for (let column = 1; column <= mapWidth; column++) row.push('e');
        map.push(row);
    }
    return map;
}

export interface BulderProps {}

const Builder: React.FC<BulderProps> = () => {
    const [mapTemplate, setMapTemplate] = useState<MapFieldSign[][]>(generateEmptyMap());
    const [selectedSign, setSelectedSign] = useState<MapFieldSign>();

    function handleFieldPick(sign: MapFieldSign): void {
        selectedSign === sign ? setSelectedSign(undefined) : setSelectedSign(sign);
    }

    function updateMapTemplate(sign: MapFieldSign, coordinates: Coordinates): void {
        let mapTemplateCopy: MapFieldSign[][] = [...mapTemplate];
        let rowArrayCopy: MapFieldSign[] = [...mapTemplateCopy[coordinates.y]];
        rowArrayCopy[coordinates.x] = sign;
        mapTemplateCopy[coordinates.y] = rowArrayCopy;
        setMapTemplate(mapTemplateCopy);
    }

    function tryToPlaceField(coordinates: Coordinates): void {
        if (!selectedSign) return;
        updateMapTemplate(selectedSign, coordinates);
    }

    function eraseField(coordinates: Coordinates): void {
        updateMapTemplate('e', coordinates);
    }

    return (
        <div className="builder">
            <FieldPicker selectedSign={selectedSign} onPick={handleFieldPick}></FieldPicker>
            <BuildArea
                mapTemplate={mapTemplate}
                onFieldLeftClick={tryToPlaceField}
                onFieldRightClick={eraseField}
            ></BuildArea>
        </div>
    );
};

export default Builder;
