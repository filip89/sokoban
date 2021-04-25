import { useState } from 'react';
import { Coordinates } from '../models/Coordinates';
import { MapFieldSign, MapTemplate } from '../models/MapTemplate';
import { generateEmptyMapTemplate } from '../services/generateEmptyMapTemplate';
import BuildArea from './BuildArea';
import './Builder.scss';
import FieldPicker from './FieldPicker';

export interface BulderProps {}

const Builder: React.FC<BulderProps> = () => {
    const [mapTemplate, setMapTemplate] = useState<MapTemplate>(generateEmptyMapTemplate());
    const [selectedSign, setSelectedSign] = useState<MapFieldSign>();

    function handleFieldPick(sign: MapFieldSign): void {
        selectedSign === sign ? setSelectedSign(undefined) : setSelectedSign(sign);
    }

    function updateMapTemplate(sign: MapFieldSign, coordinates: Coordinates): void {
        let mapTemplateCopy: MapTemplate = [...mapTemplate];
        let templateRow: MapFieldSign[] = [...mapTemplateCopy[coordinates.y]];
        templateRow[coordinates.x] = sign;
        mapTemplateCopy[coordinates.y] = templateRow;
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
