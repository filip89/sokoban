import React, { CSSProperties } from 'react';
import { MapTemplate } from '../models/MapTemplate';
import BlockGfx from './BlockGfx';
import './Map.scss';



export interface MapProps {
    template: MapTemplate;
}

const Map: React.FC<MapProps> = React.memo(({ template }) => {
    function getFieldClassName(field: string): string {
        let className: string = 'field';
        switch (field) {
            case 'g':
            case 'p':
            case 'b':
                className += ' field--ground';
                break;
            case 'd':
                className += ' field--destination';
                break;
        }
        return className;
    }

    function getZIndexStyle(field: string, row: number): CSSProperties {
        return {
            zIndex: field === 'o' ? row : 0,
        };
    }

    return (
        <div className="map">
            {template.map((row, rowIndex) => (
                <div key={rowIndex} className="map__row">
                    {row.map((field, columnIndex) => (
                        <div
                            className={getFieldClassName(field)}
                            key={columnIndex}
                            style={getZIndexStyle(field, rowIndex)}
                        >
                            {field === 'o' && <BlockGfx type="obstacle"></BlockGfx>}
                            {field === 'd' && <div className="field__inner-square"></div>}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
});

export default Map;
