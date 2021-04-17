import './BuildArea.scss';
import { Coordinates } from '../models/Coordinates';
import { MapFieldSign, MapTemplate } from '../models/MapTemplate';
import BlockGfx from './BlockGfx';
import TileGfx from './TileGfx';

export interface BuildAreaProps {
    mapTemplate: MapTemplate;
    onFieldLeftClick: (coordinates: Coordinates) => void;
    onFieldRightClick: (coordinates: Coordinates) => void;
}

const BuildArea: React.FC<BuildAreaProps> = ({ mapTemplate, onFieldLeftClick, onFieldRightClick }) => {
    function handleFieldContextMenu(
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        coordinates: Coordinates
    ): void {
        event.preventDefault();
        onFieldRightClick(coordinates);
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
        <div className="build-area">
            {mapTemplate.map((row, rowIndex) => (
                <div className="build-area__row" key={rowIndex}>
                    {row.map((fieldSign, columnIndex) => (
                        <div
                            className="build-area__field-slot"
                            key={columnIndex}
                            onClick={() => onFieldLeftClick({ x: columnIndex, y: rowIndex })}
                            onContextMenu={(e) => handleFieldContextMenu(e, { x: columnIndex, y: rowIndex })}
                        >
                            {getFieldGfx(fieldSign)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default BuildArea;
