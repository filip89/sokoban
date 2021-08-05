import { MapFieldSign } from '../models/MapTemplate';
import ObstacleGfx from './gfxs/ObstacleGfx';
import './FieldPicker.scss';
import TileGfx from './gfxs/TileGfx';
import { FaEraser } from 'react-icons/fa';
import BoxGfx from './gfxs/BoxGfx';
import PlayerGfx from './gfxs/PlayerGfx';

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

    return (
        <div className="field-picker">
            <div className={getFieldClassName('e')} key={'e'} onClick={() => onPick('e')}>
                <FaEraser></FaEraser>
            </div>
            <div className={getFieldClassName('o')} key={'o'} onClick={() => onPick('o')}>
                <ObstacleGfx></ObstacleGfx>
            </div>
            <div className={getFieldClassName('d')} key={'d'} onClick={() => onPick('d')}>
                <TileGfx type="destination"></TileGfx>
            </div>
            <div className={getFieldClassName('b')} key={'b'} onClick={() => onPick('b')}>
                <BoxGfx></BoxGfx>
            </div>
            <div className={getFieldClassName('p')} key={'p'} onClick={() => onPick('p')}>
                <PlayerGfx></PlayerGfx>
            </div>
            <div className={getFieldClassName('g')} key={'g'} onClick={() => onPick('g')}>
                <TileGfx type="ground"></TileGfx>
            </div>
        </div>
    );
};

export default FieldPicker;
