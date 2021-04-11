import { useState } from 'react';
import { MapFieldSign } from '../models/MapTemplate';
import BlockGfx from './BlockGfx';
import './Builder.scss';
import FieldPicker from './FieldPicker';
import TileGfx from './TileGfx';

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

    function handleFieldPlant(row: number, column: number): void {
        if (!selectedSign) return;
        let mapTemplateCopy: MapFieldSign[][] = [...mapTemplate];
        let rowArrayCopy: MapFieldSign[] = [...mapTemplateCopy[row]];
        rowArrayCopy[column] = selectedSign;
        mapTemplateCopy[row] = rowArrayCopy;
        setMapTemplate(mapTemplateCopy);
    }

    function getFieldGfx(sign: MapFieldSign) {
        if (sign === 'e') return;
        if (sign === 'o') return <BlockGfx type="obstacle"></BlockGfx>;
        if (sign === 'd') return <TileGfx type="destination"></TileGfx>;
        if (sign === 'b') return <BlockGfx type="box"></BlockGfx>;
        if (sign === 'p') return <BlockGfx type="player"></BlockGfx>;
        if (sign === 'g') return <TileGfx type="ground"></TileGfx>;
    }

    return (
        <div className="builder">
            <FieldPicker onPick={handleFieldPick} selectedSign={selectedSign}></FieldPicker>
            <div className="build-area">
                {mapTemplate.map((row, rowIndex) => (
                    <div className="build-area__row" key={rowIndex}>
                        {row.map((fieldSign, columnIndex) => (
                            <div
                                className="build-area__field-slot"
                                key={columnIndex}
                                onClick={() => handleFieldPlant(rowIndex, columnIndex)}
                            >
                                {getFieldGfx(fieldSign)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Builder;
