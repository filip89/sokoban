import { useEffect, useState } from 'react';
import { Coordinates } from '../models/Coordinates';
import { MapFieldSign, MapTemplate } from '../models/MapTemplate';
import { generateEmptyMapTemplate } from '../services/generateEmptyMapTemplate';
import BuildArea from './BuildArea';
import './Builder.scss';
import FieldPicker from './FieldPicker';

export interface BuilderProps {
    mapTemplateToEdit: MapTemplate;
    onSave: (draft: MapTemplate) => void
}

const Builder: React.FC<BuilderProps> = ({ mapTemplateToEdit, onSave}) => {
    const [mapTemplateDraft, setMapTemplateDraft] = useState<MapTemplate>([]);
    const [selectedSign, setSelectedSign] = useState<MapFieldSign>();

    useEffect(() => {
        setMapTemplateDraft(mapTemplateToEdit);
    }, [mapTemplateToEdit]);

    function handleFieldPick(sign: MapFieldSign): void {
        selectedSign === sign ? setSelectedSign(undefined) : setSelectedSign(sign);
    }

    function updateMapTemplate(sign: MapFieldSign, coordinates: Coordinates): void {
        let mapTemplateCopy: MapTemplate = [...mapTemplateDraft];
        let templateRow: MapFieldSign[] = [...mapTemplateCopy[coordinates.y]];
        templateRow[coordinates.x] = sign;
        mapTemplateCopy[coordinates.y] = templateRow;
        setMapTemplateDraft(mapTemplateCopy);
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
            <div>
                <div>
                    <button onClick={() => onSave(mapTemplateDraft)}>SAVE</button>
                    <button onClick={() => setMapTemplateDraft(mapTemplateToEdit)}>RESTORE</button>
                </div>
                <BuildArea
                    mapTemplate={mapTemplateDraft}
                    onFieldLeftClick={tryToPlaceField}
                    onFieldRightClick={eraseField}
                ></BuildArea>
            </div>
        </div>
    );
};

export default Builder;
