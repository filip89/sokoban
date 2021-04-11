import React, { CSSProperties } from 'react';
import { MapFieldSign, MapTemplate } from '../models/MapTemplate';
import BlockGfx from './BlockGfx';
import './Map.scss';
import TileGfx from './TileGfx';

export interface MapProps {
    template: MapTemplate;
}

const Map: React.FC<MapProps> = React.memo(({ template }) => {
    function getSlotInlineZIndex(field: MapFieldSign, row: number): CSSProperties {
        return {
            zIndex: field === 'o' ? row : 0,
        };
    }

    function getFieldGfx(sign: MapFieldSign) {
        if (sign === 'e') return;
        if (sign === 'o') return <BlockGfx type="obstacle"></BlockGfx>;
        if (sign === 'd') return <TileGfx type="destination"></TileGfx>;
        return <TileGfx type="ground"></TileGfx>;
    }

    return (
        <div className="map">
            {template.map((row, rowIndex) => (
                <div key={rowIndex} className="map__row">
                    {row.map((field, columnIndex) => (
                        <div className="map__field-slot" key={columnIndex} style={getSlotInlineZIndex(field, rowIndex)}>
                            {getFieldGfx(field)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
});

export default Map;
