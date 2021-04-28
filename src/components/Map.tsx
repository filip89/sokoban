import React, { CSSProperties } from 'react';
import { MapFieldSign, MapTemplate } from '../models/MapTemplate';
import FieldGfx from './FieldGfx';
import './Map.scss';

export interface MapProps {
    template: MapTemplate;
    displayMovables?: boolean;
}

const Map: React.FC<MapProps> = React.memo(({ template, displayMovables: showMovables }) => {
    function getSlotInlineZIndex(field: MapFieldSign, row: number): CSSProperties {
        return {
            zIndex: ['o', 'p', 'b'].includes(getFieldSign(field)) ? row : 0,
        };
    }

    function getFieldSign(originalSign: MapFieldSign): MapFieldSign {
        if (!showMovables && (originalSign === 'b' || originalSign === 'p')) return 'g';
        return originalSign;
    }

    return (
        <div className="map">
            {template.map((row, rowIndex) => (
                <div key={rowIndex} className="map__row">
                    {row.map((field, columnIndex) => (
                        <div className="map__field-slot" key={columnIndex} style={getSlotInlineZIndex(field, rowIndex)}>
                            <FieldGfx sign={getFieldSign(field)}></FieldGfx>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
});

export default Map;
