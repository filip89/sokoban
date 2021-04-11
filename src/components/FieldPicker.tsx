import { MapFieldSign } from '../models/MapTemplate';
import './FieldPicker.scss';

const fieldSigns: MapFieldSign[] = ['b', 'd', 'e', 'g', 'o', 'p'];

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
            {fieldSigns.map((fieldSign) => (
                <button className={getFieldClassName(fieldSign)} key={fieldSign} onClick={() => onPick(fieldSign)}>
                    {fieldSign}
                </button>
            ))}
        </div>
    );
};

export default FieldPicker;
