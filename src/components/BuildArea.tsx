import './BuildArea.scss';
import { Coordinates } from '../models/Coordinates';
import { MapTemplate } from '../models/MapTemplate';
import FieldGfx from './FieldGfx';

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
                            <FieldGfx sign={fieldSign}></FieldGfx>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default BuildArea;
