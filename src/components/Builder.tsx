import { useEffect, useState } from 'react';
import { Coordinates } from '../models/Coordinates';
import { MapFieldSign, MapTemplate } from '../models/MapTemplate';
import BuildArea from './BuildArea';
import './Builder.scss';
import FieldPicker from './FieldPicker';
import { FaSave } from 'react-icons/fa';
import { MdRestore } from 'react-icons/md';

export interface BuilderProps {
    mapTemplateToEdit: MapTemplate;
    onSave: (draft: MapTemplate) => void;
}

const Builder: React.FC<BuilderProps> = ({ mapTemplateToEdit, onSave }) => {
    const [mapTemplateDraft, setMapTemplateDraft] = useState<MapTemplate>([]);
    const [selectedSign, setSelectedSign] = useState<MapFieldSign | undefined>('g');

    useEffect(() => {
        setMapTemplateDraft(mapTemplateToEdit);
    }, [mapTemplateToEdit]);

    function handleFieldPick(sign: MapFieldSign): void {
        selectedSign === sign ? setSelectedSign(undefined) : setSelectedSign(sign);
    }

    function handleOnBuild(startPoint: Coordinates, endPoint: Coordinates): void {
        if (!selectedSign) return;
        console.log(startPoint, endPoint);
        let mapTemplateCopy: MapTemplate = [...mapTemplateDraft];
        for (let rowIndex = startPoint.y; rowIndex <= endPoint.y; rowIndex++) {
            let row: MapFieldSign[] = [...mapTemplateCopy[rowIndex]];
            for (let columnIndex = startPoint.x; columnIndex <= endPoint.x; columnIndex++) {
                row[columnIndex] = selectedSign;
            }
            mapTemplateCopy[rowIndex] = row;
        }
        setMapTemplateDraft(mapTemplateCopy);
    }

    return (
        <>
            <div className="builder">
                <div className="builder__toolbar">
                    <div className="builder__action-buttons">
                        <button className="builder__action-button" onClick={() => onSave(mapTemplateDraft)}>
                            <FaSave></FaSave>
                        </button>
                        <button
                            className="builder__action-button"
                            onClick={() => setMapTemplateDraft(mapTemplateToEdit)}
                        >
                            <MdRestore></MdRestore>
                        </button>
                    </div>
                    <FieldPicker selectedSign={selectedSign} onPick={handleFieldPick}></FieldPicker>
                </div>

                <div className="builder__build-area">
                    <BuildArea
                        mapTemplate={mapTemplateDraft}
                        onBuild={handleOnBuild}
                        selectedSign={selectedSign}
                    ></BuildArea>
                </div>
            </div>
        </>
    );
};

export default Builder;
