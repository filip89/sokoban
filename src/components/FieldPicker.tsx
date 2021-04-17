import { MapFieldSign } from '../models/MapTemplate';
import BlockGfx from './BlockGfx';
import './FieldPicker.scss';
import TileGfx from './TileGfx';
import { FaEraser } from 'react-icons/fa';

const fieldSigns: MapFieldSign[] = ['e', 'g', 'o', 'd', 'b', 'p'];

export interface FieldPickerProps {
    selectedSign?: MapFieldSign;
    onPick: (sign: MapFieldSign) => void;
}

const FieldPicker: React.FC<FieldPickerProps> = ({ selectedSign, onPick }) => {
    function getFieldClassName(sign: MapFieldSign): string {
        let className: string = 'field-picker__field';
        if (sign === selectedSign) className += ' field-picker__field--active';
        return className;
    }

    function getFieldGfx(sign: MapFieldSign) {
        if (sign === 'e') return <FaEraser></FaEraser>;
        if (sign === 'o') return <BlockGfx type="obstacle"></BlockGfx>;
        if (sign === 'd') return <TileGfx type="destination"></TileGfx>;
        if (sign === 'b') return <BlockGfx type="box"></BlockGfx>;
        if (sign === 'p') return <BlockGfx type="player"></BlockGfx>;
        if (sign === 'g') return <TileGfx type="ground"></TileGfx>;
    }

    return (
        <div className="field-picker">
            {fieldSigns.map((fieldSign) => (
                <div className={getFieldClassName(fieldSign)} key={fieldSign} onClick={() => onPick(fieldSign)}>
                    {getFieldGfx(fieldSign)}
                </div>
            ))}
        </div>
    );
};

export default FieldPicker;
